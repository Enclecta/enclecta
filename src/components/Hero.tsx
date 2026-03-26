"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useParallax } from "@/hooks/useParallax";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── ABSTRACT SHAPES (no gradients — solid fills + borders) ──── */
function AbstractShapes() {
  const parallaxA = useParallax<HTMLDivElement>({ yDistance: -60, scrub: 2 });
  const parallaxB = useParallax<HTMLDivElement>({ yDistance: -120, scrub: 1.5 });
  const parallaxC = useParallax<HTMLDivElement>({ yDistance: -40, scrub: 2.5 });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {/* Shape A — Large ring top-right */}
      <div
        ref={parallaxA}
        className="absolute"
        style={{ top: "-10%", right: "-8%", width: "620px", height: "620px" }}
      >
        <div
          className="w-full h-full rounded-full border animate-rotate"
          style={{
            borderColor: "rgba(201, 168, 76, 0.10)",
            borderWidth: "1px",
          }}
        />
        <div
          className="absolute inset-[80px] rounded-full border animate-rotate"
          style={{
            borderColor: "rgba(201, 168, 76, 0.06)",
            animationDirection: "reverse",
            animationDuration: "30s",
          }}
        />
      </div>

      {/* Shape B — Solid rectangle mid-left */}
      <div
        ref={parallaxB}
        className="absolute"
        style={{ top: "30%", left: "-4%", width: "280px", height: "1px" }}
      >
        <div className="w-full h-px bg-[var(--color-slate)] opacity-30" />
        <div
          className="absolute left-0 -top-48 w-px bg-[var(--color-slate)] opacity-20"
          style={{ height: "200px" }}
        />
      </div>

      {/* Shape C — Floating square bottom-right */}
      <div
        ref={parallaxC}
        className="absolute animate-float-y"
        style={{
          bottom: "18%",
          right: "8%",
          animationDuration: "7s",
          animationDelay: "1s",
        }}
      >
        <div
          className="w-16 h-16 rounded-sm border border-[var(--color-gold-dim)] opacity-25"
          style={{ transform: "rotate(25deg)" }}
        />
      </div>

      {/* Shape D — Small accent dot cluster */}
      <div className="absolute top-1/3 left-1/4 animate-float-x">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] opacity-30" />
        <div className="w-1 h-1 rounded-full bg-[var(--color-gold)] opacity-20 mt-3 ml-4" />
        <div className="w-0.5 h-0.5 rounded-full bg-[var(--color-gold)] opacity-15 mt-2 ml-1" />
      </div>

      {/* Shape E — Cross / plus mark */}
      <div
        className="absolute opacity-10 animate-float-y"
        style={{ top: "60%", left: "60%", animationDuration: "9s" }}
        aria-hidden="true"
      >
        <div className="relative w-8 h-8">
          <div className="absolute top-1/2 left-0 w-full h-px bg-[var(--color-silver)] -translate-y-1/2" />
          <div className="absolute left-1/2 top-0 h-full w-px bg-[var(--color-silver)] -translate-x-1/2" />
        </div>
      </div>

      {/* Large subtle grid backdrop */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-slate) 1px, transparent 1px), linear-gradient(90deg, var(--color-slate) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
}

/* ─── SCROLL INDICATOR ───────────────────────── */
function ScrollIndicator() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-px h-12 relative overflow-hidden bg-[var(--color-slate)] rounded-full">
        <motion.div
          className="w-full bg-[var(--color-gold)] rounded-full absolute top-0"
          style={{ height: "40%" }}
          animate={{ y: ["0%", "150%", "0%"] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      <span
        className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-mist)]"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        Scroll
      </span>
    </div>
  );
}

