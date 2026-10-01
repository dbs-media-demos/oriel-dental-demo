import type { ReactNode } from "react";
import { JsonLd } from "@/components/ui/JsonLd";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { dentistSchema, graph, websiteSchema } from "@/lib/schema";

/** The concept site: the fictional practice's chrome and structured data around every page. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteChrome>{children}</SiteChrome>
      <JsonLd data={graph(dentistSchema(), websiteSchema())} />
    </>
  );
}
