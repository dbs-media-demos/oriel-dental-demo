import Link from "next/link";
import { Parallax, Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { doctors } from "@/content/team";

/** Three doctors in arched frames, staggered like windows along a facade; a row to swipe on phones. */
export function TeamTeaser() {
  return (
    <ul className="swipe grid gap-12 md:grid-cols-3 md:gap-8">
      {doctors.map((d, i) => (
        <li key={d.slug} className={i === 1 ? "md:mt-24 phone:mt-0" : i === 2 ? "md:mt-12 phone:mt-0" : undefined}>
          <Link href={`/team/${d.slug}`} transitionTypes={["nav-forward"]} className="group block" data-cursor="Meet">
            <Parallax className="arch aspect-[3/4] w-full phone:aspect-square" amount={12}>
              <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-soft)] group-hover:scale-[1.04]">
                <Photo image={d.image} sizes="(max-width: 767px) 62vw, (min-width: 768px) 30vw, 90vw" position="50% 25%" />
              </div>
            </Parallax>
            <Reveal className="mt-6 phone:mt-3">
              <p className="display text-[1.9rem] leading-tight phone:text-[1.3rem]">
                {d.name}
                <span className="ml-2 align-middle text-[0.9rem] font-sans text-ink-soft phone:ml-0 phone:block phone:text-[0.8rem]">{d.credentials}</span>
              </p>
              <p className="mt-1 text-[0.95rem] text-sage phone:text-[0.82rem] phone:leading-snug">{d.role}</p>
              <p className="mt-3 max-w-[32ch] text-ink-soft phone:mt-1.5 phone:text-[0.88rem] phone:leading-snug">{d.short}</p>
              <p className="mt-1.5 hidden text-[0.78rem] leading-snug text-ink-soft phone:block">{d.education[0]}</p>
            </Reveal>
          </Link>
        </li>
      ))}
    </ul>
  );
}
