import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Wordt aangeroepen nadat de browser een CSV-bestand al rechtstreeks naar
// Supabase Storage heeft geüpload (bucket "ride-uploads"). Registreert de
// upload in file_uploads en triggert de "Ride Ingestion" n8n-workflow, die
// het bestand parseert naar rides-rijen (status unbilled). Bewust géén
// automatische factuurgeneratie hier — dat blijft een aparte, expliciete
// gebruikersactie.
export async function POST(request: NextRequest) {
  const { storagePath } = await request.json();
  if (!storagePath) {
    return NextResponse.json({ error: "storagePath ontbreekt." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("tenant_id")
    .eq("id", user.id)
    .single();
  if (!profile) {
    return NextResponse.json({ error: "Geen tenant gevonden." }, { status: 403 });
  }

  const { data: fileUpload, error } = await supabase
    .from("file_uploads")
    .insert({
      tenant_id: profile.tenant_id,
      storage_path: storagePath,
      status: "pending",
      uploaded_by: user.id,
    })
    .select()
    .single();

  if (error || !fileUpload) {
    return NextResponse.json({ error: error?.message ?? "Registreren mislukt." }, { status: 400 });
  }

  const n8nBaseUrl = process.env.N8N_BASE_URL;
  const sharedSecret = process.env.N8N_SHARED_SECRET;
  if (n8nBaseUrl && sharedSecret) {
    // Afgewacht i.p.v. fire-and-forget: op Vercel's serverless runtime kan
    // een niet-afgewachte fetch stilletjes worden afgebroken zodra de
    // response is verstuurd, waardoor n8n de trigger nooit zou ontvangen.
    try {
      await fetch(`${n8nBaseUrl}/webhook/ride-ingestion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RitFactuur-Secret": sharedSecret,
        },
        body: JSON.stringify({ file_upload_id: fileUpload.id, tenant_id: profile.tenant_id }),
      });
    } catch {
      // fileUpload blijft op status "pending" staan; kan later opnieuw
      // getriggerd worden. Geen dataverlies.
    }
  }

  return NextResponse.json({ fileUploadId: fileUpload.id });
}
