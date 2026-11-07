import clsx from "clsx";
import type { ReactNode } from "react";

/** Slow, endless CSS marquee (a plain row to swipe on phones). Content is duplicated for a seamless loop; the copy is hidden from AT. */
export function Marquee({ children, className, reverse, speed = 60 }: { children: ReactNode; className?: string; reverse?: boolean; speed?: number }) {
  return (
    <div className={clsx("group no-scrollbar relative flex overflow-hidden phone:overflow-x-auto", className)}>
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className={clsx("flex shrink-0 items-center motion-safe:animate-marquee group-hover:[animation-play-state:paused] phone:animate-none!", i === 1 && "phone:hidden")}
          style={{ animationDuration: `${speed}s`, animationDirection: reverse ? "reverse" : "normal" }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