/* ─── HEADLINE WORDS (GSAP text reveal) ─────── */
function HeroHeadline() {
  const containerRef = useRef<HTMLDivElement>(null);

  const words = ["Engineer", "Evolve.", "Lead."];

  useEffect(() => {
    if (!containerRef.current) return;

    const lines = containerRef.current.querySelectorAll(".word-wrap span");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { y: "110%", opacity: 1 },
        {
          y: "0%",
          opacity: 1,
          duration: 1.3,
          ease: "expo.out",
          stagger: 0.1,
          delay: 0.3,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-0">
      {words.map((word, i) => (
        <div key={i} className="word-wrap overflow-hidden leading-[0.95]">
          <span
            className="block text-[clamp(4rem,10vw,10rem)] font-bold tracking-tight
                       text-[var(--color-white)]"
            style={{
              fontFamily: "var(--font-syne, Syne, sans-serif)",
              lineHeight: "0.95",
            }}
          >
            {i === 1 ? (
              <>
                Evolve
                <span className="text-[var(--color-gold)]">.</span>
              </>
            ) : i === 2 ? (
              <>
                Lead
                <span className="text-[var(--color-gold)]">.</span>
              </>
            ) : (
              word
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── STATS ──────────────────────────────────── */
const STATS = [
  { value: "12+", label: "Years of Excellence" },
  { value: "300+", label: "Projects Shipped" },
  { value: "99%", label: "Client Satisfaction" },
] as const;

function HeroStats() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const items = ref.current.querySelectorAll(".stat-item");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          delay: 1.6,
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="flex gap-8 md:gap-12 flex-wrap">
      {STATS.map(({ value, label }) => (
        <div key={label} className="stat-item opacity-0">
          <p
            className="text-3xl font-bold text-[var(--color-white)] tracking-tight"
            style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}
          >
            {value}
          </p>
          <p className="text-xs text-[var(--color-mist)] mt-0.5 tracking-wide">{label}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── MAIN HERO COMPONENT ────────────────────── */
export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!subRef.current || !ctaRef.current || !accentRef.current) return;

    const ctx = gsap.context(() => {
      // Subtext reveal
      gsap.fromTo(
        subRef.current,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 1.2 }
      );

      // CTA buttons reveal
      gsap.fromTo(
        ctaRef.current!.querySelectorAll("button, a"),
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.12,
          delay: 1.45,
        }
      );

      // Gold accent line
      gsap.fromTo(
        accentRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 1, ease: "expo.out", delay: 0.8 }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="noise relative min-h-screen flex flex-col justify-center overflow-hidden
                 bg-[var(--color-void)]"
      aria-label="Hero"
      id="hero"
    >
      {/* Background shapes (parallax) */}
      <AbstractShapes />

      {/* Depth layer — top dark vignette */}
      <div
        className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, var(--color-void) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Depth layer — bottom dark fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: "linear-gradient(to top, var(--color-void) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Main content ── */}
      <div className="relative z-10 w-full pl-[8%] sm:pl-[12%] lg:pl-[8%] pr-[6%] sm:pr-[8%] lg:pr-[10%] pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-end">

          {/* Left column — headline + sub */}
          <div className="lg:col-span-8">
            {/* Overline label */}
            <div ref={accentRef} className="flex items-center gap-3 mb-8 origin-left">
              <div className="accent-line" />
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-gold)]">
                Premium IT Solutions
              </span>
            </div>

            {/* Main headline */}
            <HeroHeadline />

            {/* Subtext */}
            <div ref={subRef} className="opacity-0 mt-8 max-w-lg">
              <p className="text-base md:text-lg text-[var(--color-ghost)] leading-relaxed">
                We architect and build technology systems that power{" "}
                <span className="text-[var(--color-silver)]">ambitious companies</span>
                {" "}— from cloud infrastructure to bespoke software,
                engineered with precision.
              </p>
            </div>

            {/* CTA Buttons */}
            <div ref={ctaRef} className="mt-10 flex flex-wrap gap-4">
              <motion.a
                href="#work"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="opacity-0 inline-flex items-center gap-2 px-7 py-3.5
                           text-sm font-semibold tracking-wide text-[var(--color-void)]
                           bg-[var(--color-gold)] rounded-sm
                           hover:bg-[var(--color-gold-pale)] transition-colors duration-300"
              >
                View Our Work
                <ArrowRight size={14} />
              </motion.a>

              <motion.a
                href="#services"
                whileHover={{ scale: 1.02, borderColor: "var(--color-gold)" }}
                whileTap={{ scale: 0.97 }}
                className="opacity-0 inline-flex items-center gap-2 px-7 py-3.5
                           text-sm font-semibold tracking-wide text-[var(--color-silver)]
                           border border-[var(--color-slate)] rounded-sm
                           hover:text-[var(--color-white)] transition-all duration-300"
              >
                Our Services
              </motion.a>
            </div>
          </div>

          {/* Right column — stats + accent */}
          <div className="lg:col-span-4 lg:flex lg:flex-col lg:items-end lg:justify-end">
            <div className="flex flex-col gap-6">
              {/* Vertical accent bar */}
              <div className="hidden lg:flex justify-end">
                <div
                  className="w-px bg-[var(--color-slate)]"
                  style={{ height: "120px" }}
                />
              </div>
              {/* Stats */}
              <HeroStats />
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom left — scroll indicator ── */}
      <div
        className="absolute bottom-10 left-10 hidden md:flex items-center gap-4 z-10"
        aria-hidden="true"
      >
        <ScrollIndicator />
      </div>

      {/* ── Bottom right — position label ── */}
      <div className="absolute bottom-10 right-10 hidden md:block z-10">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--color-slate)]">
          2026 · Pune
        </p>
      </div>
    </section>
  );
}

/* ─── INLINE ICON ────────────────────────────── */
function ArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
