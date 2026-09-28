import Link from "next/link";
import { Parallax, Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { doctors } from "@/content/team";

/** Three doctors in arched frames, staggered like windows along a facade. */
export function TeamTeaser() {
  return (
    <ul className="grid gap-12 md:grid-cols-3 md:gap-8">
      {doctors.map((d, i) => (
        <li key={d.slug} className={i === 1 ? "md:mt-24" : i === 2 ? "md:mt-12" : undefined}>
          <Link href={`/team/${d.slug}`} transitionTypes={["nav-forward"]} className="group block" data-cursor="Meet">
            <Parallax className="arch aspect-[3/4] w-full" amount={12}>
              <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-soft)] group-hover:scale-[1.04]">
                <Photo image={d.image} sizes="(min-width: 768px) 30vw, 90vw" position="50% 25%" />
              </div>
            </Parallax>
            <Reveal className="mt-6">
              <p className="display text-[1.9rem] leading-tight">
                {d.name}
                <span className="ml-2 align-middle text-[0.9rem] font-sans text-ink-soft">{d.credentials}</span>
              </p>
              <p className="mt-1 text-[0.95rem] text-sage">{d.role}</p>
              <p className="mt-3 max-w-[32ch] text-ink-soft">{d.short}</p>
            </Reveal>
          </Link>
        </li>
      ))}
    </ul>
  );
}
