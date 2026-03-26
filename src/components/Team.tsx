"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASES, DURATIONS, STAGGER } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ────────────────────────────────────────────────────────────────────

const TEAM = [
  {
    id: "ceo",
    name: "Darius Okafor",
    role: "Chief Executive Officer",
    shortRole: "CEO",
    bio: "20 years building technology organisations across three continents. Former Partner at McKinsey Digital. Believes the best technology decisions are fundamentally human ones.",
    image: "/team_ceo.png",
    linkedin: "#",
    tags: ["Strategy", "Leadership", "M&A"],
    featured: true,
  },
  {
    id: "cto",
    name: "Ananya Krishnan",
    role: "Chief Technology Officer",
    shortRole: "CTO",
    bio: "Engineering lead for cloud-native systems at scale. Ex-Google SRE, ex-Netflix Platform. Obsessive about resilience, latency, and systems that survive contact with reality.",
    image: "/team_cto.png",
    linkedin: "#",
    tags: ["Cloud", "Distributed Systems", "SRE"],
    featured: true,
  },
  {
    id: "arch",
    name: "Kevin Zhao",
    role: "Principal Architect",
    shortRole: "Principal Arch.",
    bio: "Designed core infrastructure at two unicorns before joining Enclecta. Specialises in event-driven microservices, DDD, and making CQRS readable by humans.",
    image: "/team_arch.png",
    linkedin: "#",
    tags: ["Architecture", "DDD", "Microservices"],
    featured: false,
  },
  {
    id: "data",
    name: "Sofia Reyes",
    role: "Head of Data & AI",
    shortRole: "Head of AI",
    bio: "PhD in Computational Linguistics. Led ML platforms at two B2B SaaS companies. Translates research into production systems that business people actually trust.",
    image: "/team_data.png",
    linkedin: "#",
    tags: ["ML", "NLP", "Data Platforms"],
    featured: false,
  },
  {
    id: "security",
    name: "Tariq Al-Hassan",
    role: "Head of Security",
    shortRole: "Head of Security",
    bio: "Former penetration tester, current zero-trust evangelist. Has hardened infrastructure for three regulated industries and finds CVSS scoring \"optimistic\".",
    image: "/team_security.png",
    linkedin: "#",
    tags: ["Zero Trust", "Pen Testing", "Compliance"],
    featured: false,
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Team() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading
      if (headingRef.current) {
        const els = headingRef.current.querySelectorAll(".gsap-reveal");
        gsap.fromTo(els,
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: DURATIONS.slow,
            ease: EASES.expo,
            stagger: STAGGER.items,
            scrollTrigger: { trigger: headingRef.current, start: "top 78%" },
          }
        );
      }

      // Cards
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll(".team-card");
        gsap.fromTo(cards,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: DURATIONS.slow,
            ease: EASES.out,
            stagger: 0.12,
            scrollTrigger: { trigger: gridRef.current, start: "top 78%" },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="team"
      ref={sectionRef}
      className="relative bg-[var(--color-void)] py-36 overflow-hidden"
      aria-label="Leadership team"
    >
      {/* Subtle dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── Heading ── */}
        <div ref={headingRef} className="mb-20 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="space-y-6">
            <div className="gsap-reveal flex items-center gap-4">
              <span className="accent-line" />
              <span className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold)] font-medium"
                style={{ fontFamily: "var(--font-mono)" }}>
                The Team
              </span>
            </div>
            <h2 className="gsap-reveal text-5xl lg:text-6xl font-bold text-[var(--color-white)] leading-[1.08]"
              style={{ fontFamily: "var(--font-display)" }}>
              The people
              <br />
              <span className="text-[var(--color-gold)]">behind the work</span>
            </h2>
          </div>
          <p className="gsap-reveal text-[var(--color-ghost)] text-base max-w-xs leading-relaxed lg:text-right">
            A senior team with no juniors on client projects. Every engagement gets our best.
          </p>
        </div>

        {/* ── Featured row (CEO + CTO) ── */}
        <div ref={gridRef} className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {TEAM.filter((m) => m.featured).map((member) => (
              <FeaturedCard
                key={member.id}
                member={member}
                expanded={activeId === member.id}
                onToggle={() => setActiveId(activeId === member.id ? null : member.id)}
              />
            ))}
          </div>

          {/* ── Supporting row ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TEAM.filter((m) => !m.featured).map((member) => (
              <CompactCard
                key={member.id}
                member={member}
                expanded={activeId === member.id}
                onToggle={() => setActiveId(activeId === member.id ? null : member.id)}
              />
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <div className="mt-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-[var(--surface-glass-border)] pt-12">
          <div>
            <p className="text-sm font-semibold text-[var(--color-white)] mb-1"
              style={{ fontFamily: "var(--font-display)" }}>
              Want to join the team?
            </p>
            <p className="text-xs text-[var(--color-ghost)]">
              We hire for character first, skill second. Open roles below.
            </p>
          </div>
          <button
            id="open-roles-btn"
            className="group inline-flex items-center gap-3 px-6 py-3 border border-[var(--color-slate)] text-sm font-medium text-[var(--color-silver)] hover:border-[var(--color-gold)] hover:text-[var(--color-white)] transition-all duration-300"
          >
            View open roles
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Featured Card ────────────────────────────────────────────────────────────

type Member = (typeof TEAM)[number];

function FeaturedCard({
  member,
  expanded,
  onToggle,
}: {
  member: Member;
  expanded: boolean;
  onToggle: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    const img = imgRef.current;
    if (!card || !img) return;
    const rect = card.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(img, { x: xPct * 10, y: yPct * 6, duration: 0.6, ease: "power2.out" });
  }

  function handleMouseLeave() {
    gsap.to(imgRef.current, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1,0.5)" });
  }

  return (
    <div
      ref={cardRef}
      className="team-card group relative overflow-hidden border border-[var(--surface-glass-border)] hover:border-[var(--color-gold-dim)] transition-colors duration-500 cursor-pointer"
      onClick={onToggle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      aria-label={`${member.name}, ${member.role}`}
      onKeyDown={(e) => e.key === "Enter" && onToggle()}
    >
      <div className="flex gap-0">
        {/* Image column */}
        <div className="relative w-44 shrink-0 overflow-hidden bg-[var(--color-coal)]">
          <div ref={imgRef} className="absolute inset-0 scale-105">
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover object-top saturate-50 group-hover:saturate-100 transition-all duration-700"
              sizes="176px"
            />
          </div>
          {/* Gold overlay tint */}
          <div className="absolute inset-0 bg-[var(--color-gold)] opacity-0 group-hover:opacity-5 mix-blend-color transition-opacity duration-500" />
        </div>

        {/* Content column */}
        <div className="flex-1 p-7 flex flex-col justify-between min-h-[220px]">
          <div>
            {/* Role badge */}
            <span className="inline-block mb-4 px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase border border-[var(--color-gold-dim)] text-[var(--color-gold)] bg-[rgba(201,168,76,0.06)]"
              style={{ fontFamily: "var(--font-mono)" }}>
              {member.shortRole}
            </span>

            <h3 className="text-xl font-bold text-[var(--color-white)] mb-1 group-hover:text-[var(--color-gold-pale)] transition-colors duration-300"
              style={{ fontFamily: "var(--font-display)" }}>
              {member.name}
            </h3>
            <p className="text-xs text-[var(--color-mist)] mb-4">{member.role}</p>

            {/* Bio — expand on click */}
            <div
              className="overflow-hidden transition-all duration-500"
              style={{ maxHeight: expanded ? "120px" : "0px", opacity: expanded ? 1 : 0 }}
            >
              <p className="text-sm text-[var(--color-ghost)] leading-relaxed pb-4">{member.bio}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {member.tags.map((tag) => (
                <span key={tag}
                  className="px-2 py-0.5 text-[10px] tracking-wide uppercase border border-[var(--color-slate)] text-[var(--color-mist)]"
                  style={{ fontFamily: "var(--font-mono)" }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Expand toggle */}
            <div className={`w-6 h-6 shrink-0 text-[var(--color-slate)] group-hover:text-[var(--color-gold)] transition-all duration-300 ${expanded ? "rotate-45" : ""}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Compact Card ─────────────────────────────────────────────────────────────

function CompactCard({
  member,
  expanded,
  onToggle,
}: {
  member: Member;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="team-card group relative border border-[var(--surface-glass-border)] hover:border-[var(--color-gold-dim)] transition-colors duration-500 cursor-pointer overflow-hidden"
      onClick={onToggle}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      aria-label={`${member.name}, ${member.role}`}
      onKeyDown={(e) => e.key === "Enter" && onToggle()}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-[var(--color-coal)]">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover object-top saturate-50 group-hover:saturate-100 group-hover:scale-105 transition-all duration-700"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Dark scrim */}
        <div className="absolute inset-0 bg-linear-to-t from-[var(--color-obsidian)] via-transparent to-transparent opacity-80" />

        {/* Name overlay on image */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span className="block text-[10px] tracking-[0.2em] uppercase text-[var(--color-gold)] mb-1"
            style={{ fontFamily: "var(--font-mono)" }}>
            {member.shortRole}
          </span>
          <h3 className="text-base font-bold text-[var(--color-white)] group-hover:text-[var(--color-gold-pale)] transition-colors duration-300"
            style={{ fontFamily: "var(--font-display)" }}>
            {member.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Bio expand */}
        <div
          className="overflow-hidden transition-all duration-500"
          style={{ maxHeight: expanded ? "150px" : "0px", opacity: expanded ? 1 : 0 }}
        >
          <p className="text-sm text-[var(--color-ghost)] leading-relaxed mb-4">{member.bio}</p>
        </div>

        <div className="flex items-end justify-between">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {member.tags.map((tag) => (
              <span key={tag}
                className="px-2 py-0.5 text-[10px] uppercase border border-[var(--color-slate)] text-[var(--color-mist)] group-hover:border-[var(--color-gold-dim)] transition-colors duration-300"
                style={{ fontFamily: "var(--font-mono)" }}>
                {tag}
              </span>
            ))}
          </div>

          <div className={`w-5 h-5 shrink-0 ml-3 text-[var(--color-slate)] group-hover:text-[var(--color-gold)] transition-all duration-300 ${expanded ? "rotate-45" : ""}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
