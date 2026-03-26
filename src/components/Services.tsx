"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASES, DURATIONS, STAGGER } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: "website",
    number: "01",
    title: "Website Development",
    tagline: "Engage your users",
    description:
      "We build responsive, high-performance websites that reflect your brand and engage your users. From sleek landing pages to full-featured e-commerce platforms, we deliver pixel-perfect design with clean, maintainable code.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12 32a8 8 0 1 1 3.428-15.267A12 12 0 1 1 36 28H12z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M24 28v8M20 34l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "ai",
    number: "02",
    title: "AI & Automation",
    tagline: "Intelligence at scale",
    description:
      "From LLM-powered copilots to production ML pipelines, we embed machine intelligence into your product so it learns, adapts, and delivers measurable outcomes.",
    tags: ["LLMs", "MLOps", "Python", "Vector DBs"],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M24 8v4M24 36v4M8 24h4M36 24h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M13.4 13.4l2.8 2.8M31.8 31.8l2.8 2.8M34.6 13.4l-2.8 2.8M16.2 31.8l-2.8 2.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="24" cy="24" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "saas",
    number: "03",
    title: "SaaS Development",
    tagline: "Turnkey SaaS platforms",
    description:
      "We build secure, scalable SaaS applications from the ground up. From multi-tenant architecture and subscription management to automated onboarding and analytics dashboards, we handle the full stack so you can focus on your business.",
    tags: ["SaaS", "Multi-tenant", "Subscription Management", "Analytics"],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M24 6L8 12v12c0 9.941 7.163 19.238 16 22 8.837-2.762 16-12.059 16-22V12L24 6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M17 24l5 5 9-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "dev",
    number: "04",
    title: "Product Engineering",
    tagline: "Built to last",
    description:
      "Full-stack teams that turn ideas into polished, performant products. Agile sprints, clean architecture, and obsessive attention to code quality from day one.",
    tags: ["Next.js", "Node.js", "TypeScript", "Postgres"],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M19 20l-5 4 5 4M29 20l5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M25 18l-4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "data",
    number: "05",
    title: "Data & Analytics",
    tagline: "Signal over noise",
    description:
      "We build data platforms that turn raw streams into executive decisions — real-time pipelines, semantic data models, and dashboards your entire org will actually use.",
    tags: ["Spark", "dbt", "Snowflake", "Kafka"],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M8 36l10-12 8 8 6-10 8 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="18" cy="24" r="2" fill="currentColor" />
        <circle cx="26" cy="32" r="2" fill="currentColor" />
        <circle cx="32" cy="22" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "social media",
    number: "06",
    title: "Social Media Management",
    tagline: "Build your brand",
    description:
      "We help businesses build and manage their online presence through strategic social media management. From content creation and scheduling to community engagement and analytics, we deliver measurable results that drive growth.",
    tags: ["Social Media", "Content Creation", "Community Engagement", "Analytics"],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M24 6l5.196 9h10.392L34.392 24l5.196 9H29.196L24 42l-5.196-9H8.412L13.608 24 8.412 15H18.804L24 6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="24" cy="24" r="4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      if (headingRef.current) {
        const headingChildren = headingRef.current.querySelectorAll(".gsap-reveal");
        gsap.fromTo(
          headingChildren,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: DURATIONS.slow,
            ease: EASES.expo,
            stagger: STAGGER.items,
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 80%",
            },
          }
        );
      }

      // Cards stagger reveal
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".service-card");
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: DURATIONS.slow,
            ease: EASES.out,
            stagger: 0.1,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 75%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative bg-[var(--color-void)] py-36 overflow-hidden"
      aria-label="Services"
    >
      {/* Subtle grid bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Corner accent */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-px h-48 bg-linear-to-b from-[var(--color-gold)] to-transparent opacity-40"
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* ── Heading ── */}
        <div ref={headingRef} className="mb-20 max-w-2xl">
          <div className="gsap-reveal flex items-center gap-4 mb-6">
            <span className="accent-line" />
            <span
              className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold)] font-medium"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              What We Do
            </span>
          </div>

          <h2
            className="gsap-reveal text-5xl lg:text-6xl font-bold text-[var(--color-white)] leading-[1.08]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Capabilities built
            <br />
            <span className="text-[var(--color-gold)]">for what&apos;s next</span>
          </h2>

          <p className="gsap-reveal mt-6 text-[var(--color-ghost)] text-lg max-w-lg leading-relaxed">
            Six practice areas. One integrated partner. From cloud foundations to AI-native products, we cover every layer of the modern technology stack.
          </p>
        </div>

        {/* ── Cards grid ── */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--surface-glass-border)]"
          role="list"
        >
          {SERVICES.map((svc) => (
            <ServiceCard key={svc.id} service={svc} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Card sub-component ───────────────────────────────────────────────────────

type ServiceType = (typeof SERVICES)[number];

function ServiceCard({ service }: { service: ServiceType }) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--mouse-x", `50%`);
    card.style.setProperty("--mouse-y", `50%`);
  }

  return (
    <div
      ref={cardRef}
      role="listitem"
      className="service-card group relative bg-[var(--color-obsidian)] p-8 lg:p-10 cursor-default overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        {
          "--mouse-x": "50%",
          "--mouse-y": "50%",
        } as React.CSSProperties
      }
    >
      {/* Radial spotlight on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), rgba(201,168,76,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Top border reveal */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 h-px w-0 group-hover:w-full bg-[var(--color-gold)] transition-all duration-700 ease-out"
      />

      {/* Number */}
      <span
        className="block mb-6 text-xs tracking-[0.25em] text-[var(--color-slate)]"
        style={{ fontFamily: "var(--font-mono)" }}
        aria-hidden="true"
      >
        {service.number}
      </span>

      {/* Icon */}
      <div className="mb-5 w-10 h-10 text-[var(--color-gold)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
        {service.icon}
      </div>

      {/* Title */}
      <h3
        className="text-xl font-bold text-[var(--color-white)] mb-1 transition-colors duration-300 group-hover:text-[var(--color-gold-pale)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {service.title}
      </h3>

      {/* Tagline */}
      <p
        className="text-xs tracking-widest uppercase text-[var(--color-mist)] mb-4"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {service.tagline}
      </p>

      {/* Description */}
      <p className="text-sm text-[var(--color-ghost)] leading-relaxed mb-6">
        {service.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-auto">
        {service.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 text-[10px] tracking-wider uppercase border border-[var(--color-slate)] text-[var(--color-mist)] rounded-sm group-hover:border-[var(--color-gold-dim)] group-hover:text-[var(--color-gold)] transition-colors duration-300"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Arrow indicator */}
      <div className="absolute bottom-8 right-8 w-6 h-6 text-[var(--color-slate)] group-hover:text-[var(--color-gold)] transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
