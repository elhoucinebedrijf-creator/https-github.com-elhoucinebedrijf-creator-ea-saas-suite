import { AlertTriangle, CheckCircle2, FileText, ListChecks } from "lucide-react";
import type { EaProduct } from "@/lib/products";

export default function DemoReport({ product }: { product: EaProduct }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">Demo rapport</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">{product.shortName} analyse</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{product.demoScenario}</p>
        </div>
        <span className="rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
          Klaar voor klantdemo
        </span>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-md bg-slate-50 p-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <p className="mt-3 text-2xl font-bold text-slate-950">82%</p>
          <p className="text-sm text-slate-600">commerciële waarde-score</p>
        </div>
        <div className="rounded-md bg-slate-50 p-4">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <p className="mt-3 text-2xl font-bold text-slate-950">3</p>
          <p className="text-sm text-slate-600">prioriteiten voor opvolging</p>
        </div>
        <div className="rounded-md bg-slate-50 p-4">
          <FileText className="h-5 w-5 text-cyan-700" />
          <p className="mt-3 text-2xl font-bold text-slate-950">PDF</p>
          <p className="text-sm text-slate-600">rapport-output voorbereid</p>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="flex items-center gap-2 font-semibold text-slate-950">
          <ListChecks className="h-5 w-5" />
          Rapportonderdelen
        </h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {product.reportSections.map((section) => (
            <li key={section} className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700">
              {section}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
