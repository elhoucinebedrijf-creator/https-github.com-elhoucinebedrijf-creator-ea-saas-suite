import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Maakt een draft-factuur aan uit geselecteerde onfactureerde ritten (via de
// create_invoice_from_rides RPC — reserveert het factuurnummer en berekent
// totalen atomisch), en triggert daarna de "Invoice Generation" n8n-workflow
// voor PDF-rendering + e-mailverzending. De factuur bestaat al (status
// 'draft') zodra deze route terugkeert, ongeacht of de n8n-call slaagt.
export async function POST(request: NextRequest) {
  const { clientId, rideIds } = await request.json();

  if (!clientId || !Array.isArray(rideIds) || rideIds.length === 0) {
    return NextResponse.json({ error: "Selecteer een klant en minstens één rit." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  const { data: invoiceId, error } = await supabase.rpc("create_invoice_from_rides", {
    p_client_id: clientId,
    p_ride_ids: rideIds,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const n8nBaseUrl = process.env.N8N_BASE_URL;
  const sharedSecret = process.env.N8N_SHARED_SECRET;
  if (n8nBaseUrl && sharedSecret) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    // De factuur is al veilig aangemaakt in de database, dus een falende
    // n8n-call betekent alleen dat PDF/e-mail later handmatig (opnieuw)
    // getriggerd moet worden, niet dataverlies. We wachten de call hier wél
    // af (geen "fire-and-forget"): op Vercel's serverless runtime kan een
    // niet-afgewachte fetch stilletjes worden afgebroken zodra de response
    // is verstuurd, waardoor n8n de trigger nooit zou ontvangen.
    try {
      await fetch(`${n8nBaseUrl}/webhook/invoice-generation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RitFactuur-Secret": sharedSecret,
        },
        body: JSON.stringify({ invoice_id: invoiceId, tenant_id: profile?.tenant_id }),
      });
    } catch {
      // Bewust genegeerd — zie toelichting hierboven.
    }
  }

  return NextResponse.json({ invoiceId });
}
