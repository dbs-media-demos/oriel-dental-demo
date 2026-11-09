"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useDesktopGSAP, prefersReducedMotion } from "@/lib/motion";
import { Photo } from "@/components/ui/Photo";
import { HeroRoom, HeroCameo, heroArch, HERO_PROGRESS } from "@/components/sections/HeroRoom";
import { Button, PhoneIcon, Arrow } from "@/components/ui/Button";
import { OpenBadge } from "@/components/ui/OpenBadge";
import type { Img } from "@/content/images";
import { useBiz, useT } from "@/components/preview/BizContext";
import { heroLede } from "@/content/site";
import { num, telOf, townOf } from "@/lib/biz-core";
import { doctors } from "@/content/team";

// Phones only (the `phone` variant): everything wider shows the 3D room instead, and asks for a 1px copy
/** Each doctor's face, zoomed into a 40px circle (the portraits are framed loosely). */
const FACE: Record<string, React.CSSProperties> = {
  "elena-marsh": { objectPosition: "58% 40%", transform: "scale(2.6)", transformOrigin: "58% 46%" },
  "julian-ashford": { objectPosition: "50% 22%", transform: "scale(1.9)", transformOrigin: "52% 32%" },
  "sofia-delgado": { objectPosition: "50% 18%", transform: "scale(2.1)", transformOrigin: "52% 26%" },
};

const PHONE_PHOTO_SIZES ="(max-width: 767.98px) 100vw, (hover: none) and (max-width: 1023.98px) 100vw, (pointer: coarse) and (max-width: 1023.98px) 100vw, 1px";

/**
 * The arched window. On desktop it looks into a sunlit room where a porcelain molar turns above a
 * travertine plinth (HeroRoom: a still in the HTML, live three.js after load on big screens with a
 * mouse). Shutters open it on the first frame; on scroll GSAP widens the arch until the room fills the
 * screen and the sun sinks. On phones it's a stacked first screen: the studio photo with a small still
 * of the tooth, the service and town, the rating, plans and a Call button with the number, painted whole.
 */
