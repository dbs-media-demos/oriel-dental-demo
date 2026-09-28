import Link from "next/link";
import { HomeHero } from "@/components/sections/HomeHero";
import { Intro } from "@/components/sections/Intro";
import { TreatmentIndex } from "@/components/sections/TreatmentIndex";
import { Journey } from "@/components/sections/Journey";
import { SmileGallery } from "@/components/sections/SmileGallery";
import { ComfortMenu, type Comfort } from "@/components/sections/ComfortMenu";
import { TeamTeaser } from "@/components/sections/TeamTeaser";
import { OfficeRail, type RailItem } from "@/components/sections/OfficeRail";
import { RatingSummary, ReviewMarquee } from "@/components/sections/ReviewsSection";
import { InsuranceChecker } from "@/components/sections/InsuranceChecker";
import { AreaMap } from "@/components/sections/AreaMap";
import { FinalCta } from "@/components/sections/FinalCta";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { Marquee } from "@/components/ui/Marquee";
import { FaqList } from "@/components/ui/FaqList";
import { Reveal } from "@/components/ui/Reveal";
import { Button, Arrow } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { img } from "@/content/images";
import { services } from "@/content/services";
import { journey } from "@/content/journey";
import { smileCases, caseTabs } from "@/content/gallery";
import { homeFaqs } from "@/content/faqs";
import { site, hours, fmtTime, fullAddress } from "@/content/site";
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

const comforts: Comfort[] = [
  { title: "Weighted blankets", body: "Heavy, soft and warm. Most patients never give theirs back until the very end.", image: img.comfortBlanket },
  { title: "Noise-cancelling headphones", body: "Your playlist, a podcast or rain sounds. No drill noise, no small talk required.", image: img.comfortHeadphones },
  { title: "Your show on the ceiling", body: "Netflix, Hulu or Max on a screen above every chair. Pick up where you left off.", image: img.loungeTv },
  { title: "Tea, sparkling water, calm", body: "Lavender or mint tea in the lounge, and rooms that smell like eucalyptus, not a clinic.", image: img.comfortTea },
  { title: "A stop signal, always honored", body: "Raise your hand and we pause. Every time, no questions, no sighs.", image: img.dentistLaugh },
  { title: "Nitrous & oral sedation", body: "For the truly nervous: a doctor with a Texas sedation permit and careful monitoring.", image: img.suiteWindow },
];

const rail: RailItem[] = [
  { image: img.lobbyWood, caption: "The front door: oak, plants and a real person to greet you.", shape: "wide" },
  { image: img.receptionArches, caption: "Reception, with our arches in sage.", shape: "arch" },
  { image: img.loungeWindow, caption: "The window lounge, for tea before your visit.", shape: "tall" },
  { image: img.suiteWood, caption: "Treatment suite 2: north light all day.", shape: "wide" },
  { image: img.suiteWindow, caption: "Every chair faces a window.", shape: "arch" },
  { image: img.detailBamboo, caption: "Small things, done nicely.", shape: "tall" },
  { image: img.loungePlants, caption: "The quiet room, for recovery after sedation.", shape: "wide" },
];

const marqueeWords = ["Weighted blankets", "Evening hours", "3D scans, no goop", "Prices first", "Se habla español", "Same-day emergencies", "Saturday mornings", "Free parking"];

