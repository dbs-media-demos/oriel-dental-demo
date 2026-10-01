import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { img } from "@/content/images";
import { InsuranceChecker } from "@/components/sections/InsuranceChecker";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/ui/JsonLd";
import { FaqList } from "@/components/ui/FaqList";
import { Reveal, SplitReveal } from "@/components/ui/Reveal";
import { insurers, membership } from "@/content/insurance";
import { faqGroups } from "@/content/faqs";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, graph, webPageSchema } from "@/lib/schema";

const title = "Dental Insurance & Financing";
const description =
  "Check if Oriel Dental Studio is in network with your dental insurance, see how we file out-of-network claims, and explore 0% financing and our $29/month membership plan for patients without insurance.";

export const metadata = buildMetadata({ title, description, path: "/insurance-financing", eyebrow: "Insurance & financing" });

const financing = [
  { title: "0% for 12 months", body: "On treatment over $500, with a quick soft credit check that won't affect your score." },
  { title: "Longer plans", body: "Up to 60 months through our lending partners for implants, veneers and aligners." },
  { title: "HSA & FSA welcome", body: "Pay with your health savings or flexible spending card; we'll give you itemized receipts." },
  { title: "Prices first, always", body: "Every plan comes with a written estimate. If something changes mid-treatment, we stop and tell you." },
];

export default function InsurancePage() {
  const inNetwork = insurers.filter((i) => i.status === "in-network");
  const faqs = faqGroups[2].items;
  return (
    <>
      <PageHero
        eyebrow="Insurance & financing"
        title={
          <>
            Clear costs, <em className="text-sage">before we start.</em>
          </>
        }
        lede="Type your insurance company for an instant answer. Not listed, not in network, or not insured at all? We still have a friendly, affordable way in."
        crumbs={[{ name: "Insurance & financing", path: "/insurance-financing" }]}
        image={img.familyCouch}
      />

      <section aria-label="Insurance checker" className="pb-24 md:pb-32">
        <div className="container-x grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <InsuranceChecker />
          <Reveal className="rounded-[2rem] bg-linen p-8 sm:p-10">
            <h2 className="eyebrow text-sage">In network with</h2>
            <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-2.5 text-[0.98rem] sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {inNetwork.map((i) => (
                <li key={i.name} className="flex items-center gap-2">
                  <span aria-hidden className="text-sage">
                    ✓
                  </span>
                  {i.name}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[0.85rem] text-ink-soft">Plans change often. We verify your benefits before every first visit.</p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="fin-title" className="bg-shell py-24 md:py-36">
        <div className="container-x">
          <p className="eyebrow text-sage">Financing</p>
          <SplitReveal id="fin-title" className="display h-md mt-6 max-w-[18ch]">
            Spread it out, <em>without the fine print.</em>
          </SplitReveal>
          <Reveal as="ul" stagger={0.1} className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {financing.map((f) => (
              <li key={f.title} className="rounded-t-[10rem] rounded-b-3xl bg-porcelain px-7 pt-14 pb-8 ring-1 ring-line">
                <h3 className="display text-[1.7rem] leading-tight">{f.title}</h3>
                <p className="mt-3 text-ink-soft">{f.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="member-teaser" className="py-24 md:py-32">
        <div className="container-x">
          <Reveal className="grid items-center gap-10 rounded-t-[16rem] rounded-b-[2rem] bg-sage px-8 pt-24 pb-12 text-porcelain md:grid-cols-[1.3fr_1fr] md:px-16 md:pt-28">
            <div>
              <p className="eyebrow text-mist">No insurance?</p>
              <h2 id="member-teaser" className="display h-md mt-5">
                The Oriel Membership: <em className="text-glow">${membership.adult.monthly}/month.</em>
              </h2>
              <p className="mt-5 max-w-xl text-[1.1rem] text-porcelain/90">
                Two cleanings, exams, x-rays and an emergency visit every year, plus 15% off everything else. No deductibles, no waiting, no claim forms.
              </p>
            </div>
            <div className="md:text-right">
              <Link href="/membership" className="inline-flex min-h-12 items-center rounded-full bg-porcelain px-7 font-semibold text-ink transition-colors hover:bg-white">
                See the plan & calculator →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="ins-faq-title" className="pb-24 md:pb-32">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-24">
          <h2 id="ins-faq-title" className="display h-md">
            Money questions
          </h2>
          <FaqList items={faqs} />
        </div>
      </section>

      <FinalCta />
      <JsonLd data={graph(webPageSchema({ path: "/insurance-financing", name: title, description }), faqSchema(faqs))} />
    </>
  );
}
