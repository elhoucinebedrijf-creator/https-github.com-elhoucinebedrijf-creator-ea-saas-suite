import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";
import DashboardNav from "@/components/DashboardNav";
import Logo from "@/components/Logo";
import { isPlatformOwner } from "@/lib/platform-owner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/inloggen");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("tenant_id, tenants(company_name)")
    .eq("id", user.id)
    .single();

  // Geen profile betekent dat de betaalstap (registreren stap 2, via Mollie)
  // nog niet is afgerond — de Tenant Onboarding-workflow heeft dan nog geen
  // tenant/profile aangemaakt. Elke pagina hieronder gaat er vanuit dat een
  // tenant bestaat, dus we stoppen hier expliciet i.p.v. verderop te crashen.
  if (!profile) {
    redirect("/account-in-behandeling");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 shrink-0 border-r border-slate-200 bg-slate-50 p-4">
        <div className="mb-6 px-2">
          <Logo />
          <p className="mt-1 truncate text-xs text-slate-500">
            {(profile?.tenants as any)?.company_name ?? "Mijn bedrijf"}
          </p>
        </div>
        <DashboardNav isPlatformOwner={isPlatformOwner(user.email)} />
        <div className="mt-6 px-2">
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
