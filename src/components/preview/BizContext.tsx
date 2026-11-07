"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Biz } from "@/lib/biz-core";
import { defaultBiz } from "@/lib/biz";

const BizContext = createContext<Biz>(defaultBiz);
const DictContext = createContext<Record<string, string> | null>(null);

/** Client components read the business from here; without a provider it's the concept business. */
export function BizProvider({ biz, dict = null, children }: { biz: Biz; dict?: Record<string, string> | null; children: ReactNode }) {
  return (
    <BizContext.Provider value={biz}>
      <DictContext.Provider value={dict}>{children}</DictContext.Provider>
    </BizContext.Provider>
  );
}

export const useBiz = () => useContext(BizContext);

/** The Serbian for a line, already in the server's HTML: for what's on the first screen, which can't wait for Translate. */
export function useT() {
  const dict = useContext(DictContext);
  return (s: string) => dict?.[s] ?? s;
}
