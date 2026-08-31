"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, Sparkles, Activity, Play, Radio, Zap } from "lucide-react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

const SFX_PACKS = [
  { id: "whoosh", name: "Cinematic Whip Whoosh", type: "Transition", freq: [180, 850, 220], duration: 0.35, desc: "Fast-motion transition swipe for dynamic match-cuts" },
  { id: "impact", name: "Sub-Bass Heavy Hit", type: "Impact", freq: [120, 45], duration: 0.8, desc: "Deep 45Hz sub-bass hit for dramatic title drops" },
  { id: "shutter", name: "Sony FX3 Mechanical Shutter", type: "Foley", freq: [600, 300, 750], duration: 0.18, desc: "Crisp mechanical shutter click for freeze-frames" },
  { id: "riser", name: "Tension Pitch Riser", type: "Tension", freq: [80, 720], duration: 1.2, desc: "Build-up swell right before the 3-second hook drop" },
  { id: "glitch", name: "Cyber Glitch Blip", type: "Cyberpunk", freq: [900, 200, 1100], duration: 0.25, desc: "High-frequency digital texture for futuristic overlays" },
  { id: "cassette", name: "Analog Tape Stop", type: "Vintage", freq: [440, 110], duration: 0.5, desc: "Vinyl/tape motor drop for comedic pauses & beat switches" },
];

export default function SoundDesignLab() {
  const [activeSfx, setActiveSfx] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveHeights, setWaveHeights] = useState<number[]>(Array(32).fill(12));
  const audioCtxRef = useRef<AudioContext | null>(null);

  const triggerSfx = (sfx: typeof SFX_PACKS[0]) => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      setActiveSfx(sfx.id);
      setIsPlaying(true);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = sfx.id === "impact" ? "sine" : sfx.id === "shutter" ? "square" : "sawtooth";
      osc.frequency.setValueAtTime(sfx.freq[0], ctx.currentTime);

      if (sfx.freq.length > 1) {
        sfx.freq.slice(1).forEach((f, idx) => {
          osc.frequency.exponentialRampToValueAtTime(f, ctx.currentTime + (sfx.duration * (idx + 1)) / sfx.freq.length);
        });
      }

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + sfx.duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + sfx.duration);

      // Animate waveform
      const interval = setInterval(() => {
        setWaveHeights(Array.from({ length: 32 }, () => Math.floor(Math.random() * 48) + 8));
      }, 50);

      setTimeout(() => {
        clearInterval(interval);
        setWaveHeights(Array(32).fill(12));
        setIsPlaying(false);
      }, sfx.duration * 1000);
    } catch {
      setActiveSfx(sfx.id);
    }
  };

  return (
    <section className="section-wrapper bg-[#02050c]/60">
      <div className="section-container">
        {/* Centered Section Header */}
        <RevealOnScroll className="section-header">
          <span className="section-label">// INTERACTIVE AUDIO LAB</span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-6 section-title">
            Cinematic <span className="gradient-text">Sound Design</span>
          </h2>
          <p className="section-desc">
            Audio accounts for 50% of viral retention. Click to test the custom synthesized micro-SFX layers we build into our reels.
          </p>
        </RevealOnScroll>

        {/* Live Audio Visualizer Canvas Box */}
        <RevealOnScroll className="max-w-4xl mx-auto mb-14">
          <div className="glass-card-lg p-8 sm:p-12 rounded-[36px] flex flex-col items-center justify-center border border-[var(--card-border)] shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-3 mb-8">
              <Activity className="w-5 h-5 text-[var(--accent)] animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
                {isPlaying ? `PLAYING: ${SFX_PACKS.find(s => s.id === activeSfx)?.name}` : "FREQUENCY MONITOR READY"}
              </span>
            </div>

            {/* Visualizer Waveform */}
            <div className="h-20 flex items-center justify-center gap-1.5 sm:gap-2 w-full max-w-lg mb-8">
              {waveHeights.map((h, i) => (
                <div
                  key={i}
                  className="wave-bar"
                  style={{
                    height: `${h}px`,
                    opacity: isPlaying ? 0.9 : 0.25,
                    background: isPlaying ? "var(--accent-gradient)" : "rgba(255,255,255,0.2)",
                  }}
                />
              ))}
            </div>

            <p className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-2">
              <Radio className="w-4 h-4 text-[var(--accent)]" /> Synthesized via Web Audio Engine · 0ms Latency
            </p>
          </div>
        </RevealOnScroll>

        {/* Interactive Soundboard SFX Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {SFX_PACKS.map((sfx, i) => (
            <RevealOnScroll key={sfx.id} delay={i * 0.05}>
              <button
                onClick={() => triggerSfx(sfx)}
                className={`w-full text-left glass-card glass-card-hover p-7 rounded-3xl transition-all cursor-pointer border ${
                  activeSfx === sfx.id && isPlaying
                    ? "border-[var(--accent)] bg-[var(--accent-glow)] shadow-[0_0_30px_var(--accent-glow)]"
                    : "border-[var(--card-border)]"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="tag-pill text-[10px] uppercase font-mono">{sfx.type}</span>
                  <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--accent)]">
                    <Volume2 className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="text-white font-bold text-base mb-1.5">{sfx.name}</h4>
                <p className="text-white/45 text-xs leading-relaxed mb-4">{sfx.desc}</p>
                <div className="flex items-center justify-between text-xs font-mono text-[var(--accent)] pt-3 border-t border-white/5 font-semibold">
                  <span className="flex items-center gap-1.5"><Play className="w-3 h-3 fill-current" /> Play Sound Cue</span>
                  <span>{sfx.duration}s</span>
                </div>
              </button>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
