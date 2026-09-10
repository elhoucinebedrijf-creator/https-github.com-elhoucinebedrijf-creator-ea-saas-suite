"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarCheck, CheckCircle2, Loader2, Send, ShieldCheck } from "lucide-react";
import SuiteHeader from "@/components/SuiteHeader";
import { coachflowFeatures } from "@/lib/coachflow";

const focusAreas = [
  "Business opbouwen",
  "Planning en discipline",
  "Stress en grenzen",
  "Geld en omzet",
  "Loopbaan",
  "Administratie",
  "Zelfvertrouwen",
  "Relaties en communicatie",
];

export default function CoachFlowStartPage() {
  const [selected, setSelected] = useState<string[]>(["Planning en discipline"]);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleArea(area: string) {
    setSelected((current) =>
      current.includes(area) ? current.filter((item) => item !== area) : [...current, area]
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      coachingType: String(formData.get("coachingType") ?? ""),
      urgency: String(formData.get("urgency") ?? ""),
      mainQuestion: String(formData.get("mainQuestion") ?? ""),
      desiredOutcome: String(formData.get("desiredOutcome") ?? ""),
      focusAreas: selected,
    };

    const response = await fetch("/api/coachflow/intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.error ?? "Intake kon niet worden verwerkt.");
      return;
    }

    setSent(true);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <SuiteHeader />
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-700">CoachFlow OS</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Organiseer je coachingpraktijk alsof je al een professioneel team hebt.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Intake, CRM, sessieverslagen, actieplannen, planning, facturatie en klantopvolging
              in één werkbaar systeem voor zzp-coaches.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["24/7", "intake"],
                ["1 plek", "voor dossiers"],
                ["0 losse lijstjes", "voor acties"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-2xl font-bold text-slate-950">{value}</p>
                  <p className="text-sm text-slate-600">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                AVG-bewust dossier
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-emerald-700" />
                Klaar voor n8n automatisering
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            {sent ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
                <h2 className="mt-4 text-2xl font-bold text-slate-950">Intake ontvangen</h2>
                <p className="mt-2 text-sm text-slate-600">
                  CoachFlow heeft het dossier aangemaakt en de eerste opvolgactie voorbereid.
                </p>
                <Link
                  href="/dashboard/coachflow"
                  className="mt-6 inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                >
                  Open dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-950">Nieuwe klantintake</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Gebruik dit formulier als professionele voordeur voor je coachingtrajecten.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium text-slate-700">
                    Naam
                    <input name="name" required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
                  </label>
                  <label className="text-sm font-medium text-slate-700">
                    E-mail
                    <input name="email" type="email" required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
                  </label>
                  <label className="text-sm font-medium text-slate-700">
                    Telefoon
                    <input name="phone" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
                  </label>
                  <label className="text-sm font-medium text-slate-700">
                    Trajecttype
                    <select name="coachingType" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2">
                      <option>Business coaching</option>
                      <option>Loopbaancoaching</option>
                      <option>Discipline traject</option>
                      <option>Stress en structuur</option>
                      <option>Los consult</option>
                    </select>
                  </label>
                </div>
                <label className="block text-sm font-medium text-slate-700">
                  Urgentie
                  <select name="urgency" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2">
                    <option>Deze week starten</option>
                    <option>Binnen 2 weken</option>
                    <option>Deze maand</option>
                    <option>Oriënterend</option>
                  </select>
                </label>
                <div>
                  <p className="text-sm font-medium text-slate-700">Thema&apos;s</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {focusAreas.map((area) => (
                      <label key={area} className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm">
                        <input type="checkbox" checked={selected.includes(area)} onChange={() => toggleArea(area)} />
                        {area}
                      </label>
                    ))}
                  </div>
                </div>
                <label className="block text-sm font-medium text-slate-700">
                  Wat is nu het grootste probleem?
                  <textarea name="mainQuestion" required rows={4} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Wat moet er na 30 dagen anders zijn?
                  <textarea name="desiredOutcome" required rows={3} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
                </label>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Intake verwerken
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {coachflowFeatures.map((feature) => (
            <div key={feature.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <feature.icon className="h-6 w-6 text-emerald-700" />
              <h3 className="mt-4 font-bold text-slate-950">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
