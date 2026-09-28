import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import { Button, Arrow } from "@/components/ui/Button";
import { img } from "@/content/images";
import { services } from "@/content/services";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="pt-[calc(var(--header-h)+3rem)] pb-28">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <div>
          <p className="eyebrow anim-fade text-sage">Error 404</p>
          <h1 className="display h-lg anim-heading mt-6 max-w-[14ch]">
            This room is <em className="text-sage">still empty.</em>
          </h1>
          <p className="lede anim-fade mt-6 max-w-lg" style={{ "--d": "0.2s" } as React.CSSProperties}>
            The page you were looking for has moved or never existed. Take a breath; here are a few places to go instead.
          </p>
          <div className="anim-fade mt-9 flex flex-wrap gap-3" style={{ "--d": "0.35s" } as React.CSSProperties}>
            <Button href="/" icon={<Arrow />}>
              Back to home
            </Button>
            <Button href="/book" variant="ghost">
              Book a visit
            </Button>
          </div>
          <ul className="anim-fade mt-12 flex flex-wrap gap-2" style={{ "--d": "0.5s" } as React.CSSProperties}>
            {services.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="inline-flex min-h-11 items-center rounded-full bg-shell px-4 ring-1 ring-line hover:ring-ink/40">
                  {s.short}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="arch relative aspect-[3/4] w-full max-w-md justify-self-center">
          <Photo image={img.archWall} sizes="(min-width: 1024px) 30vw, 90vw" preload />
          <div aria-hidden className="shutters inset-0">
            <span />
            <span />
          </div>
        </div>
      </div>
    </section>
  );
}
