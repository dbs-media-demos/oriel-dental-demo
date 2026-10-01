import { PageHero } from "@/components/ui/PageHero";
import { MembershipCalculator } from "@/components/sections/MembershipCalculator";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/ui/JsonLd";
import { FaqList } from "@/components/ui/FaqList";
import { Reveal, SplitReveal } from "@/components/ui/Reveal";
import { img } from "@/content/images";
import { membership } from "@/content/insurance";
import { absoluteUrl } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, graph, practiceId, webPageSchema } from "@/lib/schema";

const title = "Oriel Membership: Dental Plan Without Insurance";
const description = `No dental insurance? The Oriel Membership is $${membership.adult.monthly}/month for adults and covers cleanings, exams, x-rays and an emergency visit, plus 15% off treatment. Uptown Dallas.`;

export const metadata = buildMetadata({ title, description, path: "/membership", eyebrow: "Membership plan" });

const faqs = [
  { q: "Is this insurance?", a: "No. It's a simple yearly plan between you and Oriel. There are no deductibles, annual maximums, waiting periods or claim forms." },
  { q: "Can I use it right away?", a: "Yes. Your membership starts the day you join, including for your first cleaning and exam." },
  { q: "What if I move away?", a: "Monthly memberships can be cancelled any time after the first three months. Yearly plans are refundable for unused cleanings." },
  { q: "Is there a gum-care plan?", a: `Yes: $${membership.gum.monthly}/month covers up to four periodontal maintenance visits a year for patients who need more frequent cleanings.` },
];

const sum = (xs: { fee: number }[]) => xs.reduce((a, b) => a + b.fee, 0);

export default function MembershipPage() {
  const valueAdult = sum(membership.valueAdult);
  const valueChild = sum(membership.valueChild);
  return (
    <>
      <PageHero
        eyebrow="Oriel Membership"
        title={
          <>
            No insurance? <em className="text-sage">No problem.</em>
          </>
        }
        lede={`One simple plan: $${membership.adult.monthly} a month for adults, $${membership.child.monthly} for kids. Everything preventive is included, and everything else is 15% off.`}
        crumbs={[
          { name: "Insurance & financing", path: "/insurance-financing" },
          { name: "Membership", path: "/membership" },
        ]}
        image={img.familyPark}
      />

      <section aria-labelledby="included-title" className="pb-24 md:pb-32">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
          <div>
            <p className="eyebrow text-sage">What&apos;s included</p>
            <SplitReveal id="included-title" className="display h-md mt-6">
              Everything preventive, <em>and then some.</em>
            </SplitReveal>
          </div>
          <Reveal as="ul" stagger={0.08} className="border-t border-line">
            {membership.perks.map((p) => (
              <li key={p} className="flex items-center gap-4 border-b border-line py-5 text-[1.1rem]">
                <span aria-hidden className="inline-block h-4 w-3 shrink-0 rounded-t-full bg-sage" />
                {p}
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section aria-label="Membership savings calculator" className="pb-24 md:pb-32">
        <div className="container-x">
          <MembershipCalculator adult={membership.adult} child={membership.child} valueAdult={valueAdult} valueChild={valueChild} treatmentSaving={180} />
          <p className="mt-6 text-[0.85rem] text-ink-soft">
            Standard fees used for comparison: adult ${valueAdult}/yr ({membership.valueAdult.map((v) => v.item).join(", ")}); child ${valueChild}/yr. Treatment saving assumes
            15% off a $1,200 crown.
          </p>
        </div>
      </section>

      <section aria-labelledby="m-faq-title" className="bg-shell py-24 md:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-24">
          <h2 id="m-faq-title" className="display h-md">
            Membership questions
          </h2>
          <FaqList items={faqs} />
        </div>
      </section>

      <FinalCta title="Join at your first visit. It takes two minutes." eyebrow="Oriel Membership" />
      <JsonLd
        data={graph(webPageSchema({ path: "/membership", name: title, description }), faqSchema(faqs), {
          "@type": "Offer",
          name: "Oriel Membership (adult)",
          url: absoluteUrl("/membership"),
          price: membership.adult.yearly,
          priceCurrency: "USD",
          offeredBy: { "@id": practiceId },
          description: membership.perks.join("; "),
        })}
      />
    </>
  );
}
