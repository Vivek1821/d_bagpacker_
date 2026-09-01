"use client";

import RevealOnScroll from "@/components/ui/RevealOnScroll";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { Users, Film, Eye, TrendingUp, Award, Clock } from "lucide-react";

const STATS = [
  {
    icon: Users,
    value: 20,
    suffix: "K+",
    label: "Instagram Followers",
    desc: "Active community of travel lovers & outdoor enthusiasts",
    color: "var(--accent)",
  },
  {
    icon: Film,
    value: 302,
    suffix: "+",
    label: "Published Posts & Reels",
    desc: "High-quality solo travel, treks, and road trip reels",
    color: "#f97316",
  },
  {
    icon: Eye,
    value: 12,
    suffix: "M+",
    label: "Organic Video Views",
    desc: "Viral reach across travel, lifestyle, and tourism feeds",
    color: "#818cf8",
  },
  {
    icon: TrendingUp,
    value: 8,
    suffix: ".6%",
    label: "Engagement Rate",
    desc: "3.2x higher than typical travel influencer benchmarks",
    color: "#10b981",
  },
  {
    icon: Award,
    value: 40,
    suffix: "+",
    label: "Brand Partnerships",
    desc: "Collaborations with travel gear, hospitality & tech brands",
    color: "#ec4899",
  },
  {
    icon: Clock,
    value: 100,
    suffix: "%",
    label: "On-Time Deliverables",
    desc: "Strict adherence to commercial timelines and brand briefs",
    color: "#06b6d4",
  },
];

export default function StatsSection() {
  return (
    <section className="section-wrapper border-y border-[var(--card-border)] bg-[var(--bg-secondary)]">
      <div className="section-container">
        <RevealOnScroll className="section-header">
          <span className="section-label">// VERIFIED METRICS</span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold theme-heading mb-4 sm:mb-6 section-title">
            Numbers That <span className="gradient-text">Speak Proof</span>
          </h2>
          <p className="section-desc">
            Authentic community engagement and high-impact travel storytelling for brands.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
          {STATS.map((stat, i) => (
            <RevealOnScroll key={stat.label} delay={i * 0.08} direction="up">
              <div className="group glass-card glass-card-hover p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-[var(--card-border)] hover:border-[var(--accent)] flex flex-col h-full transition-all duration-500 hover:shadow-[0_0_30px_var(--accent-glow)] transform hover:-translate-y-2">
                {/* Top Icon & Pulse Dot */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 flex-shrink-0"
                    style={{ background: stat.color + "18", border: `1px solid ${stat.color}45` }}
                  >
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: stat.color }} />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping opacity-75" />
                </div>

                {/* Big Animated Counter */}
                <div className="text-2xl sm:text-4xl lg:text-5xl font-bold font-mono neon-text mb-2 tracking-tight group-hover:scale-105 transition-transform duration-300 origin-left">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>

                {/* Harmonized Title Slot: Guaranteed equal vertical height across mobile grid */}
                <div className="min-h-[38px] sm:min-h-[46px] flex items-center mb-1">
                  <h3 className="theme-heading font-bold text-xs sm:text-base leading-snug line-clamp-2">
                    {stat.label}
                  </h3>
                </div>

                {/* Description */}
                <p className="theme-muted text-[11px] sm:text-xs leading-relaxed line-clamp-2 mt-auto">
                  {stat.desc}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
