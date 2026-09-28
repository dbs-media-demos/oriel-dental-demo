import { Suspense } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { BookingForm } from "@/components/forms/BookingForm";
import { JsonLd } from "@/components/ui/JsonLd";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { PhoneIcon } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { img } from "@/content/images";
import { site, absoluteUrl } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { graph, practiceId, webPageSchema } from "@/lib/schema";

const title = "Book an Appointment Online";
const description =
  "Book your visit at Oriel Dental Studio in Uptown Dallas in about a minute: new-patient visits, cleanings, same-day emergencies, cosmetic and implant consults. Evenings and Saturdays available.";

export const metadata = buildMetadata({ title, description, path: "/book", eyebrow: "Book online" });

function FormSkeleton() {
  return <div className="h-[36rem] animate-pulse rounded-[2rem] bg-shell ring-1 ring-line" aria-hidden />;
}

export default function BookPage() {
  return (
    <>
      <PageHero
        eyebrow="Book a visit"
        title={
          <>
            Book in about <em className="text-sage">a minute.</em>
          </>
        }
        lede="Pick a reason, a time and your comforts. We'll text to confirm, and your forms will be ready on your phone."
        crumbs={[{ name: "Book", path: "/book" }]}
      />

      <section aria-label="Booking form" className="pb-28 md:pb-40">
        <div className="container-x grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
          <Suspense fallback={<FormSkeleton />}>
            <BookingForm />
          </Suspense>
          <aside className="space-y-6 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <div className="arch relative hidden aspect-[4/5] lg:block">
              <Photo image={img.receptionArches} sizes="30vw" />
            </div>
            <div className="rounded-3xl bg-shell p-7 ring-1 ring-line">
              <h2 className="eyebrow text-sage">Rather talk?</h2>
              <a href={site.phoneHref} className="display mt-3 flex items-center gap-3 text-[1.9rem]">
                <PhoneIcon className="size-6" />
                {site.phone}
              </a>
              <div className="mt-4">
                <OpenBadge />
              </div>
              <p className="mt-4 text-[0.95rem] text-ink-soft">
                In pain right now? Call us. We hold same-day emergency slots every weekday and Saturday morning. Se habla español.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <JsonLd
        data={graph(webPageSchema({ path: "/book", name: title, description }), {
          "@type": "ReserveAction",
          target: { "@type": "EntryPoint", urlTemplate: absoluteUrl("/book"), actionPlatform: "https://schema.org/DesktopWebPlatform" },
          object: { "@id": practiceId },
          name: "Book an appointment",
        })}
      />
    </>
  );
}
