# EA SaaS Suite

Professionele basis om de EA n8n-producten als verkoopklare SaaS aan te bieden.

## Wat zit erin

- Publieke suite-homepage
- Productcatalogus voor 12 SaaS-producten
- Productdetailpagina per SaaS
- Prijzenpagina
- Demo-rapportpagina
- Klantportaal/dashboard preview
- API-routes voor intake, uploadregistratie, rapportstatus en Mollie-webhook
- Supabase schema met RLS voor organisaties, leden, dossiers, uploads, rapporten, betalingen en auditlogs
- n8n eventcontract en verkoop/onboardingdocumentatie
- Juridische basisdocumenten met jurist-disclaimer

## Belangrijke routes

- `/`
- `/producten`
- `/producten/claimbewijs`
- `/producten/businessflow`
- `/producten/smbautomate`
- `/producten/eduflow`
- `/producten/freelanceflow`
- `/prijzen`
- `/demo-rapport`
- `/dashboard`

## API-contract

- `POST /api/intake`
- `POST /api/uploads/register`
- `POST /api/reports/:id/ready`
- `POST /api/billing/mollie-webhook`

De routes werken in local preview zonder secrets. Met Supabase- en n8n-env vars slaan ze data op en dispatchen ze events naar n8n.

## Live koppelen

1. Draai `supabase/migrations/0100_ea_saas_suite.sql` in Supabase.
2. Vul `.env.local` op basis van `.env.example`.
3. Maak in n8n een production webhook `/webhook/ea-suite`.
4. Behoud de bestaande EA-mappen en routeer op `product` + `event`.
5. Zet Mollie live keys pas aan na een testbetaling met webhookcontrole.
6. Controleer juridische teksten door een jurist voor verkoop aan echte klanten.

## Domeinen

- `claimbewijs.elhoucineautomation.nl`
- `businessflow.elhoucineautomation.nl`
- `smbautomate.elhoucineautomation.nl`
- `eduflow.elhoucineautomation.nl`
- `freelanceflow.elhoucineautomation.nl`
