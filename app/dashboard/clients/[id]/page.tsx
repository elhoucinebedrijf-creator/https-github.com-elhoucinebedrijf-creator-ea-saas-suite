import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ClientForm from "@/components/ClientForm";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: client } = await supabase
    .from("clients")
    .select(
      "id, name, type, email, phone, address_line, postal_code, city, payment_terms_days"
    )
    .eq("id", id)
    .single();

  if (!client) notFound();

  return (
    <div className="max-w-lg">
      <Link href="/dashboard/clients" className="text-sm font-medium text-brand-600">
        ← Terug naar Klanten
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">{client.name}</h1>
      <div className="mt-6">
        <ClientForm
          initialValues={{
            id: client.id,
            name: client.name,
            type: client.type,
            email: client.email ?? "",
            phone: client.phone ?? "",
            address_line: client.address_line ?? "",
            postal_code: client.postal_code ?? "",
            city: client.city ?? "",
            payment_terms_days: String(client.payment_terms_days ?? 14),
          }}
        />
      </div>
    </div>
  );
}
