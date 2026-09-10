import {
  BarChart3,
  Bot,
  BriefcaseBusiness,
  Building2,
  FileArchive,
  FileCheck2,
  FileSearch,
  GraduationCap,
  Landmark,
  MailCheck,
  Repeat2,
  ShieldCheck,
  WalletCards,
  Workflow,
} from "lucide-react";

export type ProductKey =
  | "claimbewijs"
  | "factuurketen"
  | "regeldrukradar"
  | "businessflow"
  | "smbautomate"
  | "eduflow"
  | "freelanceflow"
  | "zzp-compliance"
  | "mkb-integrator"
  | "klantenservice-assistent"
  | "invoice-cashflow"
  | "content-repurposing";

export type EaProduct = {
  key: ProductKey;
  name: string;
  shortName: string;
  domain?: string;
  audience: string;
  pain: string;
  promise: string;
  description: string;
  price: string;
  setupFee: string;
  accent: string;
  icon: typeof FileCheck2;
  features: string[];
  workflowFolder: string;
  workflowContract: string[];
  demoScenario: string;
  reportSections: string[];
  cta: string;
};

export const products: EaProduct[] = [
  {
    key: "claimbewijs",
    name: "EA ClaimBewijs",
    shortName: "ClaimBewijs",
    domain: "claimbewijs.elhoucineautomation.nl",
    audience: "Ondernemers, zzp'ers en mkb-bedrijven met claims, klachten of zakelijke conflicten.",
    pain: "Bewijs staat verspreid in mailboxen, documenten, foto's en losse notities waardoor dossiers zwak en tijdrovend worden.",
    promise: "Van ruwe bewijsstukken naar een helder, professioneel claimrapport met tijdlijn, risico's en vervolgstappen.",
    description:
      "Upload documenten, laat bewijs structureren, krijg een dossier met samenvatting, tijdlijn, ontbrekende stukken en downloadbaar rapport.",
    price: "Vanaf EUR 49 per dossier",
    setupFee: "EUR 0 instap, maatwerkbundels voor volume",
    accent: "from-emerald-600 to-slate-900",
    icon: FileArchive,
    features: ["Documentupload", "Bewijsanalyse", "Tijdlijn", "Risicoscore", "Rapportdownload", "Klantportaal"],
    workflowFolder: "EA ClaimBewijs",
    workflowContract: ["intake.received", "evidence.uploaded", "analysis.requested", "report.ready", "followup.required"],
    demoScenario: "Een zzp'er uploadt contract, mailwisseling en foto's rond een onbetaalde opdracht.",
    reportSections: ["Dossieroverzicht", "Chronologische tijdlijn", "Sterke en zwakke bewijsstukken", "Risico-inschatting", "Actielijst"],
    cta: "Start claimscan",
  },
  {
    key: "factuurketen",
    name: "EA FactuurKeten",
    shortName: "FactuurKeten",
    audience: "Accountants, administratiekantoors en mkb-bedrijven met veel inkomende facturen.",
    pain: "Foute btw, dubbele facturen, ontbrekende velden en late betalingen worden te laat gezien.",
    promise: "Controleer factuurstromen automatisch en krijg direct cashflow- en fouteninzichten.",
    description:
      "Verwerkt PDF- en UBL-facturen, valideert kerngegevens en bouwt een accountantwaardig controledossier.",
    price: "Vanaf EUR 99 per maand",
    setupFee: "EUR 299 onboarding",
    accent: "from-cyan-700 to-zinc-900",
    icon: FileSearch,
    features: ["PDF/UBL upload", "BTW/KVK/IBAN-check", "Dubbele facturen", "Cashflowrapport", "Klantdossiers", "Accountant dashboard"],
    workflowFolder: "EA FactuurKeten",
    workflowContract: ["invoice.imported", "invoice.validated", "duplicate.detected", "cashflow.updated", "client.followup"],
    demoScenario: "Een accountant uploadt 40 inkoopfacturen en ziet direct 6 afwijkingen en 2 dubbele facturen.",
    reportSections: ["Validatiescore", "Afwijkingen", "Duplicaten", "Cashflowimpact", "Klantadvies"],
    cta: "Controleer facturen",
  },
  {
    key: "regeldrukradar",
    name: "EA RegeldrukRadar",
    shortName: "RegeldrukRadar",
    audience: "Bedrijven die grip willen krijgen op administratie, AVG en compliance-verplichtingen.",
    pain: "Verplichtingen, vertragingen en risico's zijn versnipperd over processen en eigenaars.",
    promise: "Maak administratieve druk zichtbaar met een score, prioriteiten en verbeterplan.",
    description:
      "Een bedrijfsscan vertaalt processen, documenten en verplichtingen naar concrete compliance-acties.",
    price: "Vanaf EUR 149 per scan",
    setupFee: "EUR 499 voor teamimplementatie",
    accent: "from-indigo-700 to-stone-900",
    icon: ShieldCheck,
    features: ["Bedrijfsscan", "Regeldrukscore", "AVG-risico's", "Prioriteitenlijst", "Dashboard", "Automatische rapportage"],
    workflowFolder: "EA RegeldrukRadar",
    workflowContract: ["scan.submitted", "risk.analysis", "priority.generated", "report.ready", "owner.reminded"],
    demoScenario: "Een mkb-bedrijf vult een compliance-scan in en krijgt een top-10 verbeterlijst.",
    reportSections: ["Regeldrukscore", "AVG-risico's", "Procesvertragingen", "Prioriteiten", "Verbeterplan"],
    cta: "Doe regeldrukscan",
  },
  {
    key: "businessflow",
    name: "EA BusinessFlow Analyzer",
    shortName: "BusinessFlow",
    domain: "businessflow.elhoucineautomation.nl",
    audience: "Mkb-directies en operationeel managers die willen weten waar tijd en marge weglekken.",
    pain: "Processen lijken druk, maar niemand ziet precies welke stap geld, tijd of omzet kost.",
    promise: "Breng bottlenecks, KPI's en verbeteracties samen in een managementrapport.",
    description:
      "Procesintake, KPI-analyse, bottleneck-detectie en actieopvolging in een strak dashboard.",
    price: "Vanaf EUR 199 per analyse",
    setupFee: "EUR 750 implementatiepakket",
    accent: "from-teal-700 to-neutral-950",
    icon: BarChart3,
    features: ["Procesintake", "KPI-analyse", "Bottlenecks", "Verbeterplan", "Managementrapport", "Actie-reminders"],
    workflowFolder: "EA BusinessFlow Analyzer",
    workflowContract: ["process.intake", "kpi.calculated", "bottleneck.detected", "action.created", "management.report"],
    demoScenario: "Een dienstverlener analyseert offerte tot facturatie en vindt 18 uur wachttijd per order.",
    reportSections: ["Proceskaart", "KPI-dashboard", "Bottleneckanalyse", "Financiele impact", "30-dagen actieplan"],
    cta: "Analyseer proces",
  },
  {
    key: "smbautomate",
    name: "EA SMB Automate",
    shortName: "SMB Automate",
    domain: "smbautomate.elhoucineautomation.nl",
    audience: "Kleine en middelgrote bedrijven die terugkerend kantoorwerk willen automatiseren.",
    pain: "Leads, factuuropvolging, voorraad, HR en rapportages vragen elke week handmatig werk.",
    promise: "Automatiseer terugkerende processen zonder een intern automationteam.",
    description:
      "Bundelt lead intake, factuuropvolging, voorraadalerts, HR-onboarding en maandrapportages.",
    price: "Vanaf EUR 249 per maand",
    setupFee: "Vanaf EUR 950 implementatie",
    accent: "from-sky-700 to-zinc-950",
    icon: Workflow,
    features: ["Lead intake", "Factuuropvolging", "Voorraadalerts", "HR onboarding", "Maandrapportage", "Automation dashboard"],
    workflowFolder: "EA SMB Automate",
    workflowContract: ["lead.received", "invoice.overdue", "stock.low", "employee.onboarding", "monthly.report"],
    demoScenario: "Een handelsbedrijf automatiseert leadopvolging, voorraadwaarschuwingen en maandrapportage.",
    reportSections: ["Automatiseringskaart", "Bespaarde uren", "Processtatus", "Open acties", "ROI-inschatting"],
    cta: "Plan automatiseringsscan",
  },
  {
    key: "eduflow",
    name: "EA EduFlow",
    shortName: "EduFlow",
    domain: "eduflow.elhoucineautomation.nl",
    audience: "Scholen, weekendscholen, stichtingen en onderwijsorganisaties.",
    pain: "Inschrijvingen, afwezigheid, roosters en oudercommunicatie lopen via losse formulieren en berichten.",
    promise: "Een overzichtelijk portaal voor leerlingen, ouders, planning en rapportage.",
    description:
      "Beheert inschrijvingen, afwezigheidsmeldingen, roosterupdates, oudermails en rapportages.",
    price: "Vanaf EUR 129 per maand",
    setupFee: "EUR 399 schoolstart",
    accent: "from-rose-700 to-slate-950",
    icon: GraduationCap,
    features: ["Inschrijvingen", "Afwezigheid", "Roosterupdates", "Oudermails", "Rapportgeneratie", "Leerlingdashboard"],
    workflowFolder: "EA EduFlow",
    workflowContract: ["student.registration", "absence.reported", "schedule.updated", "parent.email", "education.report"],
    demoScenario: "Een weekendschool verwerkt nieuwe aanmeldingen en stuurt automatisch ouderbevestigingen.",
    reportSections: ["Leerlingenoverzicht", "Aanwezigheid", "Communicatie", "Roosterwijzigingen", "Maandrapport"],
    cta: "Bekijk schoolportaal",
  },
  {
    key: "freelanceflow",
    name: "EA FreelanceFlow",
    shortName: "FreelanceFlow",
    domain: "freelanceflow.elhoucineautomation.nl",
    audience: "Freelancers en zzp'ers met offertes, projecten, facturen en opvolging.",
    pain: "Opvolging, facturatie en projectstatus blijven liggen tussen klantwerk door.",
    promise: "Houd commerciële opvolging en projectadministratie automatisch strak.",
    description:
      "Regelt projectintake, offerte-opvolging, facturen, betaalherinneringen en weekoverzichten.",
    price: "Vanaf EUR 39 per maand",
    setupFee: "EUR 99 quickstart",
    accent: "from-lime-700 to-neutral-950",
    icon: BriefcaseBusiness,
    features: ["Project intake", "Offerte-opvolging", "Factuur maken", "Betaalherinneringen", "Weekoverzicht", "Dashboard"],
    workflowFolder: "EA FreelanceFlow",
    workflowContract: ["project.intake", "quote.followup", "invoice.created", "payment.reminder", "weekly.summary"],
    demoScenario: "Een consultant zet intake, offerte en eerste factuur klaar vanuit een klantformulier.",
    reportSections: ["Pipeline", "Projectstatus", "Open facturen", "Weekfocus", "Omzetverwachting"],
    cta: "Start als freelancer",
  },
  {
    key: "zzp-compliance",
    name: "EA ZZP Compliance Assistant",
    shortName: "ZZP Compliance",
    audience: "Zelfstandigen die contracten, AVG-documenten en administratie willen controleren.",
    pain: "Zzp'ers weten vaak niet welke documenten ontbreken tot een opdrachtgever of controle ernaar vraagt.",
    promise: "Een praktische compliancecheck met bewijs, ontbrekende documenten en concrete acties.",
    description:
      "Controleert contracten, privacydocumenten, administratie en zelfstandigheidsrisico's.",
    price: "Vanaf EUR 29 per scan",
    setupFee: "EUR 0",
    accent: "from-violet-700 to-neutral-950",
    icon: Landmark,
    features: ["Contractcheck", "AVG-checklist", "Administratiecontrole", "Risicoscore", "Actielijst", "Rapportdownload"],
    workflowFolder: "EA ZZP Compliance Assistant",
    workflowContract: ["compliance.intake", "document.checked", "risk.scored", "action.generated", "report.ready"],
    demoScenario: "Een zzp'er uploadt modelovereenkomst en privacytekst voor een opdrachtgevercheck.",
    reportSections: ["Documentstatus", "Risico's", "Ontbrekende stukken", "Aanbevolen acties", "Disclaimer"],
    cta: "Doe zzp-check",
  },
  {
    key: "mkb-integrator",
    name: "EA MKB Bedrijfsproces Integrator",
    shortName: "MKB Integrator",
    audience: "Mkb-bedrijven die processen en systemen beter willen laten samenwerken.",
    pain: "Afdelingen werken met losse tools waardoor dubbel werk en overdrachtsfouten ontstaan.",
    promise: "Ontwerp de proceskoppelingen, datastromen en automatiseringen die echt rendement geven.",
    description:
      "Analyseert processen, koppelt overdrachten en bewaakt verbeteracties per afdeling.",
    price: "Vanaf EUR 399 per maand",
    setupFee: "Vanaf EUR 1.500 implementatie",
    accent: "from-fuchsia-700 to-slate-950",
    icon: Building2,
    features: ["Procesanalyse", "Systeemkaart", "Koppelflows", "Datacontrole", "Verbeterbacklog", "Directiedashboard"],
    workflowFolder: "EA MKB Bedrijfsproces Integrator",
    workflowContract: ["process.mapped", "system.connected", "handover.checked", "issue.created", "executive.report"],
    demoScenario: "Een installateur koppelt sales, planning en facturatie in een centrale proceskaart.",
    reportSections: ["Procesarchitectuur", "Systeemkoppelingen", "Datakwaliteit", "Automatiseringskansen", "Roadmap"],
    cta: "Ontwerp integratie",
  },
  {
    key: "klantenservice-assistent",
    name: "EA AI Klantenservice Assistent",
    shortName: "Klantenservice Assistent",
    audience: "Bedrijven met terugkerende klantvragen via e-mail, formulieren of chat.",
    pain: "Teams verliezen tijd aan classificeren, standaardantwoorden en rapporteren van klantvragen.",
    promise: "Classificeer vragen, stel antwoorden voor en maak service-inzichten zichtbaar.",
    description:
      "Een service-assistent voor intake, triage, antwoordconcepten, escalaties en rapportages.",
    price: "Vanaf EUR 199 per maand",
    setupFee: "EUR 750 implementatie",
    accent: "from-amber-600 to-zinc-950",
    icon: Bot,
    features: ["Vraagclassificatie", "Antwoordconcepten", "Escalaties", "Klantdossiers", "SLA-dashboard", "Rapportage"],
    workflowFolder: "EA AI Klantenservice Assistent",
    workflowContract: ["ticket.received", "ticket.classified", "reply.drafted", "ticket.escalated", "service.report"],
    demoScenario: "Een webshop verwerkt retourvragen, klachten en productvragen vanuit een centrale inbox.",
    reportSections: ["Vraagcategorieen", "SLA-status", "Conceptantwoorden", "Escalaties", "Verbeterinzichten"],
    cta: "Test serviceflow",
  },
  {
    key: "invoice-cashflow",
    name: "EA Smart Invoice & Cashflow Manager",
    shortName: "Invoice & Cashflow",
    audience: "Ondernemers die facturen, betalingen en cashflowprognoses willen sturen.",
    pain: "Openstaande facturen en toekomstige cashflow zijn pas duidelijk als het al krap wordt.",
    promise: "Automatische factuurstatus, betaalherinneringen en cashflowvooruitblik.",
    description:
      "Combineert factuurbeheer met voorspellingen, herinneringen en managementoverzicht.",
    price: "Vanaf EUR 79 per maand",
    setupFee: "EUR 249 onboarding",
    accent: "from-emerald-700 to-zinc-950",
    icon: WalletCards,
    features: ["Factuurbeheer", "Cashflowprognose", "Betaalherinneringen", "Debiteurenstatus", "Mollie-koppeling", "Dagrapport"],
    workflowFolder: "EA Smart Invoice & Cashflow Manager",
    workflowContract: ["invoice.created", "payment.updated", "cashflow.forecast", "reminder.sent", "finance.report"],
    demoScenario: "Een bureau ziet welke facturen deze maand betaald moeten worden en welke herinnering uitgaat.",
    reportSections: ["Openstaande posten", "Cashflow 30/60/90", "Risicoklanten", "Herinneringen", "Betaalstatus"],
    cta: "Bekijk cashflow",
  },
  {
    key: "content-repurposing",
    name: "EA Content Repurposing Engine",
    shortName: "Content Engine",
    audience: "Ondernemers en bureaus die content over meerdere kanalen willen hergebruiken.",
    pain: "Een goede post, video of nieuwsbrief levert te weinig op omdat hergebruik handmatig blijft.",
    promise: "Zet een bronstuk om naar kanaalklare content met planning en kwaliteitscontrole.",
    description:
      "Maakt herbruikbare posts, nieuwsbrieven, scripts en campagne-items vanuit een centrale bron.",
    price: "Vanaf EUR 99 per maand",
    setupFee: "EUR 299 contentsetup",
    accent: "from-red-700 to-neutral-950",
    icon: Repeat2,
    features: ["Content intake", "Kanaalvarianten", "Publicatieplanning", "Tone-of-voice", "Reviewflow", "Campagnerapport"],
    workflowFolder: "EA Content Repurposing Engine",
    workflowContract: ["content.received", "variants.generated", "review.requested", "schedule.created", "campaign.report"],
    demoScenario: "Een ondernemer uploadt een blog en krijgt LinkedIn-posts, nieuwsbrieftekst en videoscript.",
    reportSections: ["Bronanalyse", "Kanaalvarianten", "Reviewstatus", "Publicatieplanning", "Campagneadvies"],
    cta: "Hergebruik content",
  },
];

