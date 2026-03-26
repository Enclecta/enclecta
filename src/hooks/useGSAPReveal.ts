"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type RevealConfig = {
  /** y offset to animate from (default: 40) */
  y?: number;
  /** x offset to animate from (default: 0) */
  x?: number;
  /** opacity start value (default: 0) */
  opacity?: number;
  /** animation duration in seconds (default: 1) */
  duration?: number;
  /** stagger between child elements (default: 0) */
  stagger?: number;
  /** GSAP ease string (default: "power3.out") */
  ease?: string;
  /** delay before animation (default: 0) */
  delay?: number;
  /** ScrollTrigger start (default: "top 88%") */
  scrollStart?: string;
  /** If true, uses ScrollTrigger; otherwise animates on mount */
  scrollTrigger?: boolean;
  /** Target children selector instead of root element */
  childSelector?: string;
};

/**
 * useGSAPReveal
 * Returns a ref to attach to a container element.
 * The container (or its children) will animate in with GSAP.
 */
export function useGSAPReveal<T extends HTMLElement = HTMLDivElement>(
  config: RevealConfig = {}
) {
  const ref = useRef<T>(null);

  const {
    y = 40,
    x = 0,
    opacity = 0,
    duration = 1,
    stagger = 0,
    ease = "power3.out",
    delay = 0,
    scrollStart = "top 88%",
    scrollTrigger = true,
    childSelector,
  } = config;

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const target = childSelector
        ? ref.current!.querySelectorAll(childSelector)
        : ref.current!;

      const fromVars: gsap.TweenVars = { y, x, opacity, ease, duration };
      const toVars: gsap.TweenVars = {
        y: 0,
        x: 0,
        opacity: 1,
        ease,
        duration,
        delay,
        stagger: stagger || undefined,
      };

      if (scrollTrigger) {
        toVars.scrollTrigger = {
          trigger: ref.current!,
          start: scrollStart,
          toggleActions: "play none none none",
        };
      }

      gsap.fromTo(target, fromVars, toVars);
    }, ref);

    return () => ctx.revert();
  }, [y, x, opacity, duration, stagger, ease, delay, scrollStart, scrollTrigger, childSelector]);

  return ref;
}
