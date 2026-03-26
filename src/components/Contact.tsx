"use client";

import { useRef, useEffect, useState, useId } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASES, DURATIONS, STAGGER } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────

type FieldName = "name" | "email" | "company" | "service" | "budget" | "message";

type FormState = Record<FieldName, string>;
type ErrorState = Partial<Record<FieldName, string>>;

const SERVICES = [
  "Cloud Architecture",
  "AI & Automation",
  "Cybersecurity",
  "Product Engineering",
  "Data & Analytics",
  "Digital Strategy",
  "Not sure yet",
];

const BUDGETS = [
  "< $25k",
  "$25k – $100k",
  "$100k – $500k",
  "$500k +",
  "Ongoing retainer",
];

const CONTACT_DETAILS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Email",
    value: "hello@enclecta.com",
    href: "mailto:hello@enclecta.com",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Phone",
    value: "+44 20 7946 0958",
    href: "tel:+442079460958",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Office",
    value: "One Canada Square, London E14 5AB",
    href: "#",
  },
];

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(form: FormState): ErrorState {
  const errors: ErrorState = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Enter a valid email address";
  if (!form.service) errors.service = "Please select a service";
  if (!form.message.trim()) errors.message = "Tell us a bit about your project";
  return errors;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    company: "",
    service: "",
    budget: "",
    message: "",
  });
  const [errors, setErrors] = useState<ErrorState>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  // Heading reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        const els = headingRef.current.querySelectorAll(".gsap-reveal");
        gsap.fromTo(
          els,
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
      // Form fields
      if (formRef.current) {
        const fields = formRef.current.querySelectorAll(".form-field");
        gsap.fromTo(
          fields,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.6,
            ease: EASES.out,
            stagger: 0.07,
            scrollTrigger: { trigger: formRef.current, start: "top 80%" },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name as FieldName]) {
      // Re-validate on change once the field has been blurred
      const newErrors = validate({ ...form, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: newErrors[name as FieldName] }));
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validate(form);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name as FieldName] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const allTouched = Object.keys(form).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {} as Record<FieldName, boolean>
    );
    setTouched(allTouched);
    const newErrors = validate(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setStatus("submitting");
    // Simulate network request
    await new Promise((r) => setTimeout(r, 1800));
    setStatus("success");
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative bg-[var(--color-coal)] py-36 overflow-hidden"
      aria-label="Contact Enclecta"
    >
      {/* Corner accent lines */}
      <div aria-hidden="true" className="absolute top-0 left-0 w-24 h-px bg-[var(--color-gold)] opacity-20" />
      <div aria-hidden="true" className="absolute top-0 left-0 h-24 w-px bg-[var(--color-gold)] opacity-20" />
      <div aria-hidden="true" className="absolute bottom-0 right-0 w-24 h-px bg-[var(--color-gold)] opacity-20" />
      <div aria-hidden="true" className="absolute bottom-0 right-0 h-24 w-px bg-[var(--color-gold)] opacity-20" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── Heading ── */}
        <div ref={headingRef} className="mb-20 max-w-2xl">
          <div className="gsap-reveal flex items-center gap-4 mb-6">
            <span className="accent-line" />
            <span className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold)] font-medium"
              style={{ fontFamily: "var(--font-mono)" }}>
              Get In Touch
            </span>
          </div>
          <h2 className="gsap-reveal text-5xl lg:text-6xl font-bold text-[var(--color-white)] leading-[1.08]"
            style={{ fontFamily: "var(--font-display)" }}>
            Let&apos;s build
            <br />
            <span className="text-[var(--color-gold)]">something exceptional</span>
          </h2>
          <p className="gsap-reveal mt-6 text-[var(--color-ghost)] text-base max-w-md leading-relaxed">
            Tell us about your project. We respond to every serious enquiry within one business day.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 items-start">

          {/* ── Form ── */}
          {status === "success" ? (
            <SuccessState />
          ) : (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
              aria-label="Project enquiry form"
              className="space-y-6"
            >
              {/* Row 1: Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field
                  id={`${uid}-name`}
                  name="name"
                  label="Full name"
                  type="text"
                  placeholder="Alex Johnson"
                  value={form.name}
                  error={errors.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <Field
                  id={`${uid}-email`}
                  name="email"
                  label="Work email"
                  type="email"
                  placeholder="alex@company.com"
                  value={form.email}
                  error={errors.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
              </div>

              {/* Row 2: Company */}
              <Field
                id={`${uid}-company`}
                name="company"
                label="Company"
                type="text"
                placeholder="Acme Corp (optional)"
                value={form.company}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {/* Row 3: Service + Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <SelectField
                  id={`${uid}-service`}
                  name="service"
                  label="Service needed"
                  options={SERVICES}
                  value={form.service}
                  error={errors.service}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <SelectField
                  id={`${uid}-budget`}
                  name="budget"
                  label="Budget range"
                  options={BUDGETS}
                  value={form.budget}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              {/* Row 4: Message */}
              <div className="form-field">
                <label htmlFor={`${uid}-message`}
                  className="block text-xs tracking-[0.15em] uppercase mb-2 text-[var(--color-silver)]"
                  style={{ fontFamily: "var(--font-mono)" }}>
                  Project brief <span className="text-[var(--color-gold)]" aria-hidden="true">*</span>
                </label>
                <textarea
                  id={`${uid}-message`}
                  name="message"
                  rows={5}
                  placeholder="Tell us what you're trying to achieve, current challenges, timelines, and anything else that would help us prepare..."
                  value={form.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  aria-required="true"
                  aria-describedby={errors.message ? `${uid}-message-err` : undefined}
                  className={`w-full bg-[var(--color-obsidian)] border px-4 py-3.5 text-sm text-[var(--color-white)] placeholder:text-[var(--color-slate)] resize-none outline-none transition-colors duration-200 focus:border-[var(--color-gold)] ${
                    errors.message
                      ? "border-[var(--color-red)]"
                      : "border-[var(--color-ash)] hover:border-[var(--color-slate)]"
                  }`}
                  style={{ fontFamily: "var(--font-body)" }}
                />
                {errors.message && (
                  <p id={`${uid}-message-err`} role="alert"
                    className="mt-1.5 text-xs text-[var(--color-red)]"
                    style={{ fontFamily: "var(--font-mono)" }}>
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="form-field pt-2">
                <button
                  id="contact-submit-btn"
                  type="submit"
                  disabled={status === "submitting"}
                  className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 bg-[var(--color-gold)] text-[var(--color-void)] text-sm font-bold tracking-wide uppercase hover:bg-[var(--color-gold-pale)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {status === "submitting" ? (
                    <>
                      <Spinner />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Enquiry
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </button>
                <p className="mt-4 text-xs text-[var(--color-slate)]"
                  style={{ fontFamily: "var(--font-mono)" }}>
                  No spam. No sales pressure. Just a conversation.
                </p>
              </div>
            </form>
          )}

          {/* ── Right panel: contact info ── */}
          <div className="space-y-10 lg:pt-2">
            {/* Contact details */}
            <div className="space-y-6">
              {CONTACT_DETAILS.map((item) => (
                <a key={item.label} href={item.href}
                  className="flex items-start gap-4 group"
                  aria-label={`${item.label}: ${item.value}`}>
                  <div className="w-10 h-10 shrink-0 border border-[var(--color-slate)] flex items-center justify-center text-[var(--color-gold)] group-hover:border-[var(--color-gold)] transition-colors duration-300">
                    <span className="w-4 h-4">{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-mist)] mb-0.5"
                      style={{ fontFamily: "var(--font-mono)" }}>
                      {item.label}
                    </p>
                    <p className="text-sm text-[var(--color-silver)] group-hover:text-[var(--color-white)] transition-colors duration-300">
                      {item.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-[var(--surface-glass-border)]" />

            {/* Response time pledge */}
            <div className="space-y-3">
              <p className="text-xs tracking-[0.2em] uppercase text-[var(--color-mist)]"
                style={{ fontFamily: "var(--font-mono)" }}>
                Our promise
              </p>
              {[
                "Reply within 1 business day",
                "Senior-level response, always",
                "Free 30-min discovery call",
                "No obligation, no hard sell",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="w-4 h-4 shrink-0 text-[var(--color-gold)]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-sm text-[var(--color-ghost)]">{item}</span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-[var(--surface-glass-border)]" />

            {/* Social links */}
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-mist)] mb-4"
                style={{ fontFamily: "var(--font-mono)" }}>
                Follow us
              </p>
              <div className="flex items-center gap-3">
                {[
                  { label: "LinkedIn", href: "#" },
                  { label: "X / Twitter", href: "#" },
                  { label: "GitHub", href: "#" },
                ].map((s) => (
                  <a key={s.label} href={s.href}
                    className="px-3 py-1.5 text-[10px] tracking-widest uppercase border border-[var(--color-slate)] text-[var(--color-mist)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors duration-200"
                    style={{ fontFamily: "var(--font-mono)" }}
                    aria-label={s.label}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────

type FieldProps = {
  id: string;
  name: FieldName;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  error?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
};

function Field({ id, name, label, type, placeholder, value, error, required, onChange, onBlur }: FieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={id}
        className="block text-xs tracking-[0.15em] uppercase mb-2 text-[var(--color-silver)]"
        style={{ fontFamily: "var(--font-mono)" }}>
        {label}{required && <span className="text-[var(--color-gold)] ml-1" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        aria-required={required}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`w-full bg-[var(--color-obsidian)] border px-4 py-3.5 text-sm text-[var(--color-white)] placeholder:text-[var(--color-slate)] outline-none transition-colors duration-200 focus:border-[var(--color-gold)] ${
          error
            ? "border-[var(--color-red)]"
            : "border-[var(--color-ash)] hover:border-[var(--color-slate)]"
        }`}
        style={{ fontFamily: "var(--font-body)" }}
      />
      {error && (
        <p id={`${id}-err`} role="alert"
          className="mt-1.5 text-xs text-[var(--color-red)]"
          style={{ fontFamily: "var(--font-mono)" }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── SelectField ──────────────────────────────────────────────────────────────

type SelectFieldProps = {
  id: string;
  name: FieldName;
  label: string;
  options: string[];
  value: string;
  error?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
};

function SelectField({ id, name, label, options, value, error, required, onChange, onBlur }: SelectFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={id}
        className="block text-xs tracking-[0.15em] uppercase mb-2 text-[var(--color-silver)]"
        style={{ fontFamily: "var(--font-mono)" }}>
        {label}{required && <span className="text-[var(--color-gold)] ml-1" aria-hidden="true">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          aria-required={required}
          aria-describedby={error ? `${id}-err` : undefined}
          className={`w-full appearance-none bg-[var(--color-obsidian)] border px-4 py-3.5 text-sm outline-none transition-colors duration-200 focus:border-[var(--color-gold)] cursor-pointer ${
            value ? "text-[var(--color-white)]" : "text-[var(--color-slate)]"
          } ${
            error
              ? "border-[var(--color-red)]"
              : "border-[var(--color-ash)] hover:border-[var(--color-slate)]"
          }`}
          style={{ fontFamily: "var(--font-body)" }}
        >
          <option value="" disabled>Select…</option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-[var(--color-obsidian)] text-[var(--color-white)]">
              {opt}
            </option>
          ))}
        </select>
        {/* Chevron icon */}
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-mist)]">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {error && (
        <p id={`${id}-err`} role="alert"
          className="mt-1.5 text-xs text-[var(--color-red)]"
          style={{ fontFamily: "var(--font-mono)" }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Success state ────────────────────────────────────────────────────────────

function SuccessState() {
  return (
    <div className="flex flex-col items-start justify-center py-12 space-y-6">
      <div className="w-14 h-14 border border-[var(--color-gold)] flex items-center justify-center text-[var(--color-gold)]">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-[var(--color-white)]"
        style={{ fontFamily: "var(--font-display)" }}>
        Message received
      </h3>
      <p className="text-[var(--color-ghost)] text-base max-w-md leading-relaxed">
        Thank you for reaching out. A member of our senior team will be in touch within one business day.
      </p>
      <div className="h-px w-16 bg-[var(--color-gold)]" />
      <p className="text-xs text-[var(--color-mist)]" style={{ fontFamily: "var(--font-mono)" }}>
        Ref: ENQ-{Date.now().toString(36).toUpperCase()}
      </p>
    </div>
  );
}

// ─── Spinner ─────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
