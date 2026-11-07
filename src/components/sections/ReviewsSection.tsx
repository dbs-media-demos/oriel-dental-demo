import clsx from "clsx";
import { Marquee } from "@/components/ui/Marquee";
import { reviews, ratingBreakdown, type Review } from "@/content/reviews";
import { site } from "@/content/site";
import { scrub } from "@/lib/scrub";
import type { Biz } from "@/lib/biz-core";

export function Stars({ n = 5, className }: { n?: number; className?: string }) {
  return (
    <span className={clsx("inline-flex gap-0.5 text-[#e2a93b]", className)} role="img" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={clsx("size-4", i >= n && "opacity-25")} aria-hidden>
          <path fill="currentColor" d="m10 1.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8L10 1.6Z" />
        </svg>
      ))}
    </span>
  );
}

function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-8Z" />
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.3V7.1H2.1a11 11 0 0 0 0 9.9l3.7-2.8Z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4Z" />
    </svg>
  );
}

export function ReviewCard({ r, className }: { r: Review; className?: string }) {
  return (
    <figure className={clsx("flex flex-col rounded-3xl bg-shell p-7 ring-1 ring-line phone:rounded-2xl phone:p-4", className)}>
      <div className="flex items-center justify-between">
        <Stars n={r.rating} />
        <GoogleG className="size-5" />
      </div>
      <blockquote className="mt-5 flex-1 text-[1rem] leading-relaxed text-ink phone:mt-2 phone:text-[0.9rem] phone:leading-snug">&ldquo;{r.text}&rdquo;</blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5 phone:mt-3 phone:pt-2.5">
        <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-mist-soft font-semibold text-sage phone:size-8 phone:text-[0.85rem]">
          {r.name[0]}
        </span>
        <span className="text-[0.9rem] leading-tight phone:text-[0.8rem]">
          <span className="block font-semibold">{r.name}</span>
          <span className="text-ink-soft">
            {r.area && <>{r.area} · </>}
            {r.treatment} · {r.when}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export function RatingSummary({ className, rating = site.rating, value }: { className?: string; rating?: { value: number; count: number }; value?: string }) {
  return (
    <div className={clsx("rounded-3xl bg-shell p-8 ring-1 ring-line phone:grid phone:grid-cols-[auto_1fr] phone:gap-x-5 phone:p-4", className)}>
      <div className="flex items-center gap-3 phone:col-span-2 phone:gap-2 phone:text-[0.9rem]">
        <GoogleG className="size-6 phone:size-5" />
        <span className="font-semibold">Google reviews</span>
      </div>
      <div className="mt-6 flex items-end gap-4 phone:mt-2 phone:flex-col phone:items-start phone:gap-1">
        <span className="display text-[4.5rem] leading-none phone:text-[2.75rem]">{value ?? rating.value}</span>
        <span className="pb-2 phone:pb-0">
          <Stars />
          <span className="mt-1 block text-[0.9rem] text-ink-soft phone:mt-0 phone:text-[0.8rem]">{rating.count} reviews</span>
        </span>
      </div>
      <dl className="mt-6 space-y-2 phone:mt-2 phone:space-y-0">
        {ratingBreakdown.map((b) => (
          <div key={b.stars} className="grid grid-cols-[1.5rem_1fr_2.5rem] items-center gap-3 text-[0.85rem] phone:gap-2 phone:text-[0.72rem]">
            <dt className="text-ink-soft">{b.stars}★</dt>
            <dd className="h-1.5 overflow-hidden rounded-full bg-linen">
              <span className="block h-full rounded-full bg-sage" style={{ width: `${Math.max(1, b.share * 100)}%` }} />
            </dd>
            <dd className="text-right text-ink-soft tabular-nums">{Math.round(b.share * rating.count)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

const listFor = (scrubFor?: Pick<Biz, "preview" | "shortName" | "lang">) => {
  // Serbian previews: only neutral reviews about the visit, none that describe a result (Health Care Law art. 53)
  const allowed = scrubFor?.lang === "sr" ? reviews.filter((r) => r.neutral) : reviews;
  return scrubFor ? allowed.map((r) => ({ ...r, text: scrub(r.text, scrubFor), area: scrubFor.preview ? "" : r.area })) : allowed;
};

/** Two slow, opposite-moving rows of review cards. */
export function ReviewMarquee({ scrubFor }: { scrubFor?: Pick<Biz, "preview" | "shortName" | "lang"> } = {}) {
  const list = listFor(scrubFor);
  const half = Math.ceil(list.length / 2);
  // A short list repeats, so the rows still run past the edge of the screen
  const rows = [list.slice(0, half), list.slice(half)].map((row) => (list.length < 8 ? [...row, ...row, ...row] : row));
  return (
    <div className="space-y-6 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      {rows.map((row, i) => (
        <Marquee key={i} reverse={i === 1} speed={90}>
          {row.map((r, j) => (
            <ReviewCard key={`${r.name}-${j}`} r={r} className="mr-6 w-[21rem] shrink-0 sm:w-[26rem]" />
          ))}
        </Marquee>
      ))}
    </div>
  );
}

/** Phones: nothing moves on its own. The first reviews in full, stacked; the rest in a row to swipe. */
export function ReviewStack({ scrubFor }: { scrubFor?: Pick<Biz, "preview" | "shortName" | "lang"> } = {}) {
  const list = listFor(scrubFor);
  const stacked = list.length <= 5 ? list.length : 3;
  return (
    <div className="container-x">
      <div className="rest-card grid gap-2.5">
        {list.slice(0, stacked).map((r) => (
          <ReviewCard key={r.name} r={r} />
        ))}
      </div>
      {list.length > stacked && (
        <div className="swipe swipe-wide mt-2.5">
          {list.slice(stacked).map((r) => (
            <ReviewCard key={r.name} r={r} />
          ))}
        </div>
      )}
    </div>
  );
}
