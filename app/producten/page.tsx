import ProductCard from "@/components/ProductCard";
import SuiteHeader from "@/components/SuiteHeader";
import { products } from "@/lib/products";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SuiteHeader />
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6">
        <p className="text-sm font-semibold uppercase text-slate-500">Productcatalogus</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">Alle EA SaaS-producten</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Elk product is apart verkoopbaar, maar gebruikt dezelfde professionele basis voor accounts,
          dossiers, uploads, betalingen, rapporten, auditlogs en workflowkoppelingen.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.key} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
