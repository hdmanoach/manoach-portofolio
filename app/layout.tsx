import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/language";

export const metadata: Metadata = {
  title: "Manoach HOSSOU DODO | Portfolio DevOps & Admin Système",
  description:
    "Portfolio de Manoach HOSSOU DODO : administration système, DevOps, infrastructure, cybersécurité, data et développement web.",
  openGraph: {
    title: "Manoach HOSSOU DODO | Portfolio DevOps & Admin Système",
    description:
      "Administration système, DevOps, infrastructure, cybersécurité, data et développement web.",
    locale: "fr_FR",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap"
          rel="stylesheet"
        />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
