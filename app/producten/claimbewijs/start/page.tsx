"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileUp, Send } from "lucide-react";
import SuiteHeader from "@/components/SuiteHeader";
import { claimbewijsRequiredFlows } from "@/lib/claimbewijs";

export default function ClaimBewijsStartPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const form = new FormData(event.currentTarget);
    const payload = {
      organizationName: form.get("organizationName"),
      contactName: form.get("contactName"),
      email: form.get("email"),
      phone: form.get("phone"),
      counterparty: form.get("counterparty"),
      claimAmount: form.get("claimAmount"),
      urgency: form.get("urgency"),
      claimSummary: form.get("claimSummary"),
      documentsAvailable: form.getAll("documentsAvailable"),
    };

    const response = await fetch("/api/claimbewijs/intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setStatus("sent");
      setMessage("Je ClaimBewijs intake is ontvangen. Het dossier staat klaar voor analyse.");
      event.currentTarget.reset();
      return;
    }

    const body = await response.json().catch(() => ({}));
    setStatus("error");
    setMessage(body.error ?? "Intake versturen is mislukt.");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <SuiteHeader />
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-6 lg:grid-cols-[0.72fr_0.28fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <Link href="/producten/claimbewijs" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
            <ArrowLeft className="h-4 w-4" />
            Terug naar ClaimBewijs
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-slate-950">Start een ClaimBewijs dossier</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Verzamel de eerste gegevens voor een claim-, klacht- of bewijsrapport. Na verzending kan de
            workflow bewijsstukken analyseren, een tijdlijn maken en een rapport klaarzetten.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Organisatie
                <input name="organizationName" required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Contactpersoon
                <input name="contactName" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                E-mailadres
                <input name="email" type="email" required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Telefoon
                <input name="phone" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Tegenpartij
                <input name="counterparty" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Geschat bedrag
                <input name="claimAmount" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" placeholder="EUR 2.500" />
              </label>
            </div>

            <label className="text-sm font-medium text-slate-700">
              Urgentie
              <select name="urgency" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2">
                <option value="normal">Normaal</option>
                <option value="high">Hoog</option>
                <option value="deadline">Deadline binnen 7 dagen</option>
              </select>
            </label>

            <fieldset className="rounded-md border border-slate-200 p-4">
              <legend className="px-1 text-sm font-semibold text-slate-900">Beschikbare bewijsstukken</legend>
              <div className="mt-3 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                {["Contract", "Factuur", "E-mailwisseling", "Foto's", "Chatgesprekken", "Leveringsbewijs"].map((item) => (
                  <label key={item} className="flex items-center gap-2">
                    <input type="checkbox" name="documentsAvailable" value={item} />
                    {item}
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="text-sm font-medium text-slate-700">
              Samenvatting claim of geschil
              <textarea name="claimSummary" required rows={6} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
            </label>

            {message ? (
              <p className={`rounded-md p-3 text-sm ${status === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                {message}
              </p>
            ) : null}

            <button type="submit" disabled={status === "sending"} className="inline-flex w-fit items-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
              {status === "sending" ? "Bezig..." : "Intake versturen"}
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        <aside className="space-y-5">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <FileUp className="h-6 w-6 text-slate-950" />
            <h2 className="mt-4 font-bold text-slate-950">Workflowlijn</h2>
            <div className="mt-4 space-y-3">
              {claimbewijsRequiredFlows.map((flow) => (
                <div key={flow.path} className="rounded-md border border-slate-200 p-3">
                  <p className="text-sm font-semibold text-slate-950">{flow.label}</p>
                  <p className="mt-1 break-words text-xs text-slate-500">{flow.path}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
