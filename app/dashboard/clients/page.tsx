import Link from "next/link";
import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ClientForm from "@/components/ClientForm";
import EmptyState from "@/components/EmptyState";

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, type, email, phone, payment_terms_days")
    .order("name");

  const hasClients = (clients ?? []).length > 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Klanten</h1>
      <p className="mt-1 text-sm text-slate-600">
        De klanten van jouw bedrijf — particulieren, bedrijven of zorgverzekeraars die je
        factureert. Klik op een klant om de gegevens te bewerken.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,320px]">
        <div className="rounded-lg border border-slate-200">
          {hasClients ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                  <th className="px-4 py-2">Naam</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">E-mail</th>
                  <th className="px-4 py-2">Telefoon</th>
                  <th className="px-4 py-2">Betaaltermijn</th>
                </tr>
              </thead>
              <tbody>
                {clients!.map((c) => (
                  <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-2 font-medium text-slate-900">
                      <Link href={`/dashboard/clients/${c.id}`} className="hover:underline">
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2 capitalize text-slate-600">{c.type}</td>
                    <td className="px-4 py-2 text-slate-600">{c.email ?? "—"}</td>
                    <td className="px-4 py-2 text-slate-600">{c.phone ?? "—"}</td>
                    <td className="px-4 py-2 text-slate-600">{c.payment_terms_days} dagen</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState
              icon={Users}
              title="Nog geen klanten"
              body="Voeg rechts je eerste klant toe — particulier, bedrijf of zorgverzekeraar. Daarna kun je er direct ritten en facturen aan koppelen."
            />
          )}
        </div>
        <ClientForm />
      </div>
    </div>
  );
}
