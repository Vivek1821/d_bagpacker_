"use client";

import { useState, useRef, useCallback } from "react";
import { GripVertical, Sparkles } from "lucide-react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

const SCENES = [
  {
    id: 1,
    title: "Golden Hour Bali",
    raw: { emoji: "🌅", label: "S-LOG3 RAW", desc: "Flat, desaturated Log3 footage straight from Sony FX3 sensor", color: "#251b10" },
    final: { emoji: "✨", label: "CINEMATIC GRADE", desc: "Custom teal & orange LUT with rolled off highlights & rich skin tones", color: "#180a04" },
  },
  {
    id: 2,
    title: "Monsoon Mumbai",
    raw: { emoji: "🌧️", label: "NATURAL LOG", desc: "Overcast flat lighting with muted contrast & neutral shadows", color: "#101620" },
    final: { emoji: "🌊", label: "MOODY TEAL", desc: "High contrast cyberpunk mood with reflective rain bloom & cyan glow", color: "#060b14" },
  },
  {
    id: 3,
    title: "Urban Night Drift",
    raw: { emoji: "🌆", label: "HIGH ISO LOG", desc: "Ungraded 12,800 ISO night footage with elevated ambient noise", color: "#181422" },
    final: { emoji: "🌃", label: "NEON MATRIX", desc: "Noise reduction + deep blacks + neon green/magenta separation", color: "#0a0614" },
  },
];

export default function BehindTheCut() {
  const [sliderX, setSliderX] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [activeScene, setActiveScene] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scene = SCENES[activeScene];

  const updateSlider = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setSliderX(Math.min(95, Math.max(5, x)));
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) updateSlider(e.clientX);
    },
    [isDragging, updateSlider]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isDragging) updateSlider(e.touches[0].clientX);
    },
    [isDragging, updateSlider]
  );

  return (
    <section id="casestudy" className="section-wrapper">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 65% 45% at 50% 50%, var(--accent-glow) 0%, transparent 70%)",
        }}
      />

      <div className="section-container">
        {/* Centered Section Header */}
        <RevealOnScroll className="section-header">
          <span className="section-label">// POST-PRODUCTION MASTERY</span>
          <h2 className="text-3xl sm:text-6xl md:text-7xl font-bold theme-heading mb-4 sm:mb-6 section-title">
            Raw vs. <span className="gradient-text">Graded</span>
          </h2>
          <p className="section-desc">
            Drag the interactive slider to compare raw camera S-Log sensor data with the final DaVinci Resolve color grade.
          </p>
        </RevealOnScroll>

        {/* Scene selector */}
        <RevealOnScroll className="flex flex-wrap gap-2.5 sm:gap-3.5 justify-center mb-10 sm:mb-14 px-2">
          {SCENES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setActiveScene(i); setSliderX(50); }}
              className={`tag-pill cursor-pointer transition-all duration-300 ${
                activeScene === i
                  ? "active"
                  : "opacity-65 hover:opacity-100"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 opacity-80" />
              {s.title}
            </button>
          ))}
        </RevealOnScroll>

        {/* Comparison Canvas */}
        <RevealOnScroll className="max-w-5xl mx-auto">
          <div
            ref={containerRef}
            className="relative h-[340px] sm:h-[540px] rounded-[28px] sm:rounded-[36px] overflow-hidden cursor-ew-resize select-none border border-[var(--card-border)] shadow-2xl"
            onMouseMove={onMouseMove}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchMove={onTouchMove}
            onTouchEnd={() => setIsDragging(false)}
          >
            {/* Final (right side - full background) */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: scene.final.color }}
            >
              <div className="text-center p-4 sm:p-6">
                <span className="text-[100px] sm:text-[160px] block filter drop-shadow-2xl select-none">{scene.final.emoji}</span>
                <div className="glass-card-sm px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl mt-2 sm:mt-4 inline-block backdrop-blur-xl border border-[var(--card-border)]">
                  <p className="text-[var(--accent)] font-mono text-xs font-bold tracking-widest uppercase">{scene.final.label}</p>
                  <p className="text-white/80 text-xs mt-1 max-w-[240px] leading-relaxed hidden sm:block">{scene.final.desc}</p>
                </div>
              </div>
              {/* Corner label */}
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 glass-card-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-[var(--card-border)]">
                <span className="text-[var(--accent)] text-[10px] sm:text-xs font-mono tracking-wider font-semibold">GRADED MASTER</span>
              </div>
            </div>

            {/* Raw (left side, clipped) */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                clipPath: `polygon(0 0, ${sliderX}% 0, ${sliderX}% 100%, 0 100%)`,
                background: scene.raw.color,
              }}
            >
              <div className="text-center p-4 sm:p-6" style={{ filter: "grayscale(85%) contrast(0.9) brightness(1.05)" }}>
                <span className="text-[100px] sm:text-[160px] block select-none opacity-80">{scene.raw.emoji}</span>
                <div className="glass-card-sm px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl mt-2 sm:mt-4 inline-block backdrop-blur-xl border border-[var(--card-border)]">
                  <p className="text-white/90 font-mono text-xs font-bold tracking-widest uppercase">{scene.raw.label}</p>
                  <p className="text-white/60 text-xs mt-1 max-w-[240px] leading-relaxed hidden sm:block">{scene.raw.desc}</p>
                </div>
              </div>
              {/* Corner label */}
              <div className="absolute top-4 sm:top-6 left-4 sm:left-6 glass-card-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-[var(--card-border)]">
                <span className="text-white/80 text-[10px] sm:text-xs font-mono tracking-wider font-semibold">RAW S-LOG3</span>
              </div>
            </div>

            {/* Drag Handle Bar */}
            <div
              className="split-slider-handle"
              style={{ left: `${sliderX}%` }}
            >
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--bg-primary)] border-2 border-[var(--accent)] flex items-center justify-center shadow-lg"
              >
                <GripVertical className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--accent)]" />
              </div>
            </div>
          </div>

          {/* Slider position text */}
          <div className="mt-4 sm:mt-6 text-center text-xs font-mono theme-muted tracking-wider">
            ← DRAG SLIDER TO REVEAL → &nbsp;|&nbsp; {Math.round(sliderX)}% S-LOG
          </div>
        </RevealOnScroll>

        {/* Workflow Badges */}
        <RevealOnScroll className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto mt-12 sm:mt-16">
          {[
            { label: "Grading Engine", value: "DaVinci Studio 19" },
            { label: "Color Space", value: "ACEScct / Rec.709" },
            { label: "Mastering Resolution", value: "4K DCI (4096x2160)" },
            { label: "Audio Science", value: "Dolby Atmos 5.1" },
          ].map((item) => (
            <div key={item.label} className="glass-card glass-card-hover p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-center">
              <p className="text-[var(--accent)] font-bold text-xs sm:text-sm font-mono">{item.value}</p>
              <p className="theme-muted text-[10px] sm:text-xs font-mono mt-1 tracking-wider uppercase">{item.label}</p>
            </div>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
