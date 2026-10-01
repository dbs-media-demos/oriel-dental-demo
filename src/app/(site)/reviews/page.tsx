import { PageHero } from "@/components/ui/PageHero";
import { img } from "@/content/images";
import { RatingSummary, ReviewCard } from "@/components/sections/ReviewsSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { Button, Arrow } from "@/components/ui/Button";
import { reviews } from "@/content/reviews";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { graph, practiceId, webPageSchema } from "@/lib/schema";

const title = "Patient Reviews";
const description = `Rated ${site.rating.value}★ from ${site.rating.count} Google reviews. Read what patients from Uptown, Oak Lawn, Victory Park and across Dallas say about Oriel Dental Studio.`;

export const metadata = buildMetadata({ title, description, path: "/reviews", eyebrow: `${site.rating.value}★ on Google` });

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Reviews"
        title={
          <>
            {site.rating.count} reviews, <em className="text-sage">one theme: calm.</em>
          </>
        }
        lede="Nervous patients, busy parents, emergency Saturday mornings. Here's what people say after their visit."
        crumbs={[{ name: "Reviews", path: "/reviews" }]}
        image={img.smileDenim}
      >
        <Button href="/book" icon={<Arrow />}>
          Book your visit
        </Button>
      </PageHero>

      <section aria-label="All reviews" className="pb-24 md:pb-36">
        <div className="container-x grid gap-8 lg:grid-cols-[22rem_1fr] lg:gap-12">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <RatingSummary />
            <p className="mt-4 px-2 text-[0.85rem] text-ink-soft">Reviews shown are from a fictional demo practice.</p>
          </div>
          <Reveal as="ul" stagger={0.08} className="columns-1 gap-6 md:columns-2 [&>li]:mb-6 [&>li]:break-inside-avoid">
            {reviews.map((r) => (
              <li key={r.name}>
                <ReviewCard r={r} />
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <FinalCta title="Be our next five-star story." />
      <JsonLd
        data={graph(webPageSchema({ path: "/reviews", name: title, description }), {
          "@id": practiceId,
          "@type": "Dentist",
          review: reviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.name },
            datePublished: r.date,
            reviewBody: r.text,
            reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
          })),
        })}
      />
    </>
  );
}
