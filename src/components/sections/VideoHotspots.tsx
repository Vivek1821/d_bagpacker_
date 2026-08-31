"use client";

import { useState } from "react";
import { Target, Zap, Music, TrendingUp, BarChart2, Eye, Share2, MessageCircle } from "lucide-react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const HOTSPOTS = [
  {
    id: 1,
    x: 24,
    y: 18,
    icon: "⚡",
    label: "3-Second Hook Rule",
    type: "hook",
    color: "#f97316",
    detail: "Fast motion match-cut + bold text overlay on beat drop. Retains 94.2% of viewers past the scroll decision threshold.",
    metric: "94.2% Retention @ 3s",
  },
  {
    id: 2,
    x: 52,
    y: 42,
    icon: "🎵",
    label: "Micro-SFX & Sub-Bass",
    type: "audio",
    color: "#818cf8",
    detail: "Layered whooshes, risers and deep 808 sub drops synchronized with camera transitions to maintain subconscious engagement.",
    metric: "+67% Share Rate",
  },
  {
    id: 3,
    x: 74,
    y: 28,
    icon: "📊",
    label: "Open Narrative Loop",
    type: "retention",
    color: "#10b981",
    detail: "Unresolved visual question seeded at second 12 ('Wait until the reveal...'), preventing swipe-away until the finale.",
    metric: "78.4% Full Completion",
  },
  {
    id: 4,
    x: 36,
    y: 72,
    icon: "💬",
    label: "High-Friction CTA",
    type: "cta",
    color: "#06b6d4",
    detail: "Conversational prompt embedded inside the visual storyline, generating over 12,400 comment debates.",
    metric: "12.4K Comments",
  },
];

const RETENTION_DATA = [
  { second: "0s", value: 100 },
  { second: "3s", value: 94 },
  { second: "10s", value: 84 },
  { second: "20s", value: 76 },
  { second: "30s", value: 68 },
  { second: "45s", value: 62 },
  { second: "End", value: 78 },
];

