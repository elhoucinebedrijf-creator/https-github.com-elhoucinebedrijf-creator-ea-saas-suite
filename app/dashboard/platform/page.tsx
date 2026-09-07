import { redirect } from "next/navigation";
import { Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isPlatformOwner } from "@/lib/platform-owner";
import EmptyState from "@/components/EmptyState";

const STATUS_LABELS: Record<string, string> = {
  trialing: "Proefperiode",
  active: "Actief",
  past_due: "Betaling mislukt",
  canceled: "Opgezegd",
};

const STATUS_STYLES: Record<string, string> = {
  trialing: "bg-blue-100 text-blue-700",
  active: "bg-emerald-100 text-emerald-700",
  past_due: "bg-red-100 text-red-700",
  canceled: "bg-slate-100 text-slate-600",
};

const eur = (cents: number) => new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format((cents || 0) / 100);

export default async function PlatformPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isPlatformOwner(user.email)) {
    redirect("/dashboard");
  }

  const admin = createAdminClient();
  const { data: tenants } = await admin
    .from("tenants")
    .select("id, company_name, kvk_number, created_at, profiles(email, role), subscriptions(plan, status, price_cents, current_period_end)")
    .order("created_at", { ascending: false });

  const rows = (tenants ?? []).map((t: any) => {
    const owner = (t.profiles ?? []).find((p: any) => p.role === "owner");
    const sub = Array.isArray(t.subscriptions) ? t.subscriptions[0] : t.subscriptions;
    return {
      id: t.id,
      companyName: t.company_name,
      kvkNumber: t.kvk_number,
      ownerEmail: owner?.email ?? "-",
      plan: sub?.plan ?? "-",
      status: sub?.status ?? "geen abonnement",
      priceCents: sub?.price_cents ?? 0,
      periodEnd: sub?.current_period_end,
    };
  });

  const activeCount = rows.filter((r) => r.status === "active").length;
  const mrrCents = rows.filter((r) => r.status === "active").reduce((sum, r) => sum + (r.priceCents || 0), 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Platform (eigenaar)</h1>
      <p className="mt-1 text-sm text-slate-600">Alle RitFactuur-tenants en hun abonnementsstatus.</p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-xs uppercase text-slate-500">Tenants totaal</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{rows.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-xs uppercase text-slate-500">Actieve abonnementen</p>
          <p className="mt-1 text-xl font-bold text-emerald-700">{activeCount}</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-xs uppercase text-slate-500">MRR</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{eur(mrrCents)}</p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200">
        {rows.length === 0 ? (
          <EmptyState icon={Building2} title="Nog geen tenants" body="Nieuwe tenants verschijnen hier na registratie." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                <th className="px-4 py-2">Bedrijf</th>
                <th className="px-4 py-2">Contact</th>
                <th className="px-4 py-2">Plan</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Bedrag/mnd</th>
                <th className="px-4 py-2">Volgende verlenging</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-2 font-medium text-slate-900">{r.companyName}</td>
                  <td className="px-4 py-2 text-slate-600">{r.ownerEmail}</td>
                  <td className="px-4 py-2 text-slate-600 capitalize">{r.plan}</td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[r.status] ?? "bg-slate-100 text-slate-600"}`}>
                      {STATUS_LABELS[r.status] ?? r.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-slate-600">{eur(r.priceCents)}</td>
                  <td className="px-4 py-2 text-slate-600">
                    {r.periodEnd ? new Date(r.periodEnd).toLocaleDateString("nl-NL") : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
