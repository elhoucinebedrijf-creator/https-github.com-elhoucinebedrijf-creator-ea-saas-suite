import { createClient } from "@/lib/supabase/server";
import { formatEuroCents } from "@/lib/invoice/calc";
import CancelSubscriptionButton from "@/components/CancelSubscriptionButton";

const STATUS_LABELS: Record<string, string> = {
  trialing: "Proefperiode",
  active: "Actief",
  past_due: "Betaling mislukt",
  canceled: "Opgezegd",
};

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("tenant_id")
    .eq("id", user!.id)
    .single();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("tenant_id", profile!.tenant_id)
    .maybeSingle();

  const { data: payments } = await supabase
    .from("subscription_payments")
    .select("*")
    .eq("tenant_id", profile!.tenant_id)
    .order("created_at", { ascending: false })
    .limit(12);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Abonnement</h1>
      <p className="mt-1 text-sm text-slate-600">
        Je RitFactuur-abonnement wordt automatisch maandelijks afgeschreven via Mollie.
      </p>

      {subscription ? (
        <div className="mt-6 rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Plan</p>
              <p className="text-lg font-semibold capitalize text-slate-900">
                {subscription.plan}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                subscription.status === "active"
                  ? "bg-emerald-100 text-emerald-700"
                  : subscription.status === "past_due"
                    ? "bg-red-100 text-red-700"
                    : "bg-slate-100 text-slate-600"
              }`}
            >
              {STATUS_LABELS[subscription.status] ?? subscription.status}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Prijs</p>
              <p className="font-medium text-slate-900">
                {formatEuroCents(subscription.price_cents)} / maand
              </p>
            </div>
            <div>
              <p className="text-slate-500">Huidige periode</p>
              <p className="font-medium text-slate-900">
                {subscription.current_period_start
                  ? new Date(subscription.current_period_start).toLocaleDateString("nl-NL")
                  : "—"}{" "}
                –{" "}
                {subscription.current_period_end
                  ? new Date(subscription.current_period_end).toLocaleDateString("nl-NL")
                  : "—"}
              </p>
            </div>
          </div>
          {subscription.status !== "canceled" && (
            <div className="mt-6 border-t border-slate-100 pt-4">
              <CancelSubscriptionButton />
            </div>
          )}
        </div>
      ) : (
        <p className="mt-6 text-sm text-slate-500">Geen abonnementsgegevens gevonden.</p>
      )}

      <h2 className="mt-8 text-lg font-semibold text-slate-900">Betalingen</h2>
      <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
              <th className="px-4 py-2">Datum</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-right">Bedrag</th>
            </tr>
          </thead>
          <tbody>
            {(payments ?? []).map((p) => (
              <tr key={p.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-2 text-slate-600">
                  {new Date(p.created_at).toLocaleDateString("nl-NL")}
                </td>
                <td className="px-4 py-2 capitalize text-slate-600">{p.status}</td>
                <td className="px-4 py-2 text-right font-medium text-slate-900">
                  {formatEuroCents(p.amount_cents)}
                </td>
              </tr>
            ))}
            {(payments ?? []).length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                  Nog geen betalingen.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
