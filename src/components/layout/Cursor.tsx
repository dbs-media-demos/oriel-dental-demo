"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, isTouch, prefersReducedMotion } from "@/lib/gsap";

/**
 * A soft follower ring for mouse users. Elements with `data-cursor="Drag"` (or any label)
 * turn it into a labelled bubble. The native cursor stays, so nothing is lost for anyone.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (isTouch() || prefersReducedMotion()) return;
    const id = window.requestAnimationFrame(() => setEnabled(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const el = ring.current;
    if (!enabled || !el) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });
    let current = "";
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const target = (e.target as Element | null)?.closest?.("[data-cursor]");
      const next = target?.getAttribute("data-cursor") ?? "";
      const interactive = !next && (e.target as Element | null)?.closest?.("a, button, [role='slider'], input, select, textarea");
      el.dataset.state = next ? "label" : interactive ? "hover" : "idle";
      if (next !== current) {
        current = next;
        setLabel(next);
      }
    };
    const leave = () => (el.dataset.state = "hidden");
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div
      ref={ring}
      aria-hidden
      data-state="hidden"
      className="pointer-events-none fixed top-0 left-0 z-[70] grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-sage/60 transition-[width,height,background-color,border-color,opacity] duration-500 ease-[var(--ease-soft)] data-[state=hidden]:opacity-0 data-[state=hover]:size-14 data-[state=hover]:border-sage data-[state=label]:size-24 data-[state=label]:border-transparent data-[state=label]:bg-sage/90"
    >
      <span className="text-[0.72rem] font-semibold tracking-[0.18em] text-porcelain uppercase">{label}</span>
    </div>
  );
}
