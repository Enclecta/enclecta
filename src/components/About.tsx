"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASES, DURATIONS, STAGGER } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

// ─── Stats ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: 14, suffix: "+", label: "Years of practice" },
  { value: 320, suffix: "+", label: "Projects delivered" },
  { value: 98, suffix: "%", label: "Client retention" },
  { value: 40, suffix: "+", label: "Enterprise clients" },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left column reveal
      if (leftRef.current) {
        const els = leftRef.current.querySelectorAll(".gsap-reveal");
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
              trigger: leftRef.current,
              start: "top 75%",
            },
          }
        );
      }

      // Right column reveal
      if (rightRef.current) {
        const els = rightRef.current.querySelectorAll(".gsap-reveal");
        gsap.fromTo(
          els,
          { x: 40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: DURATIONS.slow,
            ease: EASES.expo,
            stagger: STAGGER.items,
            delay: 0.15,
            scrollTrigger: {
              trigger: rightRef.current,
              start: "top 75%",
            },
          }
        );
      }

      // Stats section trigger
      if (statsRef.current) {
        ScrollTrigger.create({
          trigger: statsRef.current,
          start: "top 80%",
          onEnter: () => setStatsVisible(true),
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative bg-[var(--color-obsidian)] py-36 overflow-hidden"
      aria-label="About Enclecta"
    >
      {/* Decorative vertical rule */}
      <div
        aria-hidden="true"
        className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-[var(--surface-glass-border)]"
      />

      {/* Large ghost typography */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -bottom-8 left-60 text-[clamp(100px,18vw,220px)] font-bold leading-none text-[var(--color-obsidian)] tracking-tighter"
        style={{
          fontFamily: "var(--font-display)",
          WebkitTextStroke: "1px rgba(255, 255, 255, 0.17)",
        }}
      >
        ENCLECTA
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* ── Split layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start mb-28">
          {/* Left — headline + philosophy */}
          <div ref={leftRef} className="space-y-8">
            <div className="gsap-reveal flex items-center gap-4">
              <span className="accent-line" />
              <span
                className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold)] font-medium"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Our Philosophy
              </span>
            </div>

            <h2
              className="gsap-reveal text-5xl lg:text-6xl font-bold text-[var(--color-white)] leading-[1.08]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Technology that
              <br />
              <em className="not-italic text-[var(--color-gold)]">earns its place</em>
            </h2>

            <div className="gsap-reveal space-y-4 text-[var(--color-ghost)] text-base leading-relaxed max-w-md">
              <p>
                We don&apos;t sell technology for the sake of it. Every system we build, every decision we make, has to justify itself — in business value, in resilience, in the lives it makes easier.
              </p>
              <p>
                Enclecta was founded on the belief that the best technology is invisible: it just works, scales when you need it, and stays out of your way.
              </p>
            </div>

            <div className="gsap-reveal pt-2">
              <a
                href="#services"
                id="about-explore-link"
                className="inline-flex items-center gap-3 text-sm font-medium text-[var(--color-white)] group"
              >
                <span className="h-px w-8 bg-[var(--color-gold)] transition-all duration-300 group-hover:w-14" />
                <span className="transition-colors duration-300 group-hover:text-[var(--color-gold)]">
                  Explore our services
                </span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 text-[var(--color-gold)]"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right — values list */}
          <div ref={rightRef} className="space-y-0 pt-2">
            {[
              {
                num: "I",
                title: "Precision over volume",
                body: "We take on fewer engagements so we can do each one properly. Our teams go deep, not wide.",
              },
              {
                num: "II",
                title: "Long-term partnership",
                body: "We measure success in years, not projects. Our goal is to be the tech partner you never have to replace.",
              },
              {
                num: "III",
                title: "Radical transparency",
                body: "No hidden costs, no scope creep surprises. You see everything — timelines, trade-offs, risks.",
              },
              {
                num: "IV",
                title: "Engineering rigour",
                body: "Code review, test coverage, CI/CD, observability — these aren't optional extras. They're how we work.",
              },
            ].map((v, i) => (
              <div
                key={v.num}
                className="gsap-reveal group border-b border-[var(--surface-glass-border)] py-7 first:border-t flex gap-6 items-start hover:bg-[rgba(201,168,76,0.02)] transition-colors duration-300 px-1"
              >
                <span
                  className="text-xs text-[var(--color-slate)] pt-1 shrink-0 w-5"
                  style={{ fontFamily: "var(--font-mono)" }}
                  aria-hidden="true"
                >
                  {v.num}
                </span>
                <div className="space-y-1.5">
                  <h3
                    className="text-base font-bold text-[var(--color-white)] group-hover:text-[var(--color-gold-pale)] transition-colors duration-300"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {v.title}
                  </h3>
                  <p className="text-sm text-[var(--color-ghost)] leading-relaxed">{v.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Stats ribbon ── */}
        <div
          ref={statsRef}
          className="border-t border-[var(--surface-glass-border)] pt-16 grid grid-cols-2 lg:grid-cols-4 gap-10"
          role="list"
        >
          {STATS.map((stat, i) => (
            <StatCounter
              key={stat.label}
              stat={stat}
              visible={statsVisible}
              delay={i * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Stat counter sub-component ───────────────────────────────────────────────

function StatCounter({
  stat,
  visible,
  delay,
}: {
  stat: (typeof STATS)[number];
  visible: boolean;
  delay: number;
}) {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!visible || hasRun.current) return;
    hasRun.current = true;

    const timeout = setTimeout(() => {
      const duration = 1600;
      const steps = 60;
      const stepTime = duration / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += 1;
        const progress = current / steps;
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * stat.value));
        if (current >= steps) clearInterval(timer);
      }, stepTime);

      return () => clearInterval(timer);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [visible, stat.value, delay]);

  return (
    <div role="listitem" className="space-y-2">
      <div
        className="text-5xl lg:text-6xl font-bold"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)" }}
        aria-label={`${stat.value}${stat.suffix}`}
      >
        {count}
        <span className="text-3xl lg:text-4xl">{stat.suffix}</span>
      </div>
      <p
        className="text-xs tracking-[0.2em] uppercase text-[var(--color-mist)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {stat.label}
      </p>
    </div>
  );
}
