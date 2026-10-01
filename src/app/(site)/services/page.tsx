import { PageHero } from "@/components/ui/PageHero";
import { TreatmentExplorer } from "@/components/sections/TreatmentExplorer";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/ui/JsonLd";
import { Button, Arrow } from "@/components/ui/Button";
import { img } from "@/content/images";
import { categories, comfortLabels, services } from "@/content/services";
import { buildMetadata } from "@/lib/seo";
import { graph, offerCatalogSchema, webPageSchema } from "@/lib/schema";

const title = "Dental Treatments in Uptown Dallas";
const description =
  "Explore every treatment at Oriel Dental Studio: cleanings, family dentistry, whitening, veneers, clear aligners, implants, emergency care, sedation and kids' dentistry. Time, comfort level and price for each.";

export const metadata = buildMetadata({ title, description, path: "/services", eyebrow: "Treatments" });

export default function ServicesPage() {
  const catLabel = Object.fromEntries(categories.map((c) => [c.id, c.label]));
  const items = services.map((s) => ({
    slug: s.slug,
    name: s.name,
    category: s.category,
    categoryLabel: catLabel[s.category],
    tagline: s.tagline,
    duration: s.duration,
    comfort: s.comfort,
    comfortLabel: comfortLabels[s.comfort],
    price: s.price,
    image: s.image,
  }));

  return (
    <>
      <PageHero
        eyebrow="Treatment explorer"
        title={
          <>
            Every treatment, <em className="text-sage">explained honestly.</em>
          </>
        }
        lede="How long it takes, how it feels, and what it costs, before you ever sit down. Tap any treatment to see exactly what happens."
        crumbs={[{ name: "Treatments", path: "/services" }]}
        image={img.suiteWood}
      >
        <Button href="/book" icon={<Arrow />}>
          Book a consultation
        </Button>
      </PageHero>

      <section aria-label="All treatments" className="pb-28 md:pb-40">
        <div className="container-x">
          <TreatmentExplorer items={items} filters={categories} />
        </div>
      </section>

      <FinalCta title="Not sure what you need? Start with a $99 first visit." />
      <JsonLd data={graph(webPageSchema({ path: "/services", name: title, description, type: "CollectionPage" }), offerCatalogSchema(services))} />
    </>
  );
}
