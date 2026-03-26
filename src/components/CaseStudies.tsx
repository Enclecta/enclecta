"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASES, DURATIONS, STAGGER } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = "All" | "Cloud" | "AI" | "Cybersecurity" | "Engineering" | "Data";

type CaseStudy = {
  id: string;
  title: string;
  client: string;
  category: Category;
  year: string;
  tags: string[];
  result: string;
  resultLabel: string;
  description: string;
  image: string | null;
  imageFallback: string; // CSS gradient as fallback
  size: "large" | "medium"; // for Bento layout
};

// ─── Data ────────────────────────────────────────────────────────────────────

const CASES: CaseStudy[] = [
  {
    id: "nova-fintech",
    title: "Real-Time Trading Infrastructure",
    client: "Nova Capital",
    category: "Cloud",
    year: "2024",
    tags: ["AWS", "Kubernetes", "Kafka", "LatencyOps"],
    result: "0.8ms",
    resultLabel: "Order latency achieved",
    description:
      "Re-architected the entire order execution pipeline for a $4B AUM trading desk, replacing a monolithic stack with event-driven microservices running on EKS.",
    image: "/case_fintech.png",
    imageFallback: "linear-gradient(135deg, #0a0e1a 0%, #0d1f3c 50%, #1a2f50 100%)",
    size: "large",
  },
  {
    id: "meridian-health",
    title: "AI Diagnostic Co-Pilot",
    client: "Meridian Health",
    category: "AI",
    year: "2024",
    tags: ["LLMs", "Computer Vision", "HIPAA", "Azure"],
    result: "94%",
    resultLabel: "Diagnostic accuracy",
    description:
      "Built a HIPAA-compliant AI assistant that analyses medical imaging in real-time, surfacing anomalies and suggested differential diagnoses for radiologists.",
    image: "/case_healthcare.png",
    imageFallback: "linear-gradient(135deg, #051a1a 0%, #073030 50%, #0a4545 100%)",
    size: "medium",
  },
  {
    id: "atlas-logistics",
    title: "Supply Chain Intelligence Platform",
    client: "Atlas Global",
    category: "Data",
    year: "2023",
    tags: ["Snowflake", "dbt", "Spark", "Real-time"],
    result: "31%",
    resultLabel: "Logistics cost reduction",
    description:
      "Unified 14 siloed data sources into a single demand-forecasting platform, enabling predictive routing and inventory pre-positioning across 80 countries.",
    image: "/case_logistics.png",
    imageFallback: "linear-gradient(135deg, #0f0d00 0%, #1e1800 50%, #2d2400 100%)",
    size: "medium",
  },
  {
    id: "forge-cybersec",
    title: "Zero-Trust Security Transformation",
    client: "Forge Defence",
    category: "Cybersecurity",
    year: "2023",
    tags: ["Zero Trust", "SIEM", "Pen Testing", "ISO 27001"],
    result: "100%",
    resultLabel: "Critical CVEs resolved",
    description:
      "Executed a full zero-trust architecture migration for a defence contractor under strict government compliance requirements, achieving ISO 27001 with zero incident recurrence.",
    image: null,
    imageFallback: "linear-gradient(135deg, #1a0000 0%, #2d0a0a 50%, #400f0f 100%)",
    size: "medium",
  },
  {
    id: "luminary-edtech",
    title: "Adaptive Learning Engine",
    client: "Luminary Learn",
    category: "AI",
    year: "2023",
    tags: ["Next.js", "NLP", "Personalisation", "AWS"],
    result: "3.2×",
    resultLabel: "Learner completion rate",
    description:
      "Built an NLP-powered curriculum engine that adapts content sequencing to each learner's cognitive profile, deployed across 600K monthly active users.",
    image: null,
    imageFallback: "linear-gradient(135deg, #0d0020 0%, #1a0040 50%, #270060 100%)",
    size: "medium",
  },
  {
    id: "strata-platform",
    title: "Full-Stack SaaS Re-Platform",
    client: "Strata Cloud",
    category: "Engineering",
    year: "2024",
    tags: ["Next.js", "PostgreSQL", "Stripe", "TypeScript"],
    result: "12wk",
    resultLabel: "Launch to production",
    description:
      "Rebuilt a legacy SaaS codebase from scratch: new API, multi-tenant data model, Stripe billing integration, and a CI/CD pipeline that ships multiple times per day.",
    image: null,
    imageFallback: "linear-gradient(135deg, #001a0a 0%, #002d14 50%, #00401e 100%)",
    size: "large",
  },
];

