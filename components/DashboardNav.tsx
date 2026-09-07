"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Car, FileText, Users, CreditCard, Settings, Building2 } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overzicht", icon: LayoutDashboard },
  { href: "/dashboard/rides", label: "Ritten", icon: Car },
  { href: "/dashboard/invoices", label: "Facturen", icon: FileText },
  { href: "/dashboard/clients", label: "Klanten", icon: Users },
  { href: "/dashboard/billing", label: "Abonnement", icon: CreditCard },
  { href: "/dashboard/settings", label: "Instellingen", icon: Settings },
];

export default function DashboardNav({ isPlatformOwner }: { isPlatformOwner?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/dashboard" ? pathname === item.href : pathname?.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-brand-600 text-white"
                : "text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
      {isPlatformOwner && (
        <Link
          href="/dashboard/platform"
          className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition ${
            pathname?.startsWith("/dashboard/platform") ? "bg-brand-600 text-white" : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Building2 className="h-4 w-4" />
          Platform (eigenaar)
        </Link>
      )}
    </nav>
  );
}
