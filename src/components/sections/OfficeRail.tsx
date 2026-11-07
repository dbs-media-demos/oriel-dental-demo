"use client";

import { useRef, type ReactNode } from "react";
import clsx from "clsx";
import { useDesktopGSAP, prefersReducedMotion } from "@/lib/motion";
import { Photo } from "@/components/ui/Photo";
import type { Img } from "@/content/images";

export type RailItem = { image: Img; caption: string; shape: "arch" | "tall" | "wide" };

/**
 * Horizontal walk through the studio. Desktop: the section pins and vertical scroll moves
 * the rail sideways, each photo drifting at its own depth. Touch: a native swipe rail, the words above it.
 */
export function OfficeRail({ items, intro }: { items: RailItem[]; intro: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useDesktopGSAP(
    ({ gsap }) => {
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
    <section ref={root} aria-label="A walk through the studio" className="relative overflow-hidden bg-linen pin:h-svh">
      <div className="container-x mb-5 hidden phone:block">{intro}</div>
      <div
        data-track
        className="swipe swipe-flush no-scrollbar flex h-full scroll-px-[var(--gutter)] snap-x snap-mandatory items-center gap-6 overflow-x-auto px-[var(--gutter)] py-24 pin:snap-none pin:gap-10 pin:overflow-visible pin:py-0 phone:h-auto phone:items-start phone:py-0"
      >
        <div className="w-[82vw] shrink-0 snap-start sm:w-[26rem] pin:w-[30vw] phone:hidden">{intro}</div>
        {items.map((it) => (
          <figure key={it.image.src} className="shrink-0 snap-center">
            <div
              className={clsx(
                "relative overflow-hidden",
                it.shape === "arch" && "arch h-[60vh] w-[70vw] sm:w-[22rem] pin:h-[68vh] pin:w-[26vw]",
                it.shape === "tall" && "h-[60vh] w-[70vw] rounded-3xl sm:w-[22rem] pin:h-[74vh] pin:w-[24vw]",
                it.shape === "wide" && "h-[48vh] w-[86vw] rounded-3xl sm:w-[34rem] pin:h-[56vh] pin:w-[44vw]",
                "phone:h-auto phone:w-full phone:aspect-square",
              )}
            >
              <div data-depth className="absolute -inset-x-[10%] inset-y-0">
                <Photo image={it.image} sizes="(max-width: 767px) 62vw, (min-width: 1024px) 48vw, 90vw" />
              </div>
            </div>
            <figcaption className="mt-4 text-[0.92rem] text-ink-soft phone:mt-2 phone:text-[0.85rem] phone:leading-snug">{it.caption}</figcaption>
          </figure>
        ))}
        <div aria-hidden className="w-[4vw] shrink-0 phone:hidden" />
      </div>
    </section>
  );
}
