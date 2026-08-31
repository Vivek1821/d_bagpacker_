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

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {STATS.map((stat, i) => (
            <RevealOnScroll key={stat.label} delay={i * 0.08} direction="up">
              <div className="group glass-card glass-card-hover p-5 sm:p-7 rounded-3xl border border-[var(--card-border)] hover:border-[var(--accent)] flex flex-col justify-between h-full transition-all duration-500 hover:shadow-[0_0_30px_var(--accent-glow)] transform hover:-translate-y-2">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                    style={{ background: stat.color + "18", border: `1px solid ${stat.color}45` }}
                  >
                    <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping opacity-75" />
                </div>

                <div>
                  <div className="text-3xl sm:text-5xl font-bold font-mono neon-text mb-1.5 tracking-tight group-hover:scale-105 transition-transform duration-300 origin-left">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <h3 className="theme-heading font-bold text-sm sm:text-base mb-1">{stat.label}</h3>
                  <p className="theme-muted text-xs leading-relaxed">{stat.desc}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
