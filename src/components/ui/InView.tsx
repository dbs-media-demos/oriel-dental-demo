"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Sets data-in="true" once the element scrolls into view, for CSS-driven entrances. */
export function InView({ children, className, threshold = 0.25 }: { children: ReactNode; className?: string; threshold?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} data-in={inView} className={className}>
      {children}
    </div>
  );
}
