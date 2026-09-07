"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteInvoiceButton({ invoiceId }: { invoiceId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    setError(null);

    const res = await fetch(`/api/invoices/${invoiceId}`, { method: "DELETE" });

    setLoading(false);
    if (!res.ok) {
      setError("Verwijderen mislukt. Probeer het opnieuw.");
      return;
    }
    router.push("/dashboard/invoices");
    router.refresh();
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-sm font-medium text-slate-500 hover:text-red-600"
      >
        Factuur verwijderen
      </button>
    );
  }

  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-4">
      <p className="text-sm text-red-800">
        Weet je het zeker? De factuur wordt definitief verwijderd en de gekoppelde ritten gaan
        terug naar &quot;nog te factureren&quot;.
      </p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60"
        >
          {loading ? "Bezig..." : "Ja, verwijderen"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Annuleren
        </button>
      </div>
    </div>
  );
}
