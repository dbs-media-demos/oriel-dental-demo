import { sr } from "@/i18n/sr";
import type { Biz } from "./biz-core";

/** Server components: the Serbian for a line of the first screen, so it's in the HTML from the first byte (client components: useT). */
export const tr = (biz: Pick<Biz, "lang">, s: string) => (biz.lang === "sr" ? (sr[s] ?? s) : s);
