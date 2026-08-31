"use client";

import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { Compass, Mountain, Video, MapPin, ArrowUpRight, Flame, Tent } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";

const TIMELINE = [
  { year: "2019", event: "First solo trek across the Western Ghats with a basic smartphone. Documented raw monsoon trails and hit 20K views.", emoji: "🥾" },
  { year: "2020", event: "Started high-altitude backpacking. First viral Himalayan trek reel crossed 1.2M views in 48 hours.", emoji: "🏔️" },
  { year: "2021", event: "Invested in full cinema kit + drone setup. Signed first outdoor brand sponsorship with leading hiking apparel.", emoji: "📷" },
  { year: "2022", event: "Completed 14 high Himalayan passes over 15,000ft (Khardung La, Chang La, Rohtang). Crossed 100K community.", emoji: "⛰️" },
  { year: "2023", event: "Sony FX3 cinema line upgrade. Shot winter Spiti at -18°C. Crossed 200K followers on @d_bagpacker_.", emoji: "❄️" },
  { year: "2024", event: "International expedition shoot — Bali volcanic crater drone run + northeast India backpacking doc series. 40M+ views.", emoji: "🌋" },
  { year: "2025", event: "Full-time adventure filmmaker. 284K+ community. Collaborating with global outdoor, tech, and travel brands.", emoji: "🏕️" },
];

const SERVICES = [
  {
    icon: Mountain,
    title: "Extreme Expedition Filmmaking",
    desc: "End-to-end 4K 120fps production in rugged terrain, sub-zero temperatures, and high altitudes. From Himalayan summits to coastal cliffs.",
    color: "var(--accent)",
  },
  {
    icon: Tent,
    title: "Outdoor & Tech Brand Collabs",
    desc: "Authentic, high-retention sponsored integration showcasing your gear in real-world extreme environments — not staged studio shots.",
    color: "#f97316",
  },
  {
    icon: Video,
    title: "Cinematic Drone Aerials",
    desc: "Licensed cinematic aerial cinematography capturing sweeping mountain ridges, dramatic sunset peaks, and epic landscape scale.",
    color: "#818cf8",
  },
  {
    icon: Compass,
    title: "Tourism & Destination Campaigns",
    desc: "High-impact visual tourism storytelling for state tourism boards, luxury eco-resorts, and adventure travel agencies.",
    color: "#06b6d4",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="section-wrapper">
      <div className="section-container">

        {/* Centered Section Header */}
        <RevealOnScroll className="section-header">
          <span className="section-label">// THE EXPLORER STORY</span>
          <h2 className="text-3xl sm:text-6xl md:text-7xl font-bold theme-heading mb-4 sm:mb-6 section-title">
            Forged On <span className="gradient-text">The Summit</span>
          </h2>
          <p className="section-desc">
            From solo budget backpacking across India to full cinema expeditions at 18,000+ feet — here is the story of D Bagpacker.
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
                    <h3 className="text-xl sm:text-2xl font-bold theme-heading">Vivek | D Bagpacker</h3>
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
                      <span className="theme-muted">India / Global</span>
                    </a>
                  </div>
                </div>

                <div className="space-y-3.5 theme-subtext leading-relaxed text-sm sm:text-base">
                  <p>
                    I am an adventure filmmaker and extreme travel creator known online as <span className="text-[var(--accent)] font-bold">@d_bagpacker_</span>. Specializing in <span className="theme-heading font-semibold">high-altitude Himalayan treks, cinematic drone landscapes, and solo backpacking documentaries</span>.
                  </p>
                  <p>
                    I operate an all-weather cinema rig capable of capturing 4K 120fps HDR in -20°C blizzards and high-altitude hypoxia zones. Brand partnerships average <span className="text-[var(--accent)] font-bold">4.2× engagement ROI</span> due to genuine outdoor credibility.
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
                    Follow on Instagram
                  </a>
                  <div className="glass-card-sm flex items-center gap-2 text-xs font-mono theme-subtext">
                    <Tent className="w-3.5 h-3.5 text-[var(--accent)]" />
                    Available for Q4 2025 / Q1 2026 Expeditions
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Right: Services Stack */}
          <div className="lg:col-span-6 space-y-3.5 sm:space-y-4">
            <p className="section-label mb-3 sm:mb-4">// ADVENTURE SERVICES & SCOPE</p>
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
            <span className="section-label">// EXPEDITION MILESTONES</span>
            <h2 className="text-3xl sm:text-5xl font-bold theme-heading mb-4 sm:mb-6 section-title">
              From Western Ghats to <span className="gradient-text">284K Explorers</span>
            </h2>
            <p className="section-desc">
              Every summit conquered through discipline, high-altitude endurance, and visual excellence.
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
                        // {item.year} EXPEDITION
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
