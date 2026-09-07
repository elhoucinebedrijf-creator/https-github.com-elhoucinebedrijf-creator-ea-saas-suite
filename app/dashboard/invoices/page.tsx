import Link from "next/link";
import { FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatEuroCents } from "@/lib/invoice/calc";
import EmptyState from "@/components/EmptyState";

const STATUS_LABELS: Record<string, string> = {
  draft: "Concept",
  generated: "PDF gereed",
  sent: "Verstuurd",
  paid: "Betaald",
  overdue: "Te laat",
  cancelled: "Geannuleerd",
};

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600",
  generated: "bg-blue-100 text-blue-700",
  sent: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  overdue: "bg-red-100 text-red-700",
  cancelled: "bg-slate-100 text-slate-400",
};

export default async function InvoicesPage() {
  const supabase = await createClient();
  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, invoice_number, invoice_date, due_date, status, total_incl_btw, clients(name)")
    .order("invoice_date", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Facturen</h1>
      <p className="mt-1 text-sm text-slate-600">
        Alle facturen, inclusief status. PDF&apos;s worden automatisch gegenereerd en verstuurd.
      </p>

      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200">
        {(invoices ?? []).length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                <th className="px-4 py-2">Factuurnummer</th>
                <th className="px-4 py-2">Klant</th>
                <th className="px-4 py-2">Datum</th>
                <th className="px-4 py-2">Vervaldatum</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-right">Bedrag</th>
              </tr>
            </thead>
            <tbody>
              {invoices!.map((inv) => (
                <tr key={inv.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-2 font-medium text-slate-900">
                    <Link href={`/dashboard/invoices/${inv.id}`} className="hover:underline">
                      {inv.invoice_number}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-slate-600">{(inv.clients as any)?.name ?? "—"}</td>
                  <td className="px-4 py-2 text-slate-600">
                    {new Date(inv.invoice_date).toLocaleDateString("nl-NL")}
                  </td>
                  <td className="px-4 py-2 text-slate-600">
                    {new Date(inv.due_date).toLocaleDateString("nl-NL")}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[inv.status] ?? "bg-slate-100 text-slate-600"}`}
                    >
                      {STATUS_LABELS[inv.status] ?? inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-slate-900">
                    {formatEuroCents(inv.total_incl_btw)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState
            icon={FileText}
            title="Nog geen facturen"
            body="Zodra je ritten aan een klant koppelt en op 'Genereer factuur' klikt, verschijnen je facturen hier — inclusief automatische PDF en verzending."
          />
        )}
      </div>
    </div>
  );
}
