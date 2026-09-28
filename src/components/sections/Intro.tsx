import { ScrubWords, Parallax, Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { Photo } from "@/components/ui/Photo";
import { img } from "@/content/images";
import { site } from "@/content/site";

const stats = [
  { value: site.rating.value, decimals: 1, suffix: "★", label: `Average from ${site.rating.count} Google reviews` },
  { value: 60, suffix: " min", label: "Cleanings are a full hour, never rushed" },
  { value: 12, suffix: "", label: "Years of calm dentistry in Uptown" },
  { value: 0, prefix: "$", label: "Surprise bills. Prices come before treatment" },
];

export function Intro() {
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
          <p className="eyebrow text-sage">Why Oriel</p>
          <h2 id="intro-title" className="sr-only">
            Why patients choose Oriel Dental Studio
          </h2>
          <ScrubWords
            className="display mt-8 text-[clamp(1.9rem,3.6vw,3.4rem)] leading-[1.12]"
            text="We built Oriel for people who'd rather be anywhere but the dentist. Rooms full of daylight, appointments that never feel rushed, a stop signal that's always honored, and a clear plan with prices before anything happens."
          />
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
