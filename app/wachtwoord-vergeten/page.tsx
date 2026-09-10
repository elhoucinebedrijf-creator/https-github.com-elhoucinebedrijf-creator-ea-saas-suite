"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getPublicAppUrl } from "@/lib/public-url";

export default function WachtwoordVergetenPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getPublicAppUrl()}/auth/callback?next=/wachtwoord-resetten`,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="text-2xl font-bold text-slate-900">Wachtwoord vergeten</h1>
      <p className="mt-1 text-sm text-slate-600">
        Vul je e-mailadres in, dan sturen we je een link om een nieuw wachtwoord in te stellen.
      </p>

      {sent ? (
        <p className="mt-8 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          Check je inbox — als dit e-mailadres bij ons bekend is, ontvang je binnen enkele
          minuten een link.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-500 disabled:opacity-60"
          >
            {loading ? "Bezig..." : "Verstuur resetlink"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-slate-600">
        <Link href="/inloggen" className="font-medium text-brand-600">
          Terug naar inloggen
        </Link>
      </p>
    </main>
  );
}
