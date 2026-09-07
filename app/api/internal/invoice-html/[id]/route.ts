import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatEuroCents } from "@/lib/invoice/calc";

// Server-gerenderde factuur-HTML — single source of truth voor het
// factuurdocument. Wordt aangeroepen door de "Invoice Generation" n8n-
// workflow, die deze HTML doorstuurt naar Gotenberg voor PDF-conversie.
// Alleen bereikbaar met het gedeelde n8n-geheim (geen sessie: n8n draait
// server-to-server, niet als ingelogde gebruiker).
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sharedSecret = request.headers.get("X-RitFactuur-Secret");
  if (!sharedSecret || sharedSecret !== process.env.N8N_SHARED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createAdminClient();

  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("*, clients(*), invoice_line_items(*)")
    .eq("id", id)
    .single();

  if (invoiceError || !invoice) {
    return NextResponse.json({ error: "Factuur niet gevonden." }, { status: 404 });
  }

  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("id", invoice.tenant_id)
    .single();

  if (!tenant) {
    return NextResponse.json({ error: "Bedrijfsgegevens niet gevonden." }, { status: 404 });
  }

  const client = invoice.clients;
  const lines = invoice.invoice_line_items ?? [];

  const html = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #1f2937; margin: 0; padding: 40px; font-size: 13px; }
  .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
  .company { font-weight: bold; font-size: 16px; }
  .muted { color: #6b7280; }
  h1 { font-size: 22px; margin: 0 0 4px; }
  table { width: 100%; border-collapse: collapse; margin-top: 24px; }
  th, td { text-align: left; padding: 8px 6px; border-bottom: 1px solid #e5e7eb; }
  th { color: #6b7280; font-weight: normal; font-size: 11px; text-transform: uppercase; }
  .totals { margin-top: 16px; width: 260px; margin-left: auto; }
  .totals div { display: flex; justify-content: space-between; padding: 4px 0; }
  .totals .grand { font-weight: bold; border-top: 1px solid #1f2937; margin-top: 6px; padding-top: 6px; }
  .footer { margin-top: 60px; font-size: 11px; color: #6b7280; }
  .logo { max-height: 48px; max-width: 180px; margin-bottom: 12px; object-fit: contain; }
  .pay-button { display: inline-block; margin-top: 16px; padding: 10px 20px; background: #2f7d63; color: #fff; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: bold; }
</style>
</head>
<body>
  <div class="header">
    <div>
      ${tenant.logo_url ? `<img class="logo" src="${escapeHtml(tenant.logo_url)}" alt="" />` : ""}
      <div class="company">${escapeHtml(tenant.company_name)}</div>
      <div class="muted">${escapeHtml(tenant.address_line ?? "")}</div>
      <div class="muted">${escapeHtml(tenant.postal_code ?? "")} ${escapeHtml(tenant.city ?? "")}</div>
      <div class="muted">KVK: ${escapeHtml(tenant.kvk_number ?? "-")}</div>
      <div class="muted">BTW: ${escapeHtml(tenant.btw_number ?? "-")}</div>
      <div class="muted">IBAN: ${escapeHtml(tenant.iban ?? "-")}</div>
    </div>
    <div style="text-align:right">
      <h1>Factuur ${escapeHtml(invoice.invoice_number)}</h1>
      <div class="muted">Factuurdatum: ${formatDate(invoice.invoice_date)}</div>
      <div class="muted">Vervaldatum: ${formatDate(invoice.due_date)}</div>
    </div>
  </div>

  <div>
    <div class="muted">Factuur aan</div>
    <div><strong>${escapeHtml(client?.name ?? "")}</strong></div>
    <div class="muted">${escapeHtml(client?.address_line ?? "")}</div>
    <div class="muted">${escapeHtml(client?.postal_code ?? "")} ${escapeHtml(client?.city ?? "")}</div>
    ${client?.btw_number ? `<div class="muted">BTW: ${escapeHtml(client.btw_number)}</div>` : ""}
  </div>

  <table>
    <thead>
      <tr>
        <th>Omschrijving</th>
        <th>Aantal</th>
        <th>Prijs excl. BTW</th>
        <th>BTW</th>
        <th>Totaal incl. BTW</th>
      </tr>
    </thead>
    <tbody>
      ${lines
        .map(
          (l: any) => `
      <tr>
        <td>${escapeHtml(l.description)}</td>
        <td>${l.quantity}</td>
        <td>${formatEuroCents(l.unit_price_excl_btw)}</td>
        <td>${l.btw_rate}%</td>
        <td>${formatEuroCents(l.line_total_incl_btw)}</td>
      </tr>`
        )
        .join("")}
    </tbody>
  </table>

  <div class="totals">
    <div><span>Subtotaal excl. BTW</span><span>${formatEuroCents(invoice.subtotal_excl_btw)}</span></div>
    <div><span>BTW</span><span>${formatEuroCents(invoice.btw_total)}</span></div>
    <div class="grand"><span>Totaal incl. BTW</span><span>${formatEuroCents(invoice.total_incl_btw)}</span></div>
    ${invoice.payment_url ? `<a class="pay-button" href="${escapeHtml(invoice.payment_url)}">Betaal direct online</a>` : ""}
  </div>

  <div class="footer">
    Gelieve het totaalbedrag vóór ${formatDate(invoice.due_date)} te voldoen op
    IBAN ${escapeHtml(tenant.iban ?? "-")} onder vermelding van factuurnummer ${escapeHtml(invoice.invoice_number)},
    of direct online (o.a. met iDEAL)${invoice.payment_url ? ` via: ${escapeHtml(invoice.payment_url)}` : "."}
  </div>
</body>
</html>`;

  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
