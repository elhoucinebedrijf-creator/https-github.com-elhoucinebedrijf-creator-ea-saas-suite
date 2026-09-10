# n8n live audit - 10 september 2026

## Status

De lokale `.env.local` bevat nu:

- `N8N_BASE_URL`: aanwezig
- `N8N_API_KEY`: aanwezig
- `N8N_SHARED_SECRET`: aanwezig

De n8n-host is bereikbaar en de Public API werkt nu met de nieuwe API key.

## Geteste routes

- `GET /api/v1/workflows` -> 200 JSON
- `GET /api/v1/workflows/:id` -> 200 JSON

## Resultaat

- Totaal workflows gevonden: 488
- EA/verwante workflows gevonden: 308
- Target EA SaaS workflows gevonden: 186
- Alle 12 gevraagde EA-productgroepen zijn aanwezig.
- De meeste target-workflows staan momenteel inactief; ClaimBewijs heeft 1 actieve workflow.

## Nog nodig

- Activeer workflows niet in bulk. Test en activeer per product alleen de intake, analyse, rapportage, e-mail en foutafhandeling die bij de live SaaS horen.
- Zie `docs/n8n-ea-live-inventory-2026-09-10.md` voor de productinventarisatie.
- Zie `docs/n8n-ea-webhook-map-2026-09-10.md` voor de webhookpaden.
