import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { insertIfConfigured } from "@/lib/server/audit";
import { dispatchWorkflow } from "@/lib/server/n8n";
import { getWorkflowPath } from "@/lib/workflow-routing";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const product = getProduct(String(body.product ?? ""));

  if (!product) {
    return NextResponse.json({ error: "Onbekend SaaS-product." }, { status: 400 });
  }

  if (!body.email || !body.organizationName) {
    return NextResponse.json({ error: "E-mail en organisatienaam zijn verplicht." }, { status: 400 });
  }

  const intake = {
    product_key: product.key,
    organization_name: String(body.organizationName),
    contact_name: String(body.contactName ?? ""),
    email: String(body.email),
    phone: String(body.phone ?? ""),
    status: "received",
    source: "web",
    payload: body,
  };

  const record = await insertIfConfigured("ea_intakes", intake);
  await dispatchWorkflow({
    product: product.key,
    event: "intake.received",
    path: getWorkflowPath(product.key, "intake.received"),
    recordId: record.id,
    payload: intake,
  });

  return NextResponse.json({ ok: true, intakeId: record.id ?? "local-preview", product: product.name });
}
