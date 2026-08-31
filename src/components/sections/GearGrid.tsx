"use client";

import RevealOnScroll from "@/components/ui/RevealOnScroll";
import TiltCard from "@/components/ui/TiltCard";
import { Camera, Compass, Video, Disc, Wrench, Shield, CheckCircle2, Tent, Radio } from "lucide-react";

const GEAR = [
  {
    category: "Cinema Line",
    name: "Sony FX3 Full-Frame",
    spec: "4K 120fps 10-bit 4:2:2 internal recording with active cooling fan for high altitudes",
    emoji: "📷",
    badge: "Primary A-Cam",
    color: "var(--accent)",
  },
  {
    category: "Optics",
    name: "Sony FE 24-70mm f/2.8 GM II",
    spec: "Flagship weather-sealed G-Master lens for razor sharp mountain and riding landscape details",
    emoji: "🔭",
    badge: "Hero Lens",
    color: "#f97316",
  },
  {
    category: "Aerial",
    name: "DJI Mavic 3 Pro Cine + FPV",
    spec: "Triple camera system + Hasselblad color science with 43min high-wind flight resistance",
    emoji: "🦅",
    badge: "Aerial Drone",
    color: "#818cf8",
  },
  {
    category: "Moto & Action",
    name: "GoPro Hero 13 Black Rig",
    spec: "HorizonLock + 5.3K 60fps helmet chin-mounted for high-speed Spiti Valley moto POV",
    emoji: "🏍️",
    badge: "Action Helmet Cam",
    color: "#ec4899",
  },
  {
    category: "Ridge Audio",
    name: "Rode Wireless PRO 32-Bit",
    spec: "Dual channel 32-bit float internal recording with high-wind deadcat furry shields",
    emoji: "🎙️",
    badge: "Windproof Audio",
    color: "#10b981",
  },
  {
    category: "Post Production",
    name: "DaVinci Resolve Studio 19",
    spec: "Custom ACES color grading node tree with customized film emulation and LUT design",
    emoji: "🎨",
    badge: "Color Suite",
    color: "#06b6d4",
  },
];

export default function GearGrid() {
  return (
    <section id="gear" className="section-wrapper">
      <div className="section-container">

        {/* Centered Section Header */}
        <RevealOnScroll className="section-header">
          <span className="section-label">// EXPEDITION PRODUCTION RIG</span>
          <h2 className="text-3xl sm:text-6xl md:text-7xl font-bold theme-heading mb-4 sm:mb-6 section-title">
            The Explorer <span className="gradient-text">Gear Arsenal</span>
          </h2>
          <p className="section-desc">
            All-weather cinema equipment engineered for sub-zero Himalayan blizzards, high-speed motorcycle touring, and remote solo expeditions.
          </p>
        </RevealOnScroll>

        {/* Gear Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {GEAR.map((item, i) => (
            <RevealOnScroll key={item.name} delay={i * 0.05}>
              <TiltCard className="glass-card glass-card-hover p-6 sm:p-8 rounded-[32px] flex flex-col justify-between h-full border border-[var(--card-border)]" intensity={8}>
                <div>
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <span className="text-4xl sm:text-5xl p-3 rounded-2xl bg-[var(--subtle-bg)] border border-[var(--card-border)]">{item.emoji}</span>
                    <span
                      className="text-[9px] sm:text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase"
                      style={{ background: item.color + "18", color: item.color, border: `1px solid ${item.color}35` }}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <span className="theme-muted text-[10px] font-mono uppercase tracking-wider block mb-1">{item.category}</span>
                  <h3 className="theme-heading font-bold text-base sm:text-lg mb-2">{item.name}</h3>
                  <p className="theme-subtext text-xs sm:text-sm leading-relaxed">{item.spec}</p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-6 border-t border-[var(--card-border)] text-xs font-mono">
                  <span className="text-[var(--accent)] font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> In Active Expedition Rig
                  </span>
                </div>
              </TiltCard>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
}
