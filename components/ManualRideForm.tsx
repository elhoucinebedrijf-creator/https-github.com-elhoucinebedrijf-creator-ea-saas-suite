"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { computeInvoiceTotals, DEFAULT_PERSONENVERVOER_BTW_RATE } from "@/lib/invoice/calc";

type Client = { id: string; name: string };

const NEW_CLIENT_VALUE = "__new__";

export default function ManualRideForm({ clients }: { clients: Client[] }) {
  const router = useRouter();
  const [localClients, setLocalClients] = useState(clients);
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [rideDate, setRideDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [priceExcl, setPriceExcl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [addingClient, setAddingClient] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [creatingClient, setCreatingClient] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  function handleClientSelect(value: string) {
    if (value === NEW_CLIENT_VALUE) {
      setAddingClient(true);
      return;
    }
    setClientId(value);
  }

  async function handleCreateClient(e: React.FormEvent) {
    e.preventDefault();
    if (!newClientName.trim() || !newClientEmail.trim()) return;
    setCreatingClient(true);
    setClientError(null);

    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from("clients")
      .insert({ name: newClientName.trim(), email: newClientEmail.trim() })
      .select("id, name")
      .single();

    setCreatingClient(false);
    if (insertError || !data) {
      setClientError(insertError?.message ?? "Klant aanmaken mislukt.");
      return;
    }

    setLocalClients((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
    setClientId(data.id);
    setNewClientName("");
    setNewClientEmail("");
    setAddingClient(false);
    router.refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId) {
      setError("Kies of maak eerst een klant aan.");
      return;
    }
    setError(null);
    setLoading(true);

    const amountExclBtw = Math.round(parseFloat(priceExcl.replace(",", ".")) * 100);
    const totals = computeInvoiceTotals([
      {
        description: "Rit",
        quantity: 1,
        unitPriceExclBtw: amountExclBtw,
        btwRate: DEFAULT_PERSONENVERVOER_BTW_RATE,
      },
    ]);

    const supabase = createClient();
    const { error: insertError } = await supabase.from("rides").insert({
      client_id: clientId,
      ride_date: rideDate,
      pickup_address: pickup,
      dropoff_address: dropoff,
      amount_excl_btw: amountExclBtw,
      btw_rate: DEFAULT_PERSONENVERVOER_BTW_RATE,
      amount_incl_btw: totals.totalInclBtw,
      source: "manual",
      status: "unbilled",
    });

    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }

    setPickup("");
    setDropoff("");
    setPriceExcl("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 p-6">
      <p className="text-sm font-medium text-slate-700">Rit handmatig toevoegen</p>
      <div className="mt-4 space-y-3">
        <div>
          <label className="text-xs font-medium text-slate-600">Klant</label>
          {addingClient ? (
            <div className="mt-1 space-y-2">
              <input
                autoFocus
                placeholder="Naam nieuwe klant"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                type="email"
                placeholder="E-mailadres (voor facturen)"
                value={newClientEmail}
                onChange={(e) => setNewClientEmail(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCreateClient}
                  disabled={creatingClient || !newClientName.trim() || !newClientEmail.trim()}
                  className="flex-1 rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-white disabled:opacity-40"
                >
                  {creatingClient ? "..." : "Toevoegen"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAddingClient(false);
                    setClientError(null);
                  }}
                  className="shrink-0 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-600"
                >
                  Annuleren
                </button>
              </div>
            </div>
          ) : (
            <select
              value={clientId}
              onChange={(e) => handleClientSelect(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              {localClients.length === 0 && <option value="">Geen klanten</option>}
              {localClients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
              <option value={NEW_CLIENT_VALUE}>+ Nieuwe klant toevoegen...</option>
            </select>
          )}
          {clientError && <p className="mt-1 text-xs text-red-600">{clientError}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600">Datum</label>
            <input
              type="date"
              required
              value={rideDate}
              onChange={(e) => setRideDate(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Bedrag excl. BTW (€)</label>
            <input
              required
              inputMode="decimal"
              placeholder="25,00"
              value={priceExcl}
              onChange={(e) => setPriceExcl(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600">Ophaaladres</label>
            <input
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Bestemming</label>
            <input
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading || !clientId}
        className="mt-4 w-full rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-40"
      >
        {loading ? "Bezig..." : "Rit toevoegen"}
      </button>
    </form>
  );
}
