import {
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  FileText,
  MessageSquareText,
  Target,
  Users,
} from "lucide-react";

export const coachflowFeatures = [
  {
    icon: ClipboardList,
    title: "Slimme intake",
    body: "Verzamelt hulpvraag, doelen, urgentie, belemmeringen en gewenste begeleiding in een compleet klantprofiel.",
  },
  {
    icon: Users,
    title: "CRM en trajectstatus",
    body: "Leads, actieve klanten, risicotrajecten, no-shows en vervolgacties overzichtelijk bij elkaar.",
  },
  {
    icon: FileText,
    title: "Coachingdossiers",
    body: "Per klant een dossier met doelen, sessies, notities, documenten, voortgang en evaluaties.",
  },
  {
    icon: MessageSquareText,
    title: "AI sessieverslagen",
    body: "Zet ruwe gespreksnotities om naar samenvatting, patronen, afspraken, huiswerk en volgende focus.",
  },
  {
    icon: Target,
    title: "Actieplan-generator",
    body: "Maakt weekplannen met prioriteiten, meetpunten, blokkades en concrete opdrachten voor de klant.",
  },
  {
    icon: CreditCard,
    title: "Facturen en betalingen",
    body: "Volgt abonnementen, losse sessies, open posten, betaalherinneringen en verlengmomenten.",
  },
];

export const coachflowStats = [
  { label: "Actieve klanten", value: "24", detail: "+6 deze maand" },
  { label: "Sessies gepland", value: "18", detail: "7 deze week" },
  { label: "Open actiepunten", value: "43", detail: "11 urgent" },
  { label: "Open omzet", value: "EUR 3.420", detail: "4 facturen" },
];

export const coachflowClients = [
  {
    name: "Sofia Amrani",
    type: "ZZP starter",
    status: "Actief",
    theme: "Focus, aanbod, acquisitie",
    progress: 72,
    nextSession: "Vrijdag 10:00",
    risk: "Laag",
    invoice: "Betaald",
  },
  {
    name: "Yassin El B.",
    type: "Loopbaancoaching",
    status: "Extra aandacht",
    theme: "Stress, planning, grenzen",
    progress: 41,
    nextSession: "Maandag 14:30",
    risk: "Midden",
    invoice: "Open",
  },
  {
    name: "Nadia Bakkali",
    type: "Business coaching",
    status: "Actief",
    theme: "Prijsstrategie, ritme, sales",
    progress: 64,
    nextSession: "Woensdag 09:00",
    risk: "Laag",
    invoice: "Betaald",
  },
  {
    name: "Bilal H.",
    type: "Discipline traject",
    status: "Nieuwe intake",
    theme: "Structuur, motivatie, gewoontes",
    progress: 18,
    nextSession: "Nog plannen",
    risk: "Midden",
    invoice: "Proeftraject",
  },
];

export const coachflowSessions = [
  {
    client: "Yassin El B.",
    title: "Weekplanning en energielekken",
    time: "Vandaag 16:30",
    output: "Verslag + 5 actiepunten klaarzetten",
  },
  {
    client: "Sofia Amrani",
    title: "Aanbod aanscherpen",
    time: "Morgen 10:00",
    output: "LinkedIn follow-up en belscript",
  },
  {
    client: "Nadia Bakkali",
    title: "Prijsverhoging voorbereiden",
    time: "Woensdag 09:00",
    output: "Beslismatrix en klantcommunicatie",
  },
];

export const coachflowProblemMap = [
  { label: "Geld en omzet", count: 9, color: "bg-emerald-600" },
  { label: "Planning en discipline", count: 14, color: "bg-sky-600" },
  { label: "Stress en grenzen", count: 8, color: "bg-rose-600" },
  { label: "Business en sales", count: 12, color: "bg-amber-500" },
  { label: "Administratie", count: 5, color: "bg-slate-700" },
];

export const coachflowWorkflowContract = [
  "coach.intake.received",
  "coach.client.created",
  "coach.session.notes_submitted",
  "coach.summary.generated",
  "coach.action_plan.generated",
  "coach.reminder.sent",
  "coach.invoice.followup",
  "coach.evaluation.requested",
];

export const coachflowPortalItems = [
  { icon: CheckCircle2, label: "Weekacties", value: "5 open" },
  { icon: CalendarCheck, label: "Volgende sessie", value: "Vrijdag 10:00" },
  { icon: FileText, label: "Laatste verslag", value: "Beschikbaar" },
  { icon: Target, label: "Hoofddoel", value: "Meer structuur" },
];
