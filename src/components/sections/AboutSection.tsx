"use client";

import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { Zap, Video, Camera, Globe, Award, Coffee, MapPin, ExternalLink } from "lucide-react";

const TIMELINE = [
  { year: "2019", event: "Started shooting mobile travel vlogs on a OnePlus 7 Pro. First reel reached 10K views organically.", emoji: "📱" },
  { year: "2020", event: "Lockdown pivot — switched to full creator content. First viral reel hit 500K views in 3 days.", emoji: "🔥" },
  { year: "2021", event: "Invested in Sony A7III + Sigma 18-35mm. Hit 50K followers and signed first paid brand partnership.", emoji: "📷" },
  { year: "2022", event: "First 5-figure brand deal with OnePlus India. Crossed 100K followers. Built dedicated studio setup.", emoji: "🤝" },
  { year: "2023", event: "Upgraded to Sony FX3 Cinema line. Launched YouTube channel. Hit 200K IG & 20K YT in 8 months.", emoji: "🚀" },
  { year: "2024", event: "250K IG followers, 40M+ total views, 80+ brand deals. First international shoot — Bali with DJI Global.", emoji: "⚡" },
  { year: "2025", event: "Full-time cinematic creator. 284K IG, 52K YT, 47M+ total views. Available for premium brand collabs.", emoji: "🎬" },
];

const SERVICES = [
  {
    icon: Video,
    title: "Cinematic Reel Production",
    desc: "End-to-end production — scripting, location scouting, shooting on Sony FX3, color grading in DaVinci, sound design. Deliverable in 7–10 days.",
    color: "var(--accent)",
  },
  {
    icon: Camera,
    title: "Brand Collaborations",
    desc: "Authentic sponsored content built around your brand story — not just a tag. Full usage rights, whitelisting, and performance reporting available.",
    color: "#f97316",
  },
  {
    icon: Globe,
    title: "UGC Content Packages",
    desc: "Studio-quality UGC for performance ads — unboxings, product reviews, testimonials. Shot for conversions, not just aesthetics.",
    color: "#818cf8",
  },
  {
    icon: Award,
    title: "Creative Direction",
    desc: "Concept development, shot lists, storyboards, and campaign strategy. I can also brief and direct a team for larger productions.",
    color: "#06b6d4",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="section-wrapper">
      <div className="section-container">

        {/* Centered Section Header */}
        <RevealOnScroll className="section-header">
          <span className="section-label">// THE CREATOR STORY</span>
          <h2 className="text-3xl sm:text-6xl md:text-7xl font-bold theme-heading mb-4 sm:mb-6 section-title">
            Built Frame <span className="gradient-text">By Frame</span>
          </h2>
          <p className="section-desc">
            From a smartphone camera in a bedroom to a full cinema production setup — here is the story behind the work.
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
                      🎬
                    </div>
                    <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[var(--accent)] flex items-center justify-center shadow-sm">
                      <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#030712]" fill="#030712" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold theme-heading">Vivek Creates</h3>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[var(--accent)] font-mono text-xs mt-1">
                      <Camera className="w-3.5 h-3.5" />
                      <span>@vivek.creates</span>
                      <span className="theme-muted mx-1">·</span>
                      <MapPin className="w-3.5 h-3.5 theme-muted" />
                      <span className="theme-muted">Mumbai, India</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3.5 theme-subtext leading-relaxed text-sm sm:text-base">
                  <p>
                    I am a full-time cinematic creator specializing in <span className="theme-heading font-semibold">high-retention reels, brand-aligned visual storytelling, and commercial UGC</span>. Operating an in-house Sony FX3 cinema rig creating 500+ pieces of content annually.
                  </p>
                  <p>
                    My philosophy combines <span className="text-[var(--accent)] font-semibold">cinematic artistry</span> with viral conversion psychology. Partnering brands average <span className="text-[var(--accent)] font-bold">4.2× ROI</span> on dedicated campaigns.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-3 border-t border-[var(--card-border)]">
                  <div className="glass-card-sm flex items-center gap-2 text-xs font-mono theme-subtext">
                    <Coffee className="w-3.5 h-3.5 text-[var(--accent)]" />
                    Available for Q4 2025 / Q1 2026
                  </div>
                  <a
                    href="mailto:hello@vivekcreates.in"
                    className="glass-card-sm flex items-center gap-2 text-xs font-mono text-[var(--accent)] hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    hello@vivekcreates.in
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Right: Services Stack */}
          <div className="lg:col-span-6 space-y-3.5 sm:space-y-4">
            <p className="section-label mb-3 sm:mb-4">// SERVICES & DELIVERABLES</p>
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
            <span className="section-label">// CREATOR JOURNEY & MILESTONES</span>
            <h2 className="text-3xl sm:text-5xl font-bold theme-heading mb-4 sm:mb-6 section-title">
              From Day One to <span className="gradient-text">284K Fans</span>
            </h2>
            <p className="section-desc">
              Every milestone achieved through consistent production and audience dedication.
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
