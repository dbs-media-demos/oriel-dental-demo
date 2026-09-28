"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Photo } from "@/components/ui/Photo";
import type { Img } from "@/content/images";

export type Chapter = { kicker: string; title: string; body: string; points: string[]; image: Img };

/**
 * The new-patient journey. On desktop the arch window stays pinned while chapters
 * scroll past; each chapter wipes its photo up into the window. On phones every
 * chapter carries its own photo.
 */
export function Journey({ chapters }: { chapters: Chapter[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const steps = gsap.utils.toArray<HTMLElement>("[data-chapter]", el);
        const layers = gsap.utils.toArray<HTMLElement>("[data-layer]", el);
        const reduce = prefersReducedMotion();
        if (reduce) gsap.set(layers.slice(1), { opacity: 0, clipPath: "inset(0% 0% 0% 0%)" });
        steps.forEach((step, i) => {
          ScrollTrigger.create({
            trigger: step,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => {
              if (!self.isActive) return;
              setActive(i);
              if (reduce) layers.forEach((l, j) => gsap.set(l, { opacity: j <= i ? 1 : 0 }));
            },
          });
          if (i === 0 || reduce) return;
          gsap.fromTo(
            layers[i],
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: step, start: "top 95%", end: "top 45%", scrub: 0.8 } },
          );
          gsap.fromTo(
            layers[i].firstElementChild,
            { scale: 1.25, yPercent: 8 },
            { scale: 1, yPercent: 0, ease: "none", scrollTrigger: { trigger: step, start: "top 95%", end: "top 25%", scrub: 0.8 } },
          );
        });
        // Progress thread fills as you go.
        gsap.fromTo("[data-thread]", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 50%", end: "bottom 60%", scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
      {/* Pinned window (desktop) */}
      <div className="sticky top-[calc(var(--header-h)+4vh)] hidden h-[82vh] self-start lg:block">
        <div className="arch relative h-full w-full bg-linen">
          {chapters.map((c, i) => (
            <div key={c.title} data-layer className={clsx("absolute inset-0", i > 0 && "[clip-path:inset(100%_0%_0%_0%)]")}>
              <div className="absolute inset-0">
                <Photo image={c.image} sizes="45vw" />
              </div>
            </div>
          ))}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-night/60 to-transparent p-8 pt-24 text-porcelain">
            <span className="display text-[5rem] leading-none tabular-nums">0{active + 1}</span>
            <span className="eyebrow mb-3 text-porcelain/85">{chapters[active].kicker}</span>
          </div>
        </div>
      </div>

      {/* Chapters */}
      <ol className="relative">
        <span aria-hidden className="absolute top-2 bottom-2 left-[0.6rem] hidden w-px bg-line lg:block">
          <span data-thread className="absolute inset-0 origin-top bg-sage" />
        </span>
        {chapters.map((c, i) => (
          <li key={c.title} data-chapter className="relative flex min-h-0 flex-col justify-center py-10 lg:min-h-[80vh] lg:pl-16">
            <span
              aria-hidden
              className={clsx(
                "absolute top-1/2 left-0 hidden size-[1.3rem] -translate-y-1/2 rounded-t-full border-2 transition-colors duration-700 lg:block",
                active >= i ? "border-sage bg-sage" : "border-mist bg-porcelain",
              )}
            />
            <div className="arch relative mb-8 aspect-[4/5] w-full max-w-md lg:hidden">
              <Photo image={c.image} sizes="(min-width: 640px) 28rem, 90vw" />
            </div>
            <p className="eyebrow text-sage">
              Step {i + 1} · {c.kicker}
            </p>
            <h3 className="display h-md mt-5 max-w-[14ch]">{c.title}</h3>
            <p className="lede mt-6 max-w-[34rem]">{c.body}</p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {c.points.map((p) => (
                <li key={p} className="rounded-full bg-shell px-4 py-2 text-[0.9rem] ring-1 ring-line">
                  {p}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
