import { PageHero } from "@/components/ui/PageHero";
import { TeamTeaser } from "@/components/sections/TeamTeaser";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/ui/JsonLd";
import { Parallax, Reveal, SplitReveal, ScrubWords } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { img } from "@/content/images";
import { doctors, team } from "@/content/team";
import { buildMetadata } from "@/lib/seo";
import { graph, physicianSchema, webPageSchema } from "@/lib/schema";

const title = "Meet Our Dentists & Team";
const description =
  "Meet Dr. Elena Marsh, Dr. Julian Ashford and Dr. Sofia Delgado, plus the hygienists and coordinators who make Oriel Dental Studio in Uptown Dallas feel calm. Se habla español.";

export const metadata = buildMetadata({ title, description, path: "/team", eyebrow: "Our team" });

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Meet the team"
        title={
          <>
            Unhurried hands, <em className="text-sage">familiar faces.</em>
          </>
        }
        lede="Three doctors, two hygienists, and the people who answer the phone. Most of us have been here for years, so you'll see the same faces every visit."
        crumbs={[{ name: "Team", path: "/team" }]}
        image={img.studioConsult2}
      />

      <section aria-labelledby="doctors-title" className="py-20 md:py-32">
        <div className="container-x">
          <h2 id="doctors-title" className="eyebrow text-sage">
            Your doctors
          </h2>
          <div className="mt-12">
            <TeamTeaser />
          </div>
        </div>
      </section>

      <section aria-labelledby="promise-title" className="bg-night py-24 text-porcelain md:py-36">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
          <div>
            <p className="eyebrow text-mist">Our promise</p>
            <h2 id="promise-title" className="sr-only">
              Our promise to every patient
            </h2>
            <Parallax className="arch mt-10 hidden aspect-[3/4] w-3/4 lg:block" amount={12}>
              <div className="absolute inset-0">
                <Photo image={img.receptionDesk} sizes="30vw" />
              </div>
            </Parallax>
          </div>
          <ScrubWords
            className="display text-[clamp(1.8rem,3.4vw,3.2rem)] leading-[1.15]"
            text="Nothing happens until you understand it. You'll always see the photo, hear the options and know the price. If you raise your hand, we stop. If you'd rather wait and think, that's a perfectly good answer."
          />
        </div>
      </section>

      <section aria-labelledby="crew-title" className="py-24 md:py-36">
        <div className="container-x">
          <p className="eyebrow text-sage">The crew</p>
          <SplitReveal id="crew-title" className="display h-md mt-6">
            The people you&apos;ll <em>actually talk to.</em>
          </SplitReveal>
          <Reveal as="ul" stagger={0.1} className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <li key={m.name}>
                <div className="arch relative aspect-[3/4] bg-linen">
                  <Photo image={m.image} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw" position="50% 25%" />
                </div>
                <h3 className="display mt-5 text-[1.6rem]">{m.name}</h3>
                <p className="text-[0.95rem] text-sage">{m.role}</p>
                <p className="mt-2 text-ink-soft">{m.note}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <FinalCta title="Come say hello. Coffee's on us." eyebrow="Meet & greet" />
      <JsonLd data={graph(webPageSchema({ path: "/team", name: title, description, type: "AboutPage" }), ...doctors.map(physicianSchema))} />
    </>
  );
}
