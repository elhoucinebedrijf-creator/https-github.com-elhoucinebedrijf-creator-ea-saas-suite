"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { formatEuroCents } from "@/lib/invoice/calc";
import EmptyState from "@/components/EmptyState";

type Ride = {
  id: string;
  ride_date: string;
  pickup_address: string | null;
  dropoff_address: string | null;
  amount_incl_btw: number;
};

type ClientGroup = {
  clientId: string;
  clientName: string;
  rides: Ride[];
};

export default function UnbilledRidesByClient({ groups }: { groups: ClientGroup[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Record<string, Set<string>>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Ref i.p.v. alleen state: state-updates renderen async, dus een snelle
  // dubbelklik kan de knop nog aanklikbaar zien vóór de eerste render met
  // disabled=true. De ref blokkeert synchroon, direct bij de eerste klik.
  const submittingRef = useRef<string | null>(null);

  function toggle(clientId: string, rideId: string) {
    setSelected((prev) => {
      const current = new Set(prev[clientId] ?? []);
      if (current.has(rideId)) current.delete(rideId);
      else current.add(rideId);
      return { ...prev, [clientId]: current };
    });
  }

  async function generateInvoice(clientId: string) {
    if (submittingRef.current) return;

    const rideIds = Array.from(selected[clientId] ?? []);
    if (rideIds.length === 0) return;

    submittingRef.current = clientId;
    setSubmitting(clientId);
    setError(null);

    try {
      const res = await fetch("/api/invoices/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, rideIds }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Factuur genereren mislukt.");
        return;
      }

      setSelected((prev) => ({ ...prev, [clientId]: new Set() }));
      router.push("/dashboard/invoices");
    } finally {
      submittingRef.current = null;
      setSubmitting(null);
    }
  }

  if (groups.length === 0) {
    return (
      <div className="mt-6 rounded-lg border border-slate-200">
        <EmptyState
          icon={CheckCircle2}
          title="Alles gefactureerd"
          body="Geen openstaande ritten. Zodra je nieuwe ritten uploadt of handmatig toevoegt, verschijnen ze hier per klant, klaar om te factureren."
        />
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {groups.map((group) => {
        const selectedCount = selected[group.clientId]?.size ?? 0;
        return (
          <div key={group.clientId} className="rounded-lg border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
              <span className="font-medium text-slate-900">{group.clientName}</span>
              <button
                onClick={() => generateInvoice(group.clientId)}
                disabled={selectedCount === 0 || submitting === group.clientId}
                className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-500 disabled:opacity-40"
              >
                {submitting === group.clientId
                  ? "Bezig..."
                  : `Genereer factuur (${selectedCount})`}
              </button>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {group.rides.map((ride) => (
                  <tr key={ride.id} className="border-b border-slate-100 last:border-0">
                    <td className="w-8 px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selected[group.clientId]?.has(ride.id) ?? false}
                        onChange={() => toggle(group.clientId, ride.id)}
                      />
                    </td>
                    <td className="px-2 py-2 text-slate-600">
                      {new Date(ride.ride_date).toLocaleDateString("nl-NL")}
                    </td>
                    <td className="px-2 py-2 text-slate-600">
                      {ride.pickup_address} → {ride.dropoff_address}
                    </td>
                    <td className="px-2 py-2 text-right font-medium text-slate-900">
                      {formatEuroCents(ride.amount_incl_btw)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
