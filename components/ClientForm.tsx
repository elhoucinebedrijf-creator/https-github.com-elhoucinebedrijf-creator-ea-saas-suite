"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ClientType = "particulier" | "bedrijf" | "zorgverzekeraar";

type ClientFormValues = {
  id?: string;
  name: string;
  type: ClientType;
  email: string;
  phone: string;
  address_line: string;
  postal_code: string;
  city: string;
  payment_terms_days: string;
};

const EMPTY_VALUES: ClientFormValues = {
  name: "",
  type: "particulier",
  email: "",
  phone: "",
  address_line: "",
  postal_code: "",
  city: "",
  payment_terms_days: "14",
};

export default function ClientForm({
  initialValues,
  onSaved,
}: {
  initialValues?: ClientFormValues;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const isEditing = Boolean(initialValues?.id);
  const [values, setValues] = useState<ClientFormValues>(initialValues ?? EMPTY_VALUES);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof ClientFormValues>(field: K, value: ClientFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const payload = {
      name: values.name,
      type: values.type,
      email: values.email || null,
      phone: values.phone || null,
      address_line: values.address_line || null,
      postal_code: values.postal_code || null,
      city: values.city || null,
      payment_terms_days: parseInt(values.payment_terms_days, 10) || 14,
    };

    const { error: saveError } = isEditing
      ? await supabase.from("clients").update(payload).eq("id", values.id!)
      : await supabase.from("clients").insert(payload);

    setLoading(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }

    if (isEditing) {
      setSaved(true);
      router.refresh();
      onSaved?.();
    } else {
      setValues(EMPTY_VALUES);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 p-6">
      <p className="text-sm font-medium text-slate-700">
        {isEditing ? "Klantgegevens" : "Klant toevoegen"}
      </p>
      <div className="mt-4 space-y-3">
        <div>
          <label className="text-xs font-medium text-slate-600">Naam</label>
          <input
            required
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600">Type</label>
            <select
              value={values.type}
              onChange={(e) => update("type", e.target.value as ClientType)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="particulier">Particulier</option>
              <option value="bedrijf">Bedrijf</option>
              <option value="zorgverzekeraar">Zorgverzekeraar</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Betaaltermijn (dagen)</label>
            <input
              type="number"
              min={1}
              value={values.payment_terms_days}
              onChange={(e) => update("payment_terms_days", e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600">E-mailadres (voor facturen)</label>
            <input
              type="email"
              value={values.email}
              onChange={(e) => update("email", e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Telefoonnummer</label>
            <input
              type="tel"
              placeholder="+31 6 12345678"
              value={values.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
        {isEditing && (
          <>
            <div>
              <label className="text-xs font-medium text-slate-600">Adres</label>
              <input
                value={values.address_line}
                onChange={(e) => update("address_line", e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600">Postcode</label>
                <input
                  value={values.postal_code}
                  onChange={(e) => update("postal_code", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Plaats</label>
                <input
                  value={values.city}
                  onChange={(e) => update("city", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
      {saved && <p className="mt-3 text-xs text-emerald-600">Opgeslagen.</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-4 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-40"
      >
        {loading ? "Bezig..." : isEditing ? "Opslaan" : "Klant toevoegen"}
      </button>
    </form>
  );
}
