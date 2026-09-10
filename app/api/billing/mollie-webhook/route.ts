import { NextRequest, NextResponse } from "next/server";
import { insertIfConfigured } from "@/lib/server/audit";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const molliePaymentId = String(formData.get("id") ?? "");

  if (!molliePaymentId) {
    return NextResponse.json({ error: "Mollie payment id ontbreekt." }, { status: 400 });
  }

  await insertIfConfigured("ea_payments", {
    provider: "mollie",
    provider_payment_id: molliePaymentId,
    status: "webhook_received",
    raw_payload: Object.fromEntries(formData.entries()),
  });

  return NextResponse.json({ ok: true });
}
