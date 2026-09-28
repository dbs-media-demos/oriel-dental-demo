import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import localFont from "next/font/local";
import { ViewTransition } from "react";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBar } from "@/components/layout/MobileBar";
import { DemoPill } from "@/components/layout/DemoPill";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Cursor } from "@/components/layout/Cursor";
import { JsonLd } from "@/components/ui/JsonLd";
import { site, siteUrl, noindex } from "@/content/site";
import { dentistSchema, graph, websiteSchema } from "@/lib/schema";
import { ogImageUrl } from "@/lib/seo";

// Fraunces, self-hosted and instanced at weight 300 / SOFT 100 (optical size stays variable):
// ~75 KB for both styles instead of ~270 KB for the full variable family.
const fraunces = localFont({
  variable: "--font-fraunces",
  display: "swap",
  src: [
    { path: "../assets/fonts/Fraunces-300-soft.woff2", weight: "300", style: "normal" },
    { path: "../assets/fonts/Fraunces-300-soft-italic.woff2", weight: "300", style: "italic" },
  ],
  fallback: ["Iowan Old Style", "Georgia", "serif"],
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${site.name} | Family & Cosmetic Dentist in Uptown Dallas`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  category: "health",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: "/",
    images: [{ url: ogImageUrl(site.tagline), width: 1200, height: 630, alt: site.name }],
  },
  twitter: { card: "summary_large_image" },
  robots: noindex ? { index: false, follow: false, googleBot: { index: false, follow: false } } : { index: true, follow: true },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#f7f4ee",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${figtree.variable}`}>
      <body>
        <a
          href="#main"
          className="fixed top-3 left-3 z-[80] -translate-y-24 rounded-full bg-ink px-5 py-3 font-semibold text-porcelain transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <Header />
        <ViewTransition default="page-swap">
          <main id="main">{children}</main>
        </ViewTransition>
        <Footer />
        <MobileBar />
        <DemoPill />
        <Cursor />
        <JsonLd data={graph(dentistSchema(), websiteSchema())} />
      </body>
    </html>
  );
}
