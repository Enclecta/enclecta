"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASES, DURATIONS } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

// ─── Marquee items ────────────────────────────────────────────────────────────

const TECH_ITEMS = [
  "AWS",
  "Google Cloud",
  "Azure",
  "Kubernetes",
  "Terraform",
  "Next.js",
  "TypeScript",
  "Python",
  "Rust",
  "PostgreSQL",
  "Kafka",
  "Snowflake",
  "dbt",
  "OpenAI",
  "LangChain",
  "Docker",
  "GraphQL",
  "Redis",
  "Spark",
  "Figma",
];

const CLIENT_ITEMS = [
  "Fintech Scale-ups",
  "Healthcare SaaS",
  "Global Logistics",
  "EdTech Platforms",
  "Government Digital",
  "Insurance Tech",
  "Retail Commerce",
  "Media & Streaming",
  "Defence Contractors",
  "Agritech Ventures",
];

// Separator diamond
const SEP = (
  <span
    aria-hidden="true"
    className="text-[var(--color-gold)] text-xs opacity-60 mx-1"
  >
    ◆
  </span>
);

// Build a long enough array to fill the marquee seamlessly
function buildStrip(items: string[], repeat = 4): string[] {
  return Array.from({ length: repeat }, () => items).flat();
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Marquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      if (headingRef.current) {
        const els = headingRef.current.querySelectorAll(".gsap-reveal");
        gsap.fromTo(
          els,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: DURATIONS.slow,
            ease: EASES.expo,
            stagger: 0.1,
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 85%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="marquee"
      ref={sectionRef}
      className="relative bg-[var(--color-coal)] py-24 overflow-hidden border-y border-[var(--surface-glass-border)]"
      aria-label="Technologies and industries"
    >
      {/* Side fade masks */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10"
        style={{
          background:
            "linear-gradient(90deg, var(--color-coal) 0%, transparent 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10"
        style={{
          background:
            "linear-gradient(270deg, var(--color-coal) 0%, transparent 100%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 mb-14">
        <div ref={headingRef} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
          <div className="gsap-reveal flex items-center gap-4">
            <span className="accent-line" />
            <span
              className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold)] font-medium"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Stack & Industries
            </span>
          </div>
          <p className="gsap-reveal text-sm text-[var(--color-mist)] max-w-xs">
            Technologies we master. Sectors we transform.
          </p>
        </div>
      </div>

      {/* ── Row 1: Tech (L → R) ── */}
      <div className="mb-6 overflow-hidden" aria-label="Technology stack">
        <MarqueeTrack ref={track1Ref} items={buildStrip(TECH_ITEMS)} direction="left" speed={35} />
      </div>

      {/* ── Row 2: Clients (R → L) ── */}
      <div className="overflow-hidden" aria-label="Industries served">
        <MarqueeTrack ref={track2Ref} items={buildStrip(CLIENT_ITEMS)} direction="right" speed={28} />
      </div>
    </section>
  );
}

// ─── MarqueeTrack ─────────────────────────────────────────────────────────────

import React from "react";

type MarqueeTrackProps = {
  items: string[];
  direction: "left" | "right";
  speed: number; // px per second
};

const MarqueeTrack = React.forwardRef<HTMLDivElement, MarqueeTrackProps>(
  function MarqueeTrack({ items, direction, speed }, ref) {
    const innerRef = useRef<HTMLDivElement>(null);
    const animRef = useRef<gsap.core.Tween | null>(null);

    useEffect(() => {
      const inner = innerRef.current;
      if (!inner) return;

      // Width of one "half" (we duplicate items so we can loop)
      const halfItems = Math.ceil(items.length / 2);
      // Estimate item width from DOM
      const firstChild = inner.firstElementChild as HTMLElement | null;
      if (!firstChild) return;

      const singleWidth = firstChild.offsetWidth;
      const halfWidth = singleWidth * halfItems;

      const sign = direction === "left" ? -1 : 1;

      animRef.current = gsap.to(inner, {
        x: sign * halfWidth,
        duration: halfWidth / speed,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: (x) => {
            const parsed = parseFloat(x);
            // Loop: reset when we've scrolled one full half
            if (direction === "left" && parsed <= -halfWidth) return "0px";
            if (direction === "right" && parsed >= 0) return `${-halfWidth}px`;
            return `${parsed}px`;
          },
        },
      });

      const onEnter = () => animRef.current?.play();
      const onLeave = () => animRef.current?.pause();
      inner.parentElement?.addEventListener("mouseenter", onLeave);
      inner.parentElement?.addEventListener("mouseleave", onEnter);

      return () => {
        animRef.current?.kill();
        inner.parentElement?.removeEventListener("mouseenter", onLeave);
        inner.parentElement?.removeEventListener("mouseleave", onEnter);
      };
    }, [items, direction, speed]);

    return (
      <div
        ref={ref}
        className="overflow-hidden"
        style={{ willChange: "transform" }}
      >
        <div
          ref={innerRef}
          className="flex items-center gap-0 whitespace-nowrap"
          style={direction === "right" ? { transform: `translateX(-${items.length * 0}px)` } : undefined}
        >
          {items.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="inline-flex items-center gap-3 px-4 py-1"
            >
              <span
                className="text-sm font-medium text-[var(--color-ghost)] tracking-wide hover:text-[var(--color-gold)] transition-colors duration-200 cursor-default"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {item}
              </span>
              {SEP}
            </span>
          ))}
        </div>
      </div>
    );
  }
);
