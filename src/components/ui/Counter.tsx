"use client";

import { useRef } from "react";
import { useDesktopGSAP, prefersReducedMotion } from "@/lib/motion";

// toLocaleString with options builds a new formatter on every call, which is slow on a phone
const formats = new Map<string, Intl.NumberFormat>();
const formatFor = (locale: string, decimals: number) => {
  const key = `${locale}/${decimals}`;
  let f = formats.get(key);
  if (!f) formats.set(key, (f = new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })));
  return f;
};

/** Number that counts up once when it scrolls into view. The final value is in the HTML. */
export function Counter({ value, decimals = 0, suffix = "", prefix = "", locale = "en-US" }: { value: number; decimals?: number; suffix?: string; prefix?: string; locale?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (n: number) => `${prefix}${formatFor(locale, decimals).format(n)}${suffix}`;

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
