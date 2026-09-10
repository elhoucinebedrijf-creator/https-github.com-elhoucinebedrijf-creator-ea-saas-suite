import Link from "next/link";
import { Activity, CreditCard, FileText, UploadCloud, Users } from "lucide-react";
import SuiteHeader from "@/components/SuiteHeader";
import { products } from "@/lib/products";

const stats = [
  { label: "Actieve organisaties", value: "18", icon: Users },
  { label: "Open dossiers", value: "64", icon: FileText },
  { label: "Uploads deze week", value: "221", icon: UploadCloud },
  { label: "Betaalstatus", value: "Mollie-ready", icon: CreditCard },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SuiteHeader />
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-slate-500">Klantportaal</p>
            <h1 className="mt-2 text-4xl font-bold text-slate-950">EA Suite dashboard</h1>
          </div>
          <Link href="/producten" className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            Nieuw dossier
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <stat.icon className="h-5 w-5 text-slate-500" />
              <p className="mt-4 text-sm text-slate-500">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-950">{stat.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-950">
              <Activity className="h-5 w-5" />
              Productstatus
            </h2>
          </div>
          <div className="divide-y divide-slate-200">
            {products.map((product) => (
              <Link key={product.key} href={`/producten/${product.key}`} className="grid gap-3 p-5 hover:bg-slate-50 md:grid-cols-[1fr_1fr_180px]">
                <div>
                  <p className="font-semibold text-slate-950">{product.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{product.audience}</p>
                </div>
                <p className="text-sm text-slate-600">{product.workflowFolder}</p>
                <span className="w-fit rounded-md bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                  Productie voorbereid
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
