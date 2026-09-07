import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PLAN_PRICES_CENTS: Record<string, number> = {
  starter: 2900,
  groei: 5900,
  vloot: 9900,
};

// Start het eerste (iDEAL) betaalverzoek bij Mollie voor een nieuwe
// tenant-aanmelding. Zet company/KVK/BTW/IBAN in de payment-metadata, zodat
// de "Tenant Onboarding"-n8n-workflow (getriggerd door Mollie's webhook) de
// tenant + profile-koppeling kan aanmaken zonder verdere invoer nodig te
// hebben. Deze route raakt zelf geen tenants/subscriptions-tabel aan — dat
// gebeurt bewust pas na bevestigde betaling, in n8n.
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { plan, companyName, kvkNumber, btwNumber, iban, email } = body;

  if (!plan || !PLAN_PRICES_CENTS[plan]) {
    return NextResponse.json({ error: "Ongeldig abonnement." }, { status: 400 });
  }
  if (!companyName || !kvkNumber || !btwNumber || !iban) {
    return NextResponse.json({ error: "Bedrijfsgegevens ontbreken." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Bevestig eerst je e-mailadres en log opnieuw in." },
      { status: 401 }
    );
  }

  const mollieApiKey = process.env.MOLLIE_API_KEY;
  const n8nBaseUrl = process.env.N8N_BASE_URL;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!mollieApiKey || !n8nBaseUrl || !appUrl) {
    return NextResponse.json(
      { error: "Betalingen zijn nog niet geconfigureerd (ontbrekende omgevingsvariabelen)." },
      { status: 500 }
    );
  }

  const amountCents = PLAN_PRICES_CENTS[plan];

  const customerRes = await fetch("https://api.mollie.com/v2/customers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${mollieApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: companyName, email: email ?? user.email }),
  });

  if (!customerRes.ok) {
    return NextResponse.json({ error: "Kon geen Mollie-klant aanmaken." }, { status: 502 });
  }
  const customer = await customerRes.json();

  const paymentRes = await fetch("https://api.mollie.com/v2/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${mollieApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: { currency: "EUR", value: (amountCents / 100).toFixed(2) },
      description: `RitFactuur ${plan} — eerste maand`,
      redirectUrl: `${appUrl}/registreren/bedankt`,
      webhookUrl: `${n8nBaseUrl}/webhook/tenant-onboarding`,
      customerId: customer.id,
      sequenceType: "first",
      metadata: {
        supabase_user_id: user.id,
        email: email ?? user.email,
        plan,
        price_cents: amountCents,
        company_name: companyName,
        kvk_number: kvkNumber,
        btw_number: btwNumber,
        iban,
      },
    }),
  });

  if (!paymentRes.ok) {
    return NextResponse.json({ error: "Kon geen betaling starten bij Mollie." }, { status: 502 });
  }
  const payment = await paymentRes.json();
  const checkoutUrl = payment._links?.checkout?.href;

  if (!checkoutUrl) {
    return NextResponse.json({ error: "Geen checkout-URL ontvangen van Mollie." }, { status: 502 });
  }

  return NextResponse.json({ checkoutUrl });
}
