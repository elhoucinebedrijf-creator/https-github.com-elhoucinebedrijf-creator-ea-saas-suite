import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Verwijdert een factuur. Zet eerst de gekoppelde ritten terug naar
// 'unbilled' (invoice_id -> null) zodat ze niet verloren gaan en opnieuw
// gefactureerd kunnen worden — anders zou de delete blokkeren op de
// foreign key vanuit rides.invoice_id.
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  const { error: rideResetError } = await supabase
    .from("rides")
    .update({ invoice_id: null, status: "unbilled" })
    .eq("invoice_id", id);

  if (rideResetError) {
    return NextResponse.json({ error: rideResetError.message }, { status: 400 });
  }

  const { error: deleteError } = await supabase.from("invoices").delete().eq("id", id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
