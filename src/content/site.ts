/** Oriel Dental Studio: a fictional practice built as a DBS Media concept site. */

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://oriel-dental-demo.vercel.app").replace(/\/$/, "");
export const absoluteUrl = (path = "/") => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

/** Demos stay out of search engines unless NEXT_PUBLIC_NOINDEX is explicitly "false". */
export const noindex = process.env.NEXT_PUBLIC_NOINDEX !== "false";

export const site = {
  name: "Oriel Dental Studio",
  shortName: "Oriel",
  tagline: "Dentistry, in a better light.",
  description:
    "Calm, light-filled family and cosmetic dentistry in Uptown Dallas. Same-day emergencies, evening and Saturday hours, 3D scans instead of goopy impressions, and prices before anything starts.",
  phone: "(214) 555-0163",
  phoneHref: "tel:+12145550163",
  phoneE164: "+1-214-555-0163",
  sms: "(214) 555-0163",
  email: "hello@orieldental.com",
  address: {
    street: "2718 Linden Row, Suite 200",
    city: "Dallas",
    region: "TX",
    postal: "75201",
    country: "US",
    neighborhood: "Uptown",
  },
  geo: { lat: 32.8007, lng: -96.8016 },
  founded: 2014,
  rating: { value: 4.9, count: 412 },
  languages: ["English", "Spanish"],
  parking: "Free validated parking in the Linden Row garage. The M-Line trolley stops half a block away.",
  areaServed: ["Uptown", "Victory Park", "Oak Lawn", "Turtle Creek", "State Thomas", "Highland Park", "Downtown Dallas", "Knox-Henderson"],
  newPatientOffer: {
    price: "$99",
    title: "The $99 first visit",
    detail: "Exam, full 3D scan, digital x-rays and a gentle cleaning for new patients without insurance.",
  },
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    google: "https://google.com/maps",
  },
  dbsMedia: "https://dbs-media.com",
} as const;

export const fullAddress = `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postal}`;

/** Weekly schedule in practice-local time (America/Chicago). 0 = Sunday. Times are minutes after midnight. */
export const hours: { day: number; label: string; open?: number; close?: number }[] = [
  { day: 1, label: "Monday", open: 7 * 60 + 30, close: 19 * 60 },
  { day: 2, label: "Tuesday", open: 7 * 60 + 30, close: 19 * 60 },
  { day: 3, label: "Wednesday", open: 7 * 60 + 30, close: 19 * 60 },
  { day: 4, label: "Thursday", open: 7 * 60 + 30, close: 19 * 60 },
  { day: 5, label: "Friday", open: 7 * 60 + 30, close: 15 * 60 },
  { day: 6, label: "Saturday", open: 8 * 60, close: 14 * 60 },
  { day: 0, label: "Sunday" },
];

export const fmtTime = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = ((h + 11) % 12) + 1;
  return m ? `${h12}:${String(m).padStart(2, "0")} ${suffix}` : `${h12} ${suffix}`;
};

export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: "Treatments", href: "/services" },
  { label: "Smile gallery", href: "/smile-gallery" },
  { label: "Team", href: "/team" },
  { label: "New patients", href: "/new-patients" },
  { label: "Insurance", href: "/insurance-financing" },
  { label: "The studio", href: "/office-tour" },
];

export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: "Visit",
    links: [
      { label: "Book a visit", href: "/book" },
      { label: "New patients", href: "/new-patients" },
      { label: "Insurance & financing", href: "/insurance-financing" },
      { label: "Membership plan", href: "/membership" },
      { label: "Contact & directions", href: "/contact" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "Meet the team", href: "/team" },
      { label: "Office tour", href: "/office-tour" },
      { label: "Smile gallery", href: "/smile-gallery" },
      { label: "Reviews", href: "/reviews" },
      { label: "FAQ", href: "/faq" },
    ],
  },
];
