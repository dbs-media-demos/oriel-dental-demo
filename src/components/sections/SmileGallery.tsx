"use client";

import { useState, useTransition, ViewTransition } from "react";
import clsx from "clsx";
import { BeforeAfter } from "./BeforeAfter";
import type { CaseType, SmileCase } from "@/content/gallery";

type Tab = { id: CaseType | "all"; label: string };

/** Filter tabs + before/after cases. Tabs crossfade the grid with a view transition. */
export function SmileGallery({ cases, tabs, limit, featured = false }: { cases: SmileCase[]; tabs: Tab[]; limit?: number; featured?: boolean }) {
  const [tab, setTab] = useState<Tab["id"]>("all");
  const [, startTransition] = useTransition();
  const list = cases.filter((c) => tab === "all" || c.type === tab).slice(0, limit);

  return (
    <div>
      <div role="group" aria-label="Filter smile cases by treatment" className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-2">
        {tabs.map((t) => {
          const count = t.id === "all" ? cases.length : cases.filter((c) => c.type === t.id).length;
          return (
            <button
              key={t.id}
              type="button"

              aria-pressed={tab === t.id}
              onClick={() => startTransition(() => setTab(t.id))}
              className={clsx(
                "min-h-11 shrink-0 rounded-full px-5 text-[0.92rem] font-medium transition-colors duration-500",
                tab === t.id ? "bg-ink text-porcelain" : "bg-shell text-ink ring-1 ring-line hover:ring-ink/40",
              )}
            >
              {t.label} <span className={clsx("ml-1 tabular-nums", tab === t.id ? "text-porcelain/60" : "text-ink-soft")}>{count}</span>
            </button>
          );
        })}
      </div>

      <ViewTransition key={tab} name="smile-grid" share="auto" enter="auto" default="none">
        <ul className={clsx("mt-10 grid gap-x-6 gap-y-14", featured ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3")}>
          {list.map((c, i) => (
            <li key={c.id} className={clsx(featured && i === 0 && "md:col-span-2")}>
              <BeforeAfter
                before={c.before}
                after={c.after}
                label={c.title}
                hint={i === 0}
                className={clsx("rounded-t-[999px] rounded-b-3xl", featured && i === 0 ? "aspect-[4/3] md:aspect-[16/9] md:rounded-t-[40vw]" : featured ? "aspect-[4/5] md:aspect-[5/4]" : "aspect-[4/5]")}
                sizes={featured && i === 0 ? "100vw" : "(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"}
              />
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="display text-[1.6rem]">{c.title}</h3>
                  <p className="mt-1 text-[0.95rem] text-ink-soft">{c.detail}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="block text-[0.85rem] font-semibold">{c.visits}</span>
                  <span className="mt-1 inline-block rounded-full bg-sand-soft px-2.5 py-0.5 text-[0.72rem] font-semibold tracking-wide text-ink uppercase">Illustrative</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </ViewTransition>
      <p className="mt-10 max-w-2xl text-[0.85rem] text-ink-soft">
        Illustrative simulations on stock photography, shown to explain each treatment. They are not patient results. Results vary from person to person; we&apos;re
        happy to show real case photos (with permission) at your consultation.
      </p>
    </div>
  );
}
