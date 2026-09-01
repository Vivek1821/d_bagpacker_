"use client";

import { useState, useEffect } from "react";
import { X, Star, Sparkles, Send, ShieldCheck, CheckCircle2, AlertCircle, Building2, User, Link as LinkIcon, Calendar } from "lucide-react";
import toast from "react-hot-toast";

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

const CATEGORIES = [
  { id: "brand_collab", label: "Brand Collab", emoji: "🤝" },
  { id: "trek_expedition", label: "Trek Expedition", emoji: "🏔️" },
  { id: "video_production", label: "Video Production", emoji: "🎥" },
  { id: "ugc_ads", label: "UGC & Performance Ads", emoji: "📱" },
  { id: "other", label: "Other", emoji: "✨" },
] as const;

const RATING_DESCRIPTIONS: Record<number, string> = {
  5: "Exceptional · Exceeded All Campaign Goals (5.0/5)",
  4: "Great Collaboration · Highly Recommended (4.0/5)",
  3: "Good Delivery · Met All Scope Requirements (3.0/5)",
  2: "Average Collaboration (2.0/5)",
  1: "Needs Significant Improvement (1.0/5)",
};

const COOLDOWN_KEY = "dbg_review_cooldown_timestamp";
const COOLDOWN_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export default function WriteReviewModal({ isOpen, onClose, onSubmitted }: WriteReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [category, setCategory] = useState<typeof CATEGORIES[number]["id"]>("brand_collab");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [projectDate, setProjectDate] = useState("2026");
  const [verificationLink, setVerificationLink] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Bot-trap invisible field
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);

  // Check cooldown status
  useEffect(() => {
    const lastSubmit = localStorage.getItem(COOLDOWN_KEY);
    if (lastSubmit) {
      const elapsed = Date.now() - Number(lastSubmit);
      if (elapsed < COOLDOWN_DURATION_MS) {
        setCooldownRemaining(Math.ceil((COOLDOWN_DURATION_MS - elapsed) / 1000));
      }
    }
  }, [isOpen]);

  // Decrement cooldown countdown
  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const interval = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownRemaining]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cooldownRemaining > 0) {
      toast.error(`Please wait ${cooldownRemaining}s before submitting another review.`);
      return;
    }

    if (!name.trim() || name.length < 2) {
      toast.error("Please provide your name or brand representative.");
      return;
    }

    if (!content.trim() || content.length < 15) {
      toast.error("Please provide detailed feedback (at least 15 characters).");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          role: role.trim() || "Brand Representative",
          company: company.trim() || "Independent Client",
          rating,
          category,
          title: title.trim() || "Outstanding Campaign Collaboration",
          content: content.trim(),
          projectDate: projectDate.trim() || "2026",
          verificationLink: verificationLink.trim(),
          bot_guard_token: honeypot, // Honeypot trap check
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed. Please try again.");
      }

      // Record cooldown in localStorage
      localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
      setCooldownRemaining(Math.ceil(COOLDOWN_DURATION_MS / 1000));

      setSubmittedSuccess(true);
      toast.success("Review submitted for verification! ✨");
      if (onSubmitted) onSubmitted();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review. Try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedSuccess(false);
    setName("");
    setRole("");
    setCompany("");
    setTitle("");
    setContent("");
    setVerificationLink("");
    onClose();
  };

  const activeRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-2xl glass-card-lg p-6 sm:p-8 rounded-[32px] sm:rounded-[36px] border border-[var(--card-border)] shadow-2xl my-auto text-[var(--text-primary)]"
        style={{
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px var(--accent-glow)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full glass-card flex items-center justify-center text-slate-400 hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedSuccess ? (
          /* Success Screen */
          <div className="text-center py-8 sm:py-12 space-y-5 animate-scale-up">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="theme-heading font-bold text-2xl sm:text-3xl">Review Submitted!</h3>
              <p className="theme-subtext text-sm sm:text-base leading-relaxed">
                Thank you for your valuable feedback! To maintain 100% legitimate client transparency, your review is now pending quick admin verification.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--subtle-bg)] border border-[var(--card-border)] text-xs font-mono text-[var(--accent)] mt-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Status: Pending Admin Approval</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleResetAndClose}
                className="neon-btn-filled px-8 py-3 rounded-full text-sm font-bold cursor-pointer shadow-lg"
              >
                Back to Portfolio
              </button>
            </div>
          </div>
        ) : (
          /* Review Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--subtle-bg)] border border-[var(--card-border)] text-xs font-mono text-[var(--accent)] mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Client Feedback</span>
              </div>
              <h3 className="theme-heading font-bold text-xl sm:text-2xl">Leave a Client Review</h3>
              <p className="theme-muted text-xs sm:text-sm mt-1">
                Share your collaboration experience with @d_bagpacker_ · Every submission is verified to maintain authentic client standards.
              </p>
            </div>

            {/* Cooldown Warning if active */}
            {cooldownRemaining > 0 && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-xs text-amber-400 font-mono">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>
                  Anti-Spam Cooldown: You recently submitted a review. Next submission available in <strong>{cooldownRemaining}s</strong>.
                </span>
              </div>
            )}

            {/* Interactive 5-Star Rating Picker */}
            <div className="glass-card-sm p-4 rounded-2xl border border-[var(--card-border)] text-center space-y-2">
              <span className="text-xs font-mono theme-muted uppercase tracking-wider block">Your Overall Rating</span>
              <div className="flex items-center justify-center gap-2 sm:gap-3 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-200 ${
                        star <= activeRating
                          ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]"
                          : "text-slate-600 hover:text-slate-400"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs font-mono text-[var(--accent)] font-medium transition-all">
                {RATING_DESCRIPTIONS[activeRating]}
              </p>
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-mono theme-muted uppercase tracking-wider mb-2">
                Collaboration Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                      category === cat.id
                        ? "bg-[var(--accent-glow)] border-[var(--accent)] text-[var(--accent)] font-bold shadow-sm"
                        : "bg-[var(--subtle-bg)] border-[var(--card-border)] theme-subtext hover:border-[var(--accent)]"
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Review Title */}
            <div>
              <label className="block text-xs font-mono theme-muted uppercase tracking-wider mb-1.5">
                Headline / One-Line Summary *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Over 10M Organic Impressions on Instagram Reel"
                className="neon-input text-xs sm:text-sm"
                maxLength={100}
                required
              />
            </div>

            {/* Detailed Feedback */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono theme-muted uppercase tracking-wider">
                  Detailed Experience & Results *
                </label>
                <span className="text-[10px] font-mono theme-muted">{content.length} / 1,000</span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe campaign results, visual quality, turnaround speed, and overall professional experience working with Vivek..."
                rows={4}
                className="neon-input text-xs sm:text-sm resize-none"
                maxLength={1000}
                required
              />
            </div>

            {/* Reviewer Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-mono theme-muted uppercase tracking-wider mb-1.5">
                  Your Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rohan Varma"
                    className="neon-input pl-10 text-xs sm:text-sm"
                    maxLength={80}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono theme-muted uppercase tracking-wider mb-1.5">
                  Brand / Organization *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. GoPro India / Wildcraft"
                    className="neon-input pl-10 text-xs sm:text-sm"
                    maxLength={80}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Role & Project Date Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-mono theme-muted uppercase tracking-wider mb-1.5">
                  Your Role / Designation
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Brand Marketing Lead"
                  className="neon-input text-xs sm:text-sm"
                  maxLength={60}
                />
              </div>

              <div>
                <label className="block text-xs font-mono theme-muted uppercase tracking-wider mb-1.5">
                  Campaign Timeline / Year
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={projectDate}
                    onChange={(e) => setProjectDate(e.target.value)}
                    placeholder="e.g. FY 2025-26 or Q4 2025"
                    className="neon-input pl-10 text-xs sm:text-sm"
                    maxLength={30}
                  />
                </div>
              </div>
            </div>

            {/* Optional Verification Link */}
            <div>
              <label className="block text-xs font-mono theme-muted uppercase tracking-wider mb-1.5">
                Verification Proof Link (Optional)
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={verificationLink}
                  onChange={(e) => setVerificationLink(e.target.value)}
                  placeholder="Link to published reel, campaign post, or brand handle"
                  className="neon-input pl-10 text-xs sm:text-sm"
                  maxLength={150}
                />
              </div>
            </div>

            {/* Honeypot Input: Hidden from real humans, catches automated bots */}
            <div className="hidden" aria-hidden="true" tabIndex={-1}>
              <label htmlFor="bot_guard_token">Do not fill this field</label>
              <input
                id="bot_guard_token"
                type="text"
                name="bot_guard_token"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                autoComplete="off"
              />
            </div>

            {/* Submit Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[var(--card-border)]">
              <div className="flex items-center gap-1.5 text-[11px] font-mono theme-muted">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Protected by Anti-Spam Rate Limiter & Admin Verification</span>
              </div>

              <button
                type="submit"
                disabled={submitting || cooldownRemaining > 0}
                className="w-full sm:w-auto neon-btn-filled px-6 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                <span>
                  {submitting
                    ? "Submitting..."
                    : cooldownRemaining > 0
                    ? `Cooldown (${cooldownRemaining}s)`
                    : "Submit for Verification"}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
