# RitFactuur

Automatische facturatie voor Nederlandse taxi-ondernemers. Zet rittendata
(geëxporteerd uit je boordcomputer/KVM-systeem, of handmatig ingevoerd) om in
BTW-conforme PDF-facturen, verstuurt ze en bewaakt betaling — zonder Excel.

## Stack

- **Next.js** (App Router, TypeScript, Tailwind) — dashboard + publieke site
- **Supabase** (Postgres, Auth, Storage) — system of record, RLS per tenant
- **n8n** — orchestratie: ritten verwerken, PDF's genereren, e-mails, herinneringen
- **Gotenberg** — self-hosted HTML→PDF voor factuurgeneratie
- **Mollie** — betalingen (SaaS-abonnement + toekomstig betaallinks per factuur)

## Snel starten

Zie [docs/setup.md](docs/setup.md) voor de volledige stap-voor-stap koppeling
van Supabase, n8n, Gotenberg en Mollie. In het kort:

```bash
npm install
cp .env.example .env    # vul in
npm run dev
```

## Structuur

```
app/                     Next.js routes (marketing, auth, dashboard, API)
lib/                      Supabase-clients en gedeelde BTW/factuur-logica
components/               Client-side UI-componenten
supabase/migrations/      Databaseschema, RLS-policies, factuurnummer-functie
n8n/workflows/             Importeerbare n8n-workflow-exports
infra/                     Docker Compose voor self-hosted n8n + Gotenberg
docs/                       Setup-instructies en BTW-compliance-checklist
```

## Scope

Dit is een werkende v1-basis, geen kant-en-klaar productiebedrijf. Zie de
"v1 scope" in het oorspronkelijke implementatieplan voor wat bewust is
uitgesteld (credit­nota's, meerdere BTW-tarieven, boordcomputer-vendor-
detectie, bankreconciliatie, etc.).
