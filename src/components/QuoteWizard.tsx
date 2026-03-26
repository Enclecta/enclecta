"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// ─── Pricing Engine ───────────────────────────────────────────────────────────

const BASE_PRICES: Record<string, number> = {
  "Website Development": 3500,
  "AI & Automation": 12000,
  "SaaS Development": 18000,
  "Product Engineering": 15000,
  "Data & Analytics": 9000,
  "Social Media Management": 1200,
};

const COMPLEXITY_MULTIPLIERS: Record<string, number> = {
  Simple: 1,
  Standard: 1.6,
  Complex: 2.4,
  Enterprise: 3.8,
};

const TIMELINE_MULTIPLIERS: Record<string, number> = {
  "< 2 weeks": 1.4,
  "1 month": 1.2,
  "2-3 months": 1.0,
  "3-6 months": 0.95,
  "6+ months": 0.9,
};

const FEATURE_PRICES: Record<string, number> = {
  "User Authentication": 800,
  "Payment Integration": 1200,
  "Admin Dashboard": 1500,
  "API Integration": 900,
  "Mobile Responsive": 600,
  "SEO Optimisation": 700,
  "Analytics & Reporting": 1000,
  "Multi-language Support": 1100,
  "AI/Chatbot": 2500,
  "Real-time Features": 1800,
};

