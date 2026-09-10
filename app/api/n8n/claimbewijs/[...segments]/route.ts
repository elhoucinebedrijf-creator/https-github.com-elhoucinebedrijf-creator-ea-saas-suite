import { NextRequest, NextResponse } from "next/server";
import { insertIfConfigured } from "@/lib/server/audit";

function isAuthorized(request: NextRequest) {
  const configuredSecret = process.env.N8N_SHARED_SECRET;
  if (!configuredSecret) return true;
  return request.headers.get("x-ea-signature") === configuredSecret;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ segments: string[] }> }) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { segments } = await params;
  const action = segments.join("/");
  const body = await request.json().catch(() => ({}));

  if (action === "reports/generate" && body.organizationId) {
    await insertIfConfigured("ea_reports", {
      organization_id: body.organizationId,
      case_id: body.caseId ?? null,
      product_key: "claimbewijs",
      title: body.title ?? "ClaimBewijs rapport",
      status: "completed",
      report_html: body.reportHtml ?? null,
      report_pdf_path: body.reportPdfPath ?? null,
      sections: body.sections ?? [],
      completed_at: new Date().toISOString(),
    });
  }

  await insertIfConfigured("ea_audit_logs", {
    organization_id: body.organizationId ?? null,
    product_key: "claimbewijs",
    action: `n8n.claimbewijs.${action}`,
    entity_type: body.entityType ?? "workflow_callback",
    entity_id: body.entityId ?? body.caseId ?? body.reportId ?? null,
    metadata: body,
  });

  return NextResponse.json({
    ok: true,
    product: "claimbewijs",
    action,
  });
}
