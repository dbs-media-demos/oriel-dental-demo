import type { Metadata } from "next";
import { HomeContent } from "@/components/sections/HomeContent";
import { JsonLd } from "@/components/ui/JsonLd";
import { services } from "@/content/services";
import { homeFaqs } from "@/content/faqs";
import { site } from "@/content/site";
import { metadata as home } from "../page";
import { faqSchema, graph, offerCatalogSchema, webPageSchema } from "@/lib/schema";

/**
 * The same homepage without any 3D (for a slow laptop, or a lead who'd rather not): the hero charts
 * the upper arch in SVG and CSS instead of the three.js tooth. Everything below the hero is the same
 * component tree as `/` (HomeContent, hero="2d"). It points search engines at `/`.
 */
export const metadata: Metadata = { ...home, robots: { index: false, follow: true } };

export default function HomePageV2() {
  return (
    <HomeContent hero="2d">
      <JsonLd
        data={graph(
          webPageSchema({ path: "/", name: "Oriel Dental Studio", description: site.description }),
          faqSchema(homeFaqs),
          offerCatalogSchema(services),
        )}
      />
    </HomeContent>
  );
}
