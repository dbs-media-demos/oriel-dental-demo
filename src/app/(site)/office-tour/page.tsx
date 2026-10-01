import { PageHero } from "@/components/ui/PageHero";
import { OfficeRail } from "@/components/sections/OfficeRail";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/ui/JsonLd";
import { Parallax, Reveal, SplitReveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { img, type Img } from "@/content/images";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { graph, webPageSchema } from "@/lib/schema";

const title = "Office Tour: A Light-Filled Dental Studio in Uptown";
const description =
  "Take a photo tour of Oriel Dental Studio: a second-floor Uptown Dallas studio where every chair faces a window, with a tea lounge, private recovery room and free validated parking.";

export const metadata = buildMetadata({ title, description, path: "/office-tour", eyebrow: "Office tour" });

const rooms: { name: string; text: string; images: [Img, Img] }[] = [
  {
    name: "Arrival",
    text: "Oak, olive trees and a real person at the desk. Check-in takes a minute, because your forms are already done.",
    images: [img.lobbyWood, img.receptionDesk],
  },
  {
    name: "The lounge",
    text: "Armchairs by the window, lavender tea, sparkling water and zero dental posters. Most people wait less than five minutes anyway.",
    images: [img.loungeWindow, img.loungeHall],
  },
  {
    name: "Treatment suites",
    text: "Four private suites with north light, a ceiling screen and noise-cancelling headphones at every chair.",
    images: [img.suiteWood, img.suiteRoom],
  },
  {
    name: "Technology, quietly",
    text: "3D intraoral scanning, low-dose digital x-rays and cone-beam imaging for implants: precise, fast and far more comfortable.",
    images: [img.scanner, img.xrayReview],
  },
];

export default function OfficeTourPage() {
  return (
    <>
      <PageHero
        eyebrow="Office tour"
        title={
          <>
            Every chair <em className="text-sage">faces a window.</em>
          </>
        }
        lede={`A second-floor studio on Linden Row, designed with an architect rather than picked from a dental catalog. ${site.parking}`}
        crumbs={[{ name: "Office tour", path: "/office-tour" }]}
        image={img.suiteSunlit}
      />

      <OfficeRail
        items={[
          { image: img.receptionArches, caption: "Reception in sage, with our arches.", shape: "arch" },
          { image: img.loungePlants, caption: "The quiet room, for recovery after sedation.", shape: "wide" },
          { image: img.suiteWindow, caption: "Suite 3, facing east for the morning sun.", shape: "tall" },
          { image: img.loungeTv, caption: "The family lounge, with games for kids.", shape: "wide" },
          { image: img.detailMirror2, caption: "Every instrument sterilized and sealed in front of you.", shape: "arch" },
          { image: img.suiteBright, caption: "Suite 1, where most first visits happen.", shape: "wide" },
        ]}
        intro={
          <div>
            <p className="eyebrow text-sage">Scroll sideways</p>
            <h2 className="display h-md mt-5">
              A slow walk <em>through the studio.</em>
            </h2>
          </div>
        }
      />

      {rooms.map((r, i) => (
        <section key={r.name} aria-labelledby={`room-${i}`} className="py-20 md:py-32">
          <div className={`container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-24 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <div className="relative">
              <Parallax className="arch aspect-[4/5] w-[85%]" amount={12}>
                <div className="absolute inset-0">
                  <Photo image={r.images[0]} sizes="(min-width: 1024px) 40vw, 85vw" />
                </div>
              </Parallax>
              <Parallax className="absolute right-0 -bottom-10 aspect-square w-[42%] rounded-3xl ring-8 ring-porcelain" amount={18}>
                <div className="absolute inset-0">
                  <Photo image={r.images[1]} sizes="(min-width: 1024px) 20vw, 40vw" />
                </div>
              </Parallax>
            </div>
            <div>
              <p className="eyebrow text-sage">0{i + 1} · Room</p>
              <SplitReveal id={`room-${i}`} className="display h-md mt-6">
                {r.name}
              </SplitReveal>
              <Reveal>
                <p className="lede mt-6 max-w-lg">{r.text}</p>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      <section aria-labelledby="light-title" className="relative isolate overflow-hidden bg-shell py-28 md:py-40">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div className="arch relative mx-auto aspect-[9/14] w-full max-w-sm">
            <AmbientVideo src="/video/leaf-light.mp4" poster="/video/leaf-light.jpg" />
          </div>
          <div>
            <p className="eyebrow text-sage">Why the light matters</p>
            <SplitReveal id="light-title" className="display h-md mt-6">
              Calm is <em>a design decision.</em>
            </SplitReveal>
            <Reveal>
              <p className="lede mt-6 max-w-lg">
                Harsh overhead light and windowless rooms make anyone tense. We chose big windows, warm dimmable lighting, soft materials and plants in every room, because
                the space does half the calming before we say a word.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <FinalCta title="See it in person. First visits are $99." />
      <JsonLd data={graph(webPageSchema({ path: "/office-tour", name: title, description }))} />
    </>
  );
}
