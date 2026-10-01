import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal, SplitReveal } from "@/components/ui/Reveal";
import { Button, Arrow } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { doctors, getDoctor } from "@/content/team";
import { buildMetadata } from "@/lib/seo";
import { graph, physicianSchema, webPageSchema } from "@/lib/schema";

export function generateStaticParams() {
  return doctors.map((d) => ({ slug: d.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/team/[slug]">) {
  const { slug } = await params;
  const d = getDoctor(slug);
  if (!d) return {};
  return buildMetadata({
    title: `${d.name}, ${d.credentials}: ${d.role.split(" · ")[0]}`,
    description: `${d.short} ${d.name} practices at Oriel Dental Studio in Uptown Dallas.`,
    path: `/team/${d.slug}`,
    eyebrow: "Meet your dentist",
  });
}

const focusLinks: Record<string, string> = {
  "Porcelain veneers & bonding": "porcelain-veneers",
  Whitening: "teeth-whitening",
  "Family dentistry": "general-family-dentistry",
  "Dental implants": "dental-implants",
  "Oral & nitrous sedation": "sedation-dentistry",
  "Kids' dentistry": "kids-dentistry",
  "Family care": "general-family-dentistry",
  "Smile design": "cosmetic-dentistry",
};

export default async function DoctorPage({ params }: PageProps<"/team/[slug]">) {
  const { slug } = await params;
  const d = getDoctor(slug);
  if (!d) notFound();
  const others = doctors.filter((o) => o.slug !== d.slug);
  const path = `/team/${d.slug}`;

  return (
    <>
      <PageHero
        eyebrow={d.role}
        title={
          <>
            {d.name}
            <span className="ml-3 align-middle font-sans text-[1.1rem] tracking-normal text-ink-soft">{d.credentials}</span>
          </>
        }
        lede={d.short}
        crumbs={[
          { name: "Team", path: "/team" },
          { name: d.name, path },
        ]}
        image={d.image}
        imagePosition="50% 25%"
      >
        <Button href={`/book?doctor=${d.slug}`} icon={<Arrow />}>
          Book with {d.name}
        </Button>
      </PageHero>

      <section aria-labelledby="bio-title" className="py-20 md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
          <div>
            <p className="eyebrow text-sage">In their words</p>
            <SplitReveal as="p" className="display h-sm mt-6 max-w-[22ch] text-sage-deep">
              &ldquo;{d.quote}&rdquo;
            </SplitReveal>
          </div>
          <Reveal className="space-y-6 text-[1.12rem] leading-relaxed text-ink-soft">
            <h2 id="bio-title" className="sr-only">
              About {d.name}
            </h2>
            {d.bio.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <p>
              <strong className="font-semibold text-ink">Off duty:</strong> {d.offDuty}
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-label="Credentials" className="bg-shell py-20 md:py-28">
        <Reveal stagger={0.1} className="container-x grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="eyebrow text-sage">Focus</h3>
            <ul className="mt-4 space-y-2">
              {d.focus.map((f) => (
                <li key={f}>
                  {focusLinks[f] ? (
                    <Link href={`/services/${focusLinks[f]}`} className="link-underline">
                      {f}
                    </Link>
                  ) : (
                    f
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="eyebrow text-sage">Education</h3>
            <ul className="mt-4 space-y-2 text-ink-soft">
              {d.education.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="eyebrow text-sage">Memberships</h3>
            <ul className="mt-4 space-y-2 text-ink-soft">
              {d.memberships.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="eyebrow text-sage">Languages</h3>
            <p className="mt-4 text-ink-soft">{d.languages.join(", ")}</p>
          </div>
        </Reveal>
      </section>

      <section aria-labelledby="others-title" className="py-20 md:py-32">
        <div className="container-x">
          <h2 id="others-title" className="display h-sm">
            Also at Oriel
          </h2>
          <ul className="mt-10 grid gap-6 md:grid-cols-2">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/team/${o.slug}`} className="group flex items-center gap-6 rounded-3xl bg-shell p-4 ring-1 ring-line transition-shadow hover:ring-ink/30">
                  <span className="relative aspect-[3/4] w-28 shrink-0 overflow-hidden rounded-t-full rounded-b-xl">
                    <Photo image={o.image} sizes="112px" alt="" position="50% 25%" />
                  </span>
                  <span>
                    <span className="display block text-[1.6rem] leading-tight">{o.name}</span>
                    <span className="mt-1 block text-[0.95rem] text-sage">{o.role}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FinalCta title={`Book a visit with ${d.name}.`} eyebrow="New patients welcome" />
      <JsonLd
        data={graph(
          webPageSchema({ path, name: d.name, description: d.short, type: "ProfilePage" }),
          { ...physicianSchema(d), knowsAbout: d.focus },
        )}
      />
    </>
  );
}