const CATEGORIES: Category[] = ["All", "Cloud", "AI", "Cybersecurity", "Engineering", "Data"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function CaseStudies() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<Category>("All");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered = activeFilter === "All"
    ? CASES
    : CASES.filter((c) => c.category === activeFilter);

  // Heading reveal on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        const els = headingRef.current.querySelectorAll(".gsap-reveal");
        gsap.fromTo(
          els,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: DURATIONS.slow,
            ease: EASES.expo,
            stagger: STAGGER.items,
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 78%",
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Cards animate in whenever the filter changes
  const animateCards = useCallback(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".case-card");
    gsap.fromTo(
      cards,
      { y: 40, opacity: 0, clipPath: "inset(0 0 100% 0)" },
      {
        y: 0,
        opacity: 1,
        clipPath: "inset(0 0 0% 0)",
        duration: 0.7,
        ease: EASES.expo,
        stagger: 0.07,
      }
    );
  }, []);

  useEffect(() => {
    // Small delay lets React re-render the filtered list first
    const id = setTimeout(animateCards, 40);
    return () => clearTimeout(id);
  }, [filtered, animateCards]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative bg-[var(--color-void)] py-36 overflow-hidden"
      aria-label="Case Studies"
    >
      {/* Accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-px bg-[var(--color-gold)] opacity-10 blur-sm"
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* ── Heading ── */}
        <div ref={headingRef} className="mb-14">
          <div className="gsap-reveal flex items-center gap-4 mb-6">
            <span className="accent-line" />
            <span
              className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold)] font-medium"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Selected Work
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <h2
              className="gsap-reveal text-5xl lg:text-6xl font-bold text-[var(--color-white)] leading-[1.08] max-w-lg"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Proof over
              <br />
              <span className="text-[var(--color-gold)]">promise</span>
            </h2>

            <p className="gsap-reveal text-[var(--color-ghost)] text-base max-w-xs leading-relaxed">
              Six case studies. Real clients, real outcomes — and the numbers to back every claim.
            </p>
          </div>
        </div>

        {/* ── Filter tabs ── */}
        <FilterBar
          categories={CATEGORIES}
          active={activeFilter}
          onChange={setActiveFilter}
        />

        {/* ── Card grid ── */}
        <div
          ref={gridRef}
          className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto"
          role="list"
        >
          {filtered.map((cs) => (
            <CaseCard
              key={cs.id}
              cs={cs}
              hovered={hoveredId === cs.id}
              onHover={setHoveredId}
            />
          ))}
        </div>

        {/* ── CTA ── */}
        <div className="mt-16 flex justify-center">
          <button
            id="view-all-cases-btn"
            className="group relative inline-flex items-center gap-3 px-8 py-4 border border-[var(--color-slate)] text-sm font-medium text-[var(--color-silver)] hover:border-[var(--color-gold)] hover:text-[var(--color-white)] transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">View all case studies</span>
            <svg
              className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* Fill on hover */}
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[var(--color-gold)] opacity-0 group-hover:opacity-5 transition-opacity duration-300"
            />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────