export function HomeHero({ image }: { image: Img }) {
  const biz = useBiz();
  const t = useT();
  const sr = biz.lang === "sr";
  const town = townOf(biz);
  const root = useRef<HTMLElement>(null);

  useDesktopGSAP(
    ({ gsap }) => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      const frame = el.querySelector<HTMLElement>("[data-frame]")!;
      const copy = el.querySelector<HTMLElement>("[data-copy]")!;
      const veil = el.querySelector<HTMLElement>("[data-veil]")!;
      const statement = el.querySelector<HTMLElement>("[data-statement]")!;

      const clip = (a: { t: number; r: number; b: number; l: number; rad: number }) =>
        `inset(${a.t}px ${a.r}px ${a.b}px ${a.l}px round ${a.rad}px ${a.rad}px 0px 0px)`;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true },
        // The 3D room follows the same smoothed progress: its camera, its sun and the part it draws
        onUpdate: () => window.dispatchEvent(new CustomEvent(HERO_PROGRESS, { detail: tl.progress() })),
      });
      tl.fromTo(frame, { clipPath: () => clip(heroArch()) }, { clipPath: "inset(0px 0px 0px 0px round 0px 0px 0px 0px)", duration: 1 }, 0)
        .fromTo(copy, { opacity: 1, y: 0 }, { opacity: 0, y: -90, duration: 0.45 }, 0)
        .fromTo(veil, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.55)
        .fromTo(statement, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35 }, 0.62);
    },
    { scope: root },
  );

  return (
    <section ref={root} data-hero aria-labelledby="hero-title" className="relative h-[175svh] motion-reduce:h-svh md:h-[210vh] still:h-svh phone:h-auto">
      <div className="hero-stage sticky top-0 h-svh overflow-hidden">
        {/* The window */}
        <div data-frame className="hero-frame absolute inset-0 will-change-[clip-path]">
          {/* Desktop: the sunlit room with the porcelain tooth */}
          <HeroRoom className="phone:hidden" />
          {/* Phones: the studio, and the same tooth in a small arch */}
          <div className="absolute inset-0 hidden phone:block">
            <Photo image={image} sizes={PHONE_PHOTO_SIZES} preload quality={75} position="36% 40%" />
            <HeroCameo className="absolute right-3 bottom-3 aspect-[300/380] h-[clamp(4.5rem,34%,6.75rem)] overflow-hidden rounded-t-full shadow-[0_10px_24px_-10px_rgb(30_41_38/0.5)] ring-2 ring-porcelain/90" />
          </div>
          <div aria-hidden className="shutters hero-shutters">
            <span />
            <span />
          </div>
          <div data-veil className="absolute inset-0 bg-gradient-to-r from-porcelain/70 via-porcelain/25 to-transparent opacity-0 phone:hidden" />
          <div data-statement className="absolute inset-x-0 bottom-[13svh] opacity-0 phone:hidden">
            <p className="display container-x text-[clamp(2.4rem,5.4vw,5.8rem)] text-ink">
              <span className="block max-w-[13ch]">
                {t("Soft light. Unhurried hands.")} <em className="text-sage">{t("Honest prices.")}</em>
              </span>
            </p>
          </div>
        </div>

        {/* Copy: on the first frame as it is, nothing faded in */}
        <div
          data-copy
          className="hero-copy relative z-10 flex h-full flex-col justify-end pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:justify-center md:pt-[var(--header-h)] md:pb-0"
        >
          <div className="container-x">
            <div className="hero-text md:max-w-[48%]">
              <div
                className={clsx("hero-badge anim-fade flex flex-wrap items-center gap-3 phone:mb-2.5", biz.hours ? "min-h-[2.125rem] phone:min-h-[1.875rem]" : "phone:hidden")}
                style={{ "--d": "0.1s" } as React.CSSProperties}
              >
                <OpenBadge className="phone:whitespace-nowrap" />
                <span className="eyebrow hidden text-ink-soft sm:inline phone:hidden">{biz.preview ? biz.area : "Uptown Dallas"}</span>
              </div>
              <h1 id="hero-title" className="display mt-5 text-[clamp(3.1rem,6.2vw,7.2rem)] text-ink md:mt-6 phone:mt-0 phone:text-[clamp(2.25rem,10.6vw,2.75rem)] phone:text-balance">
                {/* Phones: the service and the town are the headline */}
                <span className="hidden phone:block">
                  {sr ? `Stomatološka ordinacija, ${town}.` : `Dentistry in ${town},`}
                  {biz.tagline ? <em className="mt-1 block text-[0.6em] text-sage">{biz.tagline}</em> : !sr && <em className="block text-sage">in a better light.</em>}
                </span>
                {biz.tagline ? (
                  <span className="block phone:hidden">{biz.tagline}</span>
                ) : (
                  <>
                    <span className="block phone:hidden">{t("Dentistry,")}</span>
                    <span className="block phone:hidden">
                      {t("in a")} <em className="text-sage">{t("better light.")}</em>
                    </span>
                  </>
                )}
              </h1>
              <p className="lede mt-5 hidden max-w-[34rem] sm:block md:mt-7 phone:hidden">{t(heroLede)}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3 md:mt-9 phone:order-1 phone:mt-3">
                <Button href="/book" icon={<Arrow />} className={biz.phone ? "phone:hidden" : "phone:w-full"}>
                  {t("Book your first visit")}
                </Button>
                {biz.phone && (
                  <Button href={telOf(biz)!} variant="ghost" icon={<PhoneIcon />} className="hidden sm:inline-flex phone:inline-flex phone:w-full phone:border-sage phone:bg-sage phone:text-porcelain">
                    <span className="hidden phone:inline">{t("Call")}</span> {biz.phoneDisplay}
                  </Button>
                )}
              </div>
              {(biz.rating || !sr) && (
                <div className="mt-7 grid max-w-[40rem] gap-3.5 border-t border-line pt-6 text-[0.95rem] text-ink-soft md:mt-9 phone:mt-2 phone:gap-1 phone:border-0 phone:pt-0 phone:text-[0.875rem]">
                  {biz.rating && (
                    <div className="flex items-center gap-4">
                      {/* Your doctors (the concept practice's own; a preview has its own team) */}
                      {!biz.preview && (
                        <Link href="/team" aria-label={`Meet ${doctors.map((d) => d.name).join(", ")}`} className="group flex shrink-0 phone:hidden">
                          {doctors.map((d, i) => (
                            <span
                              key={d.slug}
                              className="relative -ml-2.5 size-10 overflow-hidden rounded-full bg-linen ring-2 ring-porcelain transition-transform duration-500 ease-[var(--ease-soft)] first:ml-0 group-hover:-translate-y-1"
                              style={{ transitionDelay: `${i * 60}ms` }}
                            >
                              <Image src={d.image.src} alt="" fill sizes="96px" quality={60} className="object-cover" style={FACE[d.slug]} />
                            </span>
                          ))}
                        </Link>
                      )}
                      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 phone:gap-2">
                        <span className="tracking-[0.2em] text-sage phone:tracking-[0.1em] phone:text-[#c98f1f]" aria-hidden>
                          ★★★★★
                        </span>
                        <span>
                          <strong className="font-semibold text-ink">{num(biz, biz.rating.value)}</strong>{" "}
                          {sr ? `· ${biz.rating.count} Google recenzija` : `from ${biz.rating.count} Google reviews`}
                        </span>
                        {!biz.preview && (
                          <>
                            <span className="hidden text-ink/30 lg:inline" aria-hidden>
                              ·
                            </span>
                            <span className="hidden lg:inline">Se habla español</span>
                          </>
                        )}
                      </p>
                    </div>
                  )}
                  {/* Plans accepted (US): what a new patient checks first. Serbian pages have no US plans. */}
                  {!sr && (
                    <p className="leading-snug">
                      In network with <strong className="font-semibold text-ink">{biz.preview ? "most PPO plans" : "Delta Dental, Cigna, MetLife, Aetna"}</strong>
                      {biz.preview ? ", and we file the claim for you." : " and most PPO plans."}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
