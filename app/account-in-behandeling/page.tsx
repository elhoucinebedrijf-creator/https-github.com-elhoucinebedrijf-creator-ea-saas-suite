import Link from "next/link";
import Logo from "@/components/Logo";

export default function AccountInBehandelingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex justify-center">
        <Logo />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Je account wordt nog geactiveerd</h1>
      <p className="mt-3 text-sm text-slate-600">
        Je e-mailadres is bevestigd, maar de registratie is nog niet volledig — waarschijnlijk is
        de bedrijfsgegevens-/betaalstap nog niet afgerond. Rond die stap af om je dashboard te
        activeren.
      </p>
      <Link
        href="/registreren"
        className="mt-6 rounded-md bg-brand-600 px-6 py-3 font-medium text-white hover:bg-brand-500"
      >
        Registratie afronden
      </Link>
      <Link href="/" className="mt-4 text-sm font-medium text-slate-600 hover:text-slate-950">
        Terug naar overzicht
      </Link>
    </main>
  );
}
