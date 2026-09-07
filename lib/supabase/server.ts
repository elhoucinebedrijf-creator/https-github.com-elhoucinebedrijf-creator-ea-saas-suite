import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

// RLS-scoped client voor gebruik in server components / route handlers.
// Draait als de ingelogde gebruiker, niet als service role.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // set() vanuit een Server Component wordt genegeerd als er
            // middleware is die de sessie ververst — dat is verwacht gedrag.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // zie opmerking hierboven
          }
        },
      },
    }
  );
}
