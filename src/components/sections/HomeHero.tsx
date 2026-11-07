"use client";

import dynamic from "next/dynamic";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useDesktopGSAP, isStill, prefersReducedMotion } from "@/lib/motion";
import { Photo } from "@/components/ui/Photo";
import { Button, PhoneIcon, Arrow } from "@/components/ui/Button";
import { OpenBadge } from "@/components/ui/OpenBadge";
import type { Img } from "@/content/images";
import { useBiz, useT } from "@/components/preview/BizContext";
import { heroLede } from "@/content/site";
import { num, telOf, townOf } from "@/lib/biz-core";

// The shader never reaches a phone: they get the sharp still.
const DappledLight = dynamic(() => import("@/components/fx/DappledLight").then((m) => m.DappledLight), { ssr: false });

/**
 * The arched window. CSS paints it on first frame (and opens it from a slit); on scroll,
 * GSAP widens the arch until the studio fills the screen. On phones it's a stacked first screen:
 * the photo, the service and town, the rating and a Call button with the number, painted whole.
 */
export function HomeHero({ image }: { image: Img }) {
  const biz = useBiz();
  const t = useT();
  const sr = biz.lang === "sr";
  const town = townOf(biz);
  const root = useRef<HTMLElement>(null);
  const [light, setLight] = useState(false);

  useEffect(() => {
    if (isStill()) return;
    const id = window.requestAnimationFrame(() => setLight(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  useDesktopGSAP(
    ({ gsap }) => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      const frame = el.querySelector<HTMLElement>("[data-frame]")!;
      const photo = el.querySelector<HTMLElement>("[data-photo]")!;
      const copy = el.querySelector<HTMLElement>("[data-copy]")!;
      const veil = el.querySelector<HTMLElement>("[data-veil]")!;
      const statement = el.querySelector<HTMLElement>("[data-statement]")!;

      // Same geometry as the CSS custom properties on .hero-frame, in px.
      const arch = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        if (w >= 768) {
          const l = w * 0.52;
          const r = w * 0.05;
          return { t: h * 0.14, r, b: h * 0.06, l, rad: (w - l - r) / 2 };
        }
        const side = w * 0.05;
        return { t: 84, r: side, b: h * 0.5, l: side, rad: (w - side * 2) / 2 };
      };
      const clip = (a: { t: number; r: number; b: number; l: number; rad: number }) =>
        `inset(${a.t}px ${a.r}px ${a.b}px ${a.l}px round ${a.rad}px ${a.rad}px 0px 0px)`;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true },
      });
      tl.fromTo(frame, { clipPath: () => clip(arch()) }, { clipPath: "inset(0px 0px 0px 0px round 0px 0px 0px 0px)", duration: 1 }, 0)
        .fromTo(photo, { scale: 1.12 }, { scale: 1, duration: 1 }, 0)
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
          <div data-photo className="absolute inset-0 will-change-transform">
            <div className="anim-settle absolute inset-0">
              <Photo image={image} sizes="(min-width: 768px) 100vw, 100vw" preload quality={75} position="36% 40%" />
            </div>
          </div>
          {light && <DappledLight />}
          <div aria-hidden className="shutters hero-shutters">
            <span />
            <span />
          </div>
          <div data-veil className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/45 to-night/25 opacity-0 phone:hidden" />
          <div data-statement className="absolute inset-x-0 bottom-[16svh] px-[var(--gutter)] text-center text-porcelain opacity-0 [text-shadow:0_2px_30px_rgb(0_0_0/0.35)] phone:hidden">
            <p className="display mx-auto max-w-[16ch] text-[clamp(2.4rem,6.5vw,6.5rem)]">
              {t("Soft light. Unhurried hands.")} <em className="text-glow">{t("Honest prices.")}</em>
            </p>
          </div>
        </div>

        {/* Copy */}
        <div
          data-copy
          className="hero-copy relative z-10 flex h-full flex-col justify-end pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:justify-center md:pt-[var(--header-h)] md:pb-0"
        >
          <div className="container-x">
            <div className="hero-text md:max-w-[48%]">
              <div className={clsx("hero-badge anim-fade flex flex-wrap items-center gap-3 phone:mb-2.5", biz.hours ? "phone:min-h-[1.875rem]" : "phone:hidden")} style={{ "--d": "0.1s" } as React.CSSProperties}>
                <OpenBadge className="phone:whitespace-nowrap" />
                <span className="eyebrow hidden text-ink-soft sm:inline phone:hidden">{biz.preview ? biz.area : "Uptown Dallas"}</span>
              </div>
              <h1 id="hero-title" className="display mt-5 text-[clamp(3.1rem,6.5vw,7.6rem)] text-ink md:mt-7 phone:mt-0 phone:text-[clamp(2.25rem,10.6vw,2.75rem)] phone:text-balance">
                {/* Phones: the service and the town are the headline */}
                <span className="hidden phone:block">
                  {sr ? `Stomatološka ordinacija, ${town}.` : `Dentistry in ${town},`}
                  {biz.tagline ? (
                    <em className="mt-1 block text-[0.6em] text-sage">{biz.tagline}</em>
                  ) : (
                    !sr && <em className="block text-sage">in a better light.</em>
                  )}
                </span>
                {biz.tagline ? (
                  <span className="anim-heading block phone:hidden" style={{ "--d": "0.2s" } as React.CSSProperties}>
                    {biz.tagline}
                  </span>
                ) : (
                  <>
                    <span className="anim-heading block phone:hidden" style={{ "--d": "0.2s" } as React.CSSProperties}>
                      {t("Dentistry,")}
                    </span>
                    <span className="anim-heading block phone:hidden" style={{ "--d": "0.35s" } as React.CSSProperties}>
                      {t("in a")} <em className="text-sage">{t("better light.")}</em>
                    </span>
                  </>
                )}
              </h1>
              <p className="anim-fade lede mt-5 hidden max-w-[34rem] sm:block md:mt-8 phone:hidden" style={{ "--d": "0.6s" } as React.CSSProperties}>
                {t(heroLede)}
              </p>
              <div className="anim-fade mt-6 flex flex-wrap items-center gap-3 md:mt-10 phone:order-1 phone:mt-3" style={{ "--d": "0.75s" } as React.CSSProperties}>
                <Button href="/book" icon={<Arrow />} className={biz.phone ? "phone:hidden" : "phone:w-full"}>
                  {t("Book your first visit")}
                </Button>
                {biz.phone && (
                  <Button href={telOf(biz)!} variant="ghost" icon={<PhoneIcon />} className="hidden sm:inline-flex phone:inline-flex phone:w-full phone:border-sage phone:bg-sage phone:text-porcelain">
                    <span className="hidden phone:inline">{t("Call")}</span> {biz.phoneDisplay}
                  </Button>
                )}
              </div>
              {biz.rating && (
                <div className="anim-fade mt-6 flex items-center gap-3 text-[0.9rem] text-ink-soft md:mt-10 phone:mt-2 phone:gap-2 phone:text-[0.875rem]" style={{ "--d": "0.9s" } as React.CSSProperties}>
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
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
