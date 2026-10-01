"use client";

import Link from "next/link";
import { PhoneIcon } from "@/components/ui/Button";
import { useBiz } from "@/components/preview/BizContext";
import { telOf } from "@/lib/biz-core";

/** Thumb-reach Call + Book bar on phones. */
export function MobileBar() {
  const biz = useBiz();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-porcelain/95 px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="grid grid-cols-[1fr_1.4fr] gap-2.5">
        <a href={telOf(biz)} className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink/15 bg-shell font-semibold text-ink">
          <PhoneIcon />
          Call
        </a>
        <Link href="/book" className="flex min-h-12 items-center justify-center rounded-full bg-sage font-semibold text-porcelain">
          Book a visit
        </Link>
      </div>
    </div>
  );
}
