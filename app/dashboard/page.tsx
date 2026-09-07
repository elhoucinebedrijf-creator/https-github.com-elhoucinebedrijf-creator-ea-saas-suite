import Link from "next/link";
import { Clock, Euro, TimerReset, Users, FileText, Upload, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatEuroCents } from "@/lib/invoice/calc";

// Aanname voor de tijdsbesparing-indicatie: een taxi-ondernemer die
// handmatig in Excel factureert kost gemiddeld ~15 minuten per factuur
// (regels overtypen, BTW berekenen, opmaken, versturen). Elke factuur die
// RitFactuur genereert (dus niet meer status 'draft') telt als bespaarde tijd.
const MINUTES_SAVED_PER_INVOICE = 15;

export default async function DashboardOverviewPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("tenants(company_name)")
    .eq("id", user!.id)
    .single();

  const [
    { data: openInvoices },
    { data: paidInvoices },
    { count: unbilledRidesCount },
    { count: generatedInvoicesThisMonth },
    { count: clientCount },
    { count: totalInvoiceCount },
  ] = await Promise.all([
    supabase.from("invoices").select("total_incl_btw").in("status", ["sent", "overdue"]),
    supabase
      .from("invoices")
      .select("total_incl_btw")
      .eq("status", "paid")
      .gte("paid_at", startOfMonthIso()),
    supabase.from("rides").select("id", { count: "exact", head: true }).eq("status", "unbilled"),
    supabase
      .from("invoices")
      .select("id", { count: "exact", head: true })
      .neq("status", "draft")
      .gte("invoice_date", startOfMonthIso()),
    supabase.from("clients").select("id", { count: "exact", head: true }),
    supabase.from("invoices").select("id", { count: "exact", head: true }),
  ]);

  const openTotal = sumCents(openInvoices);
  const paidThisMonth = sumCents(paidInvoices);
  const minutesSaved = (generatedInvoicesThisMonth ?? 0) * MINUTES_SAVED_PER_INVOICE;
  const isNewAccount = (clientCount ?? 0) === 0 && (totalInvoiceCount ?? 0) === 0;
  const companyName = (profile?.tenants as any)?.company_name ?? "";

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        Welkom{companyName ? `, ${companyName}` : ""}
      </h1>
      <p className="mt-1 text-sm text-slate-600">Je facturatie in één oogopslag.</p>

      {isNewAccount ? (
        <OnboardingChecklist />
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={<TimerReset className="h-5 w-5" />}
              label="Tijd bespaard deze maand"
              value={formatMinutesSaved(minutesSaved)}
              highlight
              sublabel={
                (generatedInvoicesThisMonth ?? 0) > 0
                  ? `${generatedInvoicesThisMonth} facturen automatisch verwerkt`
                  : "Nog geen facturen deze maand"
              }
            />
            <StatCard icon={<Euro className="h-5 w-5" />} label="Openstaand" value={formatEuroCents(openTotal)} />
            <StatCard
              icon={<Euro className="h-5 w-5" />}
              label="Betaald deze maand"
              value={formatEuroCents(paidThisMonth)}
            />
            <StatCard
              icon={<Clock className="h-5 w-5" />}
              label="Nog te factureren ritten"
              value={String(unbilledRidesCount ?? 0)}
            />
          </div>

          {(unbilledRidesCount ?? 0) > 0 && (
            <Link
              href="/dashboard/rides"
              className="mt-6 flex items-center justify-between rounded-lg border border-brand-200 bg-brand-50 p-4 text-sm text-brand-900 transition hover:bg-brand-100"
            >
              <span>
                Je hebt <strong>{unbilledRidesCount}</strong> rit(ten) die nog niet gefactureerd
                zijn — dat scheelt je zo {formatMinutesSaved(
                  (unbilledRidesCount ?? 0) * MINUTES_SAVED_PER_INVOICE
                )} extra.
              </span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          )}
        </>
      )}
    </div>
  );
}

function OnboardingChecklist() {
  const steps = [
    {
      icon: <Users className="h-5 w-5" />,
      title: "Voeg je eerste klant toe",
      body: "Particulier, bedrijf of zorgverzekeraar — wie je ook factureert.",
      href: "/dashboard/clients",
      cta: "Naar Klanten",
    },
    {
      icon: <Upload className="h-5 w-5" />,
      title: "Upload of voer ritten in",
      body: "Exporteer uit je boordcomputer als CSV, of voer een rit handmatig in.",
      href: "/dashboard/rides",
      cta: "Naar Ritten",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Genereer je eerste factuur",
      body: "Selecteer ritten per klant en klik op 'Genereer factuur' — klaar.",
      href: "/dashboard/invoices",
      cta: "Naar Facturen",
    },
  ];

  return (
    <div className="mt-8">
      <div className="rounded-lg border border-brand-200 bg-brand-50 p-5">
        <p className="font-medium text-brand-900">
          Drie stappen tot je eerste automatisch gegenereerde factuur
        </p>
        <p className="mt-1 text-sm text-brand-800">
          Dit kost je in totaal een paar minuten — daarna scheelt elke factuur je ongeveer 15
          minuten handwerk.
        </p>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {steps.map((step, i) => (
          <Link
            key={step.title}
            href={step.href}
            className="group rounded-lg border border-slate-200 p-5 transition hover:border-brand-300 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                {step.icon}
              </span>
              <span className="text-xs font-medium text-slate-400">Stap {i + 1}</span>
            </div>
            <p className="mt-4 font-medium text-slate-900">{step.title}</p>
            <p className="mt-1 text-sm text-slate-600">{step.body}</p>
            <p className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-600">
              {step.cta} <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sublabel,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-5 ${
        highlight ? "border-brand-300 bg-brand-50" : "border-slate-200"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={highlight ? "text-brand-600" : "text-slate-400"}>{icon}</span>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
      <p className={`mt-2 text-2xl font-bold ${highlight ? "text-brand-900" : "text-slate-900"}`}>
        {value}
      </p>
      {sublabel && <p className="mt-1 text-xs text-slate-500">{sublabel}</p>}
    </div>
  );
}

function sumCents(rows: { total_incl_btw: number }[] | null): number {
  return (rows ?? []).reduce((sum, r) => sum + r.total_incl_btw, 0);
}

function formatMinutesSaved(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} uur` : `${hours}u ${rest}m`;
}

function startOfMonthIso(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}
