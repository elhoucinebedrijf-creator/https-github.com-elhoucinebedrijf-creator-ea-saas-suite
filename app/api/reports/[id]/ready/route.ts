import { NextRequest, NextResponse } from "next/server";
import { insertIfConfigured } from "@/lib/server/audit";
import { dispatchWorkflow } from "@/lib/server/n8n";
import { getProduct } from "@/lib/products";
import { getWorkflowPath } from "@/lib/workflow-routing";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const product = getProduct(String(body.product ?? ""));

  if (!product) {
    return NextResponse.json({ error: "Onbekend SaaS-product." }, { status: 400 });
  }

  await insertIfConfigured("ea_audit_logs", {
    product_key: product.key,
    action: "report.ready",
    entity_type: "report",
    entity_id: id,
    metadata: body,
  });

  await dispatchWorkflow({
    product: product.key,
    event: "report.ready",
    path: getWorkflowPath(product.key, "report.ready"),
    recordId: id,
    payload: body,
  });

  return NextResponse.json({ ok: true });
}
