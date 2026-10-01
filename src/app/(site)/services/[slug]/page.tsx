import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { Breadcrumbs } from "@/components/ui/PageHero";
import { Photo } from "@/components/ui/Photo";
import { Parallax, Reveal, SplitReveal } from "@/components/ui/Reveal";
import { Button, Arrow, PhoneIcon } from "@/components/ui/Button";
import { FaqList } from "@/components/ui/FaqList";
import { JsonLd } from "@/components/ui/JsonLd";
import { ComfortMeter } from "@/components/sections/TreatmentExplorer";
import { FinalCta } from "@/components/sections/FinalCta";
import { ReviewCard } from "@/components/sections/ReviewsSection";
import { comfortLabels, getService, services } from "@/content/services";
import { reviews } from "@/content/reviews";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, graph, serviceSchema, webPageSchema } from "@/lib/schema";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return buildMetadata({
    title: `${s.name} in Uptown Dallas`,
    description: `${s.summary} ${s.price}.`.slice(0, 300),
    path: `/services/${s.slug}`,
    eyebrow: s.name,
    keywords: s.keywords,
  });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
  const related = s.related.map((r) => getService(r)!).filter(Boolean);
  const reviewFor: Record<string, string> = {
    "general-family-dentistry": "Crown",
    "cleanings-exams": "Cleaning",
    "cosmetic-dentistry": "Porcelain veneers",
    "teeth-whitening": "Teeth whitening",
    "porcelain-veneers": "Porcelain veneers",
    "clear-aligners": "Clear aligners",
    "dental-implants": "Dental implant",
    "emergency-dentistry": "Emergency visit",
    "sedation-dentistry": "Sedation dentistry",
    "kids-dentistry": "Kids' dentistry",
  };
  const review = reviews.find((r) => r.treatment === reviewFor[s.slug]) ?? reviews[0];
  const path = `/services/${s.slug}`;

  return (
    <article>
        {/* Hero: the card's image and title morph into place from the explorer. */}
        <section className="relative pt-[calc(var(--header-h)+2rem)] pb-16 md:pt-[calc(var(--header-h)+3rem)]">
          <div className="container-x grid items-end gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
            <div>
              <Breadcrumbs
                items={[
                  { name: "Treatments", path: "/services" },
                  { name: s.name, path },
                ]}
                className="anim-fade"
              />
              <ViewTransition name={`svc-title-${s.slug}`} share="morph" default="none">
                <h1 className="display h-lg mt-10 w-fit max-w-[14ch]">{s.name}</h1>
              </ViewTransition>
              <p className="lede anim-fade mt-7 max-w-[36rem]" style={{ "--d": "0.2s" } as React.CSSProperties}>
                {s.tagline} {s.summary}
              </p>
              <dl className="anim-fade mt-10 grid max-w-xl grid-cols-2 gap-6 border-t border-line pt-7 sm:grid-cols-3" style={{ "--d": "0.35s" } as React.CSSProperties}>
                <div>
                  <dt className="eyebrow text-ink-soft">Time</dt>
                  <dd className="mt-2 font-semibold">{s.duration}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-ink-soft">Comfort</dt>
                  <dd className="mt-2 font-semibold">
                    <ComfortMeter level={s.comfort} label={comfortLabels[s.comfort]} />
                  </dd>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <dt className="eyebrow text-ink-soft">Price</dt>
                  <dd className="mt-2 font-semibold">{s.price}</dd>
                </div>
              </dl>
              <div className="anim-fade mt-10 flex flex-wrap gap-3" style={{ "--d": "0.5s" } as React.CSSProperties}>
                <Button href={`/book?treatment=${s.slug}`} icon={<Arrow />}>
                  Book a visit
                </Button>
                <Button href={site.phoneHref} variant="ghost" icon={<PhoneIcon />}>
                  {site.phone}
                </Button>
              </div>
            </div>
            <ViewTransition name={`svc-img-${s.slug}`} share="morph" default="none">
              <div className="arch relative aspect-[4/5] w-full bg-linen">
                <Image
                  src={s.image.src}
                  alt={s.image.alt}
                  fill
                  preload
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  placeholder="blur"
                  blurDataURL={s.image.blur}
                  className="object-cover"
                />
              </div>
            </ViewTransition>
          </div>
        </section>

        {/* What it is */}
        <section aria-labelledby="about-title" className="py-20 md:py-32">
          <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
            <div>
              <p className="eyebrow text-sage">What it is</p>
              <SplitReveal id="about-title" className="display h-md mt-6">
                The short version, <em>in plain English.</em>
              </SplitReveal>
            </div>
            <Reveal className="space-y-6 text-[1.15rem] leading-relaxed text-ink-soft">
              {s.intro.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
              <p className="rounded-2xl bg-mist-soft p-5 text-[1rem] text-ink">
                <strong className="font-semibold">Comfort note:</strong> {s.comfortNote}
              </p>
              <p className="text-[0.95rem]">
                <strong className="font-semibold text-ink">Insurance:</strong> {s.insurance}{" "}
                <Link href="/insurance-financing" className="font-semibold text-sage-deep underline underline-offset-4">
                  Check your plan
                </Link>
              </p>
            </Reveal>
          </div>
        </section>

        {/* Who it's for + image */}
        <section aria-labelledby="for-title" className="bg-shell py-20 md:py-32">
          <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
            <Parallax className="arch aspect-[4/5] w-full max-w-xl" amount={12}>
              <div className="absolute inset-0">
                <Photo image={s.detailImage} sizes="(min-width: 1024px) 40vw, 100vw" />
              </div>
            </Parallax>
            <div>
              <p className="eyebrow text-sage">Is it right for you?</p>
              <SplitReveal id="for-title" className="display h-md mt-6">
                You might love this if…
              </SplitReveal>
              <Reveal as="ul" stagger={0.1} className="mt-10 border-t border-line">
                {s.forYou.map((f) => (
                  <li key={f} className="flex gap-4 border-b border-line py-5 text-[1.08rem]">
                    <span aria-hidden className="mt-1.5 inline-block h-3.5 w-2.5 shrink-0 rounded-t-full bg-sage" />
                    {f}
                  </li>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section aria-labelledby="steps-title" className="py-20 md:py-32">
          <div className="container-x">
            <p className="eyebrow text-sage">What happens</p>
            <SplitReveal id="steps-title" className="display h-md mt-6 max-w-[18ch]">
              Four calm steps, <em>start to finish.</em>
            </SplitReveal>
            <Reveal as="ol" stagger={0.12} className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {s.steps.map((st, i) => (
                <li key={st.title} className="rounded-t-[10rem] rounded-b-3xl bg-shell px-7 pt-16 pb-8 ring-1 ring-line">
                  <span className="display block text-[3.2rem] leading-none text-sage">0{i + 1}</span>
                  <h3 className="display mt-6 text-[1.6rem] leading-tight">{st.title}</h3>
                  <p className="mt-3 text-ink-soft">{st.body}</p>
                </li>
              ))}
            </Reveal>
            <Reveal className="mt-14 rounded-3xl bg-linen p-8 md:p-10">
              <h3 className="eyebrow text-sage">Included</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {s.included.map((inc) => (
                  <li key={inc} className="rounded-full bg-porcelain px-4 py-2 text-[0.95rem] ring-1 ring-line">
                    {inc}
                  </li>
                ))}
              </ul>
              {s.cosmetic && <p className="mt-6 text-[0.9rem] text-ink-soft">Results vary from person to person. We never guarantee a specific cosmetic outcome.</p>}
            </Reveal>
          </div>
        </section>

        {/* Review + FAQ */}
        <section aria-labelledby="svc-faq-title" className="bg-shell py-20 md:py-32">
          <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-24">
            <div>
              <p className="eyebrow text-sage">From a patient</p>
              <Reveal className="mt-6">
                <ReviewCard r={review} className="bg-porcelain" />
              </Reveal>
            </div>
            <div>
              <h2 id="svc-faq-title" className="display h-sm">
                {s.short} questions
              </h2>
              <FaqList items={s.faqs} className="mt-8" />
            </div>
          </div>
        </section>

        {/* Related */}
        <section aria-labelledby="related-title" className="py-20 md:py-32">
          <div className="container-x">
            <h2 id="related-title" className="display h-sm">
              Often paired with
            </h2>
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/services/${r.slug}`} className="group flex items-center gap-5 rounded-3xl bg-shell p-4 ring-1 ring-line transition-shadow hover:ring-ink/30">
                    <span className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-t-full rounded-b-xl">
                      <Photo image={r.image} sizes="96px" alt="" />
                    </span>
                    <span>
                      <span className="display block text-[1.35rem] leading-tight">{r.name}</span>
                      <span className="mt-1 block text-[0.9rem] text-ink-soft">{r.price.split(" · ")[0]}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <FinalCta title={`Ready when you are.`} eyebrow={s.name} />
        <JsonLd
          data={graph(
            webPageSchema({ path, name: `${s.name} in Uptown Dallas`, description: s.summary, type: "MedicalWebPage" }),
            serviceSchema(s),
            faqSchema(s.faqs),
          )}
        />
    </article>
  );
}
