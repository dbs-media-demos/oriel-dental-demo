import { ScrubWords, Parallax, Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { Photo } from "@/components/ui/Photo";
import { img } from "@/content/images";
import { site } from "@/content/site";
import { defaultBiz } from "@/lib/biz";
import { L, openDays, type Biz } from "@/lib/biz-core";

type Stat = { value: number; decimals?: number; suffix?: string; prefix?: string; label: string };

const conceptStats: Stat[] = [
  { value: site.rating.value, decimals: 1, suffix: "★", label: `Average from ${site.rating.count} Google reviews` },
  { value: 60, suffix: " min", label: "Cleanings are a full hour, never rushed" },
  { value: 12, suffix: "", label: "Years of calm dentistry in Uptown" },
  { value: 0, prefix: "$", label: "Surprise bills. Prices come before treatment" },
];

/** A preview states only what's true of the real practice (its rating and opening days). */
function previewStats(biz: Biz): Stat[] {
  const days = openDays(biz);
  return [
    ...(biz.rating ? [{ value: biz.rating.value, decimals: 1, suffix: "★", label: L(biz, `Average from ${biz.rating.count} Google reviews`, `Prosek iz ${biz.rating.count} Google recenzija`) }] : []),
    { value: 60, suffix: " min", label: "Cleanings are a full hour, never rushed" },
    ...(days ? [{ value: days, suffix: "", label: L(biz, "Days a week we're open for you", "Dana nedeljno radimo za vas") }] : []),
    { value: 0, prefix: biz.lang === "sr" ? "" : "$", suffix: biz.lang === "sr" ? " din" : "", label: "Surprise bills. Prices come before treatment" },
  ];
}

const introText = {
  en: (name: string) =>
    `We built ${name} for people who'd rather be anywhere but the dentist. Rooms full of daylight, appointments that never feel rushed, a stop signal that's always honored, and a clear plan with prices before anything happens.`,
  sr: () =>
    "Ovu ordinaciju smo napravili za ljude koji bi radije bili bilo gde nego kod zubara. Prostorije pune dnevnog svetla, termini bez žurbe, znak za pauzu koji uvek poštujemo i jasan plan sa cenama pre nego što bilo šta počne.",
};

export function Intro({ biz = defaultBiz }: { biz?: Biz }) {
  const stats = biz.preview ? previewStats(biz) : conceptStats;
  const name = biz.preview ? biz.shortName : "Oriel";
  return (
    <section aria-labelledby="intro-title" className="relative py-28 md:py-44">
      <div className="container-x grid items-start gap-16 lg:grid-cols-[1fr_1.35fr] lg:gap-24">
        <div className="relative hidden h-[44rem] lg:block">
          <Parallax className="arch absolute top-0 left-0 aspect-[3/4] w-[62%]" amount={14}>
            <div className="absolute inset-0">
              <Photo image={img.lightLeaves} sizes="24vw" />
            </div>
          </Parallax>
          <Parallax className="arch absolute right-0 bottom-0 aspect-[3/4] w-[52%] ring-8 ring-porcelain" amount={18}>
            <div className="absolute inset-0">
              <Photo image={img.receptionArches} sizes="20vw" />
            </div>
          </Parallax>
        </div>

        <div>
          <p className="eyebrow text-sage">{L(biz, `Why ${name}`, "Zašto mi")}</p>
          <h2 id="intro-title" className="sr-only">
            {L(biz, `Why patients choose ${biz.preview ? biz.name : "Oriel Dental Studio"}`, `Zašto pacijenti biraju ${biz.name}`)}
          </h2>
          {/* ScrubWords splits words while rendering, so the Serbian is written here, not translated later */}
          <ScrubWords className="display mt-8 text-[clamp(1.9rem,3.6vw,3.4rem)] leading-[1.12]" text={biz.lang === "sr" ? introText.sr() : introText.en(name)} />
          <Reveal as="dl" stagger={0.12} className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12 border-t border-line pt-12">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="display block text-[clamp(2.6rem,5vw,4.5rem)] text-sage">
                    <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} prefix={s.prefix} />
                  </span>
                  <span className="mt-2 block max-w-[22ch] text-[0.95rem] text-ink-soft">{s.label}</span>
                </dd>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
