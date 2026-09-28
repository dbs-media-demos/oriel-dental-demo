"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import clsx from "clsx";
import { gsap, useGSAP, isTouch, prefersReducedMotion } from "@/lib/gsap";

type Variant = "primary" | "ghost" | "light" | "outline-light";

const styles: Record<Variant, string> = {
  primary: "bg-sage text-porcelain hover:bg-sage-deep",
  ghost: "border border-ink/20 text-ink hover:border-ink/60",
  light: "bg-porcelain text-ink hover:bg-white",
  "outline-light": "border border-porcelain/40 text-porcelain hover:border-porcelain",
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  icon?: ReactNode;
  magnetic?: boolean;
  ariaLabel?: string;
  transitionTypes?: string[];
};

/** Pill button with a soft magnetic pull on desktop. */
export function Button({ href, children, variant = "primary", className, icon, magnetic = true, ariaLabel, transitionTypes }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !magnetic || isTouch() || prefersReducedMotion()) return;
      const inner = el.querySelector<HTMLElement>("[data-inner]");
      const xTo = gsap.quickTo(el, "x", { duration: 0.9, ease: "elastic.out(1, 0.5)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.9, ease: "elastic.out(1, 0.5)" });
      const ixTo = inner ? gsap.quickTo(inner, "x", { duration: 0.9, ease: "elastic.out(1, 0.5)" }) : null;
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        xTo(dx * 0.22);
        yTo(dy * 0.3);
        ixTo?.(dx * 0.08);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
        ixTo?.(0);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref },
  );

  const isExternal = href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("http");
  const cls = clsx(
    "group relative inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 py-3 text-[0.95rem] font-semibold tracking-[0.01em] transition-colors duration-500 will-change-transform",
    styles[variant],
    className,
  );
  const content = (
    <span data-inner className="inline-flex items-center gap-2.5">
      {children}
      {icon}
    </span>
  );

  return isExternal ? (
    <a ref={ref} href={href} className={cls} aria-label={ariaLabel}>
      {content}
    </a>
  ) : (
    <Link ref={ref} href={href} className={cls} aria-label={ariaLabel} transitionTypes={transitionTypes}>
      {content}
    </Link>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={clsx("size-4 transition-transform duration-500 group-hover:translate-x-1", className)} aria-hidden fill="none">
      <path d="M4 10h11m-4.5-5L15 10l-4.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={clsx("size-4", className)} aria-hidden fill="none">
      <path
        d="M6.6 3.5 8 6.6c.2.5.1 1-.3 1.4l-1 1a9.5 9.5 0 0 0 4.3 4.3l1-1c.4-.4.9-.5 1.4-.3l3.1 1.4c.5.2.8.8.7 1.3l-.4 1.8c-.1.6-.7 1-1.3 1C9 17.3 2.7 11 2.5 4.6c0-.6.4-1.2 1-1.3l1.8-.4c.5-.1 1.1.2 1.3.6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
