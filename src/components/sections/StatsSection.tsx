"use client";

import RevealOnScroll from "@/components/ui/RevealOnScroll";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import InfiniteMarquee from "@/components/ui/InfiniteMarquee";
import { Camera, Tv2, TrendingUp, Users, Eye, Star, Award } from "lucide-react";

const BRANDS = [
  "Nike India", "Samsung", "Adobe", "Spotify", "OnePlus", "Apple",
  "Google", "Puma", "Skillshare", "NordVPN", "Notion", "Figma",
  "Sony", "DJI", "Canon", "Rode", "Boat Audio", "Levi's",
];

const TESTIMONIALS = [
  {
    name: "Ananya Sharma",
    role: "Head of Influencer Marketing · Samsung India",
    text: "Our Galaxy S25 Reel campaign hit 8.3M organic views in the first 7 days. The hook strategy was exceptional — we saw a 340% increase in retail store queries from the content.",
    rating: 5,
    avatar: "AS",
    color: "#f97316",
    project: "Galaxy S25 Launch",
  },
  {
    name: "Rahul Mehta",
    role: "Founder & CEO · EduStart India",
    text: "Booked Vivek for our product launch video. The result? 4x our projected reach and 2,400 app signups in 48 hours. The storytelling ROI was unreal. Highly recommended.",
    rating: 5,
    avatar: "RM",
    color: "#818cf8",
    project: "Product Launch Campaign",
  },
  {
    name: "Priya Nair",
    role: "Senior Content Lead · Spotify India",
    text: "The storytelling was exactly what we needed. Authentic, engaging, perfectly aligned with our brand voice. The reel drove 180K new podcast listeners — our highest performing collab.",
    rating: 5,
    avatar: "PN",
    color: "#06b6d4",
    project: "Spotify Podcast Series",
  },
];

const STATS = [
  { icon: Camera, value: 284, suffix: "K", label: "Instagram Followers", desc: "Active community with 8.4% engagement" },
  { icon: Tv2, value: 52, suffix: "K", label: "YouTube Subscribers", desc: "Long-form & Shorts cinematic audience" },
  { icon: Eye, value: 47, suffix: "M+", label: "Total Content Views", desc: "Organic lifetime video views across channels" },
  { icon: Users, value: 120, suffix: "+", label: "Brand Partnerships", desc: "Completed campaigns for global & Indian brands" },
  { icon: TrendingUp, value: 8, suffix: ".4%", label: "Avg Engagement Rate", desc: "3.5x higher than industry standard average" },
  { icon: Award, value: 50, suffix: "+", label: "5-Star Collab Reviews", desc: "100% on-time delivery track record" },
];

export default function StatsSection() {
  return (
    <section className="section-wrapper">
      {/* Glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, var(--accent-glow) 0%, transparent 70%)",
        }}
      />

      <div className="section-container">

        {/* Centered Section Header */}
        <RevealOnScroll className="section-header">
          <span className="section-label">// SOCIAL PROOF & METRICS</span>
          <h2 className="text-3xl sm:text-6xl md:text-7xl font-bold theme-heading mb-4 sm:mb-6 section-title">
            Numbers That <span className="gradient-text">Speak</span>
          </h2>
          <p className="section-desc">
            Real metrics from real brand campaigns. No vanity numbers — just measurable reach, retention, and conversion.
          </p>
        </RevealOnScroll>

        {/* 3x2 Spacious Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 mb-24 sm:mb-32">
          {STATS.map((stat, i) => (
            <RevealOnScroll key={stat.label} delay={i * 0.04}>
              <div className="glass-card glass-card-hover h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[var(--subtle-bg)] border border-[var(--card-border)] flex items-center justify-center mb-5 sm:mb-6 shadow-sm">
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--accent)]" />
                  </div>
                  <div className="text-3xl sm:text-5xl font-bold font-mono neon-text mb-2 tracking-tight">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <h3 className="theme-heading font-bold text-base sm:text-lg mb-1.5">{stat.label}</h3>
                  <p className="theme-subtext text-xs sm:text-sm leading-relaxed">{stat.desc}</p>
                </div>
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-[var(--card-border)] flex items-center justify-between text-xs font-mono theme-muted">
                  <span>METRIC VERIFIED</span>
                  <span className="text-[var(--accent)] font-bold">✓ 2025</span>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* Standalone Brand Marquee Container */}
        <div className="my-24 sm:my-32 py-10 sm:py-14 px-4 sm:px-6 border-y border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-xl rounded-[32px] shadow-lg">
          <div className="text-center mb-8 sm:mb-10">
            <span className="section-label">// COLLABORATED WITH LEADING BRANDS</span>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <InfiniteMarquee speed={22} gap={32}>
              {BRANDS.map((brand) => (
                <div
                  key={brand}
                  className="glass-card-sm flex items-center gap-3 text-xs sm:text-sm theme-subtext font-semibold tracking-wide border border-[var(--card-border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
                  {brand}
                </div>
              ))}
            </InfiniteMarquee>

            <InfiniteMarquee speed={28} direction="right" gap={32}>
              {[...BRANDS].reverse().map((brand) => (
                <div
                  key={brand}
                  className="glass-card-sm flex items-center gap-3 text-xs sm:text-sm theme-muted font-semibold tracking-wide border border-[var(--card-border)]"
                >
                  <span className="w-2 h-2 rounded-full bg-[var(--accent-dim)]" />
                  {brand}
                </div>
              ))}
            </InfiniteMarquee>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="pt-8">
          <RevealOnScroll className="section-header">
            <span className="section-label">// CLIENT LOVE & CASE TESTIMONIALS</span>
            <h2 className="text-3xl sm:text-5xl font-bold theme-heading mb-4 sm:mb-6 section-title">
              What Brand Partners <span className="gradient-text">Say</span>
            </h2>
            <p className="section-desc">
              Direct feedback from marketing leaders and founders after running campaigns with us.
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {TESTIMONIALS.map((t, i) => (
              <RevealOnScroll key={t.name} delay={i * 0.08}>
                <div className="glass-card glass-card-hover h-full flex flex-col justify-between">
                  <div>
                    {/* Stars */}
                    <div className="flex gap-1 mb-5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>

                    {/* Project Tag */}
                    <div className="mb-5">
                      <span className="tag-pill text-xs px-3.5 py-1">{t.project}</span>
                    </div>

                    {/* Quote */}
                    <p className="theme-subtext text-sm sm:text-base leading-relaxed mb-6 italic">
                      &ldquo;{t.text}&rdquo;
                    </p>
                  </div>

                  {/* Author Bar */}
                  <div className="flex items-center gap-4 pt-5 border-t border-[var(--card-border)]">
                    <div
                      className="rounded-2xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-md"
                      style={{ background: t.color, width: "48px", height: "48px" }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <p className="theme-heading text-sm sm:text-base font-bold">{t.name}</p>
                      <p className="theme-muted text-xs mt-0.5">{t.role}</p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