function computeQuote(data: QuoteData): { low: number; high: number } {
  const base = BASE_PRICES[data.service] ?? 5000;
  const complexity = COMPLEXITY_MULTIPLIERS[data.complexity] ?? 1;
  const timeline = TIMELINE_MULTIPLIERS[data.timeline] ?? 1;
  const features = data.features.reduce(
    (sum, f) => sum + (FEATURE_PRICES[f] ?? 0),
    0
  );
  const midpoint = base * complexity * timeline + features;
  return {
    low: Math.round(midpoint * 0.85 / 100) * 100,
    high: Math.round(midpoint * 1.2 / 100) * 100,
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

type QuoteData = {
  // Step 1
  service: string;
  complexity: string;
  description: string;
  // Step 2
  features: string[];
  timeline: string;
  hasDesign: string;
  // Step 3
  name: string;
  email: string;
  company: string;
  phone: string;
};

const INITIAL: QuoteData = {
  service: "",
  complexity: "",
  description: "",
  features: [],
  timeline: "",
  hasDesign: "",
  name: "",
  email: "",
  company: "",
  phone: "",
};

const EASE_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
  }),
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function QuoteWizard() {
  const [step, setStep] = useState(0); // 0=1, 1=2, 2=3, 3=result
  const [dir, setDir] = useState(1);
  const [data, setData] = useState<QuoteData>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof QuoteData, string>>>({});

  const STEPS = ["Your Project", "Requirements", "Your Details", "Your Estimate"];

  function update<K extends keyof QuoteData>(key: K, val: QuoteData[K]) {
    setData((p) => ({ ...p, [key]: val }));
    setErrors((p) => { const n = { ...p }; delete n[key]; return n; });
  }

  function toggleFeature(f: string) {
    setData((p) => ({
      ...p,
      features: p.features.includes(f)
        ? p.features.filter((x) => x !== f)
        : [...p.features, f],
    }));
  }

  function validateStep(s: number): boolean {
    const e: typeof errors = {};
    if (s === 0) {
      if (!data.service) e.service = "Please select a service";
      if (!data.complexity) e.complexity = "Please select project complexity";
    }
    if (s === 1) {
      if (!data.timeline) e.timeline = "Please select a timeline";
      if (!data.hasDesign) e.hasDesign = "Please answer this question";
    }
    if (s === 2) {
      if (!data.name.trim()) e.name = "Name is required";
      if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
        e.email = "Valid email required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validateStep(step)) return;
    setDir(1);
    setStep((s) => s + 1);
  }

  function back() {
    setDir(-1);
    setStep((s) => s - 1);
  }

  const quote = step === 3 ? computeQuote(data) : null;

  return (
    <div className="min-h-screen bg-[var(--color-void)] flex flex-col">

      {/* ── Top bar ── */}
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-[var(--surface-glass-border)] py-4 px-6 lg:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group" aria-label="Back to Enclecta">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute w-5 h-5 border border-[var(--color-gold)]" style={{ transform: "rotate(45deg)" }} />
            <div className="w-2 h-2 bg-[var(--color-gold)]" style={{ transform: "rotate(45deg)" }} />
          </div>
          <span className="text-sm font-bold tracking-[0.18em] text-[var(--color-white)] uppercase"
            style={{ fontFamily: "var(--font-display)" }}>
            Encle<span className="text-[var(--color-gold)]">cta</span>
          </span>
        </Link>
        <Link href="/"
          className="flex items-center gap-2 text-xs text-[var(--color-mist)] hover:text-[var(--color-white)] transition-colors duration-200"
          style={{ fontFamily: "var(--font-mono)" }}>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to site
        </Link>
      </header>

      {/* ── Progress bar ── */}
      <div className="fixed top-[61px] left-0 right-0 z-30 h-px bg-[var(--color-ash)]">
        <motion.div
          className="h-full bg-[var(--color-gold)]"
          animate={{ width: `${((step) / 3) * 100}%` }}
          transition={{ duration: 0.5, ease: EASE_EXPO }}
        />
      </div>

      <main className="flex-1 pt-28 pb-20 px-6 lg:px-12 max-w-3xl mx-auto w-full">

        {/* ── Step indicators ── */}
        <div className="flex items-center gap-0 mb-14" role="list" aria-label="Form progress">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1 last:flex-none" role="listitem">
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${i < step ? "bg-[var(--color-gold)] text-[var(--color-void)]" :
                  i === step ? "border-2 border-[var(--color-gold)] text-[var(--color-gold)]" :
                    "border border-[var(--color-slate)] text-[var(--color-slate)]"
                  }`} style={{ fontFamily: "var(--font-mono)" }}>
                  {i < step
                    ? <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-label="Completed"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    : i + 1}
                </div>
                <span className={`text-[9px] tracking-widest uppercase hidden sm:block transition-colors duration-300 ${i === step ? "text-[var(--color-gold)]" : "text-[var(--color-slate)]"
                  }`} style={{ fontFamily: "var(--font-mono)" }}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 mx-2 h-px transition-colors duration-500"
                  style={{ background: i < step ? "var(--color-gold)" : "var(--color-ash)" }} />
              )}
            </div>
          ))}
        </div>

        {/* ── Animated step panel ── */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: EASE_EXPO }}
          >
            {step === 0 && <Step1 data={data} errors={errors} update={update} />}
            {step === 1 && <Step2 data={data} errors={errors} update={update} toggleFeature={toggleFeature} />}
            {step === 2 && <Step3 data={data} errors={errors} update={update} />}
            {step === 3 && quote && <ResultStep data={data} quote={quote} />}
          </motion.div>
        </AnimatePresence>

        {/* ── Navigation buttons ── */}
        {step < 3 && (
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-[var(--surface-glass-border)]">
            <button
              id="quote-back-btn"
              onClick={back}
              disabled={step === 0}
              className="flex items-center gap-2 px-5 py-3 text-sm border border-[var(--color-slate)] text-[var(--color-mist)] hover:border-[var(--color-ghost)] hover:text-[var(--color-white)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>

            <div className="text-[10px] text-[var(--color-slate)]" style={{ fontFamily: "var(--font-mono)" }}>
              Step {step + 1} of 3
            </div>

            <button
              id="quote-next-btn"
              onClick={next}
              className="group flex items-center gap-2 px-8 py-3 bg-[var(--color-gold)] text-[var(--color-void)] text-sm font-bold tracking-wide hover:bg-[var(--color-gold-pale)] transition-all duration-200"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {step === 2 ? "Get My Quote" : "Continue"}
              <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Step 1: Project Type ─────────────────────────────────────────────────────

const SERVICES_LIST = Object.keys(BASE_PRICES);
const COMPLEXITY_OPTS = [
  { label: "Simple", desc: "Standard features, single use-case" },
  { label: "Standard", desc: "Multiple features, some custom logic" },
  { label: "Complex", desc: "Extensive custom functionality" },
  { label: "Enterprise", desc: "Large-scale, multi-team, mission-critical" },
];

function Step1({ data, errors, update }: {
  data: QuoteData;
  errors: Partial<Record<keyof QuoteData, string>>;
  update: <K extends keyof QuoteData>(k: K, v: QuoteData[K]) => void;
}) {
  return (
    <div className="space-y-10">
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-3"
          style={{ fontFamily: "var(--font-mono)" }}>Step 01</p>
        <h1 className="text-4xl lg:text-5xl font-bold text-[var(--color-white)] leading-tight mb-3"
          style={{ fontFamily: "var(--font-display)" }}>
          Tell us about<br />
          <span className="text-[var(--color-gold)]">your project</span>
        </h1>
        <p className="text-[var(--color-ghost)] text-sm">
          Select the primary service you need and the complexity level.
        </p>
      </div>

      {/* Service selection */}
      <div>
        <label className="block text-xs tracking-[0.2em] uppercase text-[var(--color-silver)] mb-3"
          style={{ fontFamily: "var(--font-mono)" }}>
          Service Needed <span className="text-[var(--color-gold)]">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SERVICES_LIST.map((svc) => (
            <button
              key={svc}
              id={`svc-${svc.toLowerCase().replace(/\s+/g, "-")}`}
              type="button"
              onClick={() => update("service", svc)}
              className={`text-left px-5 py-4 border text-sm transition-all duration-200 ${data.service === svc
                ? "border-[var(--color-gold)] bg-[rgba(254,123,0,0.08)] text-[var(--color-white)]"
                : "border-[var(--color-ash)] text-[var(--color-ghost)] hover:border-[var(--color-slate)] hover:text-[var(--color-silver)]"
                }`}
            >
              <span className="font-medium">{svc}</span>
            </button>
          ))}
        </div>
        {errors.service && (
          <p className="mt-2 text-xs text-[var(--color-red)]" role="alert"
            style={{ fontFamily: "var(--font-mono)" }}>{errors.service}</p>
        )}
      </div>

      {/* Complexity */}
      <div>
        <label className="block text-xs tracking-[0.2em] uppercase text-[var(--color-silver)] mb-3"
          style={{ fontFamily: "var(--font-mono)" }}>
          Project Complexity <span className="text-[var(--color-gold)]">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {COMPLEXITY_OPTS.map((c) => (
            <button
              key={c.label}
              id={`complexity-${c.label.toLowerCase()}`}
              type="button"
              onClick={() => update("complexity", c.label)}
              className={`text-left px-5 py-4 border transition-all duration-200 ${data.complexity === c.label
                ? "border-[var(--color-gold)] bg-[rgba(254,123,0,0.08)]"
                : "border-[var(--color-ash)] hover:border-[var(--color-slate)]"
                }`}
            >
              <span className={`block text-sm font-semibold mb-1 ${data.complexity === c.label ? "text-[var(--color-gold)]" : "text-[var(--color-white)]"
                }`}>{c.label}</span>
              <span className="text-xs text-[var(--color-ghost)]">{c.desc}</span>
            </button>
          ))}
        </div>
        {errors.complexity && (
          <p className="mt-2 text-xs text-[var(--color-red)]" role="alert"
            style={{ fontFamily: "var(--font-mono)" }}>{errors.complexity}</p>
        )}
      </div>

      {/* Brief */}
      <div>
        <label htmlFor="desc" className="block text-xs tracking-[0.2em] uppercase text-[var(--color-silver)] mb-2"
          style={{ fontFamily: "var(--font-mono)" }}>
          Brief Description <span className="text-[var(--color-slate)]">(optional)</span>
        </label>
        <textarea
          id="desc"
          rows={3}
          placeholder="Share any key details that would help us give you a more accurate estimate…"
          value={data.description}
          onChange={(e) => update("description", e.target.value)}
          className="w-full bg-[var(--color-obsidian)] border border-[var(--color-ash)] px-4 py-3 text-sm text-[var(--color-white)] placeholder:text-[var(--color-slate)] outline-none focus:border-[var(--color-gold)] resize-none transition-colors duration-200"
        />
      </div>
    </div>
  );
}

// ─── Step 2: Features & Timeline ──────────────────────────────────────────────

const FEATURES_LIST = Object.keys(FEATURE_PRICES);
const TIMELINE_OPTS = Object.keys(TIMELINE_MULTIPLIERS);
const DESIGN_OPTS = [
  { val: "yes", label: "Yes, we have designs ready" },
  { val: "partial", label: "Partial / wireframes only" },
  { val: "no", label: "No — we need design too" },
];

function Step2({ data, errors, update, toggleFeature }: {
  data: QuoteData;
  errors: Partial<Record<keyof QuoteData, string>>;
  update: <K extends keyof QuoteData>(k: K, v: QuoteData[K]) => void;
  toggleFeature: (f: string) => void;
}) {
  return (
    <div className="space-y-10">
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-3"
          style={{ fontFamily: "var(--font-mono)" }}>Step 02</p>
        <h1 className="text-4xl lg:text-5xl font-bold text-[var(--color-white)] leading-tight mb-3"
          style={{ fontFamily: "var(--font-display)" }}>
          Features &amp;<br />
          <span className="text-[var(--color-gold)]">requirements</span>
        </h1>
        <p className="text-[var(--color-ghost)] text-sm">
          Select all features you need. Each one adjusts your estimate.
        </p>
      </div>

      {/* Features */}
      <div>
        <label className="block text-xs tracking-[0.2em] uppercase text-[var(--color-silver)] mb-3"
          style={{ fontFamily: "var(--font-mono)" }}>
          Additional Features <span className="text-[var(--color-slate)]">(select all that apply)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {FEATURES_LIST.map((f) => {
            const selected = data.features.includes(f);
            return (
              <button
                key={f}
                id={`feat-${f.toLowerCase().replace(/\s+/g, "-")}`}
                type="button"
                onClick={() => toggleFeature(f)}
                className={`flex items-center justify-between px-4 py-3 border text-sm text-left transition-all duration-200 ${selected
                  ? "border-[var(--color-gold)] bg-[rgba(254,123,0,0.06)] text-[var(--color-white)]"
                  : "border-[var(--color-ash)] text-[var(--color-ghost)] hover:border-[var(--color-slate)]"
                  }`}
              >
                <span>{f}</span>
                <span className={`text-[10px] shrink-0 ml-2 ${selected ? "text-[var(--color-gold)]" : "text-[var(--color-slate)]"}`}
                  style={{ fontFamily: "var(--font-mono)" }}>
                  +£{FEATURE_PRICES[f].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <label className="block text-xs tracking-[0.2em] uppercase text-[var(--color-silver)] mb-3"
          style={{ fontFamily: "var(--font-mono)" }}>
          Desired Timeline <span className="text-[var(--color-gold)]">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {TIMELINE_OPTS.map((t) => (
            <button
              key={t}
              id={`timeline-${t.replace(/[\s<>+]/g, "-")}`}
              type="button"
              onClick={() => update("timeline", t)}
              className={`px-4 py-2.5 border text-sm transition-all duration-200 ${data.timeline === t
                ? "border-[var(--color-gold)] bg-[rgba(254,123,0,0.08)] text-[var(--color-gold)]"
                : "border-[var(--color-ash)] text-[var(--color-ghost)] hover:border-[var(--color-slate)]"
                }`}
            >
              {t}
            </button>
          ))}
        </div>
        {errors.timeline && (
          <p className="mt-2 text-xs text-[var(--color-red)]" role="alert"
            style={{ fontFamily: "var(--font-mono)" }}>{errors.timeline}</p>
        )}
      </div>

      {/* Design ready? */}
      <div>
        <label className="block text-xs tracking-[0.2em] uppercase text-[var(--color-silver)] mb-3"
          style={{ fontFamily: "var(--font-mono)" }}>
          Do you have existing designs? <span className="text-[var(--color-gold)]">*</span>
        </label>
        <div className="space-y-2">
          {DESIGN_OPTS.map((d) => (
            <button
              key={d.val}
              id={`design-${d.val}`}
              type="button"
              onClick={() => update("hasDesign", d.val)}
              className={`w-full text-left px-5 py-3.5 border text-sm transition-all duration-200 ${data.hasDesign === d.val
                ? "border-[var(--color-gold)] bg-[rgba(254,123,0,0.06)] text-[var(--color-white)]"
                : "border-[var(--color-ash)] text-[var(--color-ghost)] hover:border-[var(--color-slate)]"
                }`}
            >
              {d.label}
            </button>
          ))}
        </div>
        {errors.hasDesign && (
          <p className="mt-2 text-xs text-[var(--color-red)]" role="alert"
            style={{ fontFamily: "var(--font-mono)" }}>{errors.hasDesign}</p>
        )}
      </div>
    </div>
  );
}

// ─── Step 3: Contact Details ──────────────────────────────────────────────────

function Step3({ data, errors, update }: {
  data: QuoteData;
  errors: Partial<Record<keyof QuoteData, string>>;
  update: <K extends keyof QuoteData>(k: K, v: QuoteData[K]) => void;
}) {
  return (
    <div className="space-y-10">
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-3"
          style={{ fontFamily: "var(--font-mono)" }}>Step 03</p>
        <h1 className="text-4xl lg:text-5xl font-bold text-[var(--color-white)] leading-tight mb-3"
          style={{ fontFamily: "var(--font-display)" }}>
          Almost there—
          <br />
          <span className="text-[var(--color-gold)]">who are we quoting?</span>
        </h1>
        <p className="text-[var(--color-ghost)] text-sm">
          We&apos;ll send your personalised estimate to this email and follow up within 24 hours.
        </p>
      </div>

      <div className="space-y-5">
        {[
          { key: "name" as const, label: "Full Name", type: "text", placeholder: "Alex Johnson", required: true },
          { key: "email" as const, label: "Work Email", type: "email", placeholder: "alex@company.com", required: true },
          { key: "company" as const, label: "Company", type: "text", placeholder: "Acme Corp (optional)", required: false },
          { key: "phone" as const, label: "Phone Number", type: "tel", placeholder: "+44 7700 900000 (optional)", required: false },
        ].map(({ key, label, type, placeholder, required }) => (
          <div key={key}>
            <label htmlFor={`s3-${key}`}
              className="block text-xs tracking-[0.15em] uppercase mb-2 text-[var(--color-silver)]"
              style={{ fontFamily: "var(--font-mono)" }}>
              {label}{required && <span className="text-[var(--color-gold)] ml-1">*</span>}
            </label>
            <input
              id={`s3-${key}`}
              type={type}
              placeholder={placeholder}
              value={data[key]}
              onChange={(e) => update(key, e.target.value)}
              required={required}
              className={`w-full bg-[var(--color-obsidian)] border px-4 py-3.5 text-sm text-[var(--color-white)] placeholder:text-[var(--color-slate)] outline-none focus:border-[var(--color-gold)] transition-colors duration-200 ${errors[key]
                ? "border-[var(--color-red)]"
                : "border-[var(--color-ash)] hover:border-[var(--color-slate)]"
                }`}
            />
            {errors[key] && (
              <p className="mt-1.5 text-xs text-[var(--color-red)]" role="alert"
                style={{ fontFamily: "var(--font-mono)" }}>{errors[key]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Summary card */}
      <div className="border border-[var(--surface-glass-border)] p-6 space-y-3 bg-[var(--color-obsidian)]">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--color-gold)]"
          style={{ fontFamily: "var(--font-mono)" }}>Quote Summary</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <span className="text-[var(--color-ghost)]">Service</span>
          <span className="text-[var(--color-white)]">{data.service || "—"}</span>
          <span className="text-[var(--color-ghost)]">Complexity</span>
          <span className="text-[var(--color-white)]">{data.complexity || "—"}</span>
          <span className="text-[var(--color-ghost)]">Timeline</span>
          <span className="text-[var(--color-white)]">{data.timeline || "—"}</span>
          <span className="text-[var(--color-ghost)]">Features</span>
          <span className="text-[var(--color-white)]">{data.features.length > 0 ? `${data.features.length} selected` : "None"}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Result Step ──────────────────────────────────────────────────────────────

function ResultStep({ data, quote }: { data: QuoteData; quote: { low: number; high: number } }) {
  function fmt(n: number) {
    return "£" + n.toLocaleString("en-GB");
  }

  // Breakdown
  const base = BASE_PRICES[data.service] ?? 0;
  const featureTotal = data.features.reduce((s, f) => s + (FEATURE_PRICES[f] ?? 0), 0);

  return (
    <div className="space-y-10">
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-3"
          style={{ fontFamily: "var(--font-mono)" }}>Your Estimate</p>
        <h1 className="text-4xl lg:text-5xl font-bold text-[var(--color-white)] leading-tight mb-3"
          style={{ fontFamily: "var(--font-display)" }}>
          Here&apos;s what
          <br />
          <span className="text-[var(--color-gold)]">we&apos;re thinking</span>
        </h1>
        <p className="text-[var(--color-ghost)] text-sm max-w-md">
          This is an indicative range based on your inputs. A member of our team will follow up with a detailed proposal within 1 business day.
        </p>
      </div>

      {/* Big price display */}
      <div className="border border-[var(--color-gold-dim)] bg-[rgba(254,123,0,0.05)] p-8 lg:p-10">
        <p className="text-xs tracking-[0.25em] uppercase text-[var(--color-gold)] mb-4"
          style={{ fontFamily: "var(--font-mono)" }}>Estimated Project Cost</p>
        <div className="flex items-baseline gap-4 flex-wrap">
          <span className="text-5xl lg:text-6xl font-bold text-[var(--color-white)]"
            style={{ fontFamily: "var(--font-display)" }}>
            {fmt(quote.low)}
          </span>
          <span className="text-2xl text-[var(--color-mist)]">—</span>
          <span className="text-5xl lg:text-6xl font-bold text-[var(--color-gold)]"
            style={{ fontFamily: "var(--font-display)" }}>
            {fmt(quote.high)}
          </span>
        </div>
        <p className="mt-3 text-xs text-[var(--color-ghost)]" style={{ fontFamily: "var(--font-mono)" }}>
          Exc. VAT · Subject to detailed discovery
        </p>
      </div>

      {/* Breakdown */}
      <div className="border border-[var(--surface-glass-border)] p-6 space-y-4">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--color-silver)]"
          style={{ fontFamily: "var(--font-mono)" }}>Cost Breakdown</p>

        {[
          { label: `${data.service} (${data.complexity})`, amount: Math.round(base * (COMPLEXITY_MULTIPLIERS[data.complexity] ?? 1) * (TIMELINE_MULTIPLIERS[data.timeline] ?? 1)) },
          ...(featureTotal > 0 ? [{ label: `${data.features.length} additional features`, amount: featureTotal }] : []),
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between text-sm border-b border-[var(--surface-glass-border)] pb-3 last:border-0 last:pb-0">
            <span className="text-[var(--color-ghost)]">{row.label}</span>
            <span className="text-[var(--color-white)] font-medium">{fmt(row.amount)}</span>
          </div>
        ))}
      </div>

      {/* What happens next */}
      <div className="space-y-4">
        <p className="text-xs tracking-[0.2em] uppercase text-[var(--color-silver)]"
          style={{ fontFamily: "var(--font-mono)" }}>What happens next</p>
        {[
          "We'll send this estimate to " + data.email,
          "A senior consultant will review your brief and contact you within 1 business day",
          "We'll schedule a free 30-min discovery call to refine the scope",
          "You receive a fixed-price proposal with no hidden costs",
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="w-5 h-5 shrink-0 rounded-full border border-[var(--color-gold)] text-[var(--color-gold)] flex items-center justify-center text-[10px] mt-0.5"
              style={{ fontFamily: "var(--font-mono)" }}>
              {i + 1}
            </span>
            <p className="text-sm text-[var(--color-ghost)] leading-relaxed">{item}</p>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/#contact"
          id="quote-contact-cta"
          className="group flex items-center justify-center gap-2 px-8 py-4 bg-[var(--color-gold)] text-[var(--color-void)] text-sm font-bold tracking-wide hover:bg-[var(--color-gold-pale)] transition-colors duration-200"
          style={{ fontFamily: "var(--font-mono)" }}>
          Speak to our team
          <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <Link href="/"
          id="quote-back-home"
          className="flex items-center justify-center gap-2 px-8 py-4 border border-[var(--color-slate)] text-sm text-[var(--color-silver)] hover:border-[var(--color-ghost)] hover:text-[var(--color-white)] transition-all duration-200"
          style={{ fontFamily: "var(--font-mono)" }}>
          Back to home
        </Link>
      </div>
    </div>
  );
}
