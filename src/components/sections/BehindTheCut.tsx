"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Sliders, Sparkles, Wand2, Compass } from "lucide-react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function BehindTheCut() {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPos(percent);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleTouchMove = (e: React.TouchEvent) => updatePosition(e.touches[0].clientX);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) updatePosition(e.clientX);
    };
    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, updatePosition]);

  return (
    <section id="casestudy" className="section-wrapper">
      <div className="section-container">

        {/* Centered Section Header */}
        <RevealOnScroll className="section-header">
          <span className="section-label">// CINEMA COLOR PIPELINE</span>
          <h2 className="text-3xl sm:text-6xl md:text-7xl font-bold theme-heading mb-4 sm:mb-6 section-title">
            Raw Log <span className="gradient-text">vs ACES Color Grade</span>
          </h2>
          <p className="section-desc">
            Drag the interactive slider to see how raw 10-bit S-Log3 footage is transformed into cinematic mountain and riding grades.
          </p>
        </RevealOnScroll>

        {/* Split Comparison Canvas */}
        <RevealOnScroll className="max-w-4xl mx-auto">
          <div
            ref={containerRef}
            className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-[32px] sm:rounded-[40px] overflow-hidden border border-[var(--card-border)] shadow-2xl cursor-ew-resize select-none"
            onMouseDown={handleMouseDown}
            onTouchMove={handleTouchMove}
          >
            {/* RIGHT SIDE: Final Master Grade */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-950/90 via-slate-900 to-indigo-950/90 flex items-center justify-center">
              <div className="text-center p-6 space-y-2">
                <span className="text-6xl sm:text-8xl select-none block filter drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                  🏔️
                </span>
                <p className="text-sm sm:text-base font-bold text-amber-200">Final ACES 4K Master Grade</p>
                <p className="text-xs font-mono text-amber-300/70">Warm Sunset Tone + High Dynamic Range</p>
              </div>

              {/* Tag right */}
              <div className="absolute top-4 right-4 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase backdrop-blur-md">
                Graded Cinema Master
              </div>
            </div>

            {/* LEFT SIDE: Flat S-Log3 Raw */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden bg-slate-900/95 flex items-center justify-center border-r-2 border-[var(--accent)]"
              style={{ width: `${sliderPos}%` }}
            >
              <div
                className="absolute inset-y-0 flex items-center justify-center"
                style={{ width: containerRef.current?.offsetWidth || "100%" }}
              >
                <div className="text-center p-6 space-y-2 grayscale opacity-55">
                  <span className="text-6xl sm:text-8xl select-none block">🏔️</span>
                  <p className="text-sm sm:text-base font-bold text-slate-300">Raw S-Log3 10-bit Capture</p>
                  <p className="text-xs font-mono text-slate-400">Flat Dynamic Curve / Uncorrected</p>
                </div>
              </div>

              {/* Tag left */}
              <div className="absolute top-4 left-4 bg-white/10 text-white/80 border border-white/20 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase backdrop-blur-md">
                Raw S-Log3 Capture
              </div>
            </div>

            {/* Draggable Divider Handle */}
            <div
              className="absolute inset-y-0 -ml-4 w-8 flex items-center justify-center pointer-events-none z-30"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-[#030712] shadow-[0_0_20px_var(--accent-glow)] flex items-center justify-center font-bold text-xs">
                ⇄
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono theme-muted mt-4 px-2">
            <span>◄ Drag Left: Raw Sensor Log</span>
            <span>Drag Right: Master ACES Cinema Color ►</span>
          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
}
