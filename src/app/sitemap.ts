import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/content/site";
import { services } from "@/content/services";
import { doctors } from "@/content/team";

// Bump when page content changes meaningfully.
const UPDATED = new Date("2026-09-28");

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number][] = [
    ["/", 1],
    ["/services", 0.9],
    ["/book", 0.9],
    ["/new-patients", 0.8],
    ["/insurance-financing", 0.8],
    ["/membership", 0.7],
    ["/smile-gallery", 0.7],
    ["/team", 0.7],
    ["/office-tour", 0.6],
    ["/reviews", 0.6],
    ["/faq", 0.6],
    ["/contact", 0.8],
    ["/privacy", 0.2],
  ];
  return [
    ...pages.map(([p, priority]) => ({ url: absoluteUrl(p), lastModified: UPDATED, changeFrequency: "monthly" as const, priority })),
    ...services.map((s) => ({ url: absoluteUrl(`/services/${s.slug}`), lastModified: UPDATED, changeFrequency: "monthly" as const, priority: 0.85 })),
    ...doctors.map((d) => ({ url: absoluteUrl(`/team/${d.slug}`), lastModified: UPDATED, changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
