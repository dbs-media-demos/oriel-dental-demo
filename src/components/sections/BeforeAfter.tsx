"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import clsx from "clsx";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import type { Img } from "@/content/images";

type Props = {
  before: Img;
  after: Img;
  label: string;
  className?: string;
  sizes?: string;
  /** Play a small "peek" when it first scrolls into view. */
  hint?: boolean;
};

/** Drag (or arrow-key) comparison. The handle is a small arch. */
export function BeforeAfter({ before, after, label, className, sizes = "(min-width: 1024px) 50vw, 100vw", hint = true }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const touched = useRef(false);
  const dragging = useRef(false);

  const fromEvent = (clientX: number) => {
    const r = root.current!.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };

  useGSAP(
    () => {
      const el = root.current;
      if (!el || !hint || prefersReducedMotion()) return;
      const proxy = { p: 50 };
      ScrollTrigger.create({
        trigger: el,
        start: "top 70%",
        once: true,
        onEnter: () => {
          if (touched.current) return;
          gsap
            .timeline({ onUpdate: () => !touched.current && setPos(proxy.p) })
            .to(proxy, { p: 24, duration: 1.3, ease: "power2.inOut" })
            .to(proxy, { p: 72, duration: 1.6, ease: "power2.inOut" })
            .to(proxy, { p: 50, duration: 1.2, ease: "power2.inOut" });
        },
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      data-cursor="Drag"
      className={clsx("relative touch-pan-y overflow-hidden bg-linen select-none", className)}
      onPointerDown={(e) => {
        touched.current = true;
        dragging.current = true;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        fromEvent(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && fromEvent(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <Image src={after.src} alt={`${label}: after (illustrative)`} fill sizes={sizes} className="object-cover" placeholder="blur" blurDataURL={after.blur} draggable={false} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before.src} alt={`${label}: before (illustrative)`} fill sizes={sizes} className="object-cover" placeholder="blur" blurDataURL={before.blur} draggable={false} />
      </div>

      <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-night/55 px-3 py-1 text-[0.72rem] font-semibold tracking-[0.16em] text-porcelain uppercase backdrop-blur">
        Before
      </span>
      <span className="pointer-events-none absolute top-4 right-4 rounded-full bg-porcelain/80 px-3 py-1 text-[0.72rem] font-semibold tracking-[0.16em] text-ink uppercase backdrop-blur">
        After
      </span>

      {/* Divider + arch handle */}
      <div className="pointer-events-none absolute inset-y-0 w-px bg-porcelain/90 shadow-[0_0_12px_rgb(0_0_0/0.25)]" style={{ left: `${pos}%` }} />
      <button
        type="button"
        role="slider"
        aria-label={`${label}: before and after comparison`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)}% before`}
        onKeyDown={(e) => {
          const step = e.shiftKey ? 10 : 4;
          if (e.key === "ArrowLeft" || e.key === "ArrowDown") setPos((p) => Math.max(0, p - step));
          else if (e.key === "ArrowRight" || e.key === "ArrowUp") setPos((p) => Math.min(100, p + step));
          else if (e.key === "Home") setPos(0);
          else if (e.key === "End") setPos(100);
          else return;
          touched.current = true;
          e.preventDefault();
        }}
        className="absolute top-1/2 grid h-16 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-t-full rounded-b-xl bg-porcelain text-ink shadow-[0_10px_30px_-8px_rgb(0_0_0/0.45)]"
        style={{ left: `${pos}%` }}
      >
        <svg viewBox="0 0 24 12" className="mt-2 w-5" aria-hidden fill="none">
          <path d="M7 1 2 6l5 5M17 1l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
