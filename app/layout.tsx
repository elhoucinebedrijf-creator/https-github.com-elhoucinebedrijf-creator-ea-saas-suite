import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RitFactuur — automatische facturatie voor taxibedrijven",
  description:
    "RitFactuur zet je rittendata automatisch om in BTW-conforme facturen, verstuurt ze en bewaakt betaling. Gebouwd voor Nederlandse taxi-ondernemers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
