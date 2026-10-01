import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Cursor } from "@/components/layout/Cursor";
import { site, siteUrl, noindex } from "@/content/site";
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

// The instanced Fraunces above is Latin-only; č ć š ž đ (Serbian previews) come from this
// latin-ext subset of the static Fraunces 300, listed first in --font-display.
const frauncesExt = localFont({
  variable: "--font-fraunces-ext",
  display: "swap",
  src: [
    { path: "../assets/fonts/Fraunces-300-ext.woff2", weight: "300", style: "normal" },
    { path: "../assets/fonts/Fraunces-300-ext-italic.woff2", weight: "300", style: "italic" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0100-024F, U+1E00-1EFF" }],
  preload: false,
  adjustFontFallback: false,
});

const figtree = Figtree({
  subsets: ["latin", "latin-ext"],
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
    <html lang="en" className={`${fraunces.variable} ${frauncesExt.variable} ${figtree.variable}`}>
      <body>
        <a
          href="#main"
          className="fixed top-3 left-3 z-[80] -translate-y-24 rounded-full bg-ink px-5 py-3 font-semibold text-porcelain transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <SmoothScroll />
        {/* Header, footer and the rest come from (site)/layout or for/[token]/layout (SiteChrome) */}
        {children}
        <Cursor />
      </body>
    </html>
  );
}
