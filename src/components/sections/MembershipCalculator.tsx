"use client";

import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";

type Plan = { name: string; monthly: number; yearly: number };
type Props = { adult: Plan; child: Plan; valueAdult: number; valueChild: number; treatmentSaving: number };

function Stepper({ label, value, onChange, note }: { label: string; value: number; onChange: (n: number) => void; note: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-5">
      <div>
        <p className="font-semibold">{label}</p>
        <p className="text-[0.9rem] text-ink-soft">{note}</p>
      </div>
      <div className="flex items-center gap-3" role="group" aria-label={label}>
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          aria-label={`Fewer ${label.toLowerCase()}`}
          className="grid size-11 place-items-center rounded-full ring-1 ring-line hover:ring-ink/40 disabled:opacity-40"
          disabled={value === 0}
        >
          −
        </button>
        <output aria-live="polite" className="display w-8 text-center text-[1.8rem] tabular-nums">
          {value}
        </output>
        <button
          type="button"
          onClick={() => onChange(Math.min(8, value + 1))}
          aria-label={`More ${label.toLowerCase()}`}
          className="grid size-11 place-items-center rounded-full ring-1 ring-line hover:ring-ink/40"
        >
          +
        </button>
      </div>
    </div>
  );
}

/** How much a household saves with the membership versus paying visit by visit. */
export function MembershipCalculator({ adult, child, valueAdult, valueChild, treatmentSaving }: Props) {
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(1);
  const [treatment, setTreatment] = useState(false);
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");

  const plan = adults * adult.yearly + kids * child.yearly;
  const planMonthly = adults * adult.monthly + kids * child.monthly;
  const value = adults * valueAdult + kids * valueChild + (treatment ? treatmentSaving : 0);
  const saving = Math.max(0, value - plan);

  return (
    <div className="grid gap-8 rounded-[2rem] bg-shell p-6 ring-1 ring-line sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
      <div>
        <p className="eyebrow text-sage">Savings calculator</p>
        <div className="mt-4 border-t border-line">
          <Stepper label="Adults" value={adults} onChange={setAdults} note={`$${adult.monthly}/mo or $${adult.yearly}/yr each`} />
          <Stepper label="Kids under 14" value={kids} onChange={setKids} note={`$${child.monthly}/mo or $${child.yearly}/yr each`} />
          <label className="flex cursor-pointer items-center justify-between gap-4 border-b border-line py-5">
            <span>
              <span className="block font-semibold">Planning treatment this year?</span>
              <span className="text-[0.9rem] text-ink-soft">e.g. a crown or whitening. Members save 15%.</span>
            </span>
            <input type="checkbox" checked={treatment} onChange={(e) => setTreatment(e.target.checked)} className="peer sr-only" />
            <span
              aria-hidden
              className="relative h-7 w-12 shrink-0 rounded-full bg-ink/15 transition-colors peer-checked:bg-sage peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sage after:absolute after:top-1 after:left-1 after:size-5 after:rounded-full after:bg-porcelain after:transition-transform peer-checked:after:translate-x-5"
            />
          </label>
        </div>
        <div role="group" aria-label="Billing" className="mt-6 inline-flex rounded-full bg-linen p-1">
          {(["monthly", "yearly"] as const).map((b) => (
            <button
              key={b}
              type="button"
              aria-pressed={billing === b}
              onClick={() => setBilling(b)}
              className={clsx("min-h-10 rounded-full px-5 text-[0.9rem] font-semibold capitalize transition-colors", billing === b ? "bg-porcelain shadow-sm" : "text-ink-soft")}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-t-[12rem] rounded-b-3xl bg-sage p-8 pt-20 text-porcelain" aria-live="polite">
        <div>
          <p className="eyebrow text-mist">Your household</p>
          <p className="display mt-4 text-[clamp(3rem,6vw,4.5rem)] leading-none tabular-nums">
            ${billing === "monthly" ? planMonthly : plan}
            <span className="ml-1 font-sans text-[1rem] text-porcelain/80">/{billing === "monthly" ? "month" : "year"}</span>
          </p>
          <dl className="mt-8 space-y-2 text-[0.98rem]">
            <div className="flex justify-between gap-4">
              <dt className="text-porcelain/80">Standard fees for the same care</dt>
              <dd className="tabular-nums line-through decoration-porcelain/50">${value.toLocaleString()}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-porcelain/80">Membership (yearly)</dt>
              <dd className="tabular-nums">${plan.toLocaleString()}</dd>
            </div>
          </dl>
        </div>
        <div className="mt-8 border-t border-porcelain/25 pt-6">
          <p className="text-porcelain/80">You&apos;d save about</p>
          <p className="display text-[2.6rem] leading-tight text-glow tabular-nums">${saving.toLocaleString()} a year</p>
          <Link href="/book?membership=1" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-porcelain px-6 font-semibold text-ink transition-colors hover:bg-white">
            Join at your first visit
          </Link>
        </div>
      </div>
    </div>
  );
}
