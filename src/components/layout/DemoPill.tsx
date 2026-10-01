"use client";

import { useSyncExternalStore, useState } from "react";
import { site } from "@/content/site";
import { useBiz } from "@/components/preview/BizContext";

const KEY = "oriel-demo-pill-hidden";
const read = () => {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};

/** "Concept site by Scale by Noon": small, fixed and dismissible. Shorter label on phones. */
export function DemoPill() {
  const biz = useBiz();
  const stored = useSyncExternalStore(
    () => () => {},
    read,
    () => false,
  );
  const [dismissed, setDismissed] = useState(false);
  if (stored || dismissed) return null;

  return (
    <div className="fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom))] left-3 z-40 flex items-center rounded-full bg-night/90 py-1 pr-1 pl-3.5 text-[0.75rem] text-porcelain shadow-lg ring-1 ring-porcelain/10 backdrop-blur md:right-5 md:bottom-5 md:left-auto">
      <a href={site.agencyUrl} className="py-1.5 font-medium whitespace-nowrap hover:underline">
        {biz.preview ? (
          <span className="block max-w-[15rem] truncate md:max-w-none">
            {biz.lang === "sr" ? `Pregled za ${biz.shortName} · Scale by Noon ↗` : `Preview for ${biz.shortName} · by Scale by Noon ↗`}
          </span>
        ) : (
          <>
            <span className="md:hidden">Concept by Scale by Noon ↗</span>
            <span className="hidden md:inline">Concept site by Scale by Noon ↗</span>
          </>
        )}
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
