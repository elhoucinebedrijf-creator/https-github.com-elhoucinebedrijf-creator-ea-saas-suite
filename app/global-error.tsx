"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      import("@sentry/nextjs").then((Sentry) => Sentry.captureException(error));
    }
  }, [error]);

  return (
    <html lang="nl">
      <body>
        <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Er ging iets mis</h1>
          <p className="mt-3 text-sm text-slate-600">
            Onze excuses, er is een onverwachte fout opgetreden. Probeer de pagina te vernieuwen.
          </p>
        </main>
      </body>
    </html>
  );
}
