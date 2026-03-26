"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASES, DURATIONS, STAGGER } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ────────────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    id: "t1",
    quote:
      "Enclecta didn't just build us a platform — they fundamentally changed how we think about technology. The order latency they achieved was something our previous vendor said was physically impossible.",
    author: "James Whitfield",
    role: "CTO",
    company: "Nova Capital",
    category: "Cloud Infrastructure",
    initials: "JW",
    accentColor: "#c9a84c",
  },
  {
    id: "t2",
    quote:
      "The AI system they built is now a core part of our diagnostic workflow. Our radiologists trust it. That level of clinical confidence doesn't come easy — it took rigorous engineering and genuine domain understanding.",
    author: "Dr. Priya Nair",
    role: "Chief Medical Officer",
    company: "Meridian Health",
    category: "AI & Automation",
    initials: "PN",
    accentColor: "#4a7fa5",
  },
  {
    id: "t3",
    quote:
      "We'd been burned by consultancies promising the world and delivering delays. Enclecta was different — transparent, on schedule, and they actually pushed back when we made bad decisions. That's rare.",
    author: "Marcus Osei",
    role: "VP Engineering",
    company: "Atlas Global",
    category: "Data Platform",
    initials: "MO",
    accentColor: "#c9a84c",
  },
  {
    id: "t4",
    quote:
      "From zero-trust architecture to ISO 27001 certification in under six months, during live operations. The team's ability to execute under pressure is extraordinary. We've renewed our retainer twice.",
    author: "Samar Al-Rashid",
    role: "Head of IT Security",
    company: "Forge Defence",
    category: "Cybersecurity",
    initials: "SR",
    accentColor: "#8b2e2e",
  },
  {
    id: "t5",
    quote:
      "Our learner completion rate tripled in the first quarter after launch. Three-X is not a number I ever expected to see. The personalisation engine is genuinely magical — built in twelve weeks.",
    author: "Elena Vasquez",
    role: "CEO",
    company: "Luminary Learn",
    category: "Product Engineering",
    initials: "EV",
    accentColor: "#4a7fa5",
  },
];

const CLIENT_LOGOS = [
  "Nova Capital",
  "Meridian Health",
  "Atlas Global",
  "Forge Defence",
  "Luminary Learn",
  "Strata Cloud",
];

