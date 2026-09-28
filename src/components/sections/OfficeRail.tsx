"use client";

import { useRef, type ReactNode } from "react";
import clsx from "clsx";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Photo } from "@/components/ui/Photo";
import type { Img } from "@/content/images";

export type RailItem = { image: Img; caption: string; shape: "arch" | "tall" | "wide" };

/**
 * Horizontal walk through the studio. Desktop: the section pins and vertical scroll moves
 * the rail sideways, each photo drifting at its own depth. Touch: a native swipe rail.
 */
export function OfficeRail({ items, intro }: { items: RailItem[]; intro: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (hover: hover)", () => {
        const track = el.querySelector<HTMLElement>("[data-track]")!;
        const distance = () => track.scrollWidth - window.innerWidth;
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
        });
        gsap.utils.toArray<HTMLElement>("[data-depth]", el).forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            { xPercent: 8, ease: "none", scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="A walk through the studio" className="relative overflow-hidden bg-linen lg:h-svh">
      <div
        data-track
        className="no-scrollbar flex h-full scroll-px-[var(--gutter)] snap-x snap-mandatory items-center gap-6 overflow-x-auto px-[var(--gutter)] py-24 lg:snap-none lg:gap-10 lg:overflow-visible lg:py-0"
      >
        <div className="w-[82vw] shrink-0 snap-start sm:w-[26rem] lg:w-[30vw]">{intro}</div>
        {items.map((it) => (
          <figure key={it.image.src} className="shrink-0 snap-center">
            <div
              className={clsx(
                "relative overflow-hidden",
                it.shape === "arch" && "arch h-[60vh] w-[70vw] sm:w-[22rem] lg:h-[68vh] lg:w-[26vw]",
                it.shape === "tall" && "h-[60vh] w-[70vw] rounded-3xl sm:w-[22rem] lg:h-[74vh] lg:w-[24vw]",
                it.shape === "wide" && "h-[48vh] w-[86vw] rounded-3xl sm:w-[34rem] lg:h-[56vh] lg:w-[44vw]",
              )}
            >
              <div data-depth className="absolute -inset-x-[10%] inset-y-0">
                <Photo image={it.image} sizes="(min-width: 1024px) 48vw, 90vw" />
              </div>
            </div>
            <figcaption className="mt-4 text-[0.92rem] text-ink-soft">{it.caption}</figcaption>
          </figure>
        ))}
        <div aria-hidden className="w-[4vw] shrink-0" />
      </div>
    </section>
  );
}
