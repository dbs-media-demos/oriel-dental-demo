"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import type { ScanScene } from "@/components/fx/tooth/scan";

const DESK_3D = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

/** The journey's scroll announces the exam step's scan progress (0…1) and whether it's on screen. */
export const SCAN_PROGRESS = "oriel:scan-progress";
export type ScanDetail = { progress: number; active: boolean };

/**
 * The exam step's window on desktop: the 3D scan of a lower arch, built as you scroll through the
 * step (points ahead of the scan line, porcelain behind it). The server HTML carries a still of the
 * finished scan; the live scene (three.js via `await import()`, desktop with a mouse only) is built
 * when the journey comes near, while this window is still hidden behind the previous photo.
 */
export function ScanWindow({ className }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!window.matchMedia(DESK_3D).matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches || conn?.saveData) return;

    let cancelled = false;
    let sc: ScanScene | undefined;
    let detail: ScanDetail = { progress: 0, active: false };
    const onProgress = (e: Event) => {
      detail = (e as CustomEvent<ScanDetail>).detail;
      sc?.progress(detail.progress);
      sc?.setVisible(detail.active);
    };
    window.addEventListener(SCAN_PROGRESS, onProgress);
    let ro: ResizeObserver | undefined;

    const start = async () => {
      try {
        const { createScan } = await import("@/components/fx/tooth/scan");
        if (cancelled) return;
        sc = await createScan(el);
        if (cancelled) return sc.dispose();
      } catch {
        return; // no WebGL: the still stays
      }
      const scene = sc;
      scene.progress(detail.progress);
      scene.setVisible(detail.active);
      scene.onReady(() => !cancelled && setOn(true));
      ro = new ResizeObserver(() => scene.resize());
      ro.observe(el);
    };

    // Built when the journey is a screen or so away, never during the hero's opening
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 120));
        ric(() => void start(), { timeout: 1500 });
      },
      { rootMargin: "150% 0px" },
    );
    io.observe(el.closest("section") ?? el);

    return () => {
      cancelled = true;
      io.disconnect();
      ro?.disconnect();
      window.removeEventListener(SCAN_PROGRESS, onProgress);
      sc?.dispose();
    };
  }, []);

  return (
    <div aria-hidden className={clsx("absolute inset-0 bg-[#1d2925]", className)}>
      <picture>
        <source type="image/avif" srcSet="/images/tooth/scan-900.avif 900w, /images/tooth/scan-1400.avif 1400w" sizes="45vw" />
        <img
          src="/images/tooth/scan-900.webp"
          srcSet="/images/tooth/scan-900.webp 900w, /images/tooth/scan-1400.webp 1400w"
          sizes="45vw"
          width={1400}
          height={1400}
          alt=""
          loading="lazy"
          decoding="async"
          className={clsx("absolute inset-0 h-full w-full object-cover transition-opacity duration-500", on && "opacity-0")}
        />
      </picture>
      <canvas ref={canvas} className={clsx("absolute inset-0 h-full w-full", on ? "opacity-100" : "opacity-0")} />
    </div>
  );
}

/** Phones, tablets: the finished scan, a still from the same scene. No script. */
export function ScanStill({ className, alt }: { className?: string; alt: string }) {
  return (
    <picture className={className}>
      <source type="image/avif" srcSet="/images/tooth/scan-900.avif" />
      <img src="/images/tooth/scan-900.webp" width={900} height={900} alt={alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
    </picture>
  );
}