export default function VideoHotspots() {
  const [activeHotspot, setActiveHotspot] = useState<number | null>(1);

  return (
    <section className="section-wrapper">
      <div className="section-container">
        {/* Centered Section Header */}
        <RevealOnScroll className="section-header">
          <span className="section-label">// VIRAL ANATOMY</span>
          <h2 className="text-3xl sm:text-6xl md:text-7xl font-bold theme-heading mb-4 sm:mb-6 section-title">
            Viral Video <span className="gradient-text">Deconstruction</span>
          </h2>
          <p className="section-desc">
            Click on the interactive markers to decode the psychological hooks, audio layering, and editing pacing behind a 5.2M view reel.
          </p>
        </RevealOnScroll>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Simulated 9:16 Frame */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <RevealOnScroll className="w-full max-w-[290px] sm:max-w-[340px]">
              <div
                className="relative rounded-[36px] sm:rounded-[40px] overflow-hidden aspect-[9/16] w-full border-2 border-[var(--accent-dim)] shadow-[0_0_40px_var(--accent-glow)] transition-all duration-500 hover:border-[var(--accent)]"
                style={{
                  background: "linear-gradient(165deg, #0a192f 0%, #030712 50%, #0f172a 100%)",
                }}
              >
                {/* Graphic background */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  <span className="text-[100px] sm:text-[120px] opacity-25 filter drop-shadow-[0_0_30px_rgba(0,242,254,0.3)]">🌅</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/95 via-transparent to-[#030712]/60 pointer-events-none" />

                {/* Reel Header */}
                <div className="absolute top-4 sm:top-5 left-4 sm:left-5 right-4 sm:right-5 flex items-center justify-between z-10">
                  <span className="tag-pill text-[9px] bg-black/80 border border-[var(--card-border)] backdrop-blur-md">CASE STUDY #04</span>
                  <span className="text-[10px] sm:text-xs font-mono text-[var(--accent)] font-bold bg-[var(--subtle-bg)] px-2.5 py-0.5 rounded-full border border-[var(--accent-dim)]">5.2M VIEWS</span>
                </div>

                {/* Bottom Details */}
                <div className="absolute bottom-5 sm:bottom-6 left-5 sm:left-6 right-5 sm:right-6 z-10">
                  <h4 className="text-white font-bold text-sm sm:text-base mb-1">Spiti Valley High Ridge Reel</h4>
                  <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-mono text-white/80">
                    <span className="flex items-center gap-1"><Eye className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[var(--accent)]" /> 5.2M</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#818cf8]" /> 12.4K</span>
                    <span className="flex items-center gap-1"><Share2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#f97316]" /> 38K</span>
                  </div>
                </div>

                {/* Simulated Radar Scanner Line */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-40 animate-radar-sweep shadow-[0_0_15px_var(--accent)]" />
                </div>

                {/* Interactive Hotspot Markers with Ping Waves */}
                {HOTSPOTS.map((h) => (
                  <div
                    key={h.id}
                    className="hotspot-marker group"
                    style={{
                      left: `${h.x}%`,
                      top: `${h.y}%`,
                      borderColor: h.color,
                      background: h.color + "35",
                      boxShadow: `0 0 20px ${h.color}80`,
                    }}
                    onClick={() => setActiveHotspot(activeHotspot === h.id ? null : h.id)}
                  >
                    {/* Pulsing Ripple */}
                    <span
                      className="absolute inset-0 rounded-full animate-ping opacity-60 pointer-events-none"
                      style={{ background: h.color }}
                    />
                    <span className="text-xs select-none z-10">{h.icon}</span>

                    {/* Hotspot Floating Tooltip */}
                    {activeHotspot === h.id && (
                      <div
                        className="hotspot-tooltip animate-float-up"
                        style={{
                          left: h.x > 50 ? "auto" : "32px",
                          right: h.x > 50 ? "32px" : "auto",
                          top: h.y > 60 ? "auto" : "0px",
                          bottom: h.y > 60 ? "0px" : "auto",
                          borderColor: h.color + "70",
                          width: "230px",
                          boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 20px ${h.color}30`,
                        }}
                      >
                        <p className="font-bold theme-heading text-xs mb-1">{h.label}</p>
                        <p className="theme-subtext text-[10px] sm:text-[11px] leading-relaxed mb-2">{h.detail}</p>
                        <div className="text-[10px] sm:text-[11px] font-mono font-bold" style={{ color: h.color }}>
                          📊 {h.metric}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </div>

          {/* Analytics & Breakdown Panel */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Top metrics grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
              {[
                { icon: TrendingUp, label: "Total Views", value: 5, suffix: ".2M", color: "var(--accent)" },
                { icon: Target, label: "Engagement", value: 8, suffix: ".4%", color: "#f97316" },
                { icon: BarChart2, label: "Avg Watch", value: 78, suffix: "%", color: "#818cf8" },
                { icon: Music, label: "Shares", value: 38, suffix: "K", color: "#06b6d4" },
              ].map((m) => (
                <div key={m.label} className="glass-card glass-card-hover p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-center">
                  <m.icon className="w-4 h-4 sm:w-5 sm:h-5 mb-2 sm:mb-3 mx-auto" style={{ color: m.color }} />
                  <div className="text-xl sm:text-3xl font-bold font-mono" style={{ color: m.color }}>
                    <AnimatedCounter target={m.value} suffix={m.suffix} />
                  </div>
                  <div className="theme-muted text-[10px] sm:text-xs font-mono mt-1 uppercase tracking-wider">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Retention curve graph */}
            <div className="glass-card p-5 sm:p-8 rounded-3xl">
              <div className="flex items-center justify-between mb-5 sm:mb-6">
                <p className="theme-heading text-xs sm:text-sm font-bold flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[var(--accent)]" />
                  Audience Retention Curve
                </p>
                <span className="text-[10px] sm:text-xs font-mono text-[var(--accent)] font-semibold">Benchmark: Top 1%</span>
              </div>
              <div className="space-y-3 sm:space-y-3.5">
                {RETENTION_DATA.map((d, i) => (
                  <div key={d.second} className="flex items-center gap-3 sm:gap-4">
                    <span className="text-xs font-mono theme-muted w-8 sm:w-10 text-right">{d.second}</span>
                    <div className="flex-1 retention-bar">
                      <div
                        className="retention-fill"
                        style={{
                          width: `${d.value}%`,
                          transitionDelay: `${i * 80}ms`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono text-[var(--accent)] w-10 sm:w-12 font-bold">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotspot list selector */}
            <div className="space-y-2.5 sm:space-y-3">
              <p className="theme-muted text-xs font-mono tracking-[0.2em] uppercase mb-2">
                Click a hook strategy to inspect:
              </p>
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                {HOTSPOTS.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setActiveHotspot(activeHotspot === h.id ? null : h.id)}
                    className={`text-left glass-card p-4 sm:p-5 rounded-2xl flex items-center gap-3.5 sm:gap-4 transition-all duration-300 cursor-pointer ${
                      activeHotspot === h.id
                        ? "border-[var(--accent)] bg-[var(--accent-glow)] shadow-md"
                        : "glass-card-hover opacity-80"
                    }`}
                  >
                    <span className="text-xl sm:text-2xl flex-shrink-0">{h.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="theme-heading text-xs font-bold truncate">{h.label}</p>
                      <p className="text-[10px] sm:text-[11px] font-mono mt-0.5" style={{ color: h.color }}>
                        {h.metric}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
