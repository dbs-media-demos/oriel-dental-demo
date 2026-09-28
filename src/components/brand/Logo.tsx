import clsx from "clsx";

/** Shared geometry, reused by the favicon, OG image and manifest icon. */
export const MARK = {
  viewBox: "0 0 40 48",
  arch: "M7 45V20.5a13 13 0 0 1 26 0V45",
  sill: "M3.5 45h33",
  smile: "M13.5 30.5c3.8 3.6 9.2 3.6 13 0",
  sun: { cx: 20, cy: 17.5, r: 3.1 },
};

/** The Oriel mark: an arched window with morning sun and a smile on the sill. */
export function Mark({ className, sun = "var(--color-glow)" }: { className?: string; sun?: string }) {
  return (
    <svg viewBox={MARK.viewBox} className={className} aria-hidden fill="none">
      <path d={MARK.arch} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d={MARK.sill} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d={MARK.smile} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle {...MARK.sun} fill={sun} />
    </svg>
  );
}

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5", className)}>
      <Mark className="h-9 w-auto shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="display text-[1.7rem] tracking-[-0.02em]" style={{ lineHeight: 0.9 }}>
          Oriel
        </span>{" "}
        {!compact && <span className="mt-1 text-[0.58rem] font-semibold tracking-[0.34em] uppercase opacity-70">Dental Studio</span>}
      </span>
    </span>
  );
}
