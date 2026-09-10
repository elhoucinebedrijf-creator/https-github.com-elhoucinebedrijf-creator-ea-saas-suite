import { NextRequest, NextResponse } from "next/server";
import { claimbewijsWorkflowPaths } from "@/lib/claimbewijs";
import { insertIfConfigured } from "@/lib/server/audit";
import { dispatchWorkflow } from "@/lib/server/n8n";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.organizationId || !body.fileName) {
    return NextResponse.json({ error: "Organisatie en bestandsnaam zijn verplicht." }, { status: 400 });
  }

  const upload = {
    product_key: "claimbewijs",
    organization_id: String(body.organizationId),
    case_id: body.caseId ?? null,
    file_name: String(body.fileName),
    storage_path: String(body.storagePath ?? ""),
    mime_type: String(body.mimeType ?? "application/octet-stream"),
    status: "uploaded",
    metadata: body.metadata ?? {},
  };

  const record = await insertIfConfigured("ea_uploads", upload);
  const workflow = await dispatchWorkflow({
    product: "claimbewijs",
    event: "evidence.uploaded",
    path: claimbewijsWorkflowPaths.evidenceUpload,
    recordId: record.id,
    payload: upload,
  });

  return NextResponse.json({ ok: true, uploadId: record.id ?? "local-preview", workflow });
}
