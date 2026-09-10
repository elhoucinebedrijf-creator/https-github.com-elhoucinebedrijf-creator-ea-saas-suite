import DemoReport from "@/components/DemoReport";
import SuiteHeader from "@/components/SuiteHeader";
import { products } from "@/lib/products";

export default function DemoReportPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SuiteHeader />
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6">
        <p className="text-sm font-semibold uppercase text-slate-500">Demo-output</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-950">Rapportvoorbeelden per SaaS</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Deze rapportstructuren zijn bedoeld voor verkoopdemo&apos;s en als contract voor de automatische rapportageflows.
        </p>
        <div className="mt-10 grid gap-6">
          {products.slice(0, 6).map((product) => (
            <DemoReport key={product.key} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
