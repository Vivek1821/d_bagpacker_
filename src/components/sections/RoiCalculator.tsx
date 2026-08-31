"use client";

import { useState } from "react";
import { TrendingUp, Users, Eye, ArrowRight } from "lucide-react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import MagneticButton from "@/components/ui/MagneticButton";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function RoiCalculator() {
  const [reelsCount, setReelsCount] = useState(3);
  const [ugcCount, setUgcCount] = useState(2);
  const [tier, setTier] = useState<"standard" | "cinema" | "viral">("cinema");

  // Calculations
  const viewsPerReel = tier === "viral" ? 2800000 : tier === "cinema" ? 1800000 : 900000;
  const totalViews = reelsCount * viewsPerReel + ugcCount * 450000;
  const estimatedClicks = Math.round(totalViews * 0.024);
  const estimatedShares = Math.round(totalViews * 0.008);

  const baseReelRate = tier === "viral" ? 55000 : tier === "cinema" ? 38000 : 25000;
  const baseUgcRate = 18000;
  const estimatedBudget = reelsCount * baseReelRate + ugcCount * baseUgcRate;

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="section-wrapper">
      <div className="section-container">
        {/* Centered Section Header */}
        <RevealOnScroll className="section-header">
          <span className="section-label">// BRAND COLLAB ESTIMATOR</span>
          <h2 className="text-3xl sm:text-6xl md:text-7xl font-bold theme-heading mb-4 sm:mb-6 section-title">
            Campaign Reach & <span className="gradient-text">ROI Simulator</span>
          </h2>
          <p className="section-desc">
            Estimate your campaign impressions, audience conversions, and deliverable scope in real-time.
          </p>
        </RevealOnScroll>

        {/* Calculator Main Grid */}
        <RevealOnScroll className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 glass-card-lg p-6 sm:p-12 rounded-[36px] border border-[var(--card-border)] shadow-xl">
            
            {/* Left Column: Interactive Controls */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              <div>
                <h3 className="theme-heading font-bold text-xl sm:text-2xl mb-1.5">Configure Campaign Scope 🎛️</h3>
                <p className="theme-subtext text-xs sm:text-sm">Adjust deliverables to simulate audience reach and pricing.</p>
              </div>

              {/* Slider 1: 9:16 Cinematic Reels */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-sm">
                  <label className="theme-heading font-semibold flex items-center gap-2 text-xs sm:text-sm">
                    <span>🎬</span> Number of 9:16 Reels:
                  </label>
                  <span className="font-mono text-base sm:text-lg font-bold text-[var(--accent)] bg-[var(--subtle-bg)] px-3.5 py-1 rounded-xl border border-[var(--card-border)]">
                    {reelsCount} {reelsCount === 1 ? "Reel" : "Reels"}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={reelsCount}
                  onChange={(e) => setReelsCount(Number(e.target.value))}
                  className="w-full accent-[var(--accent)] cursor-pointer h-2 bg-[var(--subtle-bg)] rounded-lg"
                />
                <div className="flex justify-between text-[10px] sm:text-[11px] font-mono theme-muted">
                  <span>1 Reel</span>
                  <span>4 Reels</span>
                  <span>8 Reels</span>
                </div>
              </div>

              {/* Slider 2: UGC Ads Cutdowns */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-sm">
                  <label className="theme-heading font-semibold flex items-center gap-2 text-xs sm:text-sm">
                    <span>📱</span> Paid UGC Ad Cutdowns:
                  </label>
                  <span className="font-mono text-base sm:text-lg font-bold text-[var(--accent)] bg-[var(--subtle-bg)] px-3.5 py-1 rounded-xl border border-[var(--card-border)]">
                    {ugcCount} {ugcCount === 1 ? "Cutdown" : "Cutdowns"}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="6"
                  value={ugcCount}
                  onChange={(e) => setUgcCount(Number(e.target.value))}
                  className="w-full accent-[var(--accent)] cursor-pointer h-2 bg-[var(--subtle-bg)] rounded-lg"
                />
                <div className="flex justify-between text-[10px] sm:text-[11px] font-mono theme-muted">
                  <span>0 (Organic Only)</span>
                  <span>3 Ads</span>
                  <span>6 Ads</span>
                </div>
              </div>

              {/* Production Quality Tier */}
              <div className="space-y-2.5">
                <label className="theme-heading font-semibold text-xs sm:text-sm block">
                  Production & Hook Tier:
                </label>
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                  {[
                    { id: "standard", name: "Standard", desc: "Studio Shot" },
                    { id: "cinema", name: "4K Cinema", desc: "Sony FX3 Rig" },
                    { id: "viral", name: "Viral Master", desc: "High-Retention" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTier(t.id as typeof tier)}
                      className={`p-3 sm:p-3.5 rounded-2xl text-left transition-all cursor-pointer border ${
                        tier === t.id
                          ? "border-[var(--accent)] bg-[var(--accent-glow)] shadow-md"
                          : "glass-card hover:border-[var(--accent)]"
                      }`}
                    >
                      <p className="text-xs font-bold font-mono theme-heading">{t.name}</p>
                      <p className="text-[10px] theme-muted mt-0.5">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Live Projected Output */}
            <div className="lg:col-span-5 glass-card p-6 sm:p-8 rounded-3xl flex flex-col justify-between border border-[var(--accent)] space-y-6">
              <div>
                <span className="section-label mb-2">// ESTIMATED PROJECTIONS</span>
                <h4 className="theme-heading font-bold text-lg sm:text-xl mb-4 sm:mb-6">Campaign Performance</h4>

                <div className="space-y-3.5">
                  <div className="glass-card-sm p-3.5 sm:p-4 rounded-2xl border border-[var(--card-border)]">
                    <p className="text-[10px] sm:text-xs font-mono theme-muted uppercase mb-1">Projected Organic Reach</p>
                    <p className="text-2xl sm:text-3xl font-bold font-mono text-[var(--accent)]">
                      <AnimatedCounter target={Math.round(totalViews / 100000) / 10} suffix="M+" />
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass-card-sm p-3 rounded-2xl border border-[var(--card-border)]">
                      <p className="text-[10px] font-mono theme-muted uppercase mb-1">Conversions</p>
                      <p className="text-base sm:text-lg font-bold font-mono theme-heading">
                        {estimatedClicks.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="glass-card-sm p-3 rounded-2xl border border-[var(--card-border)]">
                      <p className="text-[10px] font-mono theme-muted uppercase mb-1">Est. Shares</p>
                      <p className="text-base sm:text-lg font-bold font-mono theme-heading">
                        {estimatedShares.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="glass-card-sm p-3.5 sm:p-4 rounded-2xl border border-[var(--accent)] bg-[var(--accent-glow)]">
                    <p className="text-[10px] sm:text-xs font-mono theme-subtext uppercase mb-1">Estimated Collab Investment</p>
                    <p className="text-xl sm:text-2xl font-bold font-mono theme-heading">
                      ₹{estimatedBudget.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>

              <MagneticButton
                onClick={scrollToContact}
                className="neon-btn-filled w-full cursor-pointer"
              >
                Apply to Brief <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </div>

          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
