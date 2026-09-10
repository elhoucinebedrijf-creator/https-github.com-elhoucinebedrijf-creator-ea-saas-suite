import { NextRequest, NextResponse } from "next/server";
import { insertIfConfigured } from "@/lib/server/audit";

const PLAN_PRICES_CENTS: Record<string, number> = {
  starter: 7900,
  groei: 19900,
  vloot: 39900,
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { plan, companyName, kvkNumber, btwNumber, iban, email, product = "claimbewijs" } = body;

  if (!plan || !PLAN_PRICES_CENTS[plan]) {
    return NextResponse.json({ error: "Ongeldig abonnement." }, { status: 400 });
  }

  if (!companyName || !kvkNumber || !btwNumber || !iban || !email) {
    return NextResponse.json({ error: "Bedrijfsgegevens ontbreken." }, { status: 400 });
  }

  const amountCents = PLAN_PRICES_CENTS[plan];
  const mollieApiKey = process.env.MOLLIE_API_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const webhookUrl = process.env.MOLLIE_WEBHOOK_URL ?? `${appUrl}/api/billing/mollie-webhook`;

  const paymentRecord = await insertIfConfigured("ea_payments", {
    product_key: product,
    provider: "mollie",
    amount_cents: amountCents,
    currency: "EUR",
    status: mollieApiKey ? "created" : "preview",
    raw_payload: { plan, companyName, kvkNumber, btwNumber, iban, email },
  });

  if (!mollieApiKey) {
    return NextResponse.json({
      checkoutUrl: "/registreren/bedankt",
      paymentId: paymentRecord.id ?? "local-preview",
      preview: true,
    });
  }

  const paymentRes = await fetch("https://api.mollie.com/v2/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${mollieApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: { currency: "EUR", value: (amountCents / 100).toFixed(2) },
      description: `EA SaaS Suite ${plan} - eerste maand`,
      redirectUrl: `${appUrl}/registreren/bedankt`,
      webhookUrl,
      sequenceType: "first",
      metadata: {
        payment_record_id: paymentRecord.id,
        email,
        plan,
        product,
        price_cents: amountCents,
        company_name: companyName,
        kvk_number: kvkNumber,
        btw_number: btwNumber,
        iban,
      },
    }),
  });

  if (!paymentRes.ok) {
    return NextResponse.json({ error: "Kon geen betaling starten bij Mollie." }, { status: 502 });
  }

  const payment = await paymentRes.json();
  const checkoutUrl = payment._links?.checkout?.href;

  if (!checkoutUrl) {
    return NextResponse.json({ error: "Geen checkout-URL ontvangen van Mollie." }, { status: 502 });
  }

  return NextResponse.json({ checkoutUrl, paymentId: payment.id });
}
