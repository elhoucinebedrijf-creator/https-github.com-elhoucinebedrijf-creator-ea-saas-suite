import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client: omzeilt RLS. Uitsluitend gebruiken in interne
// server-routes die door n8n (server-to-server, met N8N_SHARED_SECRET)
// worden aangeroepen — nooit blootstellen aan de browser. Elke query/insert
// hiermee MOET zelf tenant_id filteren/zetten, want de database dwingt dat
// hier niet af.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
