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
};

export function getWorkflowPath(product: ProductKey, event: string) {
  return workflowRoutes[product]?.[event] ?? "ea-suite";
}
