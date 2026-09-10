import Link from "next/link";
import { Boxes, LogIn } from "lucide-react";

export default function SuiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 font-semibold text-slate-950">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-950 text-white">
            <Boxes className="h-5 w-5" />
          </span>
          <span>El Houcine Automation</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          <Link href="/producten" className="hover:text-slate-950">Producten</Link>
          <Link href="/prijzen" className="hover:text-slate-950">Prijzen</Link>
          <Link href="/demo-rapport" className="hover:text-slate-950">Demo rapport</Link>
          <Link href="/dashboard" className="hover:text-slate-950">Dashboard</Link>
        </nav>
        <Link
          href="/inloggen"
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <LogIn className="h-4 w-4" />
          Inloggen
        </Link>
      </div>
    </header>
  );
}
