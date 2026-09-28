import clsx from "clsx";
import type { Faq } from "@/content/faqs";

/** Native <details> disclosure: keyboard and screen-reader friendly, animated with CSS. */
export function FaqList({ items, className }: { items: Faq[]; className?: string }) {
  return (
    <div className={clsx("faq border-t border-line", className)}>
      {items.map((f) => (
        <details key={f.q} className="group border-b border-line">
          <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-6 py-6 text-left">
            <span className="display text-[clamp(1.25rem,2vw,1.6rem)] leading-snug">{f.q}</span>
            <span aria-hidden className="relative grid size-10 shrink-0 place-items-center rounded-full ring-1 ring-line transition-colors group-open:bg-sage">
              <span className="absolute h-px w-3.5 bg-ink transition-colors group-open:bg-porcelain" />
              <span className="absolute h-3.5 w-px bg-ink transition-transform duration-500 group-open:scale-y-0" />
            </span>
          </summary>
          <p className="max-w-3xl pb-7 text-ink-soft">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
