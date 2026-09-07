"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";
import AuthSplitLayout from "@/components/AuthSplitLayout";

const PLANS = [
  { id: "starter", name: "Starter", price: "€29/mnd", desc: "Tot 5 voertuigen" },
  { id: "groei", name: "Groei", price: "€59/mnd", desc: "Tot 15 voertuigen" },
  { id: "vloot", name: "Vloot", price: "€99/mnd", desc: "Tot 50 voertuigen" },
];

export default function RegistrerenPage() {
  const [step, setStep] = useState<"account" | "bedrijf">("account");
  const [checkingSession, setCheckingSession] = useState(true);
  const [plan, setPlan] = useState("starter");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [kvkNumber, setKvkNumber] = useState("");
  const [btwNumber, setBtwNumber] = useState("");
  const [iban, setIban] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Iemand die al is ingelogd (bv. e-mail net bevestigd, maar de
    // betaalstap nog niet afgerond) moet niet opnieuw een account proberen
    // aan te maken — dat zou mislukken omdat het e-mailadres al bestaat.
    // Spring in dat geval direct naar stap 2.
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setEmail(user.email);
        setStep("bedrijf");
      }
      setCheckingSession(false);
    });
  }, []);

  async function handleAccountSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setStep("bedrijf");
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/billing/start-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, companyName, kvkNumber, btwNumber, iban, email }),
    });

    setLoading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Kon geen betaling starten. Probeer het opnieuw.");
      return;
    }

    const { checkoutUrl } = await res.json();
    window.location.href = checkoutUrl;
  }

  if (checkingSession) {
    return null;
  }

  return (
    <AuthSplitLayout
      eyebrow="Nieuw bij RitFactuur"
      heading="Automatische facturatie voor je taxibedrijf."
      lede="In een paar minuten klaar — geen creditcard nodig om te starten."
    >
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <div className="mb-8 flex justify-center lg:hidden">
        <Logo />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Start je gratis proefperiode</h1>
      <p className="mt-1 text-sm text-slate-600">
        Stap {step === "account" ? "1" : "2"} van 2 —{" "}
        {step === "account" ? "maak je account" : "bedrijfsgegevens & abonnement"}
      </p>

      {step === "account" && (
        <form onSubmit={handleAccountSubmit} className="mt-8 space-y-4">
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
            <label className="text-sm font-medium text-slate-700">Wachtwoord</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-500 disabled:opacity-60"
          >
            {loading ? "Bezig..." : "Volgende"}
          </button>
        </form>
      )}

      {step === "bedrijf" && (
        <form onSubmit={handleCheckout} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Bedrijfsnaam</label>
            <input
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">KVK-nummer</label>
              <input
                required
                value={kvkNumber}
                onChange={(e) => setKvkNumber(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">BTW-nummer</label>
              <input
                required
                value={btwNumber}
                onChange={(e) => setBtwNumber(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">IBAN</label>
            <input
              required
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Abonnement</label>
            <div className="mt-2 space-y-2">
              {PLANS.map((p) => (
                <label
                  key={p.id}
                  className={`flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-sm ${
                    plan === p.id ? "border-brand-500 bg-brand-50" : "border-slate-300"
                  }`}
                >
                  <span>
                    <input
                      type="radio"
                      name="plan"
                      value={p.id}
                      checked={plan === p.id}
                      onChange={() => setPlan(p.id)}
                      className="mr-2"
                    />
                    <span className="font-medium">{p.name}</span> — {p.desc}
                  </span>
                  <span className="font-medium text-slate-700">{p.price}</span>
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-start gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              required
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              Ik ga akkoord met de{" "}
              <Link href="/voorwaarden" target="_blank" className="font-medium text-brand-600">
                algemene voorwaarden
              </Link>{" "}
              en het{" "}
              <Link href="/privacy" target="_blank" className="font-medium text-brand-600">
                privacybeleid
              </Link>
              .
            </span>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading || !agreedToTerms}
            className="w-full rounded-md bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-500 disabled:opacity-60"
          >
            {loading ? "Bezig..." : "Doorgaan naar betaling"}
          </button>
          <p className="text-center text-xs text-slate-500">
            Je wordt doorgestuurd naar Mollie om je eerste betaling en incassomachtiging te
            bevestigen.
          </p>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-slate-600">
        Al een account?{" "}
        <Link href="/inloggen" className="font-medium text-brand-600">
          Inloggen
        </Link>
      </p>
    </main>
    </AuthSplitLayout>
  );
}
