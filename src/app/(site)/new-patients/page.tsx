import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Journey } from "@/components/sections/Journey";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/ui/JsonLd";
import { FaqList } from "@/components/ui/FaqList";
import { Reveal, SplitReveal } from "@/components/ui/Reveal";
import { Button, Arrow } from "@/components/ui/Button";
import { img } from "@/content/images";
import { journey } from "@/content/journey";
import { faqGroups } from "@/content/faqs";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, graph, webPageSchema } from "@/lib/schema";

const title = "New Patients: Your First Visit, Step by Step";
const description =
  "What to expect at your first visit to Oriel Dental Studio in Uptown Dallas: online booking, a comfort menu, a 3D scan, a clear plan with prices and a first-visit gift. $99 for patients without insurance.";

export const metadata = buildMetadata({ title, description, path: "/new-patients", eyebrow: "New patients" });

const forms = [
  { name: "Health history", time: "5 min", note: "Medications, allergies, anything we should know." },
  { name: "Comfort preferences", time: "1 min", note: "Blanket, headphones, sedation interest, stop signal." },
  { name: "Insurance details", time: "2 min", note: "A photo of your card is plenty. We verify before you arrive." },
  { name: "HIPAA & consent", time: "1 min", note: "How we protect your information. Signed on your phone." },
];

const bring = ["Photo ID", "Insurance card (if you have one)", "A list of medications", "Previous x-rays, if they're recent (or we can request them)", "Any questions, big or small"];

export default function NewPatientsPage() {
  const firstVisitFaqs = faqGroups[0].items;
  return (
    <>
      <PageHero
        eyebrow="New patients"
        title={
          <>
            Your first visit, <em className="text-sage">without the dread.</em>
          </>
        }
        lede="About 90 minutes. Nothing happens without your say-so. You leave with a clear plan, prices, and a small gift."
        crumbs={[{ name: "New patients", path: "/new-patients" }]}
        image={img.patientRelaxed}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button href="/book" icon={<Arrow />}>
            Book your first visit
          </Button>
          <span className="rounded-full bg-sand-soft px-4 py-2 text-[0.92rem] font-semibold">{site.newPatientOffer.price} first visit without insurance</span>
        </div>
      </PageHero>

      <section aria-labelledby="journey-title" className="bg-shell py-24 md:py-36">
        <div className="container-x">
          <p className="eyebrow text-sage">What to expect</p>
          <SplitReveal id="journey-title" className="display h-lg mt-6 max-w-[16ch]">
            Five calm steps, <em>zero surprises.</em>
          </SplitReveal>
          <div className="mt-16 md:mt-24">
            <Journey chapters={journey} />
          </div>
        </div>
      </section>

      <section aria-labelledby="offer-title" className="py-24 md:py-36">
        <div className="container-x grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20">
          <Reveal className="relative overflow-hidden rounded-t-[16rem] rounded-b-[2rem] bg-sage p-10 pt-24 text-porcelain md:p-14 md:pt-32">
            <p className="eyebrow text-mist">New-patient special</p>
            <h2 id="offer-title" className="display mt-5 text-[clamp(4rem,10vw,8rem)] leading-none">
              {site.newPatientOffer.price}
            </h2>
            <p className="mt-4 text-[1.15rem] text-porcelain/90">{site.newPatientOffer.detail}</p>
            <ul className="mt-8 grid gap-2 text-porcelain/90 sm:grid-cols-2">
              {["Comprehensive exam", "Full 3D scan", "Digital x-rays", "Gentle cleaning", "Written plan with prices", "The Oriel welcome kit"].map((x) => (
                <li key={x} className="flex items-center gap-2">
                  <span aria-hidden className="inline-block h-3 w-2 rounded-t-full bg-glow" />
                  {x}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[0.85rem] text-porcelain/75">Standard value $495. Deep cleanings quoted separately if needed. Insured? Most plans cover this visit in full.</p>
          </Reveal>
          <div>
            <p className="eyebrow text-sage">Paperwork, done early</p>
            <SplitReveal className="display h-md mt-6">
              Forms on your phone, <em>not a clipboard.</em>
            </SplitReveal>
            <Reveal as="ul" stagger={0.08} className="mt-10 border-t border-line">
              {forms.map((f) => (
                <li key={f.name} className="flex items-start justify-between gap-6 border-b border-line py-5">
                  <span>
                    <span className="block font-semibold">{f.name}</span>
                    <span className="text-[0.95rem] text-ink-soft">{f.note}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-mist-soft px-3 py-1 text-[0.8rem] font-semibold">{f.time}</span>
                </li>
              ))}
            </Reveal>
            <Reveal>
              <p className="mt-6 text-[0.95rem] text-ink-soft">You&apos;ll get a secure link by text after booking. Prefer paper? We&apos;ll have it ready.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="bring-title" className="bg-mist-soft py-24 md:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="eyebrow text-sage">On the day</p>
            <SplitReveal id="bring-title" className="display h-md mt-6">
              What to bring
            </SplitReveal>
            <Reveal>
              <p className="lede mt-6">
                Arrive five minutes early and park in the Linden Row garage (we validate). Take the elevator to the second floor; we&apos;re the door with the arch.
              </p>
              <Link href="/contact" className="link-underline mt-6 inline-block font-semibold text-sage-deep">
                Directions & parking →
              </Link>
            </Reveal>
          </div>
          <Reveal as="ul" stagger={0.08} className="space-y-3 self-center">
            {bring.map((b) => (
              <li key={b} className="flex items-center gap-4 rounded-2xl bg-porcelain px-6 py-4 text-[1.05rem] ring-1 ring-line">
                <span aria-hidden className="inline-block h-4 w-3 shrink-0 rounded-t-full bg-sage" />
                {b}
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="np-faq-title" className="py-24 md:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-24">
          <h2 id="np-faq-title" className="display h-md">
            First-visit questions
          </h2>
          <FaqList items={firstVisitFaqs} />
        </div>
      </section>

      <FinalCta />
      <JsonLd data={graph(webPageSchema({ path: "/new-patients", name: title, description }), faqSchema(firstVisitFaqs))} />
    </>
  );
}
