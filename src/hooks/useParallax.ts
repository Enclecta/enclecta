"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type ParallaxConfig = {
  /** Vertical travel distance in px (positive = moves down, negative = moves up) */
  yDistance?: number;
  /** How much the scrub lags behind scroll (seconds, or true for 1) */
  scrub?: number | boolean;
  /** ScrollTrigger start marker */
  start?: string;
  /** ScrollTrigger end marker */
  end?: string;
};

/**
 * useParallax
 * Attaches a parallax scroll effect to the returned ref element.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  config: ParallaxConfig = {}
) {
  const ref = useRef<T>(null);
  const { yDistance = -80, scrub = 1.5, start = "top bottom", end = "bottom top" } = config;

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current!, {
        y: yDistance,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current!,
          start,
          end,
          scrub,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [yDistance, scrub, start, end]);

  return ref;
}
