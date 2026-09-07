import Link from "next/link";
import {
  Upload,
  FileCheck2,
  Send,
  ShieldCheck,
  Clock3,
  FileX2,
  MessageCircle,
  CreditCard,
  Users,
} from "lucide-react";
import Logo from "@/components/Logo";

const HOW_IT_WORKS = [
  {
    step: "1",
    icon: Upload,
    title: "Upload je ritten",
    body: "Exporteer een CSV uit je boordcomputer, of voer een rit in 30 seconden handmatig in.",
  },
  {
    step: "2",
    icon: FileCheck2,
    title: "Selecteer & genereer",
    body: "RitFactuur groepeert ritten per klant en rekent de BTW automatisch uit. Eén klik, klaar.",
  },
  {
    step: "3",
    icon: Send,
    title: "Verstuurd, betaald en bewaakt",
    body: "De factuur gaat automatisch per e-mail én WhatsApp naar je klant, met een directe betaallink (o.a. iDEAL). Te laat? RitFactuur stuurt zelf een herinnering.",
  },
];

const FEATURES = [
  {
    icon: FileX2,
    title: "Geen Excel meer",
    body: "Upload je rittenexport (CSV) en RitFactuur groepeert ritten per klant, klaar om te factureren.",
  },
  {
    icon: ShieldCheck,
    title: "BTW-conform, automatisch",
    body: "Elke factuur bevat KVK, BTW-nummer, IBAN en het juiste BTW-tarief — gapless genummerd, zonder handwerk.",
  },
  {
    icon: MessageCircle,
    title: "Facturen via WhatsApp",
    body: "Naast e-mail ontvangt je klant de factuur ook direct op WhatsApp — ideaal voor particulieren en zorgvervoer.",
  },
  {
    icon: CreditCard,
    title: "Direct online betalen",
    body: "Elke factuur heeft een eigen betaallink (o.a. iDEAL) — je klant hoeft niet handmatig over te maken.",
  },
  {
    icon: Clock3,
    title: "Herinneringen versturen zichzelf",
    body: "Een oplopend schema (dag 1, 14, 30) stuurt automatisch herinneringen per e-mail én WhatsApp, zonder dat jij eraan hoeft te denken.",
  },
  {
    icon: Users,
    title: "Klanten centraal beheerd",
    body: "Particulieren, bedrijven of zorgverzekeraars — naam, e-mail, telefoon en adres altijd binnen handbereik.",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "€29",
    period: "/maand",
    blurb: "Voor kleine bedrijven tot 5 voertuigen.",
    features: [
      "Tot 5 voertuigen",
      "Onbeperkt facturen",
      "Verzending via e-mail & WhatsApp",
      "Directe betaallink (iDEAL e.a.)",
      "Automatische herinneringen",
    ],
  },
  {
    name: "Groei",
    price: "€59",
    period: "/maand",
    blurb: "Voor bedrijven tot 15 voertuigen.",
    features: [
      "Tot 15 voertuigen",
      "Onbeperkt facturen",
      "Verzending via e-mail & WhatsApp",
      "Directe betaallink (iDEAL e.a.)",
      "Automatische herinneringen",
      "Prioriteit-ondersteuning",
    ],
    highlighted: true,
  },
  {
    name: "Vloot",
    price: "€99",
    period: "/maand",
    blurb: "Voor bedrijven tot 50 voertuigen.",
    features: [
      "Tot 50 voertuigen",
      "Onbeperkt facturen",
      "Verzending via e-mail & WhatsApp",
      "Directe betaallink (iDEAL e.a.)",
      "Automatische herinneringen",
      "Persoonlijke onboarding",
    ],
  },
];

export default function HomePage() {
  return (
    <main>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <nav className="flex items-center gap-6 text-sm">
          <a href="#hoe-het-werkt" className="text-slate-600 hover:text-slate-900">
            Hoe het werkt
          </a>
          <a href="#prijzen" className="text-slate-600 hover:text-slate-900">
            Prijzen
          </a>
          <Link href="/inloggen" className="text-slate-600 hover:text-slate-900">
            Inloggen
          </Link>
          <Link
            href="/registreren"
            className="rounded-md bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-500"
          >
            Gratis proberen
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
          <Clock3 className="h-3.5 w-3.5" /> Bespaar gemiddeld 5+ uur administratie per week
        </span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Facturen maken kost je geen uren meer.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          RitFactuur zet je rittendata automatisch om in BTW-conforme facturen —
          gebouwd voor Nederlandse taxi-ondernemers die klaar zijn met Excel.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/registreren"
            className="rounded-md bg-brand-600 px-6 py-3 font-medium text-white hover:bg-brand-500"
          >
            Start gratis proefperiode
          </Link>
          <a
            href="#prijzen"
            className="rounded-md border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
          >
            Bekijk prijzen
          </a>
        </div>

        <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-6 border-t border-slate-200 pt-10">
          <div>
            <dt className="text-2xl font-bold text-slate-900">~15 min</dt>
            <dd className="mt-1 text-sm text-slate-500">bespaard per factuur</dd>
          </div>
          <div>
            <dt className="text-2xl font-bold text-slate-900">0</dt>
            <dd className="mt-1 text-sm text-slate-500">Excel-sheets meer nodig</dd>
          </div>
          <div>
            <dt className="text-2xl font-bold text-slate-900">100%</dt>
            <dd className="mt-1 text-sm text-slate-500">BTW-conform, elke keer</dd>
          </div>
        </dl>
      </section>

      <section id="hoe-het-werkt" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold text-slate-900">Van rit naar factuur in drie stappen</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
          Geen handmatig rekenwerk, geen vergeten herinneringen — RitFactuur doet het achter de
          schermen.
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {HOW_IT_WORKS.map((s) => (
            <div key={s.step} className="relative rounded-lg border border-slate-200 p-6">
              <span className="absolute -top-3 left-6 flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                {s.step}
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <s.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold text-slate-900">Alles wat je administratie regelt</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
          Van BTW-conforme facturen tot automatische betaalherinneringen via WhatsApp — RitFactuur
          doet het werk waar jij geen tijd voor hebt.
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-lg border border-slate-200 p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                <f.icon className="h-4.5 w-4.5" />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="prijzen" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold text-slate-900">Eenvoudige prijzen</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
          Geen verborgen kosten. Elke maand opzegbaar.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg border p-6 ${
                plan.highlighted ? "border-brand-500 shadow-lg" : "border-slate-200"
              }`}
            >
              <h3 className="font-semibold text-slate-900">{plan.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{plan.blurb}</p>
              <p className="mt-4">
                <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                <span className="text-slate-500">{plan.period}</span>
              </p>
              <ul className="mt-6 space-y-2 text-sm text-slate-600">
                {plan.features.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
              <Link
                href="/registreren"
                className={`mt-6 block rounded-md px-4 py-2 text-center font-medium ${
                  plan.highlighted
                    ? "bg-brand-600 text-white hover:bg-brand-500"
                    : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Start proefperiode
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 text-sm text-slate-500 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} RitFactuur.</span>
          <div className="flex gap-5">
            <Link href="/contact" className="hover:text-slate-700">
              Contact
            </Link>
            <Link href="/voorwaarden" className="hover:text-slate-700">
              Algemene voorwaarden
            </Link>
            <Link href="/privacy" className="hover:text-slate-700">
              Privacybeleid
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
