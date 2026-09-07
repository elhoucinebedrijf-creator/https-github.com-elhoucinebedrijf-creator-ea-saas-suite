"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Tenant = {
  id: string;
  company_name: string;
  kvk_number: string | null;
  btw_number: string | null;
  iban: string | null;
  address_line: string | null;
  postal_code: string | null;
  city: string | null;
};

export default function TenantSettingsForm({ tenant }: { tenant: Tenant }) {
  const router = useRouter();
  const [form, setForm] = useState({
    company_name: tenant.company_name ?? "",
    kvk_number: tenant.kvk_number ?? "",
    btw_number: tenant.btw_number ?? "",
    iban: tenant.iban ?? "",
    address_line: tenant.address_line ?? "",
    postal_code: tenant.postal_code ?? "",
    city: tenant.city ?? "",
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: updateError } = await supabase.from("tenants").update(form).eq("id", tenant.id);

    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <Field label="Bedrijfsnaam" value={form.company_name} onChange={(v) => update("company_name", v)} required />
      <div className="grid grid-cols-2 gap-4">
        <Field label="KVK-nummer" value={form.kvk_number} onChange={(v) => update("kvk_number", v)} />
        <Field label="BTW-nummer" value={form.btw_number} onChange={(v) => update("btw_number", v)} />
      </div>
      <Field label="IBAN" value={form.iban} onChange={(v) => update("iban", v)} />
      <Field label="Adres" value={form.address_line} onChange={(v) => update("address_line", v)} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Postcode" value={form.postal_code} onChange={(v) => update("postal_code", v)} />
        <Field label="Plaats" value={form.city} onChange={(v) => update("city", v)} />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-emerald-600">Opgeslagen.</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 disabled:opacity-60"
      >
        {loading ? "Bezig..." : "Opslaan"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-600">{label}</label>
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
    </div>
  );
}
