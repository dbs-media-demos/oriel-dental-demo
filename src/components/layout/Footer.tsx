import Link from "next/link";
import { Mark } from "@/components/brand/Logo";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { footerNav, site } from "@/content/site";
import { services } from "@/content/services";
import { defaultBiz } from "@/lib/biz";
import { DAY_NAMES, dayRange, telOf, weekFromMonday, type Biz } from "@/lib/biz-core";

export function Footer({ biz = defaultBiz }: { biz?: Biz }) {
  return (
    <footer className="relative overflow-hidden bg-night pb-28 text-porcelain md:pb-10">
      <div className="container-x pt-24 md:pt-32">
        <div className="grid gap-16 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="eyebrow text-mist">{biz.preview ? `${biz.name} · ${biz.area}` : "Oriel Dental Studio · Uptown Dallas"}</p>
            <p className="display mt-6 max-w-[14ch] text-[clamp(2.6rem,6vw,5.6rem)]">
              Dentistry, in a <em className="text-glow">better light.</em>
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/book" className="inline-flex min-h-12 items-center rounded-full bg-porcelain px-6 font-semibold text-ink transition-colors hover:bg-white">
                Book a visit
              </Link>
              <a href={telOf(biz)} className="inline-flex min-h-12 items-center rounded-full border border-porcelain/30 px-6 font-semibold transition-colors hover:border-porcelain">
                {biz.phoneDisplay}
              </a>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <h2 className="eyebrow text-mist">Find us</h2>
              <address className="mt-4 not-italic leading-relaxed text-porcelain/80">
                {biz.preview ? (
                  biz.address.full
                ) : (
                  <>
                    {site.address.street}
                    <br />
                    {site.address.city}, {site.address.region} {site.address.postal}
                  </>
                )}
              </address>
              {!biz.preview && (
                <a href={`mailto:${site.email}`} className="link-underline mt-3 inline-block text-porcelain/80 hover:text-porcelain">
                  {site.email}
                </a>
              )}
              <div className="mt-5">
                <OpenBadge tone="dark" />
              </div>
            </div>
            <div>
              <h2 className="eyebrow text-mist">Hours</h2>
              <dl className="mt-4 space-y-1.5 text-[0.95rem] text-porcelain/80">
                {weekFromMonday(biz.hours ?? []).map((h) => (
                  <div key={h.day} className="flex justify-between gap-4">
                    <dt>{DAY_NAMES[biz.lang][h.day].slice(0, 3)}</dt>
                    <dd>{dayRange(h, biz.lang)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-10 border-t border-porcelain/15 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          <nav aria-label="Treatments">
            <h2 className="eyebrow text-mist">Treatments</h2>
            <ul className="mt-4 space-y-2">
              {services.slice(0, 5).map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="link-underline text-porcelain/75 hover:text-porcelain">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="More treatments">
            <h2 className="eyebrow text-mist">&nbsp;</h2>
            <ul className="mt-4 space-y-2">
              {services.slice(5).map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="link-underline text-porcelain/75 hover:text-porcelain">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="eyebrow text-mist">{group.title}</h2>
              <ul className="mt-4 space-y-2">
                {group.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link-underline text-porcelain/75 hover:text-porcelain">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-porcelain/15 pt-8 text-[0.85rem] text-porcelain/60 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Mark className="h-7 w-auto text-porcelain" />
            <span>
              {biz.preview
                ? `© ${new Date().getFullYear()} ${biz.name}. ${biz.lang === "sr" ? `Pregled početne strane napravljen za ${biz.name}.` : `A preview homepage made for ${biz.name}.`}`
                : `© ${new Date().getFullYear()} Oriel Dental Studio, PLLC. A fictional practice.`}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/privacy" className="hover:text-porcelain">
              Privacy & HIPAA
            </Link>
            {!biz.preview && <span>Se habla español</span>}
            <a href={site.agencyUrl} className="hover:text-porcelain">
              Design & development: Scale by Noon
            </a>
          </div>
        </div>
      </div>

      {/* Giant wordmark rising from the bottom edge */}
      <svg aria-hidden viewBox="0 0 1000 260" className="pointer-events-none mt-10 block w-full select-none" preserveAspectRatio="xMidYMax meet">
        <text x="500" y="250" textAnchor="middle" fontSize="330" fill="currentColor" opacity="0.06" style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}>
          {biz.preview ? biz.shortName : "Oriel"}
        </text>
      </svg>
      <span className="sr-only">{biz.address.full}</span>
    </footer>
  );
}
