"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";

/**
 * Muted background loop. Only plays when it's on screen, and never for reduced-motion
 * or Save-Data visitors (they keep the poster).
 */
export function AmbientVideo({ src, poster, className }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches || conn?.saveData;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return v.pause();
        // Poster and video are only fetched once the frame is near the viewport.
        if (!v.poster) v.poster = poster;
        if (still) return;
        if (!v.src) v.src = src;
        v.play().catch(() => {});
      },
      { rootMargin: "300px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src, poster]);

  return <video ref={ref} className={clsx("absolute inset-0 h-full w-full object-cover", className)} muted loop playsInline preload="none" aria-hidden />;
}
