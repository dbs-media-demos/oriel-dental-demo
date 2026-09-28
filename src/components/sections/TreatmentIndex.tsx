"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import clsx from "clsx";
import { gsap, useGSAP, isTouch, prefersReducedMotion } from "@/lib/gsap";
import type { Img } from "@/content/images";

export type IndexItem = { slug: string; name: string; duration: string; price: string; tagline: string; image: Img };

/**
 * Editorial treatment list. On desktop an arch-shaped photo floats after the cursor
 * and crossfades as you move between rows.
 */
export function TreatmentIndex({ items }: { items: IndexItem[] }) {
  const root = useRef<HTMLDivElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      const el = root.current;
      const f = float.current;
      if (!el || !f || isTouch() || prefersReducedMotion()) return;
      const xTo = gsap.quickTo(f, "x", { duration: 0.9, ease: "power3.out" });
      const yTo = gsap.quickTo(f, "y", { duration: 0.9, ease: "power3.out" });
      const rTo = gsap.quickTo(f, "rotation", { duration: 1.2, ease: "power3.out" });
      let lastX = 0;
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo(e.clientX - r.left);
        yTo(e.clientY - r.top);
        rTo(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.4));
        lastX = e.clientX;
      };
      el.addEventListener("pointermove", move);
      return () => el.removeEventListener("pointermove", move);
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative" onPointerLeave={() => setActive(null)}>
      <ul className="border-t border-line">
        {items.map((s, i) => (
          <li key={s.slug} className="border-b border-line">
            <Link
              href={`/services/${s.slug}`}
              transitionTypes={["nav-forward"]}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group grid grid-cols-[4.5rem_1fr] items-center gap-4 py-5 md:grid-cols-[3rem_1fr_auto] md:gap-8 md:py-7"
            >
              <span className="relative aspect-square overflow-hidden rounded-t-full rounded-b-lg md:hidden">
                <Image src={s.image.src} alt="" fill sizes="72px" className="object-cover" placeholder="blur" blurDataURL={s.image.blur} />
              </span>
              <span className="hidden text-sm text-ink-soft tabular-nums md:block">{String(i + 1).padStart(2, "0")}</span>
              <span className="min-w-0">
                <span
                  className={clsx(
                    "display block text-[clamp(1.7rem,4vw,3.6rem)] transition-[transform,color] duration-700 ease-[var(--ease-soft)] md:group-hover:translate-x-4",
                    active !== null && active !== i ? "md:text-ink/35" : "text-ink",
                  )}
                >
                  {s.name}
                </span>
                <span className="mt-1 block text-[0.92rem] text-ink-soft md:hidden">
                  {s.duration} · {s.price}
                </span>
              </span>
              <span className="hidden text-right text-[0.92rem] text-ink-soft md:block">
                <span className="block">{s.duration}</span>
                <span className="block font-semibold text-ink">{s.price}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Floating arch preview (desktop, decorative) */}
      <div
        ref={float}
        aria-hidden
        className={clsx(
          "pointer-events-none absolute top-0 left-0 z-10 hidden h-[22rem] w-[17rem] -translate-x-1/2 -translate-y-1/2 transition-[opacity,scale] duration-700 ease-[var(--ease-soft)] md:block",
          active === null ? "scale-75 opacity-0" : "scale-100 opacity-100",
        )}
      >
        <div className="arch relative h-full w-full shadow-[0_30px_80px_-30px_rgb(30_41_38/0.5)]">
          {items.map((s, i) => (
            <Image
              key={s.slug}
              src={s.image.src}
              alt=""
              fill
              sizes="272px"
              className={clsx("object-cover transition-[opacity,scale] duration-700 ease-[var(--ease-soft)]", active === i ? "scale-100 opacity-100" : "scale-110 opacity-0")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
