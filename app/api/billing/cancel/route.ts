import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Zet het abonnement op 'canceled'. Omdat recurring billing zelf wordt
// aangestuurd door de "Recurring Subscription Billing" n8n-cron (die alleen
// subscriptions met status 'active' oppikt — zie n8n/workflows/
// recurring-billing-cron.json), is dit voldoende om toekomstige incasso's te
// stoppen. Er is geen Mollie-subscriptionobject om apart op te zeggen: dit
// project gebruikt Mollie's first-payment + mandate-aanpak, geen Mollie
// Subscriptions API.
export async function POST() {
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

  const { error } = await supabase
    .from("subscriptions")
    .update({ status: "canceled" })
    .eq("tenant_id", profile.tenant_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await supabase
    .from("tenants")
    .update({ subscription_status: "canceled" })
    .eq("id", profile.tenant_id);

  return NextResponse.json({ ok: true });
}
