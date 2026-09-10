import { NextRequest, NextResponse } from "next/server";
import { claimbewijsWorkflowPaths } from "@/lib/claimbewijs";
import { insertIfConfigured } from "@/lib/server/audit";
import { dispatchWorkflow } from "@/lib/server/n8n";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.email || !body.organizationName || !body.claimSummary) {
    return NextResponse.json(
      { error: "Organisatie, e-mail en claimsamenvatting zijn verplicht." },
      { status: 400 }
    );
  }

  const intake = {
    product_key: "claimbewijs",
    organization_name: String(body.organizationName),
    contact_name: String(body.contactName ?? ""),
    email: String(body.email),
    phone: String(body.phone ?? ""),
    status: "received",
    source: "claimbewijs-start",
    payload: {
      claimSummary: body.claimSummary,
      counterparty: body.counterparty ?? "",
      claimAmount: body.claimAmount ?? "",
      urgency: body.urgency ?? "normal",
      documentsAvailable: body.documentsAvailable ?? [],
    },
  };

  const record = await insertIfConfigured("ea_intakes", intake);
  const workflow = await dispatchWorkflow({
    product: "claimbewijs",
    event: "intake.received",
    path: claimbewijsWorkflowPaths.intake,
    recordId: record.id,
    payload: intake,
  });

  return NextResponse.json({
    ok: true,
    intakeId: record.id ?? "local-preview",
    workflow,
  });
}
