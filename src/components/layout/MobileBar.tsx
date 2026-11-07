"use client";

import Link from "next/link";
import clsx from "clsx";
import { PhoneIcon } from "@/components/ui/Button";
import { useBiz, useT } from "@/components/preview/BizContext";
import { telOf } from "@/lib/biz-core";

/** Thumb-reach Call + Book bar on phones. The Call button shows the number. */
export function MobileBar() {
  const biz = useBiz();
  const t = useT();
  const tel = telOf(biz);
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-porcelain px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] md:hidden phone:block">
      <div className={clsx("grid gap-2.5", tel ? "grid-cols-[1.25fr_1fr]" : "grid-cols-1")}>
        {tel && (
          <a href={tel} aria-label={`${t("Call")} ${biz.phoneDisplay}`} className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink/15 bg-shell text-[clamp(0.8rem,3.8vw,0.95rem)] font-semibold whitespace-nowrap text-ink">
            <PhoneIcon className="shrink-0" />
            {biz.phoneDisplay}
          </a>
        )}
        <Link href="/book" className="flex min-h-12 items-center justify-center rounded-full bg-sage text-[clamp(0.8rem,3.8vw,0.95rem)] font-semibold whitespace-nowrap text-porcelain">
          {t("Book a visit")}
        </Link>
      </div>
    </div>
  );
}
