"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    setStatus(res.ok ? "sent" : "error");
  }

  return (
    <main className="mx-auto max-w-lg px-6 py-16">
      <Link href="/" className="text-sm font-medium text-brand-600">
        ← Terug naar RitFactuur
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">Contact</h1>
      <p className="mt-2 text-sm text-slate-600">
        Vraag over RitFactuur, hulp nodig, of feedback? Stuur een bericht — we reageren meestal
        binnen één werkdag.
      </p>

      {status === "sent" ? (
        <p className="mt-8 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          Bedankt! Je bericht is verstuurd, we nemen zo snel mogelijk contact op.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Naam</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">E-mailadres</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Bericht</label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-600">
              Versturen mislukt — probeer het nogmaals of mail rechtstreeks.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-md bg-brand-600 px-6 py-2.5 font-medium text-white hover:bg-brand-500 disabled:opacity-60"
          >
            {status === "sending" ? "Bezig..." : "Versturen"}
          </button>
        </form>
      )}
    </main>
  );
}
