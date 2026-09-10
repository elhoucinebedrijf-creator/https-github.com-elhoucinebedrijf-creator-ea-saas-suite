import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  FileText,
  MessageSquareText,
  Plus,
  Target,
  Users,
} from "lucide-react";
import SuiteHeader from "@/components/SuiteHeader";
import {
  coachflowClients,
  coachflowPortalItems,
  coachflowProblemMap,
  coachflowSessions,
  coachflowStats,
} from "@/lib/coachflow";

const actionPlan = [
  { day: "Ma", task: "Top-3 prioriteiten kiezen en agenda blokkeren", owner: "Klant", status: "Open" },
  { day: "Di", task: "Aanbod in één zin herschrijven", owner: "Klant", status: "Open" },
  { day: "Wo", task: "Coach reviewt voortgang en stuurt feedback", owner: "Coach", status: "Gepland" },
  { day: "Vr", task: "Evaluatie: energie, focus en omzetkans scoren", owner: "Samen", status: "Gepland" },
];

const invoices = [
  { client: "Yassin El B.", amount: "EUR 399", status: "Open", due: "2 dagen" },
  { client: "Nadia Bakkali", amount: "EUR 799", status: "Betaald", due: "Vandaag" },
  { client: "Sofia Amrani", amount: "EUR 199", status: "Betaald", due: "Volgende maand" },
];

export default function CoachFlowDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SuiteHeader />
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-700">CoachFlow OS</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">Praktijkdashboard</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Eén werkplek voor intake, CRM, klantdossiers, sessies, actieplannen, betalingen en opvolging.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/producten/coachflow/start" className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">
              <Plus className="h-4 w-4" />
              Nieuwe intake
            </Link>
            <Link href="/producten/coachflow" className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
              Productpagina
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
        <div className="grid gap-4 md:grid-cols-4">
          {coachflowStats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-emerald-700">{stat.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <h2 className="flex items-center gap-2 text-xl font-bold text-slate-950">
                <Users className="h-5 w-5 text-emerald-700" />
                CRM en klantdossiers
              </h2>
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">Live overzicht</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Klant</th>
                    <th className="px-5 py-3">Thema</th>
                    <th className="px-5 py-3">Voortgang</th>
                    <th className="px-5 py-3">Volgende sessie</th>
                    <th className="px-5 py-3">Risico</th>
                    <th className="px-5 py-3">Factuur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {coachflowClients.map((client) => (
                    <tr key={client.name} className="align-top">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-950">{client.name}</p>
                        <p className="text-xs text-slate-500">{client.type} · {client.status}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{client.theme}</td>
                      <td className="px-5 py-4">
                        <div className="h-2 w-28 rounded-full bg-slate-100">
                          <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${client.progress}%` }} />
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{client.progress}%</p>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{client.nextSession}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">{client.risk}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">{client.invoice}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-xl font-bold text-slate-950">
                <CalendarDays className="h-5 w-5 text-emerald-700" />
                Sessies
              </h2>
              <div className="mt-4 space-y-3">
                {coachflowSessions.map((session) => (
                  <div key={session.client} className="rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-500">{session.time}</p>
                    <p className="mt-1 font-semibold text-slate-950">{session.title}</p>
                    <p className="text-sm text-slate-600">{session.client}</p>
                    <p className="mt-2 text-xs text-emerald-700">{session.output}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-xl font-bold text-slate-950">
                <ClipboardList className="h-5 w-5 text-emerald-700" />
                Probleemkaart
              </h2>
              <div className="mt-4 space-y-3">
                {coachflowProblemMap.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-700">{item.label}</span>
                      <span className="text-slate-500">{item.count}</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-slate-100">
                      <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${Math.min(item.count * 6, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-950">
              <Target className="h-5 w-5 text-emerald-700" />
              AI actieplan deze week
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {actionPlan.map((item) => (
                <div key={item.task} className="rounded-lg border border-slate-200 p-4">
                  <p className="text-xs font-semibold text-emerald-700">{item.day} · {item.owner}</p>
                  <p className="mt-2 text-sm font-medium text-slate-950">{item.task}</p>
                  <p className="mt-2 text-xs text-slate-500">{item.status}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-950">
              <CreditCard className="h-5 w-5 text-emerald-700" />
              Facturen
            </h2>
            <div className="mt-4 space-y-3">
              {invoices.map((invoice) => (
                <div key={invoice.client} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm">
                  <div>
                    <p className="font-semibold text-slate-950">{invoice.client}</p>
                    <p className="text-xs text-slate-500">{invoice.due}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-950">{invoice.amount}</p>
                    <p className="text-xs text-slate-500">{invoice.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-950">
              <MessageSquareText className="h-5 w-5 text-emerald-700" />
              AI sessieverslag
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Klant ervaart druk door te veel losse taken. Patroon: start sterk, verliest overzicht
              na drie dagen. Afspraak: elke ochtend één hoofdactie, einde dag korte check-in.
            </p>
            <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
              Volgende focus: agenda blokkeren, acquisitie beperken tot twee vaste momenten en
              factuurachterstand voor vrijdag afronden.
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-950">
              <FileText className="h-5 w-5 text-emerald-700" />
              Klantportaal preview
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              {coachflowPortalItems.map((item) => (
                <div key={item.label} className="rounded-lg border border-slate-200 p-4">
                  <item.icon className="h-5 w-5 text-emerald-700" />
                  <p className="mt-3 text-xs text-slate-500">{item.label}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">
              <CheckCircle2 className="h-5 w-5" />
              Klant ziet alleen eigen acties, verslagen, afspraken en documenten.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
