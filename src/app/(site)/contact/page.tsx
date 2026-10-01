import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { AreaMap } from "@/components/sections/AreaMap";
import { JsonLd } from "@/components/ui/JsonLd";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { Reveal } from "@/components/ui/Reveal";
import { site, hours, fmtTime, fullAddress } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { graph, webPageSchema } from "@/lib/schema";

const title = "Contact & Directions";
const description = `Find Oriel Dental Studio at ${fullAddress}. Call ${site.phone}, free validated parking, open evenings and Saturdays. Serving Uptown, Victory Park, Oak Lawn, Turtle Creek and Downtown Dallas.`;

export const metadata = buildMetadata({ title, description, path: "/contact", eyebrow: "Contact" });

const drive = [
  ["Victory Park", "6 min"],
  ["Oak Lawn", "7 min"],
  ["Turtle Creek", "5 min"],
  ["State Thomas", "4 min"],
  ["Highland Park", "10 min"],
  ["Downtown", "8 min"],
];

export default function ContactPage() {
  const mapQuery = encodeURIComponent("Uptown, Dallas, TX");
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Come find us <em className="text-sage">in Uptown.</em>
          </>
        }
        lede="Second floor on Linden Row, half a block from the M-Line trolley, with free validated parking downstairs."
        crumbs={[{ name: "Contact", path: "/contact" }]}
      />

      <section aria-label="Contact details" className="pb-20 md:pb-28">
        <div className="container-x grid gap-6 md:grid-cols-3">
          <Reveal className="rounded-3xl bg-shell p-8 ring-1 ring-line">
            <h2 className="eyebrow text-sage">Call or text</h2>
            <a href={site.phoneHref} className="display mt-4 block text-[2rem]">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="link-underline mt-2 inline-block text-ink-soft">
              {site.email}
            </a>
            <div className="mt-5">
              <OpenBadge />
            </div>
          </Reveal>
          <Reveal className="rounded-3xl bg-shell p-8 ring-1 ring-line" delay={0.1}>
            <h2 className="eyebrow text-sage">Address</h2>
            <address className="mt-4 text-[1.2rem] not-italic">
              {site.address.street}
              <br />
              {site.address.city}, {site.address.region} {site.address.postal}
            </address>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              className="link-underline mt-4 inline-block font-semibold text-sage-deep"
              rel="noopener"
              target="_blank"
            >
              Open in Google Maps ↗
            </a>
            <p className="mt-4 text-[0.95rem] text-ink-soft">{site.parking}</p>
          </Reveal>
          <Reveal className="rounded-3xl bg-shell p-8 ring-1 ring-line" delay={0.2}>
            <h2 className="eyebrow text-sage">Hours</h2>
            <dl className="mt-4 space-y-1.5 text-[0.98rem]">
              {hours.map((h) => (
                <div key={h.day} className="flex justify-between gap-4">
                  <dt className="text-ink-soft">{h.label}</dt>
                  <dd>{h.open != null && h.close != null ? `${fmtTime(h.open)} – ${fmtTime(h.close)}` : "Closed"}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="area-title" className="bg-shell py-20 md:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <div>
            <p className="eyebrow text-sage">Service area</p>
            <h2 id="area-title" className="display h-md mt-6">
              Minutes from <em>most of central Dallas.</em>
            </h2>
            <ul className="mt-10 border-t border-line">
              {drive.map(([n, t]) => (
                <li key={n} className="flex justify-between border-b border-line py-4">
                  <span>{n}</span>
                  <span className="text-ink-soft">{t} drive</span>
                </li>
              ))}
            </ul>
          </div>
          <AreaMap />
        </div>
      </section>

      <section aria-label="Contact form" className="py-20 md:py-32">
        <div className="container-x max-w-4xl">
          <ContactForm />
        </div>
      </section>

      <JsonLd data={graph(webPageSchema({ path: "/contact", name: title, description, type: "ContactPage" }))} />
    </>
  );
}