const AUTO_ADVANCE_MS = 5500;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isAnimating = useRef(false);

  // Heading reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        const els = headingRef.current.querySelectorAll(".gsap-reveal");
        gsap.fromTo(
          els,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: DURATIONS.slow,
            ease: EASES.expo,
            stagger: STAGGER.items,
            scrollTrigger: { trigger: headingRef.current, start: "top 80%" },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const goTo = useCallback((index: number) => {
    if (isAnimating.current || index === active) return;
    isAnimating.current = true;

    const el = quoteRef.current;
    if (!el) { isAnimating.current = false; return; }

    gsap.to(el, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setActive(index);
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0,
            duration: 0.5,
            ease: EASES.expo,
            onComplete: () => { isAnimating.current = false; },
          }
        );
      },
    });

    setProgress(0);
  }, [active]);

  // Auto-advance + progress bar
  useEffect(() => {
    if (paused) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }

    setProgress(0);
    const TICK_MS = 50;
    progressTimerRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + (TICK_MS / AUTO_ADVANCE_MS) * 100, 100));
    }, TICK_MS);

    timerRef.current = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % TESTIMONIALS.length;
        // Trigger animation manually since setActive is async
        const el = quoteRef.current;
        if (el && !isAnimating.current) {
          isAnimating.current = true;
          gsap.to(el, {
            opacity: 0, y: -20, duration: 0.3, ease: "power2.in",
            onComplete: () => {
              gsap.fromTo(el,
                { opacity: 0, y: 24 },
                { opacity: 1, y: 0, duration: 0.5, ease: EASES.expo,
                  onComplete: () => { isAnimating.current = false; } }
              );
            },
          });
        }
        setProgress(0);
        return next;
      });
    }, AUTO_ADVANCE_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [paused]);

  const t = TESTIMONIALS[active];

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative bg-[var(--color-obsidian)] py-36 overflow-hidden"
      aria-label="Client testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background large quote mark */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-12 left-8 text-[220px] leading-none font-bold text-[var(--color-coal)] opacity-60"
        style={{ fontFamily: "var(--font-display)", lineHeight: 1 }}
      >
        "
      </div>

      {/* Top accent line */}
      <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-px bg-[var(--surface-glass-border)]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── Heading ── */}
        <div ref={headingRef} className="mb-20 max-w-xl">
          <div className="gsap-reveal flex items-center gap-4 mb-6">
            <span className="accent-line" />
            <span className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold)] font-medium"
              style={{ fontFamily: "var(--font-mono)" }}>
              Client Voice
            </span>
          </div>
          <h2 className="gsap-reveal text-5xl lg:text-6xl font-bold text-[var(--color-white)] leading-[1.08]"
            style={{ fontFamily: "var(--font-display)" }}>
            Trusted by those
            <br />
            <span className="text-[var(--color-gold)]">who demand more</span>
          </h2>
        </div>

        {/* ── Main testimonial ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16 items-start">

          {/* Quote block */}
          <div>
            <div ref={quoteRef} aria-live="polite" aria-atomic="true">
              {/* Category chip */}
              <div className="mb-8">
                <span className="px-3 py-1 text-[10px] tracking-[0.25em] uppercase border border-[var(--color-slate)]"
                  style={{ color: t.accentColor, borderColor: t.accentColor + "55", fontFamily: "var(--font-mono)" }}>
                  {t.category}
                </span>
              </div>

              {/* Quote text */}
              <blockquote
                className="text-2xl lg:text-3xl font-medium text-[var(--color-white)] leading-[1.45] mb-10 max-w-3xl"
                style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                {/* Avatar initials */}
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border"
                  style={{
                    background: t.accentColor + "20",
                    borderColor: t.accentColor + "60",
                    color: t.accentColor,
                    fontFamily: "var(--font-mono)",
                  }}
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-white)]">{t.author}</p>
                  <p className="text-xs text-[var(--color-mist)]"
                    style={{ fontFamily: "var(--font-mono)" }}>
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Navigation dots + progress ── */}
            <div className="mt-12 flex items-center gap-6">
              {/* Dots */}
              <div className="flex items-center gap-2" role="tablist" aria-label="Testimonial navigation">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    id={`testimonial-dot-${i}`}
                    role="tab"
                    aria-selected={i === active}
                    aria-label={`Testimonial ${i + 1}`}
                    onClick={() => goTo(i)}
                    className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
                    style={{ width: i === active ? "32px" : "12px", background: "var(--color-slate)" }}
                  >
                    {i === active && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full origin-left"
                        style={{
                          background: "var(--color-gold)",
                          transform: `scaleX(${progress / 100})`,
                          transformOrigin: "left",
                          transition: paused ? "none" : undefined,
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Prev / Next */}
              <div className="flex items-center gap-2 ml-2">
                <button
                  id="testimonial-prev-btn"
                  aria-label="Previous testimonial"
                  onClick={() => goTo((active - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                  className="w-9 h-9 flex items-center justify-center border border-[var(--color-slate)] text-[var(--color-mist)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors duration-200"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  id="testimonial-next-btn"
                  aria-label="Next testimonial"
                  onClick={() => goTo((active + 1) % TESTIMONIALS.length)}
                  className="w-9 h-9 flex items-center justify-center border border-[var(--color-slate)] text-[var(--color-mist)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors duration-200"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {/* Counter */}
              <span className="ml-auto text-xs text-[var(--color-slate)]"
                style={{ fontFamily: "var(--font-mono)" }}>
                {String(active + 1).padStart(2, "0")} / {String(TESTIMONIALS.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* ── Right panel: all testimonials mini-list ── */}
          <div className="hidden lg:flex flex-col gap-3 pt-2">
            {TESTIMONIALS.map((item, i) => (
              <button
                key={item.id}
                id={`testimonial-item-${i}`}
                onClick={() => goTo(i)}
                className={`text-left px-4 py-4 border transition-all duration-300 group ${
                  i === active
                    ? "border-[var(--color-gold-dim)] bg-[rgba(201,168,76,0.05)]"
                    : "border-[var(--surface-glass-border)] hover:border-[var(--color-slate)]"
                }`}
              >
                <p className={`text-xs font-semibold mb-0.5 transition-colors duration-200 ${
                  i === active ? "text-[var(--color-gold)]" : "text-[var(--color-silver)] group-hover:text-[var(--color-white)]"
                }`} style={{ fontFamily: "var(--font-display)" }}>
                  {item.author}
                </p>
                <p className="text-[10px] text-[var(--color-mist)]"
                  style={{ fontFamily: "var(--font-mono)" }}>
                  {item.company}
                </p>
                <p className={`text-xs mt-2 line-clamp-2 leading-relaxed transition-colors duration-200 ${
                  i === active ? "text-[var(--color-ghost)]" : "text-[var(--color-slate)]"
                }`}>
                  &ldquo;{item.quote.slice(0, 80)}&hellip;&rdquo;
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Client logo strip ── */}
        <div className="mt-24 border-t border-[var(--surface-glass-border)] pt-12">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-slate)] mb-8 text-center"
            style={{ fontFamily: "var(--font-mono)" }}>
            Trusted by leading organisations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {CLIENT_LOGOS.map((logo) => (
              <div key={logo}
                className="text-sm font-bold tracking-widest uppercase text-[var(--color-slate)] hover:text-[var(--color-gold)] transition-colors duration-300 cursor-default"
                style={{ fontFamily: "var(--font-display)" }}>
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
