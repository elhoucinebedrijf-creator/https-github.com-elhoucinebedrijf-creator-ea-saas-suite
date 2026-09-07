import { createClient } from "@/lib/supabase/server";
import TenantSettingsForm from "@/components/TenantSettingsForm";
import LogoUpload from "@/components/LogoUpload";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("tenant_id")
    .eq("id", user!.id)
    .single();

  const { data: tenant } = await supabase
    .from("tenants")
    .select("id, company_name, kvk_number, btw_number, iban, address_line, postal_code, city, logo_url")
    .eq("id", profile!.tenant_id)
    .single();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Instellingen</h1>
      <p className="mt-1 text-sm text-slate-600">
        Deze gegevens verschijnen op al je facturen — zorg dat ze kloppen voor een BTW-conforme
        factuur.
      </p>
      {tenant && (
        <div className="mt-6 max-w-lg space-y-8">
          <LogoUpload tenantId={tenant.id} currentLogoUrl={tenant.logo_url} />
          <TenantSettingsForm tenant={tenant} />
        </div>
      )}
    </div>
  );
}