export const highlightedProductKeys: ProductKey[] = [
  "claimbewijs",
  "businessflow",
  "smbautomate",
  "eduflow",
  "freelanceflow",
];

export function getProduct(key: string) {
  return products.find((product) => product.key === key);
}

export function getProductByDomain(host?: string | null) {
  if (!host) return null;
  const normalizedHost = host.split(":")[0].toLowerCase();
  return products.find((product) => product.domain === normalizedHost) ?? null;
}

export const suiteMetrics = [
  { label: "SaaS-producten", value: "12" },
  { label: "Live domeinen voorbereid", value: "5" },
  { label: "Workflow-contracten", value: "60+" },
  { label: "Productieblokken", value: "9" },
];

export const platformCapabilities = [
  { icon: FileCheck2, title: "Intake tot rapport", body: "Elke SaaS heeft intake, upload, analyse, rapportage en opvolging als vaste proceslijn." },
  { icon: MailCheck, title: "E-mail en salesflows", body: "Bevestigingen, onboarding, rapportmeldingen en verkoopmails zijn per product uitgewerkt." },
  { icon: WalletCards, title: "Mollie-ready", body: "Checkout, webhookstatussen, prijsplannen en activering na betaling zijn voorbereid." },
  { icon: ShieldCheck, title: "Supabase + RLS", body: "Organisaties, gebruikers, dossiers, uploads, rapporten, betalingen en auditlogs zijn gescheiden per tenant." },
];
