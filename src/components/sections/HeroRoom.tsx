"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import type { ToothScene } from "@/components/fx/tooth/scene";

/** Live 3D only on a big screen with a mouse. Everything else keeps the still. */
const DESK_3D = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";
/** Same as the `phone` variant in globals.css: these never download the desktop still. */
const PHONE_MEDIA = "(max-width: 767.98px), (hover: none) and (max-width: 1023.98px), (pointer: coarse) and (max-width: 1023.98px)";
const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

/** The arched window's insets in px (kept in sync with .hero-frame in globals.css). */
export function heroArch() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w >= 768) {
    const l = w * 0.52;
    const r = w * 0.05;
    return { t: h * 0.14, r, b: h * 0.06, l, rad: (w - l - r) / 2 };
  }
  const side = w * 0.05;
  return { t: 84, r: side, b: h * 0.5, l: side, rad: (w - side * 2) / 2 };
}

/** The hero's scroll timeline announces its progress (0…1) with this event. */
export const HERO_PROGRESS = "oriel:hero-progress";

/**
 * The room behind the arched window: a porcelain molar turning above a travertine plinth while the
 * sun comes through an arched window and olive branches. The server HTML carries a still rendered
 * from the scene (scripts/render-tooth.mjs), so the room is there on the first frame. On a desktop
 * with a mouse, once the page has loaded, the scene is fetched with `await import()` (three.js never
 * reaches a phone) and the live canvas fades in over the still from the very same camera. Then a
 * breath of wind moves the branches and the tooth turns; the pointer moves the sun a little, and the
 * scroll sinks it while the arch opens into the room. Frames stop when the hero is off screen.
 */
export function HeroRoom({ className }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!window.matchMedia(DESK_3D).matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches || conn?.saveData) return;

    let cancelled = false;
    let sc: ToothScene | undefined;
    const timers: number[] = [];
    const off: (() => void)[] = [];

    const start = async () => {
      let createTooth: typeof import("@/components/fx/tooth/scene").createTooth;
      try {
        ({ createTooth } = await import("@/components/fx/tooth/scene"));
        if (cancelled) return;
        sc = await createTooth(el);
        if (cancelled) return sc.dispose();
      } catch {
        return; // no WebGL: the still stays
      }
      const scene = sc;
      let progress = 0;
      let onScreen = true;
      const clip = () => {
        const a = heroArch();
        const k = 1 - progress;
        scene.clip({ t: a.t * k, r: a.r * k, b: a.b * k, l: a.l * k });
      };
      clip();
      scene.onReady(() => {
        if (cancelled) return;
        setOn(true);
        // The still and the first frame match, so the fade is invisible; then the room comes alive
        timers.push(window.setTimeout(() => scene.intro(), 700));
      });

      const onProgress = (e: Event) => {
        progress = (e as CustomEvent<number>).detail;
        clip();
        scene.scroll(progress);
      };
      const onMove = (e: PointerEvent) => scene.pointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
      const io = new IntersectionObserver(([e]) => {
        onScreen = e.isIntersecting;
        scene.setVisible(onScreen);
      });
      io.observe(el);
      const ro = new ResizeObserver(() => {
        clip();
        scene.resize();
      });
      ro.observe(el);
      window.addEventListener(HERO_PROGRESS, onProgress);
      window.addEventListener("pointermove", onMove, { passive: true });
      off.push(() => {
        io.disconnect();
        ro.disconnect();
        window.removeEventListener(HERO_PROGRESS, onProgress);
        window.removeEventListener("pointermove", onMove);
      });
      scene.scroll(progress);
    };

    // After the page has loaded, the shutters have opened (~1.5 s) and the browser is idle: the first
    // paint never waits for the 3D, and building the tooth never lands in the middle of the opening
    const idle = () => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 120));
      timers.push(window.setTimeout(() => ric(() => void start(), { timeout: 1200 }), Math.max(0, 1300 - performance.now())));
    };
    if (document.readyState === "complete") idle();
    else {
      window.addEventListener("load", idle, { once: true });
      off.push(() => window.removeEventListener("load", idle));
    }

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      off.forEach((f) => f());
      sc?.dispose();
    };
  }, []);

  return (
    <div aria-hidden className={clsx("absolute inset-0 bg-[#e4ded4]", className)}>
      <picture>
        <source media={PHONE_MEDIA} srcSet={BLANK} />
        <source type="image/avif" srcSet="/images/tooth/room-1600.avif 1600w, /images/tooth/room-2400.avif 2400w" sizes="100vw" />
        {/* Rendered from the live scene at two fixed sizes, so no image optimiser touches it */}
        <img
          src="/images/tooth/room-1600.webp"
          srcSet="/images/tooth/room-1600.webp 1600w, /images/tooth/room-2400.webp 2400w"
          sizes="100vw"
          width={1600}
          height={1000}
          alt=""
          decoding="async"
          className={clsx("absolute inset-0 h-full w-full object-cover object-[80%_45%] transition-opacity duration-700", on && "opacity-0 delay-300")}
        />
      </picture>
      <canvas ref={canvas} className={clsx("absolute inset-0 h-full w-full transition-opacity duration-500", on ? "opacity-100" : "opacity-0")} />
    </div>
  );
}

/** Phones: the same room, a close still of the tooth in a small arch on the photo. No script. */
export function HeroCameo({ className }: { className?: string }) {
  return (
    <picture className={className}>
      <source type="image/avif" srcSet="/images/tooth/cameo.avif" />
      <img src="/images/tooth/cameo.webp" width={300} height={380} alt="" decoding="async" fetchPriority="low" className="block h-full w-full object-cover" />
    </picture>
  );
}
