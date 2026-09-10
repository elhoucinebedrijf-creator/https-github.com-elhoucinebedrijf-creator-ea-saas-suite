import { NextResponse } from "next/server";
import { dispatchWorkflow } from "@/lib/server/n8n";
import { getWorkflowPath } from "@/lib/workflow-routing";

type CoachFlowIntakePayload = {
  name?: string;
  email?: string;
  phone?: string;
  coachingType?: string;
  urgency?: string;
  mainQuestion?: string;
  desiredOutcome?: string;
  focusAreas?: string[];
};

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as CoachFlowIntakePayload | null;

  if (!payload?.name || !payload?.email || !payload?.mainQuestion || !payload?.desiredOutcome) {
    return NextResponse.json({ error: "Naam, e-mail, hulpvraag en doel zijn verplicht." }, { status: 400 });
  }

  const dossierId = `coach_${Date.now()}`;
  const workflow = await dispatchWorkflow({
    product: "coachflow",
    event: "coach.intake.received",
    path: getWorkflowPath("coachflow", "coach.intake.received"),
    recordId: dossierId,
    payload: {
      dossierId,
      receivedAt: new Date().toISOString(),
      ...payload,
    },
  });

  return NextResponse.json({
    ok: true,
    dossierId,
    workflowDispatched: "ok" in workflow ? workflow.ok : false,
    workflowStatus: workflow.status,
  });
}
