"use client";

import { useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import clsx from "clsx";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion, loadSplitText } from "@/lib/gsap";
import type { SplitText } from "gsap/SplitText";

/*
 * Scroll-driven reveals.
 *
 * Content is always visible in the HTML, so crawlers, screen readers and no-JS
 * visitors see it. `immediate` variants (top of the page) use pure CSS so they
 * paint instantly. Everything else is hidden by JS (opacity only) while it is still
 * below the fold, then eased in, slowly, as it arrives.
 */

const belowFold = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.92;
const delayStyle = (d: number) => ({ "--d": `${d}s` }) as CSSProperties;

type SplitProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  immediate?: boolean;
  stagger?: number;
  id?: string;
};

/** Headline that rises line by line out of a soft mask. */
export function SplitReveal({ children, as: Tag = "h2", className, delay = 0, immediate, stagger = 0.12, id }: SplitProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || immediate || prefersReducedMotion() || !belowFold(el)) return;
      gsap.set(el, { opacity: 0 });
      let split: SplitText | null = null;
      let dead = false;
      const io = new IntersectionObserver(
        async ([entry]) => {
          if (!entry.isIntersecting) return;
          io.disconnect();
          const Split = await loadSplitText();
          if (dead) return;
          split = Split.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit(self) {
              gsap.set(el, { opacity: 1 });
              // Unwrap the masks afterwards so descenders (g, y, p) are never clipped.
              return gsap.from(self.lines, { yPercent: 110, duration: 1.6, stagger, delay, ease: "expo.out", onComplete: () => self.revert() });
            },
          });
        },
        { rootMargin: "0px 0px -10% 0px" },
      );
      io.observe(el);
      return () => {
        dead = true;
        io.disconnect();
        split?.revert();
      };
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={clsx(immediate && "anim-heading", className)} style={immediate ? delayStyle(delay) : undefined}>
      {children}
    </Tag>
  );
}

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  stagger?: number;
  immediate?: boolean;
  id?: string;
};

/** Fade + gentle rise when scrolled into view. */
export function Reveal({ children, as: Tag = "div", className, delay = 0, y = 36, stagger, immediate, id }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || immediate || prefersReducedMotion() || !belowFold(el)) return;
      const targets = stagger ? Array.from(el.children) : [el];
      gsap.set(targets, { opacity: 0, y });
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () =>
          gsap.to(targets, { opacity: 1, y: 0, duration: 1.5, delay, stagger: stagger ?? 0, ease: "expo.out", clearProps: "transform" }),
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={clsx(immediate && "anim-fade", className)} style={immediate ? delayStyle(delay) : undefined}>
      {children}
    </Tag>
  );
}

/** Paragraph whose words brighten one by one as you scroll through it. */
export function ScrubWords({ text, className, as: Tag = "p" }: { text: string; className?: string; as?: ElementType }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const words = el.querySelectorAll<HTMLElement>("[data-w]");
      // Starts above 3:1 contrast (large text), so it's readable and passes WCAG before scrolling.
      gsap.fromTo(
        words,
        { opacity: 0.58 },
        { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 50%", scrub: 0.8 } },
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} data-w>
          {w}{" "}
        </span>
      ))}
    </Tag>
  );
}

/** Frame whose image drifts with scroll and unmasks (arch-first) on enter. */
export function Parallax({
  children,
  className,
  amount = 10,
  reveal = true,
  style,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  reveal?: boolean;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const inner = el?.firstElementChild as HTMLElement | null;
      if (!el || !inner || prefersReducedMotion()) return;
      gsap.set(inner, { scale: 1 + amount / 100 });
      gsap.fromTo(
        inner,
        { yPercent: -amount / 2 },
        { yPercent: amount / 2, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
      );
      if (reveal && belowFold(el)) {
        gsap.fromTo(
          el,
          { clipPath: "inset(18% 10% 0% 10% round 999px 999px 24px 24px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)",
            duration: 2,
            ease: "expo.out",
            clearProps: "clipPath",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      }
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={clsx("relative overflow-hidden", className)} style={style}>
      {children}
    </div>
  );
}
