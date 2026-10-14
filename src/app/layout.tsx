import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SCRIPT_THEME } from "@/components/layout/ThemeToggle";
import { SITE } from "@/lib/site";
import { MotionProvider } from "@/components/layout/MotionProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", axes: ["opsz", "SOFT"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url.endsWith("/") ? SITE.url : `${SITE.url}/`),
  title: { default: `${SITE.nom} — ${SITE.slogan}`, template: `%s · ${SITE.nom}` },
  description: SITE.description,
  applicationName: SITE.nom,
  openGraph: { type: "website", locale: "fr_FR", siteName: SITE.nom, title: SITE.slogan, description: SITE.description },
  twitter: { card: "summary_large_image", title: SITE.slogan, description: SITE.description },
  alternates: { canonical: "./" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1020" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${fraunces.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_THEME }} />
      </head>
      <body className="min-h-screen antialiased">
        <MotionProvider>
          <Header />
          <main id="contenu">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
