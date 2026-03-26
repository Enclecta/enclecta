/**
 * GSAP Animation presets for Enclecta
 * Centralized animation configuration for consistency
 */

export const DURATIONS = {
  fast:   0.3,
  normal: 0.6,
  slow:   1.0,
  xslow:  1.4,
} as const;

export const EASES = {
  out:        "power3.out",
  in:         "power3.in",
  inOut:      "power3.inOut",
  elastic:    "elastic.out(1, 0.5)",
  back:       "back.out(1.4)",
  expo:       "expo.out",
  circ:       "circ.out",
} as const;

export const STAGGER = {
  words:    0.055,
  chars:    0.025,
  items:    0.08,
  fast:     0.04,
} as const;

/** Navbar entry animation config */
export const navbarEntryConfig = {
  from: { y: -100, opacity: 0 },
  to:   { y: 0, opacity: 1, duration: DURATIONS.slow, ease: EASES.expo, delay: 0.2 },
};

/** Nav link stagger config */
export const navLinkStaggerConfig = {
  from: { y: -20, opacity: 0 },
  to:   { y: 0, opacity: 1, duration: DURATIONS.normal, ease: EASES.out, stagger: STAGGER.items, delay: 0.5 },
};

/** Hero headline split text config */
export const heroHeadlineConfig = {
  from: { y: "110%", opacity: 1 },
  to:   { y: "0%", duration: DURATIONS.xslow, ease: EASES.expo, stagger: STAGGER.words },
};

/** Hero sub-elements stagger config */
export const heroSubConfig = {
  from: { y: 30, opacity: 0 },
  to:   { y: 0, opacity: 1, duration: DURATIONS.slow, ease: EASES.out, stagger: 0.15, delay: 0.9 },
};
