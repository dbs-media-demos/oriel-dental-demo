"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Photo } from "@/components/ui/Photo";
import { Button, PhoneIcon, Arrow } from "@/components/ui/Button";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { DappledLight } from "@/components/fx/DappledLight";
import type { Img } from "@/content/images";
import { useBiz } from "@/components/preview/BizContext";
import { num, telOf } from "@/lib/biz-core";

/**
 * The arched window. CSS paints it on first frame (and opens it from a slit); on scroll,
 * GSAP widens the arch until the studio fills the screen.
 */
export function HomeHero({ image }: { image: Img }) {
  const biz = useBiz();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
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
    <section ref={root} aria-labelledby="hero-title" className="relative h-[175svh] motion-reduce:h-svh md:h-[210vh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* The window */}
        <div data-frame className="hero-frame absolute inset-0 will-change-[clip-path]">
          <div data-photo className="absolute inset-0 will-change-transform">
            <div className="anim-settle absolute inset-0">
              <Photo image={image} sizes="(min-width: 768px) 100vw, 100vw" preload quality={75} position="36% 40%" />
            </div>
          </div>
          <DappledLight />
          <div aria-hidden className="shutters hero-shutters">
            <span />
            <span />
          </div>
          <div data-veil className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/45 to-night/25 opacity-0" />
          <div data-statement className="absolute inset-x-0 bottom-[16svh] px-[var(--gutter)] text-center text-porcelain opacity-0 [text-shadow:0_2px_30px_rgb(0_0_0/0.35)]">
            <p className="display mx-auto max-w-[16ch] text-[clamp(2.4rem,6.5vw,6.5rem)]">
              Soft light. Unhurried hands. <em className="text-glow">Honest prices.</em>
            </p>
          </div>
        </div>

        {/* Copy */}
        <div
          data-copy
          className="relative z-10 flex h-full flex-col justify-end pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:justify-center md:pt-[var(--header-h)] md:pb-0"
        >
          <div className="container-x">
            <div className="md:max-w-[48%]">
              <div className="anim-fade flex flex-wrap items-center gap-3" style={{ "--d": "0.1s" } as React.CSSProperties}>
                <OpenBadge />
                <span className="eyebrow hidden text-ink-soft sm:inline">{biz.preview ? biz.area : "Uptown Dallas"}</span>
              </div>
              <h1 id="hero-title" className="display mt-5 text-[clamp(3.1rem,6.5vw,7.6rem)] text-ink md:mt-7">
                {biz.tagline ? (
                  <span className="anim-heading block" style={{ "--d": "0.2s" } as React.CSSProperties}>
                    {biz.tagline}
                  </span>
                ) : (
                  <>
                    <span className="anim-heading block" style={{ "--d": "0.2s" } as React.CSSProperties}>
                      Dentistry,
                    </span>
                    <span className="anim-heading block" style={{ "--d": "0.35s" } as React.CSSProperties}>
                      in a <em className="text-sage">better light.</em>
                    </span>
                  </>
                )}
              </h1>
              <p className="anim-fade lede mt-5 hidden max-w-[34rem] sm:block md:mt-8" style={{ "--d": "0.6s" } as React.CSSProperties}>
                A calm, daylight-filled studio for families, nervous patients and natural-looking cosmetic work. Same-day emergencies, evening hours,
                and every price before anything starts.
              </p>
              <div className="anim-fade mt-6 flex flex-wrap items-center gap-3 md:mt-10" style={{ "--d": "0.75s" } as React.CSSProperties}>
                <Button href="/book" icon={<Arrow />}>
                  Book your first visit
                </Button>
                {biz.phone && (
                  <Button href={telOf(biz)!} variant="ghost" icon={<PhoneIcon />} className="hidden sm:inline-flex">
                    {biz.phoneDisplay}
                  </Button>
                )}
              </div>
              {biz.rating && (
                <div className="anim-fade mt-6 flex items-center gap-3 text-[0.9rem] text-ink-soft md:mt-10" style={{ "--d": "0.9s" } as React.CSSProperties}>
                  <span className="tracking-[0.2em] text-sage" aria-hidden>
                    ★★★★★
                  </span>
                  <span>
                    <strong className="font-semibold text-ink">{num(biz, biz.rating.value)}</strong>{" "}
                    {biz.lang === "sr" ? `· ${biz.rating.count} Google recenzija` : `from ${biz.rating.count} Google reviews`}
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
