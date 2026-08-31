"use client";

import { useState } from "react";
import {
  Play, Volume2, VolumeX, Heart, MessageCircle,
  Share2, ChevronUp, ChevronDown, Bookmark, Repeat2
} from "lucide-react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

const REELS = [
  {
    id: 1,
    title: "Golden Hour Cinematic Bali",
    tag: "Cinematic B-roll",
    plays: "5.2M",
    likes: "421K",
    comments: "12.4K",
    shares: "38K",
    duration: "0:32",
    color: "from-amber-950 via-orange-950 to-rose-950",
    accentColor: "#f97316",
    emoji: "🌅",
    username: "@vivek.creates",
    caption: "Golden hour in Bali hits different when you know where to be 🌅 Shot on Sony FX3 with a 24mm f/1.4 GM lens.",
    audio: "Original Audio · Vivek Creates",
  },
  {
    id: 2,
    title: "OnePlus Open Unboxing Hook",
    tag: "UGC · Product",
    plays: "3.8M",
    likes: "198K",
    comments: "8.1K",
    shares: "21K",
    duration: "0:45",
    color: "from-blue-950 via-indigo-950 to-violet-950",
    accentColor: "#818cf8",
    emoji: "📱",
    username: "@vivek.creates",
    caption: "They said this foldable would replace my daily workstation setup. They were right. 📱 [ad] @oneplus #OnePlusOpen",
    audio: "Trending Audio: High Retention Beat",
  },
  {
    id: 3,
    title: "Day in My Life — Full-Time Creator",
    tag: "Lifestyle · Vlog",
    plays: "7.1M",
    likes: "562K",
    comments: "18.3K",
    shares: "76K",
    duration: "0:59",
    color: "from-green-950 via-emerald-950 to-teal-950",
    accentColor: "#10b981",
    emoji: "🎬",
    username: "@vivek.creates",
    caption: "POV: A realistic 14-hour day in the life as a full-time content creator in Mumbai 🎥 Would you trade the 9-to-5?",
    audio: "Original Audio · Vivek Creates",
  },
  {
    id: 4,
    title: "Mumbai Monsoon in 4K Slow Motion",
    tag: "Cinematic · Travel",
    plays: "4.4M",
    likes: "334K",
    comments: "9.7K",
    shares: "42K",
    duration: "0:38",
    color: "from-slate-900 via-blue-950 to-indigo-950",
    accentColor: "#60a5fa",
    emoji: "🌧️",
    username: "@vivek.creates",
    caption: "Mumbai during the monsoons is pure cinematic poetry. No colour filter needed 🌧️ Shot at 120fps.",
    audio: "Clair de Lune — Debussy (Slowed Reverb)",
  },
];

