import { claimbewijsWorkflowPaths } from "@/lib/claimbewijs";
import type { ProductKey } from "@/lib/products";

const workflowRoutes: Partial<Record<ProductKey, Record<string, string>>> = {
  claimbewijs: {
    "intake.received": claimbewijsWorkflowPaths.intake,
    "evidence.uploaded": claimbewijsWorkflowPaths.evidenceUpload,
    "evidence.validation.requested": claimbewijsWorkflowPaths.evidenceValidation,
    "analysis.requested": claimbewijsWorkflowPaths.claimExtraction,
    "report.ready": claimbewijsWorkflowPaths.reportMail,
    "access.activate": claimbewijsWorkflowPaths.accessActivate,
    "portal.sync": claimbewijsWorkflowPaths.portalSync,
    "client.invite": claimbewijsWorkflowPaths.clientInvite,
    "onboarding.mail": claimbewijsWorkflowPaths.onboardingMail,
  },
  coachflow: {
    "coach.intake.received": "ea-coachflow/intake",
    "coach.client.created": "ea-coachflow/client-created",
    "coach.session.notes_submitted": "ea-coachflow/session-notes",
    "coach.summary.generated": "ea-coachflow/summary",
    "coach.action_plan.generated": "ea-coachflow/action-plan",
    "coach.reminder.sent": "ea-coachflow/reminder",
    "coach.invoice.followup": "ea-coachflow/invoice-followup",
    "coach.evaluation.requested": "ea-coachflow/evaluation",
  },
};

export function getWorkflowPath(product: ProductKey, event: string) {
  return workflowRoutes[product]?.[event] ?? "ea-suite";
}
