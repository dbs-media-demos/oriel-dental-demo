"use client";

import { useSyncExternalStore } from "react";
import clsx from "clsx";
import { openStatus as statusOf } from "@/lib/biz-core";
import { defaultBiz } from "@/lib/biz";
import { useBiz } from "@/components/preview/BizContext";

/** The concept practice's status (used outside the badge, e.g. the booking page) */
export function openStatus(): { open: boolean; text: string } {
  return statusOf(defaultBiz) ?? { open: false, text: "Closed" };
}

// Re-check once a minute. The server snapshot renders a neutral label (no hydration mismatch).
const subscribe = (cb: () => void) => {
  const id = window.setInterval(cb, 60_000);
  return () => window.clearInterval(id);
};
const minute = () => Math.floor(Date.now() / 60_000);

export function OpenBadge({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const biz = useBiz();
  const tick = useSyncExternalStore(subscribe, minute, () => 0);
  // A preview of a business whose hours we don't know: no badge rather than a made-up one
  if (!biz.hours) return null;
  const status = tick ? statusOf(biz) : null;
  const snap = status ? "1" : "";
  const text = status?.text ?? biz.hoursSummary;
  const open = !!status?.open;
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