export default function ReelPlayer() {
  const [currentReel, setCurrentReel] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState<number[]>([]);
  const [saved, setSaved] = useState<number[]>([]);

  const goNext = () => setCurrentReel((p) => Math.min(p + 1, REELS.length - 1));
  const goPrev = () => setCurrentReel((p) => Math.max(p - 1, 0));
  const toggleLike = (id: number) => setLiked((p) => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleSave = (id: number) => setSaved((p) => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const reel = REELS[currentReel];

  return (
    <section id="reels" className="section-wrapper">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 65% 50% at 50% 50%, var(--accent-glow) 0%, transparent 70%)",
        }}
      />

      <div className="section-container">

        {/* Section Header */}
        <RevealOnScroll className="section-header">
          <span className="section-label">// 9:16 VERTICAL SIMULATOR</span>
          <h2 className="text-3xl sm:text-6xl md:text-7xl font-bold theme-heading mb-4 sm:mb-6 section-title">
            Native <span className="gradient-text">9:16 Reel Feed</span>
          </h2>
          <p className="section-desc">
            Scroll through selected high-performing reels — simulated exactly as they appear inside Instagram with live engagement metrics.
          </p>
        </RevealOnScroll>

        {/* Main Grid: Phone simulator on left, list on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* Left Column: 9:16 Phone frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative">
              <div
                className="relative w-[280px] h-[580px] sm:w-[320px] sm:h-[660px] rounded-[44px] sm:rounded-[48px] overflow-hidden border-4 sm:border-8 border-[var(--card-border)] shadow-2xl"
                style={{ background: "#030712" }}
              >
                {/* Dynamic island / top notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 sm:w-28 h-5 sm:h-6 bg-black rounded-full z-30 flex items-center justify-center gap-2 border border-white/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-black border border-white/20" />
                </div>

                {/* Reel visual background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${reel.color} transition-all duration-700 cursor-pointer`}
                  onClick={() => setPlaying(!playing)}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[120px] sm:text-[140px] select-none opacity-20 filter blur-sm">{reel.emoji}</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[70px] sm:text-[80px] select-none opacity-50">{reel.emoji}</span>
                  </div>

                  {/* Play/Pause Overlay */}
                  {!playing && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
                        <Play className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--accent)] ml-1" fill="currentColor" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Reel top bar */}
                <div className="absolute top-10 sm:top-12 left-4 right-14 z-20 flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-[#030712] font-bold text-xs flex-shrink-0 shadow-md">
                    V
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-xs font-bold truncate">{reel.username}</p>
                  </div>
                  <span className="ml-auto bg-[var(--accent)] text-[#030712] text-[9px] sm:text-[10px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0">
                    Follow
                  </span>
                </div>

                {/* Audio Mute button */}
                <div className="absolute top-10 sm:top-12 right-4 z-20">
                  <button
                    onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/10"
                  >
                    {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[var(--accent)]" />}
                  </button>
                </div>

                {/* Reel Bottom Information */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-5 pb-6 sm:pb-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                  <div className="mb-2">
                    <span
                      className="text-[9px] sm:text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase"
                      style={{ background: reel.accentColor + "30", color: "#fff", border: `1px solid ${reel.accentColor}50` }}
                    >
                      {reel.tag}
                    </span>
                  </div>
                  <p className="text-white text-xs sm:text-sm leading-snug font-medium mb-2 line-clamp-2">{reel.caption}</p>
                  <div className="flex items-center gap-2 text-white/70 text-[10px] sm:text-[11px] font-mono">
                    <span>🎵</span>
                    <span className="truncate">{reel.audio}</span>
                  </div>
                  <p className="text-white/40 text-[10px] font-mono mt-1">{reel.plays} views · {reel.duration}</p>
                </div>

                {/* Right Floating Actions */}
                <div className="absolute right-2.5 sm:right-3 bottom-20 sm:bottom-24 z-20 flex flex-col items-center gap-4 sm:gap-5">
                  <button onClick={() => toggleLike(reel.id)} className="flex flex-col items-center gap-1 cursor-pointer">
                    <Heart className={`w-5 h-5 sm:w-6 sm:h-6 transition-all ${liked.includes(reel.id) ? "text-rose-500 fill-rose-500 scale-110" : "text-white"}`} />
                    <span className="text-white text-[9px] sm:text-[10px] font-mono">{reel.likes}</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 cursor-pointer">
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    <span className="text-white text-[9px] sm:text-[10px] font-mono">{reel.comments}</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 cursor-pointer">
                    <Repeat2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    <span className="text-white text-[9px] sm:text-[10px] font-mono">{reel.shares}</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 cursor-pointer">
                    <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    <span className="text-white text-[9px] sm:text-[10px] font-mono">Share</span>
                  </button>
                  <button onClick={() => toggleSave(reel.id)} className="cursor-pointer">
                    <Bookmark className={`w-5 h-5 sm:w-6 sm:h-6 ${saved.includes(reel.id) ? "text-[var(--accent)] fill-[var(--accent)]" : "text-white"}`} />
                  </button>
                </div>

                {/* Previous / Next Arrows */}
                <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2.5">
                  <button onClick={goPrev} disabled={currentReel === 0} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center disabled:opacity-20 transition-all cursor-pointer">
                    <ChevronUp className="w-4 h-4 text-white" />
                  </button>
                  <button onClick={goNext} disabled={currentReel === REELS.length - 1} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center disabled:opacity-20 transition-all cursor-pointer">
                    <ChevronDown className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Backlight Ambient Glow */}
              <div
                className="absolute inset-0 rounded-[48px] blur-3xl -z-10 opacity-20 transition-all duration-700"
                style={{ background: reel.accentColor }}
              />
            </div>
          </div>

          {/* Right Column: Interactive Playlist Selector */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <p className="section-label mb-4 sm:mb-6">// SELECT REEL TO PREVIEW</p>
            <div className="space-y-3 sm:space-y-4">
              {REELS.map((r, i) => (
                <button
                  key={r.id}
                  onClick={() => setCurrentReel(i)}
                  className={`w-full text-left glass-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex items-center gap-4 sm:gap-6 transition-all duration-300 cursor-pointer ${
                    i === currentReel
                      ? "border-[var(--accent)] shadow-md"
                      : "glass-card-hover opacity-80 hover:opacity-100"
                  }`}
                >
                  <div
                    className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 shadow-sm"
                    style={{ background: r.accentColor + "20", border: `1px solid ${r.accentColor}35`, width: "56px", height: "56px" }}
                  >
                    {r.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="theme-heading font-bold text-sm sm:text-base truncate">{r.title}</span>
                      {i === currentReel && <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping flex-shrink-0" />}
                    </div>
                    <div className="flex items-center gap-3 text-xs theme-muted font-mono">
                      <span className="text-[var(--accent)] font-semibold">{r.plays} views</span>
                      <span>·</span>
                      <span>{r.likes} likes</span>
                      <span>·</span>
                      <span>{r.duration}</span>
                    </div>
                  </div>
                  <span
                    className="text-[9px] sm:text-[10px] font-mono font-bold px-2.5 sm:px-3 py-1 rounded-full uppercase flex-shrink-0 hidden sm:inline-block"
                    style={{ background: r.accentColor + "20", color: r.accentColor, border: `1px solid ${r.accentColor}35` }}
                  >
                    {r.tag.split(" · ")[0]}
                  </span>
                </button>
              ))}
            </div>

            {/* Performance Summary Cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-5 pt-4 sm:pt-6">
              {[
                { label: "Reels Made", value: "500+" },
                { label: "Avg Views", value: "1.8M" },
                { label: "3s Hook Rate", value: "94.2%" },
              ].map((s) => (
                <div key={s.label} className="glass-card p-3 sm:p-5 rounded-2xl text-center">
                  <div className="text-lg sm:text-2xl font-bold neon-text font-mono">{s.value}</div>
                  <div className="text-[10px] sm:text-[11px] theme-muted font-mono mt-1 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
