"use client";

import { useSyncExternalStore } from "react";
import clsx from "clsx";
import { hours, fmtTime } from "@/content/site";

/** Current day + minutes in Dallas, regardless of the visitor's timezone. */
function dallasNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, mins: Number(get("hour")) * 60 + Number(get("minute")) };
}

export function openStatus(): { open: boolean; text: string } {
  const { day, mins } = dallasNow();
  const today = hours.find((h) => h.day === day);
  if (today?.open != null && today.close != null) {
    if (mins >= today.open && mins < today.close) {
      const left = today.close - mins;
      return { open: true, text: left <= 60 ? `Open · closes soon (${fmtTime(today.close)})` : `Open now · until ${fmtTime(today.close)}` };
    }
    if (mins < today.open) return { open: false, text: `Opens today at ${fmtTime(today.open)}` };
  }
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const next = hours.find((h) => h.day === d);
    if (next?.open != null) return { open: false, text: `Closed · opens ${i === 1 ? "tomorrow" : next.label} ${fmtTime(next.open)}` };
  }
  return { open: false, text: "Closed" };
}

// Re-check once a minute. The server snapshot renders a neutral label (no hydration mismatch).
const subscribe = (cb: () => void) => {
  const id = window.setInterval(cb, 60_000);
  return () => window.clearInterval(id);
};
let cache: { key: number; value: string } | null = null;
const getSnapshot = () => {
  const key = Math.floor(Date.now() / 60_000);
  if (!cache || cache.key !== key) {
    const s = openStatus();
    cache = { key, value: `${s.open ? 1 : 0}|${s.text}` };
  }
  return cache.value;
};
const getServerSnapshot = () => "";

export function OpenBadge({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [flag, text] = snap ? snap.split("|") : ["", "Mon–Thu 7:30–7 · Sat 8–2"];
  const open = flag === "1";
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.8rem] font-medium",
        tone === "light" ? "bg-shell/80 text-ink ring-1 ring-line backdrop-blur" : "bg-porcelain/10 text-porcelain ring-1 ring-porcelain/20",
        className,
      )}
    >
      <span className="relative flex size-2">
        {open && <span className="absolute inset-0 rounded-full bg-emerald-600 motion-safe:animate-[pulse-ring_2.4s_ease-out_infinite]" />}
        <span className={clsx("relative size-2 rounded-full", open ? "bg-emerald-600" : snap ? "bg-sand" : "bg-mist")} />
      </span>
      <span suppressHydrationWarning>{text}</span>
    </span>
  );
}
