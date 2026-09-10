import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Database, Mail, Workflow } from "lucide-react";
import DemoReport from "@/components/DemoReport";
import SuiteHeader from "@/components/SuiteHeader";
import { getProduct, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((product) => ({ product: product.key }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ product: string }> }) {
  const { product: productKey } = await params;
  const product = getProduct(productKey);
  if (!product) notFound();

  return (
    <main className="min-h-screen bg-slate-50">
      <SuiteHeader />
      <section className={`bg-gradient-to-br ${product.accent}`}>
        <div className="mx-auto max-w-7xl px-5 py-16 text-white sm:px-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/15">
            <product.icon className="h-7 w-7" />
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">{product.name}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/85">{product.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={
                product.key === "claimbewijs"
                  ? "/producten/claimbewijs/start"
                  : product.key === "coachflow"
                    ? "/producten/coachflow/start"
                    : "/inloggen"
              }
              className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-slate-950"
            >
              {product.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/demo-rapport" className="rounded-md border border-white/30 px-5 py-3 text-sm font-semibold text-white">
              Bekijk demo rapport
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">Commerciele positionering</h2>
            <dl className="mt-5 space-y-4 text-sm leading-6">
              <div>
                <dt className="font-semibold text-slate-950">Doelgroep</dt>
                <dd className="text-slate-600">{product.audience}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-950">Pijnpunt</dt>
                <dd className="text-slate-600">{product.pain}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-950">Oplossing</dt>
                <dd className="text-slate-600">{product.promise}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-950">Prijsstrategie</dt>
                <dd className="text-slate-600">{product.price} · {product.setupFee}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">Features</h2>
            <ul className="mt-5 space-y-3">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-5">
          <DemoReport product={product} />
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <Workflow className="h-6 w-6 text-slate-950" />
              <h3 className="mt-4 font-bold text-slate-950">Procesmap</h3>
              <p className="mt-2 text-sm text-slate-600">{product.workflowFolder}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <Database className="h-6 w-6 text-slate-950" />
              <h3 className="mt-4 font-bold text-slate-950">Data</h3>
              <p className="mt-2 text-sm text-slate-600">Tenant, dossier, upload, rapport, betaling en auditlog.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <Mail className="h-6 w-6 text-slate-950" />
              <h3 className="mt-4 font-bold text-slate-950">E-mail</h3>
              <p className="mt-2 text-sm text-slate-600">Intake, betaling, rapport klaar, onboarding en sales.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
