import Link from "next/link";

export const metadata = { title: "Algemene voorwaarden - EA SaaS Suite" };

export default function VoorwaardenPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm font-medium text-brand-600">
        Terug naar EA SaaS Suite
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">Algemene voorwaarden</h1>
      <p className="mt-2 text-sm text-slate-500">Laatst bijgewerkt: 10 september 2026</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
        <p className="rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-900">
          Concepttekst: laat deze voorwaarden juridisch controleren voor live verkoop.
        </p>
        <section>
          <h2 className="font-semibold text-slate-900">1. Dienst</h2>
          <p className="mt-2">
            EA SaaS Suite levert software, automatisering, analyses en rapportages op basis van
            gegevens die de klant aanlevert of koppelt.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-900">2. Verantwoordelijkheid klant</h2>
          <p className="mt-2">
            De klant blijft verantwoordelijk voor de juistheid van aangeleverde gegevens,
            beslissingen op basis van rapporten en controle van juridische, fiscale of complianceconclusies.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-900">3. Betaling</h2>
          <p className="mt-2">
            Producten kunnen als losse scan, maandabonnement of implementatiepakket worden verkocht.
            Betaling en activering verlopen via de gekozen betaalprovider.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-900">4. Aansprakelijkheid</h2>
          <p className="mt-2">
            De dienst wordt zorgvuldig geleverd, maar vervangt geen professioneel juridisch,
            fiscaal, medisch of financieel advies.
          </p>
        </section>
      </div>
    </main>
  );
}
