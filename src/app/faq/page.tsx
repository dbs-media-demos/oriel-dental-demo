import { PageHero } from "@/components/ui/PageHero";
import { img } from "@/content/images";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/ui/JsonLd";
import { FaqList } from "@/components/ui/FaqList";
import { Reveal } from "@/components/ui/Reveal";
import { allFaqs, faqGroups } from "@/content/faqs";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, graph, webPageSchema } from "@/lib/schema";

const title = "Frequently Asked Questions";
const description =
  "Answers about first visits, comfort and dental anxiety, insurance, payment plans, emergencies and treatments at Oriel Dental Studio in Uptown Dallas.";

export const metadata = buildMetadata({ title, description, path: "/faq", eyebrow: "FAQ" });

const slug = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, "-");

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title={
          <>
            Questions, <em className="text-sage">answered kindly.</em>
          </>
        }
        lede={
          <>
            Can&apos;t find yours? Call or text {site.phone}, or email {site.email}. A real person answers from 7:30 am.
          </>
        }
        crumbs={[{ name: "FAQ", path: "/faq" }]}
        image={img.loungeWindow}
      />

      <section aria-label="Questions by topic" className="pb-24 md:pb-36">
        <div className="container-x grid gap-12 lg:grid-cols-[16rem_1fr] lg:gap-20">
          <nav aria-label="FAQ topics" className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <ul className="flex flex-wrap gap-2 lg:flex-col">
              {faqGroups.map((g) => (
                <li key={g.title}>
                  <a href={`#${slug(g.title)}`} className="inline-flex min-h-11 items-center rounded-full bg-shell px-5 ring-1 ring-line hover:ring-ink/40">
                    {g.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-20">
            {faqGroups.map((g) => (
              <Reveal key={g.title} id={slug(g.title)} className="scroll-mt-32">
                <h2 className="display h-sm">{g.title}</h2>
                <FaqList items={g.items} className="mt-6" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
      <JsonLd data={graph(webPageSchema({ path: "/faq", name: title, description, type: "FAQPage" }), faqSchema(allFaqs))} />
    </>
  );
}
