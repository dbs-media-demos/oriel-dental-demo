"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition, ViewTransition } from "react";
import clsx from "clsx";
import type { Img } from "@/content/images";

export type ExplorerItem = {
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  tagline: string;
  duration: string;
  comfort: number;
  comfortLabel: string;
  price: string;
  image: Img;
};

export function ComfortMeter({ level, label, tone = "dark" }: { level: number; label: string; tone?: "dark" | "light" }) {
  return (
    <span className="inline-flex items-center gap-2" aria-label={`Comfort: ${label} (${level} of 5)`} role="img">
      <span className="flex gap-1" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={clsx(
              "h-3 w-2 rounded-t-full",
              i < level ? (tone === "dark" ? "bg-sage" : "bg-glow") : tone === "dark" ? "bg-ink/15" : "bg-porcelain/25",
            )}
          />
        ))}
      </span>
      <span aria-hidden>{label}</span>
    </span>
  );
}

/**
 * Filterable treatment cards. Each card's photo and title are shared elements:
 * clicking morphs them into the detail page's hero (React ViewTransition).
 */
export function TreatmentExplorer({ items, filters }: { items: ExplorerItem[]; filters: { id: string; label: string }[] }) {
  const [filter, setFilter] = useState("all");
  const [, startTransition] = useTransition();
  const list = items.filter((s) => filter === "all" || s.category === filter);

  return (
    <div>
      <div role="group" aria-label="Filter treatments" className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => startTransition(() => setFilter(f.id))}
            className={clsx(
              "min-h-11 shrink-0 rounded-full px-5 text-[0.92rem] font-medium transition-colors duration-500",
              filter === f.id ? "bg-ink text-porcelain" : "bg-shell text-ink ring-1 ring-line hover:ring-ink/40",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="mt-12 grid gap-x-6 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((s) => (
          <ViewTransition key={s.slug} enter="auto" exit="auto" default="none">
            <li>
              <Link href={`/services/${s.slug}`} transitionTypes={["nav-forward"]} className="group block" data-cursor="Open">
                <ViewTransition name={`svc-img-${s.slug}`} share="morph" default="none">
                  <div className="arch relative aspect-[4/5] overflow-hidden bg-linen">
                    <Image
                      src={s.image.src}
                      alt={s.image.alt}
                      fill
                      sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
                      placeholder="blur"
                      blurDataURL={s.image.blur}
                      className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-soft)] group-hover:scale-[1.05]"
                    />
                    <span className="absolute top-[18%] left-1/2 -translate-x-1/2 rounded-full bg-porcelain/85 px-3 py-1 text-[0.72rem] font-semibold tracking-[0.14em] text-ink uppercase backdrop-blur">
                      {s.categoryLabel}
                    </span>
                  </div>
                </ViewTransition>
                <ViewTransition name={`svc-title-${s.slug}`} share="morph" default="none">
                  <h2 className="display mt-6 w-fit text-[2rem] leading-tight">{s.name}</h2>
                </ViewTransition>
                <p className="mt-2 text-ink-soft">{s.tagline}</p>
                <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-5 text-[0.9rem]">
                  <div>
                    <dt className="text-ink-soft">Time</dt>
                    <dd className="font-semibold">{s.duration}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-soft">Comfort</dt>
                    <dd className="font-semibold">
                      <ComfortMeter level={s.comfort} label={s.comfortLabel} />
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-ink-soft">Price</dt>
                    <dd className="font-semibold">{s.price}</dd>
                  </div>
                </dl>
              </Link>
            </li>
          </ViewTransition>
        ))}
      </ul>
    </div>
  );
}
