"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** Number that counts up once when it scrolls into view. The final value is in the HTML. */
export function Counter({ value, decimals = 0, suffix = "", prefix = "" }: { value: number; decimals?: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (n: number) => `${prefix}${n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;

  useGSAP(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const obj = { n: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 92%",
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          n: value,
          duration: 2.4,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = fmt(obj.n);
          },
        }),
    });
  });

  return (
    <span ref={ref} className="tabular-nums">
      {fmt(value)}
    </span>
  );
}
