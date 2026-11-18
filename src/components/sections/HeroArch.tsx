"use client";

import { useEffect, useRef, type ReactNode } from "react";
import clsx from "clsx";
import { HERO_PROGRESS } from "@/components/sections/HeroRoom";

/**
 * /v2's window, without any 3D: the same plaster room and low sun as the 3D hero, olive leaves
 * swaying in the light, and the upper arch being charted tooth by tooth (ArchChart: server-made SVG,
 * drawn by CSS, so it moves from the first frame, even before this script runs). The pointer moves
 * the light and tilts the chart a little; the hero's scroll brings it closer as the window opens.
 * Animations pause when the hero is off screen. Phones never show it (they keep the studio photo).
 * The resting transforms are in globals.css (.arch-*), so the first frame needs no script.
 */
export function HeroArch({ children, leaves, className }: { children: ReactNode; leaves: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.toggleAttribute("data-off", !e.isIntersecting));
    io.observe(el);

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (calm) return () => io.disconnect();

    // The three moving layers get their transforms written directly: a CSS variable on the room
    // would make every element of the chart recalculate its style on each scroll frame
    const sun = el.querySelector<HTMLElement>(".arch-sun")!;
    const leaves = el.querySelector<HTMLElement>(".arch-leaves")!;
    const art = el.querySelector<HTMLElement>(".arch-art")!;
    let tx = 0, ty = 0, x = 0, y = 0, p = 0, raf = 0;
    const apply = () => {
      sun.style.transform = `translate3d(${x * 1.6 - p * 10}vw, ${y * 1.2 + p * 8}vh, 0) skewX(-16deg)`;
      sun.style.opacity = String(0.9 - p * 0.3);
      leaves.style.transform = `translate3d(${-x * 1.4}vw, ${-y}vh, 0)`;
      art.style.transform = `translate3d(${p * 2}vw, ${-p * 3}vh, 0) scale(${1 + p * 0.22}) rotateX(${8 - y * 7}deg) rotateY(${x * 9}deg)`;
    };
    // Pointer: eased towards, then the loop stops until the pointer moves again
    const tick = () => {
      x += (tx - x) * 0.07;
      y += (ty - y) * 0.07;
      apply();
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.002 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf && !el.hasAttribute("data-off")) raf = requestAnimationFrame(tick);
    };
    const onProgress = (e: Event) => {
      p = (e as CustomEvent<number>).detail;
      if (!raf) apply();
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener(HERO_PROGRESS, onProgress);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener(HERO_PROGRESS, onProgress);
    };
  }, []);

  return (
    <div ref={root} aria-hidden className={clsx("arch-room absolute inset-0 overflow-hidden", className)}>
      <div className="arch-sun" />
      <div className="arch-leaves">{leaves}</div>
      <div className="arch-stage">
        <div className="arch-art">{children}</div>
      </div>
    </div>
  );
}
