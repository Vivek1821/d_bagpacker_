"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Sparkles,
  ShieldCheck,
  Building2,
  ExternalLink,
  Search,
  RefreshCw,
  Award,
  AlertCircle,
  ThumbsUp,
  Filter
} from "lucide-react";
import toast from "react-hot-toast";
import type { ReviewItem } from "@/app/api/reviews/route";

export default function ReviewsManager() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<"pending" | "approved" | "featured" | "rejected" | "all">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Fetch all reviews for admin studio
  const fetchAllReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reviews?status=all");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setReviews(json.data);
      }
    } catch (err) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  // Update Review Status (Approve / Reject)
  const handleUpdateStatus = async (id: string, newStatus: "approved" | "rejected" | "pending") => {
    setProcessingId(id);
    try {
      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );

      if (newStatus === "approved") {
        toast.success("Review approved & published live! 🚀");
      } else if (newStatus === "rejected") {
        toast.success("Review rejected and archived");
      } else {
        toast.success("Status reset to pending");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update review status");
    } finally {
      setProcessingId(null);
    }
  };

  // Toggle Featured status
  const handleToggleFeatured = async (id: string, currentFeatured: boolean = false) => {
    setProcessingId(id);
    try {
      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, featured: !currentFeatured }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to toggle featured");

      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, featured: !currentFeatured } : r))
      );

      toast.success(!currentFeatured ? "Pinned to Homepage Marquee! ★" : "Unpinned from Marquee");
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle feature");
    } finally {
      setProcessingId(null);
    }
  };

  // Delete Review Permanently
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review permanently?")) return;

    setProcessingId(id);
    try {
      const res = await fetch(`/api/reviews?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");

      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success("Review removed permanently");
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    } finally {
      setProcessingId(null);
    }
  };

  // Filtered list
  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      // Tab check
      if (filterTab === "pending" && r.status !== "pending") return false;
      if (filterTab === "approved" && r.status !== "approved") return false;
      if (filterTab === "rejected" && r.status !== "rejected") return false;
      if (filterTab === "featured" && !r.featured) return false;

      // Search check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.name.toLowerCase().includes(q) ||
          r.company.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.content.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [reviews, filterTab, searchQuery]);

  // Metrics
  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const approvedCount = reviews.filter((r) => r.status === "approved").length;
  const featuredCount = reviews.filter((r) => r.featured).length;
  const rejectedCount = reviews.filter((r) => r.status === "rejected").length;

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-6 border-b border-[var(--card-border)]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="theme-heading font-bold text-lg sm:text-2xl flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--accent)]" />
              <span>Reviews & Client Verification</span>
            </h2>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold animate-pulse flex items-center gap-1 border border-amber-500/40">
                <Clock className="w-3 h-3" />
                {pendingCount} Pending Approval
              </span>
            )}
          </div>
          <p className="theme-muted text-xs sm:text-sm mt-1">
            Review submissions are held in pending queue · Approve to publish directly to the live portfolio.
          </p>
        </div>

        <button
          onClick={fetchAllReviews}
          disabled={loading}
          className="glass-card px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 hover:border-[var(--accent)] transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[var(--accent)]" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-[var(--card-border)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono theme-muted uppercase">Pending</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-2">{pendingCount}</p>
          <span className="text-[10px] font-mono theme-muted">Needs moderation</span>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-[var(--card-border)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono theme-muted uppercase">Live on Web</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2">{approvedCount}</p>
          <span className="text-[10px] font-mono theme-muted">Active on portfolio</span>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-[var(--card-border)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono theme-muted uppercase">Featured</span>
            <Award className="w-4 h-4 text-[var(--accent)]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[var(--accent)] mt-2">{featuredCount}</p>
          <span className="text-[10px] font-mono theme-muted">In marquee ticker</span>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-[var(--card-border)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono theme-muted uppercase">Archived</span>
            <XCircle className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-400 mt-2">{rejectedCount}</p>
          <span className="text-[10px] font-mono theme-muted">Rejected / Spam</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterTab("pending")}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
              filterTab === "pending"
                ? "bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-sm"
                : "glass-card theme-subtext hover:border-[var(--accent)]"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending ({pendingCount})</span>
          </button>

          <button
            onClick={() => setFilterTab("approved")}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
              filterTab === "approved"
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-sm"
                : "glass-card theme-subtext hover:border-[var(--accent)]"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved ({approvedCount})</span>
          </button>

          <button
            onClick={() => setFilterTab("featured")}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
              filterTab === "featured"
                ? "bg-[var(--accent-glow)] text-[var(--accent)] border-[var(--accent)] shadow-sm"
                : "glass-card theme-subtext hover:border-[var(--accent)]"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Featured ({featuredCount})</span>
          </button>

          <button
            onClick={() => setFilterTab("all")}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap border ${
              filterTab === "all"
                ? "bg-[var(--accent)] text-[#030712] border-[var(--accent)]"
                : "glass-card theme-subtext hover:border-[var(--accent)]"
            }`}
          >
            <span>All ({reviews.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews..."
            className="neon-input pl-9 text-xs py-2"
          />
        </div>
      </div>

      {/* Review Items List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 rounded-2xl animate-pulse space-y-3 border border-[var(--card-border)]">
              <div className="h-4 bg-slate-800 rounded w-1/4" />
              <div className="h-3 bg-slate-800 rounded w-1/2" />
              <div className="h-10 bg-slate-800 rounded w-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-[var(--card-border)] text-center space-y-3">
          <ShieldCheck className="w-10 h-10 text-[var(--accent)] mx-auto opacity-60" />
          <h3 className="theme-heading font-bold text-base">No reviews in this queue</h3>
          <p className="theme-muted text-xs">
            {filterTab === "pending"
              ? "All submitted client reviews have been verified! 🎉"
              : "No reviews match the current filter criteria."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((rev) => {
            const isProcessing = processingId === rev.id;

            return (
              <div
                key={rev.id}
                className={`glass-card p-5 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all space-y-4 ${
                  rev.status === "pending"
                    ? "border-amber-500/40 bg-amber-500/[0.03]"
                    : rev.status === "approved"
                    ? "border-[var(--card-border)] hover:border-[var(--accent)]"
                    : "border-slate-800 opacity-60"
                }`}
              >
                {/* Top Row: Reviewer Details & Rating */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {rev.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={rev.avatarUrl}
                        alt={rev.name}
                        className="w-11 h-11 rounded-xl object-cover border border-[var(--card-border)] shadow-sm flex-shrink-0"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-[var(--accent)] text-[#030712] font-mono font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                        {rev.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="theme-heading font-bold text-sm sm:text-base leading-tight">
                          {rev.name}
                        </h4>
                        <span className="text-xs text-[var(--accent)] font-medium">
                          {rev.role} {rev.company && `· ${rev.company}`}
                        </span>

                        {/* Status Badge */}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            rev.status === "approved"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : rev.status === "pending"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-slate-800 text-slate-400 border border-slate-700"
                          }`}
                        >
                          {rev.status}
                        </span>

                        {rev.featured && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--accent-glow)] text-[var(--accent)] border border-[var(--accent)]">
                            ★ Featured Marquee
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] font-mono theme-muted mt-1">
                        <span className="uppercase text-[var(--accent)]">{rev.category.replace("_", " ")}</span>
                        <span>&bull;</span>
                        <span>{rev.projectDate || "2026"}</span>
                        <span>&bull;</span>
                        <span>{new Date(rev.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-400 self-start sm:self-auto">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-700"
                        }`}
                      />
                    ))}
                    <span className="text-xs font-mono font-bold ml-1 text-amber-400">({rev.rating}.0)</span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1.5 bg-[var(--subtle-bg)]/40 p-3.5 sm:p-4 rounded-xl border border-[var(--card-border)]/50">
                  <h5 className="theme-heading font-bold text-sm">{rev.title}</h5>
                  <p className="theme-subtext text-xs sm:text-sm leading-relaxed">
                    “{rev.content}”
                  </p>

                  {rev.verificationLink && (
                    <div className="pt-2 flex items-center gap-1.5 text-xs font-mono">
                      <span className="theme-muted">Verification Link:</span>
                      <a
                        href={rev.verificationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--accent)] hover:underline inline-flex items-center gap-1"
                      >
                        <span className="truncate max-w-xs">{rev.verificationLink}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Action Buttons Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--card-border)]/60">
                  <div className="flex items-center gap-2">
                    {rev.status !== "approved" ? (
                      <button
                        onClick={() => handleUpdateStatus(rev.id, "approved")}
                        disabled={isProcessing}
                        className="neon-btn-filled px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Publish Live</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(rev.id, "pending")}
                        disabled={isProcessing}
                        className="glass-card px-3 py-1.5 rounded-xl text-xs font-mono text-amber-400 hover:border-amber-400 cursor-pointer disabled:opacity-50"
                      >
                        Move to Pending
                      </button>
                    )}

                    {rev.status === "approved" && (
                      <button
                        onClick={() => handleToggleFeatured(rev.id, rev.featured)}
                        disabled={isProcessing}
                        className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all border disabled:opacity-50 ${
                          rev.featured
                            ? "bg-[var(--accent-glow)] text-[var(--accent)] border-[var(--accent)]"
                            : "glass-card theme-subtext hover:border-[var(--accent)] hover:text-[var(--accent)]"
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${rev.featured ? "fill-[var(--accent)]" : ""}`} />
                        <span>{rev.featured ? "Featured on Marquee" : "Pin to Marquee"}</span>
                      </button>
                    )}

                    {rev.status !== "rejected" && (
                      <button
                        onClick={() => handleUpdateStatus(rev.id, "rejected")}
                        disabled={isProcessing}
                        className="glass-card px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-rose-400 hover:border-rose-400 cursor-pointer disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5 inline mr-1" />
                        Reject
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(rev.id)}
                    disabled={isProcessing}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50"
                    title="Delete review permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
