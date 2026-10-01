import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { Button, Arrow, PhoneIcon } from "@/components/ui/Button";
import { SplitReveal, Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";
import { defaultBiz } from "@/lib/biz";
import { telOf, type Biz } from "@/lib/biz-core";

/** Closing call to action over a golden-hour leaf-shadow loop. */
export function FinalCta({
  title = "Your calmest dental visit starts here.",
  eyebrow = "New patients welcome",
  biz = defaultBiz,
}: {
  title?: string;
  eyebrow?: string;
  biz?: Biz;
}) {
  return (
    <section aria-labelledby="cta-title" className="px-3 pb-3 md:px-5 md:pb-5">
      <div className="relative isolate overflow-hidden rounded-t-[min(40vw,28rem)] rounded-b-[2rem] bg-sand-soft">
        <AmbientVideo src="/video/golden-hour.mp4" poster="/video/golden-hour.jpg" className="opacity-60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-porcelain/10 via-porcelain/30 to-porcelain/70" />
        <div className="relative container-x flex min-h-[80svh] flex-col items-center justify-center py-28 text-center">
          <Reveal>
            <p className="eyebrow text-sage-deep">{eyebrow}</p>
          </Reveal>
          <SplitReveal id="cta-title" className="display h-lg mt-6 max-w-[15ch]">
            {title}
          </SplitReveal>
          <Reveal delay={0.2}>
            <p className="lede mx-auto mt-6 max-w-[36rem] text-ink">
              <strong className="font-semibold">{site.newPatientOffer.title}:</strong> {site.newPatientOffer.detail}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button href="/book" icon={<Arrow />}>
                Book online
              </Button>
              {biz.phone && (
                <Button href={telOf(biz)!} variant="ghost" icon={<PhoneIcon />} className="bg-porcelain/50">
                  {biz.phoneDisplay}
                </Button>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
