import { NextRequest, NextResponse } from "next/server";
import { insertIfConfigured } from "@/lib/server/audit";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  await insertIfConfigured("ea_audit_logs", {
    organization_id: body.organizationId ?? null,
    product_key: body.product ?? null,
    action: "subscription.cancel_requested",
    entity_type: "organization",
    entity_id: body.organizationId ?? null,
    metadata: body,
  });

  return NextResponse.json({ ok: true, status: "cancel_requested" });
}
