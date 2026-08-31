"use client";

import { useState } from "react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import TiltCard from "@/components/ui/TiltCard";
import { Camera, Mic, Cpu, Lightbulb, Sparkles } from "lucide-react";

const GEAR_CATEGORIES = ["All", "Camera", "Audio", "Editing", "Lighting", "Accessories"];

const GEAR = [
  {
    name: "Sony FX3 Cinema Line",
    category: "Camera",
    desc: "Full-frame cinema camera with dual base ISO (800/12,800), 4K 120fps 10-bit 4:2:2 internal recording and active cooling.",
    emoji: "📷",
    color: "#f97316",
    badge: "A-Cam Cinema",
  },
  {
    name: "Sony FE 24-70mm f/2.8 GM II",
    category: "Camera",
    desc: "Flagship G-Master standard zoom with extreme edge-to-edge sharpness, lightning AF, and creamy de-clicked aperture control.",
    emoji: "🔭",
    color: "#818cf8",
    badge: "Hero Lens",
  },
  {
    name: "DJI Ronin RS4 Pro Gimbal",
    category: "Camera",
    desc: "Carbon-fiber 3-axis stabilization gimbal with automated axis locks, LiDAR autofocus integration, and 4.5kg payload support.",
    emoji: "🎥",
    color: "#06b6d4",
    badge: "Stabilizer",
  },
  {
    name: "Rode Wireless PRO",
    category: "Audio",
    desc: "Dual transmitter wireless system with onboard 32-bit float backup recording, intelligent gain control, and 40-hour battery case.",
    emoji: "🎙️",
    color: "#ec4899",
    badge: "Wireless Audio",
  },
  {
    name: "Sennheiser MKH 416",
    category: "Audio",
    desc: "Industry-standard short gun interference tube microphone for crisp dialogue, voiceovers, and outdoor Foley capturing.",
    emoji: "🎚️",
    color: "#84cc16",
    badge: "Boom Shotgun",
  },
  {
    name: "Aputure LS 600d Pro Light",
    category: "Lighting",
    desc: "600W point-source daylight LED with Bowens mount, Sidus Link app wireless mesh control, and hyper-accurate CRI/TLCI 96+.",
    emoji: "💡",
    color: "#f59e0b",
    badge: "Key Light",
  },
  {
    name: "DaVinci Resolve Studio 19",
    category: "Editing",
    desc: "Hollywood-grade color grading suite and non-linear editor with AI Magic Mask, Voice Isolation, and custom ACES LUT workflows.",
    emoji: "🎨",
    color: "var(--accent)",
    badge: "Color & NLE",
  },
  {
    name: "Apple MacBook Pro 16\" (M3 Max)",
    category: "Editing",
    desc: "16-core CPU, 40-core GPU, 64GB Unified RAM workstation capable of rendering multi-stream 4K 10-bit ProRes timelines in real-time.",
    emoji: "💻",
    color: "#64748b",
    badge: "Workstation",
  },
  {
    name: "DJI Mavic 3 Pro Cine",
    category: "Accessories",
    desc: "Tri-camera drone with Hasselblad 4/3 CMOS primary lens, Apple ProRes 422 HQ recording, and omnidirectional obstacle sensing.",
    emoji: "🛸",
    color: "#a855f7",
    badge: "Aerial Drone",
  },
];

export default function GearGrid() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All" ? GEAR : GEAR.filter((g) => g.category === activeCategory);

  return (
    <section id="gear" className="section-wrapper">
      <div className="section-container">
        {/* Centered Section Header */}
        <RevealOnScroll className="section-header">
          <span className="section-label">// CINEMATIC TOOLKIT</span>
          <h2 className="text-3xl sm:text-6xl md:text-7xl font-bold theme-heading mb-4 sm:mb-6 section-title">
            Production <span className="gradient-text">Rig & Gear</span>
          </h2>
          <p className="section-desc">
            High-caliber cinema glass, 32-bit float audio, and high-performance color grading hardware powering every viral production.
          </p>
        </RevealOnScroll>

        {/* Category filter */}
        <RevealOnScroll className="flex flex-wrap gap-2.5 sm:gap-3.5 justify-center mb-12 sm:mb-16 px-2">
          {GEAR_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`tag-pill cursor-pointer transition-all duration-200 ${
                activeCategory === cat ? "active" : "opacity-65 hover:opacity-100"
              }`}
            >
              {cat === "Camera" && <Camera className="w-3.5 h-3.5 mr-1.5" />}
              {cat === "Audio" && <Mic className="w-3.5 h-3.5 mr-1.5" />}
              {cat === "Editing" && <Cpu className="w-3.5 h-3.5 mr-1.5" />}
              {cat === "Lighting" && <Lightbulb className="w-3.5 h-3.5 mr-1.5" />}
              {cat === "All" && <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
              {cat}
            </button>
          ))}
        </RevealOnScroll>

        {/* Gear cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((gear, i) => (
            <RevealOnScroll key={gear.name} delay={i * 0.04}>
              <TiltCard className="glass-card glass-card-hover rounded-3xl h-full flex flex-col justify-between" intensity={5}>
                <div>
                  <div className="flex items-start justify-between mb-5 sm:mb-6">
                    <div
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0"
                      style={{ background: gear.color + "15", border: `1px solid ${gear.color}30` }}
                    >
                      {gear.emoji}
                    </div>
                    <span
                      className="tag-pill text-[9px] sm:text-[10px] uppercase font-mono"
                      style={{
                        borderColor: gear.color + "40",
                        color: gear.color,
                        background: gear.color + "15",
                      }}
                    >
                      {gear.badge}
                    </span>
                  </div>

                  <h3 className="theme-heading font-bold text-base sm:text-lg mb-2">{gear.name}</h3>
                  <p className="theme-subtext text-xs sm:text-sm leading-relaxed mb-5">{gear.desc}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[var(--card-border)]">
                  <span className="text-[10px] sm:text-xs font-mono theme-muted uppercase tracking-wider">{gear.category}</span>
                  <span className="text-xs font-mono text-[var(--accent)] font-semibold flex items-center gap-1">
                    ✓ In Studio Rig
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
