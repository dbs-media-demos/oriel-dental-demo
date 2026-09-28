import { PageHero } from "@/components/ui/PageHero";
import { SmileGallery } from "@/components/sections/SmileGallery";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/ui/JsonLd";
import { Parallax, Reveal, SplitReveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { img } from "@/content/images";
import { smileCases, caseTabs } from "@/content/gallery";
import { buildMetadata } from "@/lib/seo";
import { graph, webPageSchema } from "@/lib/schema";

const title = "Smile Gallery: Whitening, Veneers, Aligners & Implants";
const description =
  "Drag the before-and-after sliders to see what whitening, porcelain veneers, clear aligners and implants can do. Illustrative simulations from Oriel Dental Studio in Uptown Dallas.";

export const metadata = buildMetadata({ title, description, path: "/smile-gallery", eyebrow: "Smile gallery" });

const portraits = [img.smileCurls, img.smileJoy, img.smileMan, img.smileLace, img.smileMan3, img.smileSun];

export default function SmileGalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Smile gallery"
        title={
          <>
            Drag the arch. <em className="text-sage">See the difference.</em>
          </>
        }
        lede="Pick a treatment, then drag each slider to compare. Every case here is an illustrative simulation, so you can see what's possible before your own consultation."
        crumbs={[{ name: "Smile gallery", path: "/smile-gallery" }]}
        image={img.smileLaugh}
      />

      <section aria-label="Before and after cases" className="pb-24 md:pb-36">
        <div className="container-x">
          <SmileGallery cases={smileCases} tabs={caseTabs} />
        </div>
      </section>

      <section aria-labelledby="natural-title" className="overflow-hidden bg-shell py-24 md:py-36">
        <div className="container-x">
          <p className="eyebrow text-sage">The Oriel look</p>
          <SplitReveal id="natural-title" className="display h-md mt-6 max-w-[18ch]">
            Natural. Bright. <em>Unmistakably you.</em>
          </SplitReveal>
          <Reveal>
            <p className="lede mt-6 max-w-2xl">
              We design smiles around faces, not templates: shade matched to your skin, shape matched to your lips, and a preview you approve first.
            </p>
          </Reveal>
          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-6">
            {portraits.map((p, i) => (
              <Parallax key={p.src} className={i % 2 ? "arch aspect-[3/4] lg:mt-16" : "arch aspect-[3/4]"} amount={10 + (i % 3) * 4}>
                <div className="absolute inset-0">
                  <Photo image={p} sizes="(min-width: 1024px) 16vw, (min-width: 768px) 30vw, 45vw" />
                </div>
              </Parallax>
            ))}
          </div>
          <p className="mt-8 text-[0.85rem] text-ink-soft">Portraits are stock photography, used to illustrate natural-looking results.</p>
        </div>
      </section>

      <FinalCta title="See your own preview at a free cosmetic consult." eyebrow="Cosmetic consultation" />
      <JsonLd data={graph(webPageSchema({ path: "/smile-gallery", name: title, description, type: "CollectionPage" }))} />
    </>
  );
}
