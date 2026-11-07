"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { isStill, loadKit, prefersReducedMotion } from "@/lib/motion";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Lenis smooth scrolling on desktop, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Touch devices keep native momentum scrolling (and never download Lenis); reduced motion keeps native scrolling too.
    if (prefersReducedMotion() || isStill()) return;
    let dead = false;
    let stop: (() => void) | undefined;
    void Promise.all([loadKit(), import("lenis")]).then(([{ gsap, ScrollTrigger }, { default: LenisClass }]) => {
      if (dead) return;
      const lenis = new LenisClass({ lerp: 0.085, wheelMultiplier: 0.9, anchors: { offset: -96 } });
      window.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      stop = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        delete window.__lenis;
      };
    });
    return () => {
      dead = true;
      stop?.();
    };
  }, []);

  // New page: re-measure every trigger once the new layout settles.
  useEffect(() => {
    if (isStill()) return;
    window.__lenis?.resize();
    const id = window.setTimeout(() => void loadKit().then(({ ScrollTrigger }) => ScrollTrigger.refresh()), 400);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
