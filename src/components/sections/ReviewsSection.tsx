"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Star,
  Sparkles,
  ShieldCheck,
  Building2,
  Calendar,
  Search,
  Filter,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  MessageSquare,
  ThumbsUp,
  ExternalLink,
  Plus
} from "lucide-react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import WriteReviewModal from "@/components/ui/WriteReviewModal";
import type { ReviewItem } from "@/app/api/reviews/route";

const CATEGORY_TABS = [
  { id: "all", label: "All Reviews" },
  { id: "brand_collab", label: "Brand Collabs" },
  { id: "trek_expedition", label: "Expeditions & Treks" },
  { id: "video_production", label: "Video Production" },
  { id: "ugc_ads", label: "UGC & Meta Ads" },
  { id: "5_stars", label: "5-Star Only ⭐" },
];

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "latest" | "highest">("featured");
  const [displayCount, setDisplayCount] = useState(6);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  // Fetch approved reviews from API
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reviews?status=approved");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setReviews(json.data);
      }
    } catch (err) {
      console.warn("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Filter & Sort Logic
  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    // Category Filter
    if (selectedCategory === "5_stars") {
      result = result.filter((r) => r.rating === 5);
    } else if (selectedCategory !== "all") {
      result = result.filter((r) => r.category === selectedCategory);
    }

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.company.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.content.toLowerCase().includes(q) ||
          r.role.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === "highest") {
      result.sort((a, b) => b.rating - a.rating || new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === "latest") {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      // featured
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [reviews, selectedCategory, searchQuery, sortBy]);

  // Paginated reviews to show
  const visibleReviews = useMemo(() => {
    return filteredReviews.slice(0, displayCount);
  }, [filteredReviews, displayCount]);

  // Featured marquee items
  const featuredHighlights = useMemo(() => {
    const feat = reviews.filter((r) => r.featured);
    return feat.length > 0 ? feat : reviews.slice(0, 4);
  }, [reviews]);

  // Calculate dynamic stats
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return "5.0";
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const handleLike = (id: string) => {
    setLikedReviews((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="reviews" className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[var(--accent-glow)] blur-[140px] rounded-full pointer-events-none opacity-40 -z-10" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <RevealOnScroll>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--subtle-bg)] border border-[var(--card-border)] text-xs font-mono text-[var(--accent)] mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <span>100% Verified Brand & Client Reviews</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight theme-heading uppercase leading-tight">
            Client <span className="text-[var(--accent)]">Endorsements</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base theme-muted leading-relaxed max-w-2xl mx-auto">
            Real campaign reviews and expedition feedback from marketing heads, tourism boards, and brand partners. Every submission is authenticated for legitimate transparency.
          </p>
        </RevealOnScroll>

        {/* Global Rating & Performance Badge Banner */}
        <RevealOnScroll delay={0.1}>
          <div className="mt-8 inline-grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 glass-card-sm p-4 sm:p-5 rounded-[24px] sm:rounded-[28px] border border-[var(--card-border)] shadow-xl text-center">
            <div className="px-2">
              <div className="flex items-center justify-center gap-1 text-[var(--accent)] mb-1">
                <span className="text-2xl sm:text-3xl font-black">{averageRating}</span>
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              </div>
              <span className="text-[11px] font-mono theme-muted uppercase tracking-wider block">Average Rating</span>
            </div>

            <div className="px-2 border-l border-[var(--card-border)]/60">
              <span className="text-2xl sm:text-3xl font-black theme-heading block mb-1">98.6%</span>
              <span className="text-[11px] font-mono theme-muted uppercase tracking-wider block">Recommendation</span>
            </div>

            <div className="px-2 border-l-0 sm:border-l border-[var(--card-border)]/60">
              <span className="text-2xl sm:text-3xl font-black theme-heading block mb-1">{reviews.length}+</span>
              <span className="text-[11px] font-mono theme-muted uppercase tracking-wider block">Verified Reviews</span>
            </div>

            <div className="px-2 border-l border-[var(--card-border)]/60">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 block mb-1">100%</span>
              <span className="text-[11px] font-mono theme-muted uppercase tracking-wider block">On-Time Delivery</span>
            </div>
          </div>
        </RevealOnScroll>

        {/* Write a Review Button */}
        <RevealOnScroll delay={0.15}>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="neon-btn-filled px-6 py-3 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-[0_0_25px_var(--accent-glow)] group hover:scale-105 transition-all"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              <span>Write a Client Review</span>
            </button>
          </div>
        </RevealOnScroll>
      </div>

      {/* Featured Quotes Infinite Marquee Ribbon */}
      {featuredHighlights.length > 0 && (
        <div className="mb-14 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden py-3 border-y border-[var(--card-border)]/60 bg-[var(--subtle-bg)]/40 backdrop-blur-sm">
          <div className="flex items-center gap-6 animate-marquee hover:[animation-play-state:paused] whitespace-nowrap">
            {/* Duplicated for seamless infinite loop */}
            {[...featuredHighlights, ...featuredHighlights].map((item, idx) => (
              <div
                key={`${item.id}-marquee-${idx}`}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl glass-card-sm border border-[var(--card-border)] text-xs shadow-sm flex-shrink-0"
              >
                <div className="w-7 h-7 rounded-full bg-[var(--accent-glow)] border border-[var(--accent)] flex items-center justify-center flex-shrink-0 font-bold text-[10px] text-[var(--accent)]">
                  {item.company.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-[var(--text-primary)] leading-tight">{item.company}</span>
                  <span className="text-[10px] theme-muted truncate max-w-[280px]">“{item.title}”</span>
                </div>
                <div className="flex items-center gap-0.5 text-amber-400 pl-2">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="font-mono text-[10px] font-bold">5.0</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Control Bar: Category Tabs, Search Bar, and Sorting (Prevents 100s of cards from cluttering) */}
      <div className="space-y-4 mb-10">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedCategory(tab.id);
                setDisplayCount(6); // Reset pagination on category switch
              }}
              className={`px-4 py-2 rounded-full text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer border ${
                selectedCategory === tab.id
                  ? "bg-[var(--accent)] text-[#030712] border-[var(--accent)] shadow-md scale-105"
                  : "glass-card border-[var(--card-border)] theme-subtext hover:border-[var(--accent)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setDisplayCount(6);
              }}
              placeholder="Search by brand name, campaign, or keyword..."
              className="neon-input pl-10 text-xs sm:text-sm py-2.5"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs theme-muted hover:theme-heading"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown & Results Counter */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <span className="text-xs font-mono theme-muted">
              Showing <strong className="text-[var(--text-primary)]">{visibleReviews.length}</strong> of {filteredReviews.length}
            </span>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="neon-input text-xs font-mono py-2 pl-3 pr-8 rounded-xl cursor-pointer bg-[var(--subtle-bg)] appearance-none border border-[var(--card-border)]"
              >
                <option value="featured">★ Featured First</option>
                <option value="highest">Highest Rating</option>
                <option value="latest">Latest Reviews</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Reviews Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((skel) => (
            <div key={skel} className="glass-card p-6 rounded-3xl animate-pulse space-y-4 border border-[var(--card-border)]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-800" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-800 rounded w-1/2" />
                  <div className="h-3 bg-slate-800 rounded w-1/3" />
                </div>
              </div>
              <div className="h-4 bg-slate-800 rounded w-3/4" />
              <div className="h-16 bg-slate-800 rounded w-full" />
            </div>
          ))}
        </div>
      ) : visibleReviews.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 sm:py-20 glass-card rounded-3xl border border-[var(--card-border)] p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[var(--accent-glow)] border border-[var(--accent)] text-[var(--accent)] flex items-center justify-center mx-auto">
            <MessageSquare className="w-7 h-7" />
          </div>
          <h3 className="theme-heading font-bold text-lg sm:text-xl">No Reviews Found</h3>
          <p className="theme-muted text-xs sm:text-sm max-w-md mx-auto">
            {searchQuery
              ? `No client reviews match "${searchQuery}". Try a different keyword or reset filters.`
              : "No reviews published under this category yet."}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="neon-btn px-4 py-2 rounded-xl text-xs font-mono"
              >
                Clear Search
              </button>
            )}
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="neon-btn-filled px-5 py-2 rounded-xl text-xs font-bold"
            >
              Be the First to Review
            </button>
          </div>
        </div>
      ) : (
        /* Responsive 3-Column Masonry-Style Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleReviews.map((rev, index) => {
            const isLiked = likedReviews[rev.id] || false;
            const likeCount = (rev.likes || 0) + (isLiked ? 1 : 0);

            return (
              <div
                key={rev.id}
                className="group glass-card glass-card-hover p-6 sm:p-7 rounded-[28px] border border-[var(--card-border)] hover:border-[var(--accent)] flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
              >
                {/* Top Glowing Header Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar / Brand Initial */}
                    <div className="relative flex-shrink-0">
                      {rev.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={rev.avatarUrl}
                          alt={rev.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-[var(--card-border)] group-hover:border-[var(--accent)] transition-colors shadow-md"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-[var(--accent)] text-[#030712] font-bold font-mono flex items-center justify-center text-base shadow-md">
                          {rev.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm" title="Verified Client">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h4 className="theme-heading font-bold text-sm sm:text-base leading-tight truncate">
                        {rev.name}
                      </h4>
                      <p className="text-xs text-[var(--accent)] font-medium truncate mt-0.5">
                        {rev.role} {rev.company && `· ${rev.company}`}
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 text-amber-400 flex-shrink-0 pt-0.5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Body */}
                <div className="space-y-2 flex-1 my-2">
                  <h5 className="theme-heading font-bold text-sm sm:text-base leading-snug">
                    {rev.title}
                  </h5>
                  <p className="theme-subtext text-xs sm:text-sm leading-relaxed line-clamp-5">
                    “{rev.content}”
                  </p>
                </div>

                {/* Card Footer: Metadata & Verification Badge */}
                <div className="pt-4 mt-3 border-t border-[var(--card-border)]/60 flex items-center justify-between text-[11px] font-mono theme-muted">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[var(--subtle-bg)] border border-[var(--card-border)] text-[10px] text-[var(--accent)] font-bold uppercase">
                      {rev.category.replace("_", " ")}
                    </span>
                    {rev.projectDate && <span>{rev.projectDate}</span>}
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Helpful Micro-Interaction */}
                    <button
                      onClick={() => handleLike(rev.id)}
                      className={`flex items-center gap-1 cursor-pointer transition-colors ${
                        isLiked ? "text-rose-400 font-bold" : "hover:text-[var(--accent)]"
                      }`}
                      title="Mark review as helpful"
                    >
                      <ThumbsUp className={`w-3 h-3 ${isLiked ? "fill-rose-400" : ""}`} />
                      <span>{likeCount}</span>
                    </button>

                    {rev.verificationLink && (
                      <a
                        href={rev.verificationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[var(--accent)] transition-colors p-1"
                        title="View verified campaign link"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* "Load More" Pagination (Ensures 100s to 1,000s of reviews never clutter the screen) */}
      {filteredReviews.length > displayCount && (
        <div className="mt-12 text-center">
          <button
            onClick={() => setDisplayCount((prev) => prev + 6)}
            className="glass-card px-8 py-3.5 rounded-full text-xs sm:text-sm font-mono font-bold theme-heading hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all cursor-pointer inline-flex items-center gap-2 shadow-lg group hover:scale-105"
          >
            <span>Load More Reviews ({filteredReviews.length - displayCount} Remaining)</span>
            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}

      {/* Write a Review Modal */}
      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onSubmitted={() => {
          fetchReviews();
        }}
      />
    </section>
  );
}
