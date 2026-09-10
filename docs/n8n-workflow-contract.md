# n8n workflow-contract voor EA SaaS Suite

Gebruik in n8n een centrale production webhook:

`POST {{N8N_BASE_URL}}/webhook/ea-suite`

Headers:

`content-type: application/json`
`x-ea-signature: {{N8N_SHARED_SECRET}}`

Payload:

```json
{
  "product": "claimbewijs",
  "event": "intake.received",
  "recordId": "uuid-optioneel",
  "payload": {}
}
```

## Productmappen behouden

Behoud de bestaande n8n-mappen die beginnen met `EA`. Maak per product minimaal deze workflows aan of hernoem bestaande workflows naar dit patroon:

- `EA <Product> - 01 Intake`
- `EA <Product> - 02 Upload analyse`
- `EA <Product> - 03 Rapport genereren`
- `EA <Product> - 04 E-mail notificaties`
- `EA <Product> - 05 Follow-up en reminders`
- `EA <Product> - 99 Error handling`

## Eventcontracten

Alle events worden server-to-server verstuurd. Toon technische workflow-namen nooit aan klanten.

| Product | Events |
| --- | --- |
| EA ClaimBewijs | `intake.received`, `evidence.uploaded`, `analysis.requested`, `report.ready`, `followup.required` |
| EA FactuurKeten | `invoice.imported`, `invoice.validated`, `duplicate.detected`, `cashflow.updated`, `client.followup` |
| EA RegeldrukRadar | `scan.submitted`, `risk.analysis`, `priority.generated`, `report.ready`, `owner.reminded` |
| EA BusinessFlow Analyzer | `process.intake`, `kpi.calculated`, `bottleneck.detected`, `action.created`, `management.report` |
| EA SMB Automate | `lead.received`, `invoice.overdue`, `stock.low`, `employee.onboarding`, `monthly.report` |
| EA EduFlow | `student.registration`, `absence.reported`, `schedule.updated`, `parent.email`, `education.report` |
| EA FreelanceFlow | `project.intake`, `quote.followup`, `invoice.created`, `payment.reminder`, `weekly.summary` |
| EA ZZP Compliance Assistant | `compliance.intake`, `document.checked`, `risk.scored`, `action.generated`, `report.ready` |
| EA MKB Bedrijfsproces Integrator | `process.mapped`, `system.connected`, `handover.checked`, `issue.created`, `executive.report` |
| EA AI Klantenservice Assistent | `ticket.received`, `ticket.classified`, `reply.drafted`, `ticket.escalated`, `service.report` |
| EA Smart Invoice & Cashflow Manager | `invoice.created`, `payment.updated`, `cashflow.forecast`, `reminder.sent`, `finance.report` |
| EA Content Repurposing Engine | `content.received`, `variants.generated`, `review.requested`, `schedule.created`, `campaign.report` |

## Live checklist

- Vervang test-webhooks door production webhooks.
- Voeg shared-secret validatie toe in de eerste n8n-node.
- Schrijf elke workflowrun terug naar `ea_audit_logs`.
- Zet foutpaden op `EA <Product> - 99 Error handling`.
- Gebruik klantvriendelijke namen in e-mails en rapporten; geen n8n-node-namen.
