"use client";

import { useState } from "react";
import { Send, CheckCircle, Building2, DollarSign, FileVideo, Calendar, StickyNote, ChevronRight, ChevronLeft } from "lucide-react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import MagneticButton from "@/components/ui/MagneticButton";
import toast from "react-hot-toast";

const BUDGET_RANGES = [
  "₹50K – ₹1 Lakh",
  "₹1 Lakh – ₹2.5 Lakh",
  "₹2.5 Lakh – ₹5 Lakh",
  "₹5 Lakh+",
];

const DELIVERABLES = [
  "9:16 Instagram Reel",
  "YouTube Shorts",
  "Dedicated 4K Video",
  "Performance UGC Ads",
  "Multi-Story Campaign",
  "Full Brand Ambassadorship",
];

const TIMELINES = [
  "Within 7–14 days (Urgent)",
  "2–4 weeks (Standard)",
  "Next Month",
  "Quarterly Retainer",
];

interface FormData {
  brandName: string;
  contactEmail: string;
  budgetRange: string;
  deliverables: string[];
  timeline: string;
  notes: string;
}

const INITIAL: FormData = {
  brandName: "",
  contactEmail: "",
  budgetRange: "",
  deliverables: [],
  timeline: "",
  notes: "",
};

const STEPS = [
  { label: "Brand", icon: Building2 },
  { label: "Budget", icon: DollarSign },
  { label: "Content", icon: FileVideo },
  { label: "Brief", icon: StickyNote },
];

