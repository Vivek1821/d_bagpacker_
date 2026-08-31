"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Tv2, TrendingUp, Play, ChevronDown } from "lucide-react";
import MatrixRain from "@/components/ui/MatrixRain";
import GlitchText from "@/components/ui/GlitchText";
import MagneticButton from "@/components/ui/MagneticButton";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const TYPEWRITER_TEXTS = [
  "Cinematic Storyteller.",
  "Visual Architect.",
  "Brand Collab Expert.",
  "Reel Creator.",
  "Viral Content Machine.",
];

export default function HeroSection() {
  const [typeIndex, setTypeIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [glitchReady, setGlitchReady] = useState(false);
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { setGlitchReady(true); }, []);

  useEffect(() => {
    const currentText = TYPEWRITER_TEXTS[typeIndex];
    if (!isDeleting && displayed.length < currentText.length) {
      typingRef.current = setTimeout(() => setDisplayed(currentText.slice(0, displayed.length + 1)), 75);
    } else if (!isDeleting && displayed.length === currentText.length) {
      typingRef.current = setTimeout(() => setIsDeleting(true), 2400);
    } else if (isDeleting && displayed.length > 0) {
      typingRef.current = setTimeout(() => setDisplayed(currentText.slice(0, displayed.length - 1)), 35);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setTypeIndex((prev) => (prev + 1) % TYPEWRITER_TEXTS.length);
    }
    return () => { if (typingRef.current) clearTimeout(typingRef.current); };
  }, [displayed, isDeleting, typeIndex]);

  const scrollToWork = () => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
  const scrollToContact = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative min-h-[90vh] sm:min-h-screen flex flex-col items-center justify-center overflow-hidden grid-bg pt-32 sm:pt-40 pb-24 sm:pb-32 px-4 sm:px-8 text-center">
      {/* Matrix background rain */}
      <MatrixRain opacity={0.1} />

      {/* Radial soft glow backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 45%, var(--accent-glow) 0%, transparent 70%)",
        }}
      />

      {/* Center Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center">

        {/* Live Reach Badge */}
        <div className="inline-flex items-center justify-center gap-3 sm:gap-4 glass-card-sm rounded-full mb-8 sm:mb-10 border border-[var(--card-border)] shadow-md">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-ping" />
            <span className="text-xs font-mono text-[var(--accent)] font-bold tracking-[0.2em] uppercase">Live</span>
          </div>
          <div className="w-px h-3.5 bg-[var(--card-border)]" />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--accent)]" />
            <span className="text-xs sm:text-sm theme-subtext font-medium font-mono">
              <AnimatedCounter target={284} suffix="K" className="text-[var(--accent)] font-bold" /> followers
            </span>
          </div>
          <div className="w-px h-3.5 bg-[var(--card-border)]" />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--accent)]" />
            <span className="text-xs sm:text-sm theme-subtext font-medium font-mono">
              <AnimatedCounter target={47} suffix="M+" className="text-[var(--accent)] font-bold" /> views
            </span>
          </div>
        </div>

        {/* Main Display Headline */}
        <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.98] mb-5 sm:mb-6 text-center">
          <GlitchText text="FRAME" trigger={glitchReady} className="block gradient-text" as="span" />
          <span className="block theme-heading my-2 sm:my-3">EVERY</span>
          <GlitchText text="STORY." trigger={glitchReady} className="block gradient-text" as="span" />
        </h1>

        {/* Typewriter Subtitle Box */}
        <div className="h-10 sm:h-12 flex items-center justify-center my-3 sm:my-4 text-center">
          <p className="text-lg sm:text-2xl md:text-3xl font-mono theme-subtext tracking-wider">
            {displayed}<span className="typewriter-cursor" />
          </p>
        </div>

        {/* Lead Narrative */}
        <p className="max-w-2xl mx-auto text-sm sm:text-lg theme-subtext leading-relaxed mb-10 sm:mb-12 font-normal text-center px-2">
          Crafting high-retention reels and cinematic commercial content that converts viewers into loyal fans.
          From 3-second psychological hooks to viral storytelling — every frame is intentional.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center mb-14 sm:mb-16 w-full sm:w-auto px-4 sm:px-0">
          <MagneticButton
            onClick={scrollToContact}
            id="hero-book-cta"
            className="neon-btn-filled w-full sm:w-auto cursor-pointer"
          >
            🤝 Book Collaboration
          </MagneticButton>
          <MagneticButton
            onClick={scrollToWork}
            id="hero-watch-cta"
            className="neon-btn w-full sm:w-auto cursor-pointer"
          >
            <Play className="w-4 h-4" fill="currentColor" /> Watch Portfolio
          </MagneticButton>
        </div>

        {/* 3 Large Stat Pillars */}
        <div className="grid grid-cols-3 gap-4 sm:gap-14 max-w-xl mx-auto w-full pt-8 sm:pt-10 border-t border-[var(--card-border)] mt-4">
          {[
            { value: 284, suffix: "K", label: "Followers" },
            { value: 47, suffix: "M+", label: "Total Views" },
            { value: 8, suffix: ".4%", label: "Avg Engagement" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="text-2xl sm:text-4xl font-bold neon-text font-mono">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[10px] sm:text-xs theme-muted font-mono mt-1.5 sm:mt-2 tracking-wider uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <button
        onClick={scrollToWork}
        className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-2 theme-muted hover:text-[var(--accent)] transition-all duration-300 cursor-pointer"
      >
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase">Explore Work</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </button>
    </section>
  );
}
