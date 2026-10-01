import { HomeContent } from "@/components/sections/HomeContent";
import { JsonLd } from "@/components/ui/JsonLd";
import { services } from "@/content/services";
import { homeFaqs } from "@/content/faqs";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, graph, offerCatalogSchema, webPageSchema } from "@/lib/schema";

export const metadata = buildMetadata({
  title: "Oriel Dental Studio | Calm Family & Cosmetic Dentist in Uptown Dallas",
  absoluteTitle: true,
  description: site.description,
  path: "/",
  eyebrow: "Uptown Dallas dentist",
  keywords: ["dentist Uptown Dallas", "family dentist Dallas", "cosmetic dentist Dallas", "emergency dentist Uptown", "sedation dentist Dallas"],
});

export default function HomePage() {
  return (
    <HomeContent>
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
