"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASES, DURATIONS, STAGGER } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_GROUPS = [
  {
    title: "Services",
    links: [
      { label: "Custom Websites", href: "#services" },
      { label: "AI & Automation", href: "#services" },
      { label: "E-Commerce Websites", href: "#services" },
      { label: "Product Engineering", href: "#services" },
      { label: "Web Applications", href: "#services" },
      { label: "Social Media Management", href: "#services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Our Work", href: "#work" },
      { label: "The Team", href: "#team" },
      { label: "Insights", href: "#" },
      { label: "Open Roles", href: "#" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Get in Touch", href: "#contact" },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/enclecta/" },
      { label: "X / Twitter", href: "https://x.com/enclecta" },
      // { label: "GitHub", href: "#" },
      { label: "info@enclecta.com", href: "mailto:info@enclecta.com" },
    ],
  },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookie Settings", href: "#" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const bigWordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Big wordmark parallax
      if (bigWordRef.current) {
        gsap.fromTo(
          bigWordRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: DURATIONS.slow,
            ease: EASES.expo,
            scrollTrigger: { trigger: footerRef.current, start: "top 90%" },
          }
        );
      }

      // Link columns stagger
      const cols = footerRef.current?.querySelectorAll(".footer-col");
      if (cols?.length) {
        gsap.fromTo(
          cols,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: DURATIONS.slow,
            ease: EASES.out,
            stagger: STAGGER.items,
            scrollTrigger: { trigger: footerRef.current, start: "top 85%" },
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer
      ref={footerRef}
      id="footer"
      className="relative bg-[var(--color-void)] border-t border-[var(--surface-glass-border)] overflow-hidden"
      aria-label="Site footer"
    >
      {/* Very large ghost wordmark */}
      <div
        ref={bigWordRef}
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-0 left-0 right-0 text-center leading-none font-bold overflow-hidden"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(80px, 20vw, 260px)",
          color: "transparent",
          WebkitTextStroke: "1px rgba(255, 255, 255, 0.17)",
          lineHeight: 0.85,
          paddingBottom: "0px",
          letterSpacing: "-0.04em",
        }}
      >
        ENCLECTA
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-12">

        {/* ── Top row: Logo + tagline ── */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 mb-16 pb-16 border-b border-[var(--surface-glass-border)]">

          {/* Brand block */}
          <div className="footer-col space-y-4 max-w-xs">
            {/* Logo mark */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-[var(--color-gold)] flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-[var(--color-gold)]" aria-hidden="true">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-sm font-bold tracking-widest uppercase text-[var(--color-white)]"
                style={{ fontFamily: "var(--font-display)" }}>
                Enclecta
              </span>
            </div>
            <p className="text-sm text-[var(--color-ghost)] leading-relaxed">
              Premium IT consulting for organisations that refuse to settle. London-based, globally delivered.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="w-2 h-2 rounded-full bg-[var(--color-gold)] animate-pulse-sc" aria-hidden="true" />
              <span className="text-xs text-[var(--color-mist)]" style={{ fontFamily: "var(--font-mono)" }}>
                Available for new engagements
              </span>
            </div>
          </div>

          {/* Nav groups */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
            {NAV_GROUPS.map((group) => (
              <div key={group.title} className="footer-col space-y-4">
                <h3 className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] font-medium"
                  style={{ fontFamily: "var(--font-mono)" }}>
                  {group.title}
                </h3>
                <ul className="space-y-2.5" role="list">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--color-mist)] hover:text-[var(--color-white)] transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom row ── */}
        <div className="footer-col flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">

          {/* Copyright */}
          <div className="space-y-1">
            <p className="text-xs text-[var(--color-slate)]" style={{ fontFamily: "var(--font-mono)" }}>
              © {new Date().getFullYear()} Enclecta Technology Ltd. All rights reserved.
            </p>
            <p className="text-xs text-[var(--color-slate)]" style={{ fontFamily: "var(--font-mono)" }}>
              Registered in England &amp; Wales · Company No. 12345678
            </p>
          </div>

          {/* Legal + Back to top */}
          <div className="flex flex-wrap items-center gap-5">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.label} href={l.href}
                className="text-xs text-[var(--color-slate)] hover:text-[var(--color-ghost)] transition-colors duration-200"
                style={{ fontFamily: "var(--font-mono)" }}>
                {l.label}
              </Link>
            ))}
            <button
              id="back-to-top-btn"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="group w-9 h-9 flex items-center justify-center border border-[var(--color-slate)] text-[var(--color-mist)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors duration-300 ml-2"
            >
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M5 15l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
