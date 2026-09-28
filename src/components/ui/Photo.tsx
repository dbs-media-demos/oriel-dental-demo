import Image from "next/image";
import clsx from "clsx";
import type { Img } from "@/content/images";

type Props = {
  image: Img;
  sizes: string;
  className?: string;
  /** Only for the LCP image of a page. */
  preload?: boolean;
  quality?: 60 | 75 | 85;
  alt?: string;
  position?: string;
  /** Fill the parent (parent must be positioned). Default true. */
  fill?: boolean;
};

/** next/image with the registry's dimensions, blur placeholder and alt text. */
export function Photo({ image, sizes, className, preload, quality = 75, alt, position, fill = true }: Props) {
  const text = alt ?? image.alt;
  const common = {
    src: image.src,
    sizes,
    quality,
    placeholder: "blur" as const,
    blurDataURL: image.blur,
    preload,
    fetchPriority: preload ? ("high" as const) : undefined,
    style: position ? { objectPosition: position } : undefined,
  };
  return fill ? (
    <Image {...common} alt={text} fill className={clsx("object-cover", className)} />
  ) : (
    <Image {...common} alt={text} width={image.width} height={image.height} className={className} />
  );
}
