import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import SuiteHeader from "@/components/SuiteHeader";
import { products } from "@/lib/products";

const tiers = [
  { name: "Dossier", price: "EUR 29-149", target: "Losse scans, dossiers en rapporten", features: ["Eenmalige betaling", "Rapportdownload", "E-mailopvolging"] },
  { name: "SaaS", price: "EUR 79-399/mnd", target: "Doorlopende klantportalen", features: ["Login en klantdata", "Dashboard", "Automatische workflows"] },
  { name: "Implementatie", price: "EUR 299-1.500+", target: "Bedrijven met proceskoppelingen", features: ["Onboarding", "Workflow-koppeling", "Datamodel en training"] },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SuiteHeader />
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6">
        <p className="text-sm font-semibold uppercase text-slate-500">Prijsstrategie</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-950">Verkoopbaar per dossier, per maand of als implementatie.</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {tiers.map((tier) => (
            <article key={tier.name} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">{tier.name}</h2>
              <p className="mt-3 text-3xl font-bold text-slate-950">{tier.price}</p>
              <p className="mt-2 text-sm text-slate-600">{tier.target}</p>
              <ul className="mt-5 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-10 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Startprijs</th>
                <th className="px-4 py-3">Onboarding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {products.map((product) => (
                <tr key={product.key}>
                  <td className="px-4 py-3 font-medium text-slate-950">
                    <Link href={`/producten/${product.key}`}>{product.name}</Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{product.price}</td>
                  <td className="px-4 py-3 text-slate-600">{product.setupFee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
