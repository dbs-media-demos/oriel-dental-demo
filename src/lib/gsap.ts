"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Only ever loaded through loadKit() in ./motion, on desktop.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // Oriel moves slowly on purpose: long, soft easing everywhere.
  gsap.defaults({ ease: "expo.out", duration: 1.4 });
}

/** SplitText is only needed below the fold, so it's fetched on first use. */
export const loadSplitText = () =>
  import("gsap/SplitText").then(({ SplitText }) => {
    gsap.registerPlugin(SplitText);
    return SplitText;
  });

export { gsap, ScrollTrigger };
