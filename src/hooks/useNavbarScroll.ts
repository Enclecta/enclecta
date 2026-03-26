"use client";

import { useEffect, useState } from "react";

export type NavbarScrollState = {
  scrolled: boolean;
  scrollY: number;
  direction: "up" | "down";
};

/**
 * useNavbarScroll
 * Tracks scroll position and direction for navbar scroll behavior.
 * Returns whether the page is scrolled, the scrollY value, and scroll direction.
 */
export function useNavbarScroll(threshold = 60): NavbarScrollState {
  const [state, setState] = useState<NavbarScrollState>({
    scrolled: false,
    scrollY: 0,
    direction: "up",
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY ? "down" : "up";
      lastScrollY = currentScrollY;

      setState({
        scrolled: currentScrollY > threshold,
        scrollY: currentScrollY,
        direction,
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return state;
}
