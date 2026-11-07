"use client";

import { useEffect, type RefObject } from "react";

/**
 * Phones and touch screens get no pinning, scrubbing, parallax or smooth scrolling, so GSAP and
 * Lenis aren't even downloaded there. Keep the widths in sync with the `phone` and `still`
 * variants in globals.css.
 */
const STILL = "(max-width: 767.98px), (hover: none), (pointer: coarse)";

const PHONE = "(max-width: 767.98px), (hover: none) and (max-width: 1023.98px), (pointer: coarse) and (max-width: 1023.98px)";

export const isPhone = () => typeof window !== "undefined" && window.matchMedia(PHONE).matches;

export const isStill = () => typeof window !== "undefined" && window.matchMedia(STILL).matches;

export const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouch = () => typeof window !== "undefined" && window.matchMedia("(hover: none), (pointer: coarse)").matches;

export type MotionKit = typeof import("./gsap");

let kit: Promise<MotionKit> | null = null;
export const loadKit = () => (kit ??= import("./gsap"));

// Desktop starts fetching as soon as this module runs, so the motion is ready at hydration.
if (typeof window !== "undefined" && !isStill()) void loadKit();

/**
 * useGSAP for desktop only: nothing runs (or loads) on a phone. Everything is reverted when the
 * window crosses into phone width, and set up again on the way back.
 */
export function useDesktopGSAP(setup: (kit: MotionKit) => void | (() => void), { scope }: { scope?: RefObject<Element | null> } = {}) {
  useEffect(() => {
    let run = 0;
    let revert: (() => void) | undefined;
    const sync = () => {
      const id = ++run;
      revert?.();
      revert = undefined;
      if (isStill()) return;
      void loadKit().then((k) => {
        if (id !== run) return;
        const ctx = k.gsap.context(() => setup(k), scope?.current ?? undefined);
        revert = () => ctx.revert();
      });
    };
    sync();
    const mq = window.matchMedia(STILL);
    mq.addEventListener("change", sync);
    return () => {
      run++;
      mq.removeEventListener("change", sync);
      revert?.();
    };
    // Runs once per mount, like useGSAP without dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
