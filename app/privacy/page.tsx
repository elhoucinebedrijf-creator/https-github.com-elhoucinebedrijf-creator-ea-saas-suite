import Link from "next/link";

export const metadata = { title: "Privacybeleid - EA SaaS Suite" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm font-medium text-brand-600">
        Terug naar EA SaaS Suite
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">Privacybeleid</h1>
      <p className="mt-2 text-sm text-slate-500">Laatst bijgewerkt: 10 september 2026</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
        <p className="rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-900">
          Concepttekst: laat deze juridische basis controleren voordat je live klanten verwerkt.
        </p>
        <section>
          <h2 className="font-semibold text-slate-900">1. Verantwoordelijke</h2>
          <p className="mt-2">
            El Houcine Automation verwerkt gegevens voor de gekozen SaaS-dienst, waaronder
            accountgegevens, bedrijfsgegevens, uploads, dossiers, rapporten, betaalstatussen en auditlogs.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-900">2. Doeleinden</h2>
          <p className="mt-2">
            Gegevens worden gebruikt voor intake, uitvoering van de dienst, rapportage, support,
            beveiliging, facturatie en wettelijke verplichtingen.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-900">3. Verwerkers</h2>
          <p className="mt-2">
            De suite is voorbereid op Supabase, Mollie, hosting, foutmonitoring en een e-mailprovider.
            Voor persoonsgegevens van derden is een verwerkersovereenkomst nodig.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-900">4. Beveiliging</h2>
          <p className="mt-2">
            Data wordt per organisatie gescheiden, servertoegang wordt beperkt en gevoelige acties
            worden gelogd voor controle en opvolging.
          </p>
        </section>
      </div>
    </main>
  );
}
