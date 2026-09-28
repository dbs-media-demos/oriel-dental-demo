import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";
import { Photo } from "./Photo";
import type { Img } from "@/content/images";
import { JsonLd } from "./JsonLd";
import { breadcrumbSchema, graph } from "@/lib/schema";

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={clsx("text-[0.85rem] text-ink-soft", className)}>
      <ol className="flex flex-wrap items-center gap-2">
        {all.map((c, i) => (
          <li key={c.path} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>/</span>}
            {i === all.length - 1 ? (
              <span aria-current="page" className="text-ink">
                {c.name}
              </span>
            ) : (
              <Link href={c.path} className="link-underline hover:text-ink">
                {c.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
      <JsonLd data={graph(breadcrumbSchema(all))} />
    </nav>
  );
}

/**
 * Inner-page hero: CSS-only intro (first paint), optional arch image that opens like the home window.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  crumbs,
  image,
  imagePosition,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  crumbs: Crumb[];
  image?: Img;
  imagePosition?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative pt-[calc(var(--header-h)+2rem)] pb-16 md:pt-[calc(var(--header-h)+3.5rem)] md:pb-24">
      <div className={clsx("container-x grid gap-12", image ? "items-center lg:grid-cols-[1.25fr_1fr] lg:gap-20" : "items-end")}>
        <div>
          <Breadcrumbs items={crumbs} className="anim-fade" />
          <p className="eyebrow anim-fade mt-10 text-sage" style={{ "--d": "0.05s" } as React.CSSProperties}>
            {eyebrow}
          </p>
          <h1 className="display h-lg anim-heading mt-6 max-w-[16ch]" style={{ "--d": "0.1s" } as React.CSSProperties}>
            {title}
          </h1>
          {lede && (
            <p className="lede anim-fade mt-7 max-w-[38rem]" style={{ "--d": "0.3s" } as React.CSSProperties}>
              {lede}
            </p>
          )}
          {children && (
            <div className="anim-fade mt-9" style={{ "--d": "0.45s" } as React.CSSProperties}>
              {children}
            </div>
          )}
        </div>
        {image && (
          <div className="arch relative aspect-[4/5] w-full lg:aspect-[3/4]">
            <div className="anim-settle absolute inset-0">
              <Photo image={image} sizes="(min-width: 1024px) 40vw, 100vw" preload position={imagePosition} />
            </div>
            <div aria-hidden className="shutters inset-0">
              <span />
              <span />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
