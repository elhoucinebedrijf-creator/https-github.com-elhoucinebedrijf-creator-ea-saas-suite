import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { insertIfConfigured } from "@/lib/server/audit";
import { dispatchWorkflow } from "@/lib/server/n8n";
import { getWorkflowPath } from "@/lib/workflow-routing";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const product = getProduct(String(body.product ?? ""));

  if (!product || !body.fileName || !body.organizationId) {
    return NextResponse.json({ error: "Product, organisatie en bestandsnaam zijn verplicht." }, { status: 400 });
  }

  const upload = {
    product_key: product.key,
    organization_id: String(body.organizationId),
    file_name: String(body.fileName),
    storage_path: String(body.storagePath ?? ""),
    mime_type: String(body.mimeType ?? "application/octet-stream"),
    status: "uploaded",
    metadata: body.metadata ?? {},
  };

  const record = await insertIfConfigured("ea_uploads", upload);
  await dispatchWorkflow({
    product: product.key,
    event: "evidence.uploaded",
    path: getWorkflowPath(product.key, "evidence.uploaded"),
    recordId: record.id,
    payload: upload,
  });

  return NextResponse.json({ ok: true, uploadId: record.id ?? "local-preview" });
}
