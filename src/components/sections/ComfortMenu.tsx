"use client";

import Image from "next/image";
import { useState } from "react";
import clsx from "clsx";
import { AmbientVideo } from "@/components/ui/AmbientVideo";
import type { Img } from "@/content/images";

export type Comfort = { title: string; body: string; image: Img };

/** Hover or focus a comfort and the window shows it; at rest, leaves sway in the light. */
export function ComfortMenu({ items }: { items: Comfort[] }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
      <div className="arch relative mx-auto aspect-[3/4] w-full max-w-[30rem] bg-shell lg:max-w-none">
        <AmbientVideo src="/video/leaf-light.mp4" poster="/video/leaf-light.jpg" />
        {items.map((c, i) => (
          <Image
            key={c.title}
            src={c.image.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 40vw, 90vw"
            className={clsx("object-cover transition-[opacity,scale] duration-1000 ease-[var(--ease-soft)]", active === i ? "scale-100 opacity-100" : "scale-[1.08] opacity-0")}
          />
        ))}
        <div
          className={clsx(
            "absolute inset-0 grid place-items-center p-10 text-center transition-opacity duration-700",
            active === null ? "opacity-100" : "opacity-0",
          )}
        >
          <div>
            <span aria-hidden className="mx-auto block size-24 rounded-full bg-sage/20 motion-safe:animate-[breathe_8s_var(--ease-breath)_infinite]">
              <span className="m-auto block size-full scale-50 rounded-full bg-sage/40" />
            </span>
            <p className="display mt-6 text-[1.7rem] text-ink">Breathe in for four.</p>
            <p className="mt-1 text-ink-soft">Out for six. We&apos;ll wait.</p>
          </div>
        </div>
      </div>

      <ul className="border-t border-line" onPointerLeave={() => setActive(null)}>
        {items.map((c, i) => (
          <li key={c.title} className="border-b border-line">
            <button
              type="button"
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              onClick={() => setActive((a) => (a === i ? null : i))}
              aria-pressed={active === i}
              className="group flex w-full items-start gap-5 py-6 text-left"
            >
              <span className="mt-2 text-sm text-sage tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className={clsx("display block text-[clamp(1.6rem,2.8vw,2.4rem)] transition-colors duration-500", active !== null && active !== i ? "text-ink/40" : "text-ink")}>
                  {c.title}
                </span>
                <span
                  className={clsx(
                    "grid transition-[grid-template-rows,opacity] duration-700 ease-[var(--ease-soft)]",
                    active === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <span className="overflow-hidden">
                    <span className="block pt-2 text-ink-soft">{c.body}</span>
                  </span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
