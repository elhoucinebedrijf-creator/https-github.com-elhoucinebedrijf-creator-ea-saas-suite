"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";
import AuthSplitLayout from "@/components/AuthSplitLayout";

export default function InloggenPage() {
  return (
    <Suspense fallback={null}>
      <InloggenForm />
    </Suspense>
  );
}

function InloggenForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setError("Inloggen mislukt. Controleer je e-mailadres en wachtwoord.");
      return;
    }

    router.push(searchParams.get("next") ?? "/dashboard");
    router.refresh();
  }

  return (
    <AuthSplitLayout
      eyebrow="Welkom terug"
      heading="Log in op je EA Suite-dashboard."
      lede="Beheer producten, dossiers, rapporten en betalingen op één plek."
    >
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-16">
        <div className="mb-8 flex justify-center lg:hidden">
          <Logo />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Inloggen</h1>
        <p className="mt-1 text-sm text-slate-600">Log in op je EA Suite-dashboard.</p>

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
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Wachtwoord</label>
              <Link href="/wachtwoord-vergeten" className="text-xs font-medium text-brand-600">
                Vergeten?
              </Link>
            </div>
            <input
              type="password"
              required
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
            {loading ? "Bezig..." : "Inloggen"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Nog geen account?{" "}
          <Link href="/registreren" className="font-medium text-brand-600">
            Start een gratis proefperiode
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
}
