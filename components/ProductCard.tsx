import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { EaProduct } from "@/lib/products";

export default function ProductCard({ product }: { product: EaProduct }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`flex h-11 w-11 items-center justify-center rounded-md bg-gradient-to-br ${product.accent} text-white`}>
        <product.icon className="h-5 w-5" />
      </div>
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{product.audience}</p>
        <h3 className="mt-2 text-xl font-bold text-slate-950">{product.name}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{product.promise}</p>
      </div>
      <dl className="mt-5 space-y-2 text-sm">
        <div>
          <dt className="font-semibold text-slate-900">Prijs</dt>
          <dd className="text-slate-600">{product.price}</dd>
        </div>
        {product.domain ? (
          <div>
            <dt className="font-semibold text-slate-900">Domein</dt>
            <dd className="break-words text-slate-600">{product.domain}</dd>
          </div>
        ) : null}
      </dl>
      <Link
        href={`/producten/${product.key}`}
        className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-slate-950"
      >
        Bekijk product
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}
