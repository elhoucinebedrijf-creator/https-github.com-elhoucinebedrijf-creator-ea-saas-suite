import { createAdminClient } from "@/lib/supabase/admin";

export async function insertIfConfigured(table: string, payload: Record<string, unknown>) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { skipped: true };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.from(table).insert(payload).select("id").single();

  if (error) {
    throw new Error(error.message);
  }

  return { skipped: false, id: data?.id };
}
