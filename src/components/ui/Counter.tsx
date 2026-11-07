"use client";

import { useRef } from "react";
import { useDesktopGSAP, prefersReducedMotion } from "@/lib/motion";

/** Number that counts up once when it scrolls into view. The final value is in the HTML. */
export function Counter({ value, decimals = 0, suffix = "", prefix = "", locale = "en-US" }: { value: number; decimals?: number; suffix?: string; prefix?: string; locale?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (n: number) => `${prefix}${n.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;

  useDesktopGSAP(({ gsap, ScrollTrigger }) => {
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
