import { site, hours, fullAddress } from "@/content/site";
import { hmFromMinutes, type Biz, type DayHours } from "./biz-core";

export type { Biz } from "./biz-core";

/** The fictional practice as a Biz: what the concept site shows (previews swap in a real one). */
export const defaultBiz: Biz = {
  lang: "en",
  name: site.name,
  shortName: site.shortName,
  tagline: null,
  area: site.address.neighborhood,
  phone: site.phoneHref.replace(/^tel:/, ""),
  phoneDisplay: site.phone,
  address: { street: site.address.street, city: site.address.city, region: site.address.region, postal: site.address.postal, full: fullAddress },
  timezone: "America/Chicago",
  hours: [0, 1, 2, 3, 4, 5, 6].map((day): DayHours => {
    const h = hours.find((x) => x.day === day);
    return { day, open: hmFromMinutes(h?.open), close: hmFromMinutes(h?.close) };
  }),
  hoursSummary: "Mon–Thu 7:30–7 · Sat 8–2",
  rating: { ...site.rating },
  preview: false,
};
