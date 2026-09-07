import Link from "next/link";

export const metadata = { title: "Privacybeleid — RitFactuur" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm font-medium text-brand-600">
        ← Terug naar RitFactuur
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">Privacybeleid</h1>
      <p className="mt-2 text-sm text-slate-500">Laatst bijgewerkt: 24 augustus 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
        <p className="rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-900">
          Let op: dit is een standaardsjabloon op basis van de AVG/GDPR, geen juridisch advies.
          Laat dit controleren door een jurist voordat je dit gebruikt met echte klanten.
        </p>

        <section>
          <h2 className="font-semibold text-slate-900">1. Wie is verantwoordelijk</h2>
          <p className="mt-2">
            Elhoucine Automation, gevestigd te Almere, KVK 70739862, is
            verwerkingsverantwoordelijke voor de persoonsgegevens die worden verwerkt via
            RitFactuur.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">2. Welke gegevens we verwerken</h2>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Accountgegevens: naam, e-mailadres, bedrijfsgegevens (KVK, BTW-nummer, IBAN)</li>
            <li>Klantgegevens die jij invoert: naam, adres, e-mailadres van jouw klanten</li>
            <li>Ritgegevens: datum, adressen, bedragen</li>
            <li>Facturatiegegevens: via onze betaalverwerker Mollie</li>
            <li>Technische gegevens: IP-adres en logbestanden voor beveiliging en foutopsporing</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">3. Waarvoor we deze gebruiken</h2>
          <p className="mt-2">
            Uitsluitend om de dienst te leveren: facturen genereren, versturen en betalingsstatus
            bijhouden, je account te beheren, en de dienst te verbeteren en beveiligen. We
            verkopen geen gegevens aan derden.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">4. Verwerkers</h2>
          <p className="mt-2">
            We maken gebruik van de volgende verwerkers, elk met een verwerkersovereenkomst:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Supabase (database en bestandsopslag)</li>
            <li>Mollie (betalingsverwerking)</li>
            <li>Vercel (hosting)</li>
            <li>Sentry (foutmonitoring, geen persoonsgegevens buiten technische foutdetails)</li>
            <li>Onze e-mailprovider (verzenden van facturen en herinneringen)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">5. Bewaartermijn</h2>
          <p className="mt-2">
            Factuurgegevens bewaren we conform de wettelijke fiscale bewaarplicht van 7 jaar.
            Overige accountgegevens verwijderen we binnen 30 dagen na beëindiging van het
            abonnement, tenzij een langere bewaartermijn wettelijk verplicht is.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">6. Jouw rechten</h2>
          <p className="mt-2">
            Je hebt recht op inzage, correctie, verwijdering en overdraagbaarheid van je gegevens.
            Neem hiervoor contact op via{" "}
            <Link href="/contact" className="font-medium text-brand-600">
              onze contactpagina
            </Link>
            . Je kunt ook een klacht indienen bij de Autoriteit Persoonsgegevens.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">7. Beveiliging</h2>
          <p className="mt-2">
            We beveiligen gegevens met toegangscontrole per bedrijf (row-level security),
            versleutelde verbindingen (TLS) en beperkte toegang tot productiesystemen.
          </p>
        </section>
      </div>
    </main>
  );
}
