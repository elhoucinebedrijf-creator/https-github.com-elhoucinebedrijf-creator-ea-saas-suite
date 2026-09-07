import { notFound } from "next/navigation";
import { Mail, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatEuroCents } from "@/lib/invoice/calc";
import MarkAsPaidButton from "@/components/MarkAsPaidButton";
import DeleteInvoiceButton from "@/components/DeleteInvoiceButton";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: invoice } = await supabase
    .from("invoices")
    .select("*, clients(name, email), invoice_line_items(*)")
    .eq("id", id)
    .single();

  if (!invoice) notFound();

  const client = invoice.clients as any;
  const lines = invoice.invoice_line_items ?? [];

  const { data: reminders } = await supabase
    .from("reminder_log")
    .select("reminder_number, sent_at")
    .eq("invoice_id", id)
    .order("reminder_number");

  const REMINDER_LABELS: Record<number, string> = {
    1: "1e herinnering (dag 1)",
    2: "2e herinnering (dag 14)",
    3: "Laatste waarschuwing (dag 30)",
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Factuur {invoice.invoice_number}</h1>
          <p className="mt-1 text-sm text-slate-600">{client?.name}</p>
          {(invoice.sent_at || invoice.whatsapp_sent_at) && (
            <div className="mt-2 flex gap-3 text-xs text-slate-500">
              {invoice.sent_at && (
                <span className="inline-flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> Verstuurd per e-mail
                </span>
              )}
              {invoice.whatsapp_sent_at && (
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="h-3.5 w-3.5" /> Verstuurd via WhatsApp
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {invoice.pdf_url && (
            <a
              href={invoice.pdf_url}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              PDF bekijken
            </a>
          )}
          {invoice.payment_url && invoice.status !== "paid" && (
            <a
              href={invoice.payment_url}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Betaallink openen
            </a>
          )}
          {invoice.status !== "paid" && invoice.status !== "cancelled" && (
            <MarkAsPaidButton invoiceId={invoice.id} />
          )}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
              <th className="px-4 py-2">Omschrijving</th>
              <th className="px-4 py-2 text-right">Excl. BTW</th>
              <th className="px-4 py-2 text-right">BTW</th>
              <th className="px-4 py-2 text-right">Incl. BTW</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l: any) => (
              <tr key={l.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-2 text-slate-700">{l.description}</td>
                <td className="px-4 py-2 text-right text-slate-600">
                  {formatEuroCents(l.line_total_excl_btw)}
                </td>
                <td className="px-4 py-2 text-right text-slate-600">{l.btw_rate}%</td>
                <td className="px-4 py-2 text-right font-medium text-slate-900">
                  {formatEuroCents(l.line_total_incl_btw)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 ml-auto w-64 space-y-1 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotaal excl. BTW</span>
          <span>{formatEuroCents(invoice.subtotal_excl_btw)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>BTW</span>
          <span>{formatEuroCents(invoice.btw_total)}</span>
        </div>
        <div className="flex justify-between border-t border-slate-300 pt-1 font-bold text-slate-900">
          <span>Totaal incl. BTW</span>
          <span>{formatEuroCents(invoice.total_incl_btw)}</span>
        </div>
      </div>

      {(reminders ?? []).length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-slate-900">Verstuurde herinneringen</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            {reminders!.map((r) => (
              <li key={r.reminder_number} className="flex justify-between">
                <span>{REMINDER_LABELS[r.reminder_number] ?? `Herinnering ${r.reminder_number}`}</span>
                <span>{new Date(r.sent_at).toLocaleDateString("nl-NL")}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10 border-t border-slate-200 pt-6">
        <DeleteInvoiceButton invoiceId={invoice.id} />
      </div>
    </div>
  );
}
