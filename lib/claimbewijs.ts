export const claimbewijsWorkflowPaths = {
  intake: "claimbewijs/intake",
  evidenceUpload: "claimbewijs/evidence-upload",
  evidenceValidation: "claimbewijs/evidence-validation",
  claimExtraction: "claimbewijs/claim-extraction",
  reportMail: "claimbewijs/report-mail",
  accessActivate: "claimbewijs/access/activate",
  portalSync: "claimbewijs/portal/sync",
  clientInvite: "claimbewijs/client-invite",
  onboardingMail: "claimbewijs/onboarding/mail",
} as const;

export const claimbewijsRequiredFlows = [
  { label: "Intake", path: claimbewijsWorkflowPaths.intake },
  { label: "Bewijs upload", path: claimbewijsWorkflowPaths.evidenceUpload },
  { label: "Bewijs validatie", path: claimbewijsWorkflowPaths.evidenceValidation },
  { label: "Claimextractie", path: claimbewijsWorkflowPaths.claimExtraction },
  { label: "Rapport en adviesmail", path: claimbewijsWorkflowPaths.reportMail },
  { label: "Betaalde toegang activeren", path: claimbewijsWorkflowPaths.accessActivate },
  { label: "Portaal dossier sync", path: claimbewijsWorkflowPaths.portalSync },
];
