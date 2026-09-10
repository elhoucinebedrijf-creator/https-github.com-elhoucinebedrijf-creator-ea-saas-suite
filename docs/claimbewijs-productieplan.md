# EA ClaimBewijs productieplan

## Huidige live n8n-status

- Workflows gevonden: 15
- Actieve workflows tijdens audit: 1 (`EA ClaimBewijs AI - Juridische onboarding mail`)
- Alle workflows gebruiken een Webhook -> HTTP Request -> Response patroon.
- De HTTP Request nodes wijzen nog naar de oude ClaimBewijs app:
  `https://ea-claimbewijs-ai.wiskundehv.chatgpt.site`

## Nieuwe SaaS-routes

Publiek:

- `GET /producten/claimbewijs`
- `GET /producten/claimbewijs/start`

SaaS naar n8n:

- `POST /api/claimbewijs/intake` -> `claimbewijs/intake`
- `POST /api/claimbewijs/evidence` -> `claimbewijs/evidence-upload`

n8n terug naar SaaS:

- `POST /api/n8n/claimbewijs/intake`
- `POST /api/n8n/claimbewijs/evidence-upload`
- `POST /api/n8n/claimbewijs/evidence-validation`
- `POST /api/n8n/claimbewijs/claim-extraction`
- `POST /api/n8n/claimbewijs/report-mail`
- `POST /api/n8n/claimbewijs/reports/generate`
- `POST /api/n8n/claimbewijs/access/activate`
- `POST /api/n8n/claimbewijs/portal/sync`

## Aanpassen in n8n

Wijzig de HTTP Request URL's in de ClaimBewijs-workflows van:

`https://ea-claimbewijs-ai.wiskundehv.chatgpt.site/api/n8n/...`

naar:

`{{EA_SAAS_BASE_URL}}/api/n8n/claimbewijs/...`

Voeg op de HTTP Request nodes deze header toe:

`x-ea-signature: {{N8N_SHARED_SECRET}}`

## Testvolgorde

1. Intake testen met `test-payloads/claimbewijs-intake.json`.
2. Controleren of n8n workflow `claimbewijs/intake` de request ontvangt.
3. HTTP Request node laten terugschrijven naar de nieuwe SaaS callbackroute.
4. Evidence upload testen.
5. Evidence validation en claim extraction testen.
6. Rapportgeneratie testen zonder echte klantmail.
7. Mailflow activeren met testadres.
8. Mollie-flow pas testen met testmode betaling.

## Niet bulk activeren

Activeer alleen de workflows die per stap groen getest zijn. ClaimBewijs heeft meerdere commerciële varianten zoals greenwashing, bureau dashboard en maandmonitoring; die zijn niet nodig voor de eerste verkoopbare v1.
