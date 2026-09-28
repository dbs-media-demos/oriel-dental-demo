"use client";

import { useSyncExternalStore, useState } from "react";

const KEY = "oriel-demo-pill-hidden";
const read = () => {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};

/** "Concept site by DBS Media": small, fixed and dismissible. */
export function DemoPill() {
  const stored = useSyncExternalStore(
    () => () => {},
    read,
    () => false,
  );
  const [dismissed, setDismissed] = useState(false);
  if (stored || dismissed) return null;

  return (
    <div className="fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom))] left-3 z-40 flex items-center rounded-full bg-night/90 py-1 pr-1 pl-3.5 text-[0.75rem] text-porcelain shadow-lg ring-1 ring-porcelain/10 backdrop-blur md:right-5 md:bottom-5 md:left-auto">
      <a href="https://dbs-media.com" className="py-1.5 font-medium hover:underline">
        Concept site by DBS Media ↗
      </a>
      <button
        type="button"
        aria-label="Dismiss concept site notice"
        onClick={() => {
          setDismissed(true);
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
        }}
        className="ml-1 grid size-8 place-items-center rounded-full text-base leading-none text-porcelain/70 hover:bg-porcelain/10 hover:text-porcelain"
      >
        ×
      </button>
    </div>
  );
}
