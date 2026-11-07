"use client";

import { useState } from "react";
import clsx from "clsx";
import { useT } from "@/components/preview/BizContext";

export type PriceItem = { slug: string; name: string; duration: string; price: string };

/** Serbian phones' price list as a small tool: tap a treatment, see its price and how long it takes. */
export function PriceGuide({ items }: { items: PriceItem[] }) {
  const t = useT();
  const [active, setActive] = useState(0);
  const item = items[active];

  return (
    <div className="rounded-3xl bg-shell p-4 ring-1 ring-line">
      <div role="group" aria-label={t("Treatments")} className="swipe pb-1">
        {items.map((s, i) => (
          <button
            key={s.slug}
            type="button"
            aria-pressed={i === active}
            onClick={() => setActive(i)}
            className={clsx("min-h-10 w-auto! rounded-full px-3.5 text-[0.85rem] font-medium whitespace-nowrap transition-colors duration-300", i === active ? "bg-sage text-porcelain" : "bg-porcelain text-ink ring-1 ring-line")}
          >
            {t(s.name)}
          </button>
        ))}
      </div>
      {/* Fixed height: picking a treatment moves nothing on the page */}
      <div aria-live="polite" className="mt-3 flex h-[6.25rem] flex-col justify-center rounded-2xl bg-porcelain px-4 ring-1 ring-line">
        <p className="text-[0.85rem] leading-snug text-ink-soft">{t(item.duration)}</p>
        <p className="display mt-1 text-[1.45rem] leading-tight text-sage-deep">{t(item.price)}</p>
      </div>
    </div>
  );
}
