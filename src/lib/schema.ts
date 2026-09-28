import { absoluteUrl, hours, site, siteUrl } from "@/content/site";
import { reviews } from "@/content/reviews";
import type { Service } from "@/content/services";
import type { Doctor } from "@/content/team";

/** schema.org builders. Everything points back to one Dentist node via @id. */

export const practiceId = `${siteUrl}/#dentist`;
export const websiteId = `${siteUrl}/#website`;

type Json = Record<string, unknown>;

const pad = (n: number) => String(n).padStart(2, "0");
const hm = (mins: number) => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;
const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function dentistSchema(): Json {
  return {
    "@type": "Dentist",
    "@id": practiceId,
    name: site.name,
    slogan: site.tagline,
    description: site.description,
    url: siteUrl,
    telephone: site.phoneE164,
    email: site.email,
    image: [absoluteUrl("/images/reception-arches.jpg"), absoluteUrl("/images/studio-consult.jpg"), absoluteUrl("/images/suite-wood.jpg")],
    logo: absoluteUrl("/icon-512.png"),
    priceRange: "$$",
    currenciesAccepted: "USD",
    paymentAccepted: "Cash, Credit Card, HSA/FSA, Financing",
    foundingDate: String(site.founded),
    knowsLanguage: ["en", "es"],
    isAcceptingNewPatients: true,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postal,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: "https://www.google.com/maps/search/?api=1&query=Uptown+Dallas+TX",
    areaServed: site.areaServed.map((name) => ({ "@type": "Place", name: `${name}, Dallas, TX` })),
    openingHoursSpecification: hours
      .filter((h) => h.open != null && h.close != null)
      .map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: dayName[h.day], opens: hm(h.open!), closes: hm(h.close!) })),
    aggregateRating: { "@type": "AggregateRating", ratingValue: site.rating.value, reviewCount: site.rating.count, bestRating: 5, worstRating: 1 },
    review: reviews.slice(0, 6).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      datePublished: r.date,
      reviewBody: r.text,
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
    })),
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Free validated parking", value: true },
      { "@type": "LocationFeatureSpecification", name: "Wheelchair accessible", value: true },
      { "@type": "LocationFeatureSpecification", name: "Spanish-speaking staff", value: true },
    ],
  };
}

export function websiteSchema(): Json {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: siteUrl,
    name: site.name,
    description: site.description,
    publisher: { "@id": practiceId },
    inLanguage: "en-US",
  };
}

export function webPageSchema(opts: { path: string; name: string; description: string; type?: string }): Json {
  return {
    "@type": opts.type ?? "WebPage",
    "@id": `${absoluteUrl(opts.path)}#webpage`,
    url: absoluteUrl(opts.path),
    name: opts.name,
    description: opts.description,
    inLanguage: "en-US",
    isPartOf: { "@id": websiteId },
    about: { "@id": practiceId },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: absoluteUrl(item.path) })),
  };
}

export function serviceSchema(s: Service): Json {
  return {
    "@type": "Service",
    "@id": `${absoluteUrl(`/services/${s.slug}`)}#service`,
    name: s.name,
    serviceType: s.name,
    category: "Dentistry",
    description: s.summary,
    url: absoluteUrl(`/services/${s.slug}`),
    image: absoluteUrl(s.image.src),
    provider: { "@id": practiceId },
    areaServed: site.areaServed.map((name) => ({ "@type": "Place", name: `${name}, Dallas, TX` })),
    offers: { "@type": "Offer", priceCurrency: "USD", description: s.price, availability: "https://schema.org/InStock" },
  };
}

/** Plain Service node (for service catalogs). */
export function offerCatalogSchema(list: Service[]): Json {
  return {
    "@type": "OfferCatalog",
    "@id": `${siteUrl}/services#catalog`,
    name: "Dental treatments at Oriel Dental Studio",
    itemListElement: list.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.name,
        serviceType: s.name,
        description: s.summary,
        url: absoluteUrl(`/services/${s.slug}`),
        provider: { "@id": practiceId },
        areaServed: { "@type": "City", name: "Dallas, TX" },
      },
      priceSpecification: { "@type": "PriceSpecification", priceCurrency: "USD", description: s.price },
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]): Json {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function physicianSchema(d: Doctor): Json {
  return {
    "@type": "Person",
    "@id": `${absoluteUrl(`/team/${d.slug}`)}#person`,
    name: d.name,
    honorificSuffix: d.credentials,
    jobTitle: d.role,
    image: absoluteUrl(d.image.src),
    worksFor: { "@id": practiceId },
    knowsLanguage: d.languages,
    alumniOf: d.education[0],
    description: d.short,
  };
}

export const graph = (...nodes: Json[]) => ({ "@context": "https://schema.org", "@graph": nodes });
