import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Slaat contactformulier-inzendingen op in support_messages. Bewust géén
// e-mailverzending hier — de app heeft geen eigen transactionele e-mail
// geconfigureerd (dat loopt via n8n). Bekijk inzendingen via de Supabase
// Table Editor, of koppel later een n8n-workflow op deze tabel voor
// notificaties (bv. via een database webhook).
export async function POST(request: NextRequest) {
  const { name, email, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Alle velden zijn verplicht." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("support_messages").insert({ name, email, message });

  if (error) {
    return NextResponse.json({ error: "Opslaan mislukt." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
