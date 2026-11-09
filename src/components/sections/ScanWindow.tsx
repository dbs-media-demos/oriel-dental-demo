"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { afterFirst, afterLoad, canLive3D, cpuFast, FX_OFF, idle, stillOnly } from "@/components/fx/guard";
import type { LiveScene } from "@/components/fx/tooth/live";

/** The journey's scroll announces the exam step's scan progress (0…1) and whether it's on screen. */
export const SCAN_PROGRESS = "oriel:scan-progress";
export type ScanDetail = { progress: number; active: boolean };

/**
 * The exam step's window on desktop: the 3D scan of a lower arch, built as you scroll through the
 * step (points ahead of the scan line, porcelain behind it). The server HTML carries a still of the
 * finished scan; the live scene (in the 3D worker, desktop with a mouse only, see fx/guard.ts) warms up
 * while the browser is idle after the hero has settled, long before the journey is reached: built,
 * compiled and drawn once out of sight. Its first 2 s on screen are watched like the hero's.
 */
export function ScanWindow({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el || !canLive3D()) return;

    let cancelled = false;
    let live: LiveScene | undefined;
    let detail: ScanDetail = { progress: 0, active: false };
    let timer = 0;
    const running = () => detail.active && !document.hidden;
    const onProgress = (e: Event) => {
      detail = (e as CustomEvent<ScanDetail>).detail;
      live?.call("progress", detail.progress);
      live?.call("setVisible", running());
    };
    const onVis = () => live?.call("setVisible", running());
    window.addEventListener(SCAN_PROGRESS, onProgress);
    document.addEventListener("visibilitychange", onVis);
    let ro: ResizeObserver | undefined;
    const canvas = document.createElement("canvas");
    canvas.className = "absolute inset-0 h-full w-full";

    const unlisten = () => {
      ro?.disconnect();
      window.removeEventListener(SCAN_PROGRESS, onProgress);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener(FX_OFF, stop);
    };
    const stop = () => {
      cancelled = true;
      unlisten();
      setOn(false);
      timer = window.setTimeout(() => live?.dispose(), 800);
    };
    window.addEventListener(FX_OFF, stop);

    const start = async () => {
      await afterLoad();
      await afterFirst();
      await idle(1500);
      if (cancelled || stillOnly() || !(await cpuFast()) || cancelled) return;
      const { mount } = await import("@/components/fx/tooth/live");
      if (cancelled) return;
      el.appendChild(canvas);
      const size = () => ({ w: canvas.clientWidth, h: canvas.clientHeight, dpr: window.devicePixelRatio || 1 });
      const scene = (live = mount("scan", canvas, size(), {
        ready: () => {
          if (cancelled) return;
          setOn(true);
          scene.watch(running);
        },
      }));
      scene.call("progress", detail.progress);
      scene.call("setVisible", running());
      ro = new ResizeObserver(() => {
        const s = size();
        scene.call("resize", s.w, s.h, s.dpr);
      });
      ro.observe(canvas);
    };
    void start();

    return () => {
      cancelled = true;
      clearTimeout(timer);
      unlisten();
      live?.dispose();
      canvas.remove();
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
      {/* The live canvas goes in here (made in the effect: it's handed to the worker) */}
      <div ref={host} data-fx="scan" data-on={on || undefined} className={clsx("absolute inset-0", on ? "opacity-100" : "opacity-0 transition-opacity delay-500 duration-300")} />
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
