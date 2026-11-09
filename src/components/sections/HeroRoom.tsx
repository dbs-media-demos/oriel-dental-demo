"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { afterLoad, canLive3D, cpuFast, FX_OFF, holdFirst, idle } from "@/components/fx/guard";
import type { LiveScene } from "@/components/fx/tooth/live";

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
 * from the scene (scripts/render-tooth.mjs), so the room is there on the first frame and stays there
 * until the live scene is completely ready. On a desktop that passes the checks in fx/guard.ts, once
 * the page has loaded and gone idle, the scene is built, its shaders compiled and one frame drawn in a
 * worker (three.js never reaches a phone, and never runs on the page's thread); only then does the
 * canvas fade in over the still, from the very same camera. Then a breath of wind moves the branches
 * and the tooth turns; the pointer moves the sun a little, and the scroll sinks it while the arch
 * opens into the room. Frames stop when the hero is off screen or the tab is hidden. If its first 2 s
 * run slow, it fades back to the still for the rest of the visit.
 */
export function HeroRoom({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el || !canLive3D()) return;

    let cancelled = false;
    let live: LiveScene | undefined;
    const timers: number[] = [];
    const off: (() => void)[] = [];
    // scenes further down wait for this one to settle
    const release = holdFirst();
    const canvas = document.createElement("canvas");
    canvas.className = "absolute inset-0 h-full w-full";

    // this visit is on the stills now: fade back to ours, then free the scene
    const stop = () => {
      cancelled = true;
      off.splice(0).forEach((f) => f());
      setOn(false);
      release();
      timers.push(window.setTimeout(() => live?.dispose(), 800));
    };
    window.addEventListener(FX_OFF, stop);
    off.push(() => window.removeEventListener(FX_OFF, stop));

    const start = async () => {
      if (!(await cpuFast()) || cancelled) return release();
      const { mount } = await import("@/components/fx/tooth/live");
      if (cancelled) return;
      el.appendChild(canvas);
      let progress = 0;
      let onScreen = true;
      const running = () => onScreen && !document.hidden;
      const size = () => ({ w: canvas.clientWidth, h: canvas.clientHeight, dpr: window.devicePixelRatio || 1 });
      const scene = (live = mount("tooth", canvas, size(), {
        ready: () => {
          if (cancelled) return;
          setOn(true);
          // The still and the first frame match, so the fade is invisible; then the room comes alive
          timers.push(window.setTimeout(() => scene.call("intro"), 700));
          scene.watch(running);
          // reloaded further down the page: the scenes below needn't wait for this one to be seen
          timers.push(window.setTimeout(release, 4000));
        },
        settled: release,
      }));
      const clip = () => {
        const a = heroArch();
        const k = 1 - progress;
        scene.call("clip", { t: a.t * k, r: a.r * k, b: a.b * k, l: a.l * k });
      };
      clip();
      const onProgress = (e: Event) => {
        progress = (e as CustomEvent<number>).detail;
        clip();
        scene.call("scroll", progress);
      };
      const onMove = (e: PointerEvent) => scene.call("pointer", (e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
      const visible = () => scene.call("setVisible", running());
      const io = new IntersectionObserver(([e]) => {
        onScreen = e.isIntersecting;
        visible();
      });
      io.observe(canvas);
      const ro = new ResizeObserver(() => {
        clip();
        const s = size();
        scene.call("resize", s.w, s.h, s.dpr);
      });
      ro.observe(canvas);
      window.addEventListener(HERO_PROGRESS, onProgress);
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("visibilitychange", visible);
      off.push(() => {
        io.disconnect();
        ro.disconnect();
        window.removeEventListener(HERO_PROGRESS, onProgress);
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("visibilitychange", visible);
      });
      scene.call("scroll", progress);
    };

    // After the page has loaded, the shutters have opened (~1.5 s) and the browser is idle: the first
    // paint never waits for the 3D
    void afterLoad().then(() => {
      timers.push(window.setTimeout(() => void idle(1200).then(() => {
        if (!cancelled) void start();
      }), Math.max(0, 1300 - performance.now())));
    });

    return () => {
      cancelled = true;
      release();
      timers.forEach(clearTimeout);
      off.forEach((f) => f());
      live?.dispose();
      canvas.remove();
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
      {/* The live canvas goes in here (made in the effect: it's handed to the worker) */}
      <div ref={host} data-fx="hero" data-on={on || undefined} className={clsx("absolute inset-0 transition-opacity duration-500", on ? "opacity-100" : "opacity-0 delay-300")} />
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
