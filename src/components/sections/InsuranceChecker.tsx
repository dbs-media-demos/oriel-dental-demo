"use client";

import Link from "next/link";
import { useId, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { insurers, statusCopy, type Insurer } from "@/content/insurance";

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "");

/** Accessible combobox: type your insurer, get an instant, friendly answer. */
export function InsuranceChecker({ compact = false }: { compact?: boolean }) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const [picked, setPicked] = useState<Insurer | "none" | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const matches = useMemo(() => {
    const q = norm(query.trim());
    if (!q) return insurers.slice(0, 8);
    return insurers.filter((i) => norm(i.name).includes(q) || i.aliases?.some((a) => a.includes(q) || q.includes(a))).slice(0, 8);
  }, [query]);

  const choose = (i: Insurer) => {
    setPicked(i);
    setQuery(i.name);
    setOpen(false);
  };

  const result = picked && picked !== "none" ? statusCopy[picked.status] : null;

  return (
    <div className={clsx("rounded-[2rem] bg-shell p-6 ring-1 ring-line sm:p-10", compact && "sm:p-8")}>
      <label htmlFor={`${id}-input`} className="eyebrow text-sage">
        Check your insurance
      </label>
      <div className="relative mt-4">
        <svg viewBox="0 0 20 20" className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-ink-soft" aria-hidden fill="none">
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
          <path d="m13.5 13.5 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          ref={input}
          id={`${id}-input`}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={open && matches[hi] ? `${id}-opt-${hi}` : undefined}
          autoComplete="off"
          placeholder="Start typing, e.g. Delta, Cigna, MetLife…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHi(0);
            setPicked(null);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setHi((h) => Math.min(matches.length - 1, h + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHi((h) => Math.max(0, h - 1));
            } else if (e.key === "Enter" && open && matches[hi]) {
              e.preventDefault();
              choose(matches[hi]);
            } else if (e.key === "Escape") setOpen(false);
          }}
          className="h-16 w-full rounded-full bg-porcelain pr-6 pl-14 text-[1.05rem] ring-1 ring-line transition-shadow outline-none placeholder:text-ink-soft/80 focus:ring-2 focus:ring-sage"
        />
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label="Insurance plans"
          hidden={!open || matches.length === 0}
          className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-20 max-h-80 overflow-auto rounded-3xl bg-porcelain p-2 shadow-[0_24px_60px_-20px_rgb(30_41_38/0.35)] ring-1 ring-line"
        >
          {matches.map((m, i) => (
            <li
              key={m.name}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={i === hi}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(m);
              }}
              onMouseEnter={() => setHi(i)}
              className={clsx("flex cursor-pointer items-center justify-between rounded-2xl px-4 py-3", i === hi && "bg-mist-soft")}
            >
              <span>{m.name}</span>
              <span className={clsx("text-[0.75rem] font-semibold", m.status === "in-network" ? "text-sage" : "text-ink-soft")}>{statusCopy[m.status].label}</span>
            </li>
          ))}
        </ul>
      </div>
      <button type="button" onClick={() => { setPicked("none"); setQuery(""); }} className="mt-4 text-[0.92rem] font-semibold text-sage underline-offset-4 hover:underline">
        I don&apos;t have dental insurance
      </button>

      <div aria-live="polite" className="mt-2">
        {picked && (
          <div key={picked === "none" ? "none" : picked.name} className="mt-6 rounded-3xl bg-porcelain p-6 ring-1 ring-line" style={{ animation: "fade-in 0.9s var(--ease-soft) both" }}>
            {picked === "none" ? (
              <>
                <p className="flex items-center gap-2 font-semibold">
                  <span aria-hidden className="grid size-7 place-items-center rounded-full bg-sand text-ink">✦</span>
                  No insurance? You&apos;re covered too.
                </p>
                <p className="mt-3 text-ink-soft">
                  The Oriel Membership is <strong className="text-ink">$29/month</strong> for adults: two cleanings, exams, x-rays and an emergency visit each year, plus
                  15% off everything else. No deductibles, no waiting periods.
                </p>
                <Link href="/membership" className="mt-4 inline-block font-semibold text-sage underline underline-offset-4">
                  See the membership plan
                </Link>
              </>
            ) : (
              result && (
                <>
                  <p className="flex items-center gap-2 font-semibold">
                    <span
                      aria-hidden
                      className={clsx("grid size-7 place-items-center rounded-full", picked.status === "in-network" ? "bg-sage text-porcelain" : "bg-sand text-ink")}
                    >
                      {picked.status === "in-network" ? "✓" : "↗"}
                    </span>
                    {picked.name}: {result.label}
                  </p>
                  <p className="mt-3 text-ink-soft">{picked.note ?? result.body}</p>
                  <Link href="/book" className="mt-4 inline-block font-semibold text-sage underline underline-offset-4">
                    Book your first visit
                  </Link>
                </>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
