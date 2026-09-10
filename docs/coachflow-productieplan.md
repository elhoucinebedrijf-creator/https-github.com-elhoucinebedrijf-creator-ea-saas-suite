# CoachFlow OS productieplan

CoachFlow OS is de SaaS-module voor zzp-coaches. De eerste productieversie bevat intake, CRM, dossiers, sessieverslagen, actieplannen, planning, factuurstatus en klantportaal-preview.

## Kernflows

- `coach.intake.received`: nieuwe klantintake vanaf `/producten/coachflow/start`
- `coach.client.created`: klantprofiel en dossier aanmaken
- `coach.session.notes_submitted`: ruwe sessienotities verwerken
- `coach.summary.generated`: AI samenvatting, patronen en afspraken opslaan
- `coach.action_plan.generated`: weekplan en meetpunten genereren
- `coach.reminder.sent`: klant reminders sturen
- `coach.invoice.followup`: open facturen en betaalherinneringen opvolgen
- `coach.evaluation.requested`: evaluatieformulier na trajectfase sturen

## Schermen

- `/producten/coachflow`: productpagina
- `/producten/coachflow/start`: intakeformulier
- `/dashboard/coachflow`: praktijkdashboard
- `/api/coachflow/intake`: serverroute voor intake en n8n dispatch

## N8N webhookpaden

- `ea-coachflow/intake`
- `ea-coachflow/client-created`
- `ea-coachflow/session-notes`
- `ea-coachflow/summary`
- `ea-coachflow/action-plan`
- `ea-coachflow/reminder`
- `ea-coachflow/invoice-followup`
- `ea-coachflow/evaluation`
