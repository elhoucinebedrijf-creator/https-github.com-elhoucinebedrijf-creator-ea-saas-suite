import { createClient } from "@/lib/supabase/server";
import RideUploadForm from "@/components/RideUploadForm";
import UnbilledRidesByClient from "@/components/UnbilledRidesByClient";
import ManualRideForm from "@/components/ManualRideForm";

export default async function RidesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("tenant_id")
    .eq("id", user!.id)
    .single();

  const [{ data: rides }, { data: clients }] = await Promise.all([
    supabase
      .from("rides")
      .select("id, ride_date, pickup_address, dropoff_address, amount_incl_btw, client_id, clients(name)")
      .eq("status", "unbilled")
      .order("ride_date", { ascending: false }),
    supabase.from("clients").select("id, name").order("name"),
  ]);

  const groupsByClient = new Map<string, { clientId: string; clientName: string; rides: any[] }>();
  for (const ride of rides ?? []) {
    if (!ride.client_id) continue;
    const key = ride.client_id;
    if (!groupsByClient.has(key)) {
      groupsByClient.set(key, {
        clientId: key,
        clientName: (ride.clients as any)?.name ?? "Onbekende klant",
        rides: [],
      });
    }
    groupsByClient.get(key)!.rides.push(ride);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ritten</h1>
          <p className="mt-1 text-sm text-slate-600">
            Upload je rittenbestand of voer ritten handmatig in, en groepeer ze per klant tot een
            factuur.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <RideUploadForm tenantId={profile!.tenant_id} />
        <ManualRideForm clients={clients ?? []} />
      </div>

      <h2 className="mt-10 text-lg font-semibold text-slate-900">Nog te factureren</h2>
      <UnbilledRidesByClient groups={Array.from(groupsByClient.values())} />
    </div>
  );
}
