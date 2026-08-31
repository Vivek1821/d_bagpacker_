"use client";

import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { Compass, Mountain, Video, MapPin, ArrowUpRight, Flame, Tent, Heart, Sparkles } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";

const TIMELINE = [
  { year: "2021", event: "Started documenting first budget solo backpacking journeys across the Western Ghats and remote villages with raw mobile footage.", emoji: "🎒" },
  { year: "2022", event: "Monsoon trek series across Sahyadri peaks (Harishchandragad, Rajgad, Kalsubai) went viral, crossing 500K+ reach.", emoji: "🌧️" },
  { year: "2023", event: "Invested in cinema camera kit. First commercial brand partnerships signed with outdoor apparel and backpack makers. Crossed 10K community.", emoji: "📷" },
  { year: "2024", event: "Expanded into coastal Konkan road trips, waterfall exploration, and motorcycle tours. Published 300+ authentic travel pieces.", emoji: "🏍️" },
  { year: "2025", event: "20K+ active travel community on @d_bagpacker_. Full-time content creator working with tourism boards, hospitality, and outdoor brands.", emoji: "🇮🇳" },
];

const SERVICES = [
  {
    icon: Mountain,
    title: "Raw Trekking & Nature Reels",
    desc: "Authentic 9:16 high-retention reels documenting Sahyadri mountain trails, hidden waterfalls, and lush rainforests across India.",
    color: "var(--accent)",
  },
  {
    icon: Tent,
    title: "Outdoor & Travel Brand Collabs",
    desc: "Organic, trustworthy brand integrations featuring your gear, backpacks, riding accessories, or tech in real outdoor settings.",
    color: "#f97316",
  },
  {
    icon: Video,
    title: "Cinematic Travel Documentaries",
    desc: "End-to-end 4K video storytelling for eco-resorts, tourism boards, homestays, and unique experiential travel stays.",
    color: "#818cf8",
  },
  {
    icon: Compass,
    title: "Roadtrips & Moto Tours",
    desc: "Visual road trip documentation capturing scenic coastal highways, mountain ghats, and solo travel perspectives.",
    color: "#06b6d4",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="section-wrapper">
      <div className="section-container">

        {/* Centered Section Header */}
        <RevealOnScroll className="section-header">
          <span className="section-label">// THE TRAVELER STORY</span>
          <h2 className="text-3xl sm:text-6xl md:text-7xl font-bold theme-heading mb-4 sm:mb-6 section-title">
            Exploring India <span className="gradient-text">One Trail at a Time</span>
          </h2>
          <p className="section-desc">
            The story behind D_BagPacker_Girl_ — solo backpacking, Sahyadri mountain treks, coastal roads, and authentic travel storytelling.
          </p>
        </RevealOnScroll>

        {/* Bio + Services 2-Column Section */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-24 sm:mb-32">

          {/* Left: Bio Profile Card */}
          <div className="lg:col-span-6">
            <RevealOnScroll>
              <div className="glass-card p-6 sm:p-10 rounded-[32px] space-y-6 sm:space-y-8 border border-[var(--card-border)] shadow-lg">
                {/* Avatar */}
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="relative">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[var(--subtle-bg)] border border-[var(--card-border)] flex items-center justify-center text-4xl sm:text-5xl shadow-md">
                      🎒
                    </div>
                    <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[var(--accent)] flex items-center justify-center shadow-sm">
                      <Compass className="w-4 h-4 text-[#030712]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold theme-heading">D_BagPacker_Girl_</h3>
                    <a
                      href="https://www.instagram.com/d_bagpacker_/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[var(--accent)] font-mono text-xs mt-1 hover:underline font-bold"
                    >
                      <InstagramIcon className="w-3.5 h-3.5" />
                      <span>@d_bagpacker_</span>
                      <ArrowUpRight className="w-3 h-3" />
                      <span className="theme-muted mx-1">·</span>
                      <MapPin className="w-3.5 h-3.5 theme-muted" />
                      <span className="theme-muted">India</span>
                    </a>
                  </div>
                </div>

                <div className="space-y-3.5 theme-subtext leading-relaxed text-sm sm:text-base">
                  <p>
                    I am an Indian travel creator and solo backpacker behind <span className="text-[var(--accent)] font-bold">@d_bagpacker_</span>. Known for authentic documentation of <span className="theme-heading font-semibold">Sahyadri mountain treks, monsoon waterfalls, heritage forts, scenic road trips, and solo travel guides across India</span>.
                  </p>
                  <p>
                    With over <span className="text-[var(--accent)] font-bold">20,000+ travel followers</span> and <span className="theme-heading font-semibold">300+ published stories</span>, I work closely with leading outdoor, hospitality, fashion, and tech brands to create genuine, high-retention visual content.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-3 border-t border-[var(--card-border)]">
                  <a
                    href="https://www.instagram.com/d_bagpacker_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card-sm flex items-center gap-2 text-xs font-mono text-[var(--accent)] font-bold hover:border-[var(--accent)]"
                  >
                    <InstagramIcon className="w-4 h-4" />
                    Follow on Instagram (20K)
                  </a>
                  <div className="glass-card-sm flex items-center gap-2 text-xs font-mono theme-subtext">
                    <Tent className="w-3.5 h-3.5 text-[var(--accent)]" />
                    Open for Brand Collaborations 2025–26
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Right: Services Stack */}
          <div className="lg:col-span-6 space-y-3.5 sm:space-y-4">
            <p className="section-label mb-3 sm:mb-4">// COLLABORATION SCOPE</p>
            {SERVICES.map((s, i) => (
              <RevealOnScroll key={s.title} delay={i * 0.06}>
                <div className="glass-card glass-card-hover p-5 sm:p-6 rounded-2xl sm:rounded-3xl flex gap-4 sm:gap-5 items-start border border-[var(--card-border)]">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: s.color + "15", border: `1px solid ${s.color}30` }}
                  >
                    <s.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: s.color }} />
                  </div>
                  <div>
                    <h4 className="theme-heading font-bold text-sm sm:text-base mb-1">{s.title}</h4>
                    <p className="theme-subtext text-xs sm:text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>

        </div>

        {/* Creator Journey Timeline */}
        <div className="pt-6 sm:pt-8">
          <RevealOnScroll className="section-header">
            <span className="section-label">// MILESTONES & JOURNEY</span>
            <h2 className="text-3xl sm:text-5xl font-bold theme-heading mb-4 sm:mb-6 section-title">
              From First Solo Trek to <span className="gradient-text">20K Explorers</span>
            </h2>
            <p className="section-desc">
              Building a vibrant community through raw passion for travel and genuine outdoor storytelling.
            </p>
          </RevealOnScroll>

          {/* Centered Timeline Stack */}
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-5 flex flex-col items-center">
            {TIMELINE.map((item, i) => (
              <RevealOnScroll key={item.year} delay={i * 0.04} className="w-full">
                <div className="glass-card glass-card-hover p-5 sm:p-7 rounded-2xl sm:rounded-3xl w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 border border-[var(--card-border)]">
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[var(--subtle-bg)] border border-[var(--card-border)] flex items-center justify-center text-xl sm:text-2xl shadow-sm">
                      {item.emoji}
                    </div>
                    <span className="font-mono text-[var(--accent)] text-base font-bold tracking-widest sm:hidden">
                      {item.year}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="hidden sm:block mb-1">
                      <span className="font-mono text-[var(--accent)] text-xs sm:text-sm font-bold tracking-widest uppercase">
                        // {item.year} MILESTONE
                      </span>
                    </div>
                    <p className="theme-subtext text-xs sm:text-base leading-relaxed">{item.event}</p>
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