function FilterBar({
  categories,
  active,
  onChange,
}: {
  categories: Category[];
  active: Category;
  onChange: (c: Category) => void;
}) {
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  function updateIndicator(el: HTMLButtonElement) {
    const indicator = indicatorRef.current;
    if (!indicator || !barRef.current) return;
    const barRect = barRef.current.getBoundingClientRect();
    const btnRect = el.getBoundingClientRect();
    gsap.to(indicator, {
      x: btnRect.left - barRect.left,
      width: btnRect.width,
      duration: 0.35,
      ease: EASES.out,
    });
  }

  return (
    <div
      ref={barRef}
      className="relative flex items-center gap-1 border-b border-[var(--surface-glass-border)] pb-0"
      role="tablist"
      aria-label="Filter case studies by category"
    >
      {/* Sliding underline indicator */}
      <span
        ref={indicatorRef}
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-px bg-[var(--color-gold)] w-10"
        style={{ transform: "translateX(0px)" }}
      />

      {categories.map((cat) => (
        <button
          key={cat}
          id={`filter-${cat.toLowerCase()}`}
          role="tab"
          aria-selected={active === cat}
          onClick={(e) => {
            onChange(cat);
            updateIndicator(e.currentTarget);
          }}
          className={`relative px-4 py-3 text-xs tracking-[0.2em] uppercase transition-colors duration-200 whitespace-nowrap ${
            active === cat
              ? "text-[var(--color-gold)]"
              : "text-[var(--color-mist)] hover:text-[var(--color-silver)]"
          }`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {cat}
        </button>
      ))}

      {/* Count badge */}
      <span
        className="ml-auto px-2.5 py-1 text-[10px] font-medium border border-[var(--color-slate)] text-[var(--color-mist)] rounded-sm shrink-0"
        style={{ fontFamily: "var(--font-mono)" }}
        aria-live="polite"
      >
        {active === "All"
          ? CASES.length
          : CASES.filter((c) => c.category === active).length}{" "}
        projects
      </span>
    </div>
  );
}

// ─── Case Card ────────────────────────────────────────────────────────────────

function CaseCard({
  cs,
  hovered,
  onHover,
}: {
  cs: CaseStudy;
  hovered: boolean;
  onHover: (id: string | null) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Parallax on image on mouse move
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    const img = imageRef.current;
    if (!card || !img) return;
    const rect = card.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(img, {
      x: xPct * 12,
      y: yPct * 8,
      duration: 0.6,
      ease: "power2.out",
    });
  }

  function handleMouseLeave() {
    gsap.to(imageRef.current, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.6)",
    });
    onHover(null);
  }

  // Span 2 columns on large grid for "large" cards
  const isLarge = cs.size === "large";

  return (
    <div
      ref={cardRef}
      role="listitem"
      id={`case-${cs.id}`}
      className={`case-card group relative flex flex-col overflow-hidden border border-[var(--surface-glass-border)] bg-[var(--color-obsidian)] cursor-pointer transition-border duration-300 hover:border-[var(--color-gold-dim)] ${
        isLarge ? "md:col-span-2 lg:col-span-2" : ""
      }`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => onHover(cs.id)}
      onMouseLeave={handleMouseLeave}
      aria-label={`${cs.title} — ${cs.client}`}
    >
      {/* ── Image / visual area ── */}
      <div className="relative h-52 overflow-hidden bg-[var(--color-coal)]">
        {/* Gradient fallback always present */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: cs.imageFallback }}
        />

        {/* Actual photo if available */}
        {cs.image && (
          <div
            ref={imageRef}
            className="absolute inset-0 transition-transform will-change-transform"
            style={{ scale: "1.05" }}
          >
            <Image
              src={cs.image}
              alt={cs.title}
              fill
              className="object-cover opacity-70 mix-blend-luminosity group-hover:opacity-90 transition-opacity duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 660px"
            />
          </div>
        )}

        {/* Overlay tint */}
        <div
          ref={overlayRef}
          aria-hidden="true"
          className="absolute inset-0 bg-[var(--color-void)] opacity-50 group-hover:opacity-20 transition-opacity duration-500"
        />

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span
            className="px-2.5 py-1 text-[10px] tracking-widest uppercase bg-[rgba(0,0,0,0.6)] border border-[var(--surface-glass-border)] text-[var(--color-gold)] backdrop-blur-sm"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {cs.category}
          </span>
        </div>

        {/* Year badge */}
        <div className="absolute top-4 right-4">
          <span
            className="text-[10px] tracking-widest text-[var(--color-mist)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {cs.year}
          </span>
        </div>

        {/* Result stat — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out bg-linear-to-t from-black/90 to-transparent">
          <span
            className="block text-3xl font-bold text-[var(--color-gold)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {cs.result}
          </span>
          <span
            className="text-xs text-[var(--color-ghost)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {cs.resultLabel}
          </span>
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="flex flex-col flex-1 p-6 lg:p-8">
        {/* Client */}
        <p
          className="text-xs tracking-[0.25em] uppercase text-[var(--color-mist)] mb-2"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {cs.client}
        </p>

        {/* Title */}
        <h3
          className="text-lg font-bold text-[var(--color-white)] mb-3 leading-snug group-hover:text-[var(--color-gold-pale)] transition-colors duration-300"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {cs.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[var(--color-ghost)] leading-relaxed mb-5 flex-1">
          {cs.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {cs.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[10px] tracking-wider uppercase border border-[var(--color-slate)] text-[var(--color-mist)] rounded-sm group-hover:border-[var(--color-gold-dim)] transition-colors duration-300"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Read more arrow */}
        <div className="mt-5 flex items-center gap-2 text-xs text-[var(--color-slate)] group-hover:text-[var(--color-gold)] transition-colors duration-300">
          <span style={{ fontFamily: "var(--font-mono)" }}>View case study</span>
          <svg
            className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"
          >
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
