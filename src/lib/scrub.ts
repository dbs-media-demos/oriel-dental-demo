import type { Biz } from "./biz-core";

/**
 * The concept copy names Oriel and its fictional doctors. On a preview those lines are about a
 * real practice, so the names come out ("Dr. Ashford replaced…" → "The dentist replaced…").
 * Serbian previews are translated from the dictionary, written without the names.
 */
export function scrub(text: string, biz: Pick<Biz, "preview" | "shortName">) {
  if (!biz.preview) return text;
  return text
    .replace(/Oriel Membership/g, "membership plan")
    .replace(/our Oriel kit/g, "our welcome kit")
    .replace(/Oriel Dental Studio|Oriel/g, biz.shortName)
    .replace(/\bDr\. Sofia Delgado\b/g, "Our children's dentist")
    .replace(/(^|[.!?] )Dr\. (Ashford|Marsh|Delgado)/g, "$1The dentist")
    .replace(/\bDr\. (Ashford|Marsh|Delgado)\b/g, "the dentist")
    .replace(/the nicest waiting room in Dallas/g, "the nicest waiting room in town");
}
