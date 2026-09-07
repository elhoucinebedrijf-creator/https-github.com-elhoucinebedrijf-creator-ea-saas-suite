import Link from "next/link";

export const metadata = { title: "Algemene voorwaarden — RitFactuur" };

export default function VoorwaardenPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm font-medium text-brand-600">
        ← Terug naar RitFactuur
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">Algemene voorwaarden</h1>
      <p className="mt-2 text-sm text-slate-500">Laatst bijgewerkt: 24 augustus 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
        <p className="rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-900">
          Let op: dit is een standaardsjabloon, geen juridisch advies. Laat deze tekst controleren
          door een jurist voordat je dit gebruikt met echte klanten.
        </p>

        <section>
          <h2 className="font-semibold text-slate-900">1. Wie we zijn</h2>
          <p className="mt-2">
            RitFactuur wordt aangeboden door Elhoucine Automation, gevestigd te Almere, ingeschreven
            bij de Kamer van Koophandel onder nummer 70739862 (&quot;wij&quot;, &quot;RitFactuur&quot;).
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">2. De dienst</h2>
          <p className="mt-2">
            RitFactuur is een software-as-a-service oplossing waarmee taxi-ondernemers ritgegevens
            kunnen omzetten in facturen. Wij bieden geen boekhoudkundig, fiscaal of juridisch
            advies; de juistheid van ingevoerde bedrijfs- en klantgegevens is de verantwoordelijkheid
            van de gebruiker.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">3. Abonnementen en betaling</h2>
          <p className="mt-2">
            Abonnementen worden maandelijks vooraf gefactureerd en automatisch verlengd totdat de
            gebruiker opzegt. Opzeggen kan op elk moment via het dashboard en gaat in per het einde
            van de lopende factureringsperiode.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">4. Aansprakelijkheid</h2>
          <p className="mt-2">
            RitFactuur spant zich in voor een correcte werking van de dienst, maar aanvaardt geen
            aansprakelijkheid voor fiscale of financiële schade die voortvloeit uit onjuist
            ingevoerde gegevens door de gebruiker. Onze aansprakelijkheid is in alle gevallen
            beperkt tot het bedrag dat de gebruiker in de voorafgaande 12 maanden heeft betaald.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">5. Opzegging en beëindiging</h2>
          <p className="mt-2">
            Beide partijen kunnen de overeenkomst op elk moment opzeggen. Bij opzegging blijft
            toegang bestaan tot het einde van de betaalde periode; daarna kan de data op verzoek
            binnen 30 dagen worden geëxporteerd, waarna deze wordt verwijderd conform ons
            privacybeleid.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">6. Wijzigingen</h2>
          <p className="mt-2">
            Wij kunnen deze voorwaarden wijzigen. Bij wezenlijke wijzigingen informeren we
            gebruikers per e-mail, minimaal 14 dagen voordat ze ingaan.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">7. Contact</h2>
          <p className="mt-2">
            Vragen over deze voorwaarden? Neem contact op via{" "}
            <Link href="/contact" className="font-medium text-brand-600">
              onze contactpagina
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
