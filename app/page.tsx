import Link from "next/link";
import { ArrowRight, CheckCircle2, Rocket, ShieldCheck } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import SuiteHeader from "@/components/SuiteHeader";
import { highlightedProductKeys, platformCapabilities, products, suiteMetrics } from "@/lib/products";

export default function HomePage() {
  const highlightedProducts = products.filter((product) => highlightedProductKeys.includes(product.key));

  return (
    <main className="min-h-screen bg-slate-50">
      <SuiteHeader />
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
              <Rocket className="h-4 w-4" />
              12 verkoopklare SaaS-producten vanuit een gedeeld platform
            </span>
            <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
              Bouw automatiseringen om tot professionele SaaS-producten.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Een complete suite voor ondernemers, accountants, scholen, freelancers en mkb-bedrijven:
              met landingpages, klantportaal, intake, rapportage, betalingen, e-mailflows en proceskoppelingen.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/producten"
                className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Bekijk SaaS-producten
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/demo-rapport"
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Open demo rapport
              </Link>
            </div>
            <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
              {suiteMetrics.map((metric) => (
                <div key={metric.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <dt className="text-sm text-slate-500">{metric.label}</dt>
                  <dd className="mt-2 text-2xl font-bold text-slate-950">{metric.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-950 p-5 text-white shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
            <p className="text-sm text-slate-300">Suite cockpit</p>
                <h2 className="text-xl font-bold">Productie-overzicht</h2>
              </div>
              <ShieldCheck className="h-7 w-7 text-emerald-300" />
            </div>
            <div className="mt-5 space-y-3">
              {highlightedProducts.map((product) => (
                <Link
                  key={product.key}
                  href={`/producten/${product.key}`}
                  className="flex items-center justify-between rounded-md bg-white/[0.08] px-4 py-3 hover:bg-white/[0.12]"
                >
                  <span>
                    <span className="block font-semibold">{product.name}</span>
                    <span className="block text-sm text-slate-300">{product.domain ?? product.workflowFolder}</span>
                  </span>
                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-slate-500">Platformbasis</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">Alles wat een echte SaaS nodig heeft</h2>
          </div>
          <Link href="/prijzen" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950">
            Bekijk prijsstrategie
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {platformCapabilities.map((capability) => (
            <div key={capability.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <capability.icon className="h-6 w-6 text-slate-950" />
              <h3 className="mt-4 font-bold text-slate-950">{capability.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{capability.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-3">
          {highlightedProducts.slice(0, 3).map((product) => (
            <ProductCard key={product.key} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
