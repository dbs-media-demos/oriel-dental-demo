import { SectionIntro } from "@/components/ui/SectionIntro";
import { Reveal } from "@/components/ui/Reveal";
import { Button, Arrow } from "@/components/ui/Button";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { DAY_NAMES, L, dayRange, weekFromMonday, type Biz } from "@/lib/biz-core";

/** A preview's "visit us": the practice's real address on a Google map, its hours and directions. */
export function PreviewMap({ biz }: { biz: Biz }) {
  const query = [biz.name, biz.address.full].filter(Boolean).join(", ");
  const embed = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
  return (
    <section aria-labelledby="visit-title" className="py-24 md:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div>
          <SectionIntro
            id="visit-title"
            eyebrow={L(biz, "Visit us", "Posetite nas")}
            title={biz.lang === "sr" ? <>Lako <em>do nas.</em></> : <>In the heart <em>of {biz.area}.</em></>}
            size="h-md"
          />
          <Reveal className="mt-8 space-y-6">
            <OpenBadge />
            {biz.address.full && <address className="text-lg not-italic">{biz.address.full}</address>}
            {biz.hours && (
              <dl className="grid max-w-sm grid-cols-[auto_1fr] gap-x-8 gap-y-1.5 text-[0.95rem]">
                {weekFromMonday(biz.hours).map((h) => (
                  <div key={h.day} className="contents">
                    <dt className="text-ink-soft">{DAY_NAMES[biz.lang][h.day]}</dt>
                    <dd className="text-right">{dayRange(h, biz.lang)}</dd>
                  </div>
                ))}
              </dl>
            )}
            <Button href={directions} variant="ghost" icon={<Arrow />}>
              {L(biz, "Get directions", "Kako do nas")}
            </Button>
          </Reveal>
        </div>
        <Reveal>
          <div className="arch relative aspect-[4/5] w-full overflow-hidden bg-shell ring-1 ring-line md:aspect-[5/4]">
            <iframe src={embed} title={L(biz, `Map: ${query}`, `Mapa: ${query}`)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 size-full border-0" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
