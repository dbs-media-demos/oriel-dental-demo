import clsx from "clsx";
import type { ReactNode } from "react";
import { SplitReveal, Reveal } from "./Reveal";

/** Eyebrow + split-reveal heading + optional lede. */
export function SectionIntro({
  eyebrow,
  title,
  lede,
  id,
  className,
  align = "left",
  size = "h-lg",
  as = "h2",
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  id?: string;
  className?: string;
  align?: "left" | "center";
  size?: "h-lg" | "h-md";
  as?: "h1" | "h2";
}) {
  return (
    <div className={clsx(align === "center" && "mx-auto text-center", className)}>
      <Reveal>
        <p className="eyebrow text-sage">{eyebrow}</p>
      </Reveal>
      <SplitReveal as={as} id={id} className={clsx("display mt-6", size, align === "center" && "mx-auto")}>
        {title}
      </SplitReveal>
      {lede && (
        <Reveal delay={0.15}>
          <p className={clsx("lede mt-6 max-w-[40rem]", align === "center" && "mx-auto")}>{lede}</p>
        </Reveal>
      )}
    </div>
  );
}
