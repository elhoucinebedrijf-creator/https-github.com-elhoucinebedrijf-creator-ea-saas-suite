import Link from "next/link";
import Logo from "@/components/Logo";

export default function BedanktPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex justify-center">
        <Logo />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Bedankt voor je aanmelding</h1>
      <p className="mt-3 text-sm text-slate-600">
        We verwerken je betaling en zetten je account klaar. Dit duurt meestal minder dan een
        minuut — je ontvangt een bevestiging per e-mail zodra je kunt inloggen.
      </p>
      <Link
        href="/inloggen"
        className="mt-6 rounded-md bg-brand-600 px-6 py-3 font-medium text-white hover:bg-brand-500"
      >
        Naar inloggen
      </Link>
    </main>
  );
}