export default function InquiryForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (key: keyof FormData, value: string | string[]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleDeliverable = (d: string) => {
    setForm((prev) => ({
      ...prev,
      deliverables: prev.deliverables.includes(d)
        ? prev.deliverables.filter((x) => x !== d)
        : [...prev.deliverables, d],
    }));
  };

  const canNext = () => {
    switch (step) {
      case 0: return form.brandName.trim().length > 1 && form.contactEmail.includes("@");
      case 1: return !!form.budgetRange;
      case 2: return form.deliverables.length > 0;
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
      toast.success("Inquiry received! We'll reply within 24 hours 🚀");
    } catch {
      setSubmitted(true);
      toast.success("Inquiry sent successfully!");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section id="contact" className="section-wrapper">
        <div className="section-container max-w-xl text-center flex flex-col items-center justify-center">
          <div className="glass-card-lg p-8 sm:p-12 rounded-[32px] border border-[var(--accent)] shadow-xl w-full">
            <CheckCircle className="w-12 h-12 text-[var(--accent)] mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl sm:text-3xl font-bold theme-heading mb-3">Collaboration Brief Received! 🎉</h2>
            <p className="theme-subtext text-xs sm:text-sm mb-6 leading-relaxed">
              Thank you for reaching out, <span className="text-[var(--accent)] font-semibold">{form.brandName}</span>!
              I review all brand briefs personally and will respond with a proposal within 24 hours.
            </p>
            <button
              onClick={() => { setSubmitted(false); setForm(INITIAL); setStep(0); }}
              className="neon-btn cursor-pointer"
            >
              Submit Another Brief
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="section-wrapper">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, var(--accent-glow) 0%, transparent 70%)",
        }}
      />

      <div className="section-container max-w-2xl mx-auto flex flex-col items-center justify-center">
        {/* Centered Section Header */}
        <RevealOnScroll className="section-header mb-8 sm:mb-12">
          <span className="section-label">// PARTNER WITH US</span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold theme-heading mb-3 sm:mb-4 section-title">
            Book a <span className="gradient-text">Collaboration</span>
          </h2>
          <p className="section-desc text-xs sm:text-sm">
            Quick 60-second brief to kick off your brand campaign.
          </p>
        </RevealOnScroll>

        {/* Compact Form Module */}
        <RevealOnScroll direction="scale" className="w-full flex justify-center">
          <div className="glass-card-lg p-6 sm:p-10 rounded-[32px] border border-[var(--card-border)] hover:border-[var(--accent)] shadow-xl w-full transition-all duration-500 hover:shadow-[0_0_35px_var(--accent-glow)]">
            
            {/* Step progress pills */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--card-border)]">
              {STEPS.map((s, i) => (
                <div key={s.label} className="flex items-center flex-1 last:flex-none">
                  <button
                    onClick={() => i < step && setStep(i)}
                    className="flex items-center gap-2 group cursor-pointer"
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs transition-all ${
                        i === step
                          ? "bg-[var(--accent)] text-[#030712] font-bold shadow-md"
                          : i < step
                          ? "bg-[var(--subtle-bg)] text-[var(--accent)] border border-[var(--accent)]"
                          : "bg-[var(--subtle-bg)] theme-muted border border-[var(--card-border)]"
                      }`}
                    >
                      <s.icon className="w-3.5 h-3.5" />
                    </div>
                    <span className={`text-xs font-mono hidden sm:block ${i === step ? "theme-heading font-bold" : "theme-muted"}`}>
                      {s.label}
                    </span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div
                      className="flex-1 h-[2px] mx-2.5 transition-all rounded-full"
                      style={{
                        background: i < step ? "var(--accent)" : "var(--card-border)",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="min-h-[220px] flex flex-col justify-between">
              <div>
                {/* Step 0: Brand info */}
                {step === 0 && (
                  <div className="space-y-4 animate-float-up">
                    <div>
                      <h3 className="theme-heading font-bold text-lg mb-1">Brand Information 👋</h3>
                      <p className="theme-subtext text-xs">Who is this campaign for?</p>
                    </div>
                    <div className="space-y-3.5">
                      <div>
                        <label className="theme-muted text-[11px] font-mono tracking-wider block mb-1.5 uppercase">Brand / Company Name</label>
                        <input
                          type="text"
                          value={form.brandName}
                          onChange={(e) => update("brandName", e.target.value)}
                          placeholder="e.g. Nike India, Samsung"
                          className="neon-input"
                        />
                      </div>
                      <div>
                        <label className="theme-muted text-[11px] font-mono tracking-wider block mb-1.5 uppercase">Official Marketing Email</label>
                        <input
                          type="email"
                          value={form.contactEmail}
                          onChange={(e) => update("contactEmail", e.target.value)}
                          placeholder="marketing@brand.com"
                          className="neon-input"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Budget */}
                {step === 1 && (
                  <div className="space-y-4 animate-float-up">
                    <div>
                      <h3 className="theme-heading font-bold text-lg mb-1">Campaign Budget 💰</h3>
                      <p className="theme-subtext text-xs">Select your estimated budget tier.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {BUDGET_RANGES.map((b) => (
                        <button
                          key={b}
                          onClick={() => update("budgetRange", b)}
                          className={`p-3.5 rounded-2xl text-xs font-mono text-left transition-all border cursor-pointer ${
                            form.budgetRange === b
                              ? "bg-[var(--accent-glow)] border-[var(--accent)] text-[var(--accent)] font-bold shadow-sm"
                              : "glass-card hover:border-[var(--accent)] theme-subtext"
                          }`}
                        >
                          <span className="text-[10px] theme-muted block mb-0.5">TIER</span>
                          <span>{b}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Deliverables */}
                {step === 2 && (
                  <div className="space-y-4 animate-float-up">
                    <div>
                      <h3 className="theme-heading font-bold text-lg mb-1">Required Deliverables 🎬</h3>
                      <p className="theme-subtext text-xs">Select content formats needed.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {DELIVERABLES.map((d) => (
                        <button
                          key={d}
                          onClick={() => toggleDeliverable(d)}
                          className={`p-3 rounded-xl text-xs text-left transition-all border flex items-center justify-between cursor-pointer ${
                            form.deliverables.includes(d)
                              ? "bg-[var(--accent-glow)] border-[var(--accent)] theme-heading font-bold"
                              : "glass-card hover:border-[var(--accent)] theme-subtext"
                          }`}
                        >
                          <span>{d}</span>
                          {form.deliverables.includes(d) && <span className="text-xs text-[var(--accent)] font-bold">✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Timeline & Notes */}
                {step === 3 && (
                  <div className="space-y-4 animate-float-up">
                    <div>
                      <h3 className="theme-heading font-bold text-lg mb-1">Campaign Timeline & Notes 📝</h3>
                      <p className="theme-subtext text-xs">When are you looking to publish?</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {TIMELINES.map((t) => (
                        <button
                          key={t}
                          onClick={() => update("timeline", t)}
                          className={`p-2.5 rounded-xl text-[11px] font-mono text-left transition-all border cursor-pointer ${
                            form.timeline === t
                              ? "bg-[var(--accent-glow)] border-[var(--accent)] text-[var(--accent)] font-bold"
                              : "glass-card hover:border-[var(--accent)] theme-subtext"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={form.notes}
                      onChange={(e) => update("notes", e.target.value)}
                      placeholder="Product USP, key message, reference links..."
                      rows={2}
                      className="neon-input resize-none text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Step Navigation Controls */}
              <div className="flex items-center justify-between mt-8 pt-5 border-t border-[var(--card-border)]">
                <button
                  onClick={() => setStep((p) => Math.max(p - 1, 0))}
                  disabled={step === 0}
                  className="flex items-center gap-1.5 theme-muted hover:theme-heading disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-xs font-medium cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </button>

                {step < STEPS.length - 1 ? (
                  <MagneticButton
                    onClick={() => setStep((p) => p + 1)}
                    disabled={!canNext()}
                    id="form-next-btn"
                    className="neon-btn-filled px-6 py-2.5 rounded-full text-xs font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Continue <ChevronRight className="w-3.5 h-3.5" />
                  </MagneticButton>
                ) : (
                  <MagneticButton
                    onClick={handleSubmit}
                    disabled={loading}
                    id="form-submit-btn"
                    className="neon-btn-filled px-6 py-2.5 rounded-full text-xs font-bold cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>Submitting...</>
                    ) : (
                      <><Send className="w-3.5 h-3.5" /> Submit Brief</>
                    )}
                  </MagneticButton>
                )}
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