export default function HomePage() {
  const index = services.map((s) => ({ slug: s.slug, name: s.name, duration: s.duration, price: s.price.split(" · ")[0], tagline: s.tagline, image: s.image }));

  return (
    <>
      <HomeHero image={img.studioConsult} />

      <div className="border-y border-line bg-shell py-6">
        <Marquee speed={70}>
          {marqueeWords.map((w) => (
            <span key={w} className="display flex items-center gap-10 pr-10 text-[clamp(1.4rem,2.4vw,2.2rem)] text-ink/80">
              {w}
              <span aria-hidden className="inline-block h-4 w-3 rounded-t-full bg-sand" />
            </span>
          ))}
        </Marquee>
      </div>

      <Intro />

      {/* Treatments */}
      <section aria-labelledby="treatments-title" className="py-24 md:py-36">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionIntro
              id="treatments-title"
              eyebrow="Treatments"
              title={
                <>
                  Everything your smile needs, <em>under one arch.</em>
                </>
              }
              className="max-w-3xl"
            />
            <Reveal>
              <Button href="/services" variant="ghost" icon={<Arrow />}>
                Explore all treatments
              </Button>
            </Reveal>
          </div>
          <div className="mt-16">
            <TreatmentIndex items={index} />
          </div>
        </div>
      </section>

      {/* New-patient journey */}
      <section aria-labelledby="journey-title" className="bg-shell py-24 md:py-36">
        <div className="container-x">
          <SectionIntro
            id="journey-title"
            eyebrow="Your first visit"
            title={
              <>
                Five calm steps, <em>zero surprises.</em>
              </>
            }
            lede="From booking to the gift bag, here is exactly what your first visit feels like. About 90 minutes, and nothing happens without your say-so."
            className="max-w-3xl"
          />
          <div className="mt-16 md:mt-24">
            <Journey chapters={journey} />
          </div>
        </div>
      </section>

      {/* Smile gallery */}
      <section aria-labelledby="smiles-title" className="py-24 md:py-36">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionIntro
              id="smiles-title"
              eyebrow="Smile gallery"
              title={
                <>
                  Drag the arch. <em>See the difference.</em>
                </>
              }
              lede="Whitening, veneers, aligners and implants, shown as illustrative simulations so you know what each treatment can do."
              className="max-w-3xl"
            />
            <Reveal>
              <Button href="/smile-gallery" variant="ghost" icon={<Arrow />}>
                Full smile gallery
              </Button>
            </Reveal>
          </div>
          <div className="mt-14">
            <SmileGallery cases={smileCases} tabs={caseTabs} limit={3} featured />
          </div>
        </div>
      </section>

      {/* Comfort menu */}
      <section aria-labelledby="comfort-title" className="bg-mist-soft py-24 md:py-36">
        <div className="container-x">
          <SectionIntro
            id="comfort-title"
            eyebrow="The comfort menu"
            title={
              <>
                Built for people who <em>hate the dentist.</em>
              </>
            }
            lede="Pick your comforts when you book. We note them in your chart, so they're waiting for you every single time."
            className="max-w-3xl"
          />
          <div className="mt-16">
            <ComfortMenu items={comforts} />
          </div>
          <Reveal className="mt-14">
            <Link href="/services/sedation-dentistry" className="link-underline font-semibold text-sage-deep">
              Read about sedation & anxiety-free dentistry →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Team */}
      <section aria-labelledby="team-title" className="py-24 md:py-36">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionIntro
              id="team-title"
              eyebrow="Your doctors"
              title={
                <>
                  Unhurried hands, <em>familiar faces.</em>
                </>
              }
              className="max-w-3xl"
            />
            <Reveal>
              <Button href="/team" variant="ghost" icon={<Arrow />}>
                Meet the whole team
              </Button>
            </Reveal>
          </div>
          <div className="mt-16">
            <TeamTeaser />
          </div>
        </div>
      </section>

      {/* Office tour rail */}
      <OfficeRail
        items={rail}
        intro={
          <div>
            <p className="eyebrow text-sage">The studio</p>
            <h2 className="display h-md mt-5">
              Every chair <em>faces a window.</em>
            </h2>
            <p className="lede mt-5">A second-floor studio on Linden Row, designed with an architect, not a dental catalog.</p>
            <Link href="/office-tour" className="link-underline mt-6 inline-block font-semibold text-sage-deep">
              Take the full tour →
            </Link>
          </div>
        }
      />

      {/* Reviews */}
      <section aria-labelledby="reviews-title" className="overflow-hidden py-24 md:py-36">
        <div className="container-x grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <SectionIntro
            id="reviews-title"
            eyebrow="Reviews"
            title={
              <>
                &ldquo;I actually booked my <em>next cleaning.</em>&rdquo;
              </>
            }
          />
          <Reveal>
            <RatingSummary />
          </Reveal>
        </div>
        <div className="mt-16">
          <ReviewMarquee />
        </div>
        <div className="container-x mt-12">
          <Link href="/reviews" className="link-underline font-semibold text-sage-deep">
            Read all {site.rating.count} reviews →
          </Link>
        </div>
      </section>

      {/* Insurance */}
      <section aria-labelledby="insurance-title" className="bg-shell py-24 md:py-36">
        <div className="container-x grid gap-14 lg:grid-cols-2 lg:gap-24">
          <SectionIntro
            id="insurance-title"
            eyebrow="Insurance & financing"
            title={
              <>
                Clear costs, <em>before we start.</em>
              </>
            }
            lede="In network with most PPO plans, happy to file for the rest, and a $29/month membership if you don't have insurance. 0% financing available."
          />
          <Reveal>
            <InsuranceChecker compact />
          </Reveal>
        </div>
      </section>

      {/* Location */}
      <section aria-labelledby="visit-title" className="py-24 md:py-36">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <SectionIntro
              id="visit-title"
              eyebrow="Visit us"
              title={
                <>
                  In the heart <em>of Uptown.</em>
                </>
              }
              size="h-md"
            />
            <Reveal className="mt-8 space-y-6">
              <OpenBadge />
              <address className="text-lg not-italic">{fullAddress}</address>
              <p className="text-ink-soft">{site.parking}</p>
              <dl className="grid max-w-sm grid-cols-[auto_1fr] gap-x-8 gap-y-1.5 text-[0.95rem]">
                {hours.map((h) => (
                  <div key={h.day} className="contents">
                    <dt className="text-ink-soft">{h.label}</dt>
                    <dd className="text-right">{h.open != null && h.close != null ? `${fmtTime(h.open)} – ${fmtTime(h.close)}` : "Closed"}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-[0.95rem] text-ink-soft">Serving {site.areaServed.join(", ")}.</p>
              <Button href="/contact" variant="ghost" icon={<Arrow />}>
                Directions & contact
              </Button>
            </Reveal>
          </div>
          <Reveal>
            <AreaMap />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-title" className="pb-24 md:pb-36">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-24">
          <SectionIntro id="faq-title" eyebrow="Questions" title={<>Good to know</>} size="h-md" />
          <div>
            <FaqList items={homeFaqs} />
            <Link href="/faq" className="link-underline mt-8 inline-block font-semibold text-sage-deep">
              All frequently asked questions →
            </Link>
          </div>
        </div>
      </section>

      <FinalCta />

      <JsonLd
        data={graph(
          webPageSchema({ path: "/", name: "Oriel Dental Studio", description: site.description }),
          faqSchema(homeFaqs),
          offerCatalogSchema(services),
        )}
      />
    </>
  );
}
