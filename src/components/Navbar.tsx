"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import gsap from "gsap";
import { useNavbarScroll } from "@/hooks/useNavbarScroll";
import { cn } from "@/lib/utils";
import { EASES, DURATIONS } from "@/lib/animations";

/* ─── NAV ITEMS ──────────────────────────────── */
const NAV_LINKS = [
  { label: "Services",  href: "#services"  },
  { label: "Work",      href: "#work"       },
  { label: "About",     href: "#about"      },
  { label: "Insights",  href: "#insights"   },
] as const;

/* ─── MOBILE MENU VARIANTS ────────────────────── */
const EASE_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

const menuVariants: Variants = {
  closed: {
    clipPath: "inset(0 0 100% 0)",
    transition: { duration: 0.6, ease: EASE_EXPO },
  },
  open: {
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.6, ease: EASE_EXPO },
  },
};

const menuItemVariants: Variants = {
  closed: { y: 32, opacity: 0 },
  open: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.55,
      ease: EASE_EXPO,
      delay: 0.15 + i * 0.07,
    },
  }),
};

/* ─── MAGNETIC BUTTON (CTA) ───────────────────── */
function MagneticCTA() {
  const btnRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btnRef.current, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(btnRef.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: EASES.elastic,
    });
  };

  return (
    <Link
      href="/quote"
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      id="navbar-get-quote-btn"
      className="relative px-5 py-2.5 text-sm font-semibold tracking-wide text-[var(--color-void)]
                 bg-[var(--color-gold)] rounded-sm overflow-hidden inline-block
                 transition-colors duration-300 hover:bg-[var(--color-gold-pale)]"
      aria-label="Get a Quote"
    >
      Get Quote
    </Link>
  );
}

/* ─── NAV LINK with animated underline ───────── */
function NavLink({ label, href }: { label: string; href: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      className="relative text-sm font-medium tracking-wide text-[var(--color-silver)]
                 hover:text-[var(--color-white)] transition-colors duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
      <motion.span
        className="absolute -bottom-0.5 left-0 h-px bg-[var(--color-gold)]"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </a>
  );
}

/* ─── HAMBURGER ICON ─────────────────────────── */
function HamburgerIcon({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative w-9 h-9 flex flex-col items-center justify-center gap-1.5
                 text-[var(--color-silver)] hover:text-[var(--color-white)] transition-colors z-50"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      <motion.span
        className="w-6 h-px bg-current block"
        animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.span
        className="w-6 h-px bg-current block"
        animate={isOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      />
      <motion.span
        className="w-6 h-px bg-current block"
        animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </button>
  );
}

/* ─── MAIN NAVBAR ─────────────────────────────── */
export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const { scrolled } = useNavbarScroll(40);
  const [menuOpen, setMenuOpen] = useState(false);

  /* GSAP entry animation on mount */
  useEffect(() => {
    if (!navRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: EASES.expo } });
    tl.fromTo(
      navRef.current,
      { y: -90, opacity: 0 },
      { y: 0, opacity: 1, duration: DURATIONS.slow }
    )
      .fromTo(
        logoRef.current,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: DURATIONS.normal, ease: EASES.out },
        "-=0.5"
      )
      .fromTo(
        linksRef.current ? linksRef.current.querySelectorAll("a") : [],
        { y: -16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: DURATIONS.normal,
          ease: EASES.out,
          stagger: 0.07,
        },
        "-=0.4"
      )
      .fromTo(
        ctaRef.current,
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, duration: DURATIONS.normal, ease: EASES.out },
        "-=0.45"
      );
  }, []);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* ── Main nav bar ── */}
      <nav
        ref={navRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
          scrolled
            ? "glass border-b border-[var(--surface-glass-border)] py-3"
            : "py-6 bg-transparent"
        )}
        aria-label="Main navigation"
      >
        <div className="w-full px-6 sm:px-[6%] lg:px-[8%] flex items-center justify-between">

          {/* Logo */}
          <div ref={logoRef}>
            <Link
              href="/"
              className="flex items-center gap-3 group"
              aria-label="Enclecta home"
            >
              {/* Logo mark — geometric diamond with bracket */}
              <div className="relative w-9 h-9 flex items-center justify-center">
                {/* Outer square rotated 45° */}
                <div
                  className="absolute w-6 h-6 border border-[var(--color-gold)] transition-all duration-400
                             group-hover:w-8 group-hover:h-8"
                  style={{ transform: "rotate(45deg)" }}
                />
                {/* Inner filled diamond */}
                <div
                  className="w-2.5 h-2.5 bg-[var(--color-gold)] transition-all duration-400
                             group-hover:w-3 group-hover:h-3"
                  style={{ transform: "rotate(45deg)" }}
                />
              </div>
              {/* Wordmark */}
              <div className="flex flex-col leading-none" style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
                <span className="text-base font-bold tracking-[0.18em] text-[var(--color-white)] uppercase">
                  Encle<span className="text-[var(--color-gold)]">cta</span>
                </span>
                <span className="text-[9px] tracking-[0.3em] uppercase text-[var(--color-mist)] font-medium mt-0.5">
                  Technology
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop nav links */}
          <div
            ref={linksRef}
            className="hidden md:flex items-center gap-8"
            role="menubar"
          >
            {NAV_LINKS.map(({ label, href }) => (
              <NavLink key={label} label={label} href={href} />
            ))}
          </div>

          {/* Desktop CTA + Mobile hamburger */}
          <div ref={ctaRef} className="flex items-center gap-4">
            <div className="hidden md:block">
              <MagneticCTA />
            </div>
            <div className="md:hidden">
              <HamburgerIcon isOpen={menuOpen} onClick={() => setMenuOpen((v) => !v)} />
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile fullscreen menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-30 bg-[var(--color-obsidian)] flex flex-col
                       justify-center pl-16 pr-8 pt-24"
            aria-label="Mobile navigation"
          >
            {/* Decorative lines */}
            <div className="absolute top-1/2 left-0 w-1 h-32 bg-[var(--color-gold)] opacity-40 -translate-y-1/2" />
            <div className="absolute bottom-16 right-8 w-24 h-px bg-[var(--color-gold)] opacity-20" />

            <nav>
              <ul className="space-y-2">
                {NAV_LINKS.map(({ label, href }, i) => (
                  <motion.li
                    key={label}
                    custom={i}
                    variants={menuItemVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    <a
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className="block text-5xl font-bold tracking-tight
                                 text-[var(--color-ash)] hover:text-[var(--color-white)]
                                 transition-colors duration-300 py-3 leading-none"
                      style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}
                    >
                      {label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Bottom CTA */}
            <motion.div
              custom={NAV_LINKS.length}
              variants={menuItemVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="mt-12"
            >
              <Link
                href="/quote"
                id="mobile-get-quote-btn"
                className="inline-block px-8 py-3.5 text-base font-semibold tracking-wide
                           text-[var(--color-void)] bg-[var(--color-gold)] rounded-sm"
                onClick={() => setMenuOpen(false)}
              >
                Get Quote
              </Link>
            </motion.div>

            {/* Contact line */}
            <motion.p
              custom={NAV_LINKS.length + 1}
              variants={menuItemVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="mt-8 text-sm text-[var(--color-mist)] tracking-widest uppercase"
            >
              hello@enclecta.com
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
