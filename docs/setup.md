# RitFactuur — setup

Deze app is een werkende basis, geen kant-en-klaar gehost product. Onderstaande
stappen koppelen alle losse delen (Next.js, Supabase, n8n, Mollie, Gotenberg)
aan elkaar. Reken op een middag werk voor de eerste end-to-end test.

## 1. Supabase-project

1. Maak een nieuw project aan op [supabase.com](https://supabase.com).
2. Ga naar de SQL-editor en voer `supabase/migrations/0001_init.sql` uit,
   gevolgd door `supabase/migrations/0002_storage.sql`.
3. Kopieer uit **Settings → API**: Project URL, `anon` key en
   `service_role` key naar `.env` (zie `.env.example`).
4. Zet e-mailbevestiging bij signup desgewenst uit voor sneller testen
   (Authentication → Providers → Email → "Confirm email").

## 2. Next.js app lokaal draaien

```bash
cd taxi-saas
npm install
cp .env.example .env    # vul alle waarden in
npm run dev
```

Open http://localhost:3000 — de landingpage, registratie en login zouden nu
moeten werken (registratie loopt vast bij de betaalstap totdat Mollie/n8n
hieronder zijn gekoppeld).

## 3. n8n + Gotenberg

Heb je al een draaiende n8n-instantie? Sla stap 3a over en importeer direct
de workflows (3b) — vul dan wel dezelfde environment-variabelen in bij jouw
instantie (zie de `environment:`-sectie in `infra/docker-compose.yml` als
referentielijst).

### 3a. Zelf hosten (optioneel)

```bash
cd infra
docker compose up -d
```

n8n is dan bereikbaar op http://localhost:5678, Gotenberg op :3000.

### 3b. Workflows importeren

In n8n: **Workflows → Import from File**, en importeer elk bestand uit
`n8n/workflows/` één voor één:

1. `tenant-onboarding.json`
2. `ride-ingestion.json`
3. `invoice-generation.json`
4. `invoice-email.json`
5. `overdue-reminders.json`
6. `mollie-webhook-handler.json`
7. `recurring-billing-cron.json`

Per workflow moet je nog invullen:
- **Postgres-credential**: verbind met je Supabase-database (Settings →
  Database → Connection string in Supabase; gebruik de `service_role`
  verbinding, niet de pooler-URL voor lange-lopende connecties).
- **HTTP Header Auth-credentials**: voor Mollie-calls
  (`Authorization: Bearer <MOLLIE_API_KEY>`) en voor Supabase Storage-calls
  (`Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>`).
- **E-mail-credential**: SMTP of een transactionele provider (Resend/Postmark)
  voor de verzend- en herinnering-workflows.
- Zet elke workflow op **Active** zodra de credentials kloppen.

## 4. Mollie

1. Maak een Mollie-account aan, activeer iDEAL + SEPA-machtigingen.
2. Kopieer de (test-)API key naar `MOLLIE_API_KEY` in `.env`.
3. Test eerst met de Mollie test-mode API key — pas op live zetten na een
   succesvolle end-to-end test.

## 5. End-to-end testen

1. Registreer een nieuw account via `/registreren`, rond de Mollie-testbetaling
   af.
2. Controleer in Supabase dat er een rij in `tenants`, `profiles` en
   `subscriptions` is aangemaakt (via de Tenant Onboarding-workflow).
3. Log in, ga naar **Klanten** en voeg een testklant toe.
4. Ga naar **Ritten**, upload een CSV volgens het vaste sjabloon:
   ```
   ride_date,pickup_address,dropoff_address,distance_km,amount_excl_btw,client_name,external_ride_id
   2026-08-01,Station Utrecht,Schiphol,45,65.00,Testklant BV,R-001
   ```
5. Ververs de pagina — de rit moet onder "Nog te factureren" verschijnen.
6. Selecteer de rit en klik **Genereer factuur** — controleer in
   **Facturen** dat de status naar "Verstuurd" gaat en dat er een PDF-link
   verschijnt.
7. Wacht een dag (of pas `current_date` in een testquery aan) om de
   Overdue Reminders-workflow te testen.

## Wat je zelf nog moet doen (kan niet vanuit code)

- Een Supabase-, Mollie- en (indien zelf gehost) VPS-account aanmaken.
- Alle bovenstaande credentials invullen — dit raakt geheimen die niet in
  code horen.
- De boekhoudkundige/fiscale check uit `docs/btw-compliance-checklist.md`
  laten doen voordat je met echte klanten gaat factureren.
