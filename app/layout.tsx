import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "El Houcine Automation SaaS Suite",
  description:
    "Professionele SaaS-producten voor bewijsdossiers, factuurcontrole, compliance, procesanalyse, onderwijs, freelancers en mkb-automatisering.",
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
