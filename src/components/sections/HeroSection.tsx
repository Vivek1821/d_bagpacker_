"use client";

import { useEffect, useRef, useState } from "react";
import { Compass, Mountain, MapPin, Play, ChevronDown, ArrowUpRight, Flame } from "lucide-react";
import TravelAtmosphereCanvas from "@/components/ui/TravelAtmosphereCanvas";
import GlitchText from "@/components/ui/GlitchText";
import MagneticButton from "@/components/ui/MagneticButton";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import InstagramIcon from "@/components/ui/InstagramIcon";

const TYPEWRITER_TEXTS = [
  "Himalayan High-Altitude Explorer.",
  "Cinematic Travel Filmmaker.",
  "Solo Backpacking Documentarian.",
  "Rugged Outdoor Brand Storyteller.",
  "4K Drone Landscape Pilot.",
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
      typingRef.current = setTimeout(() => setDisplayed(currentText.slice(0, displayed.length + 1)), 65);
    } else if (!isDeleting && displayed.length === currentText.length) {
      typingRef.current = setTimeout(() => setIsDeleting(true), 2400);
    } else if (isDeleting && displayed.length > 0) {
      typingRef.current = setTimeout(() => setDisplayed(currentText.slice(0, displayed.length - 1)), 30);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setTypeIndex((prev) => (prev + 1) % TYPEWRITER_TEXTS.length);
    }
    return () => { if (typingRef.current) clearTimeout(typingRef.current); };
  }, [displayed, isDeleting, typeIndex]);

  const scrollToWork = () => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
  const scrollToContact = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative min-h-[95vh] sm:min-h-screen flex flex-col items-center justify-center overflow-hidden grid-bg pt-32 sm:pt-44 pb-24 sm:pb-36 px-4 sm:px-8 text-center">
      {/* Travel & Mountain Atmosphere Canvas (Elevation lines & mist particles) */}
      <TravelAtmosphereCanvas opacity={0.35} />

      {/* Atmospheric Mountain Sunrise Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 75% 55% at 50% 35%, var(--accent-glow) 0%, transparent 75%)",
        }}
      />

      {/* Center Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center">

        {/* GPS Altitude Coordinates & Expedition Badge */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 glass-card-sm rounded-full mb-8 sm:mb-10 border border-[var(--card-border)] shadow-lg px-4 py-2">
          <div className="flex items-center gap-1.5 text-[var(--accent)] font-mono text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: "20s" }} />
            <span>34°10&apos;N 77°35&apos;E</span>
          </div>
          <div className="hidden sm:block w-px h-3.5 bg-[var(--card-border)]" />
          <div className="flex items-center gap-1.5 theme-subtext text-xs font-mono">
            <Mountain className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>ALT 18,380 FT · HIMALAYAS</span>
          </div>
          <div className="w-px h-3.5 bg-[var(--card-border)]" />
          <a
            href="https://www.instagram.com/d_bagpacker_/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono text-[var(--accent)] hover:underline font-bold"
          >
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>@d_bagpacker_</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>

        {/* Main Display Headline */}
        <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.96] mb-5 sm:mb-6 text-center">
          <GlitchText text="BEYOND" trigger={glitchReady} className="block gradient-text" as="span" />
          <span className="block theme-heading my-2 sm:my-3">THE TRAIL.</span>
          <GlitchText text="D BAGPACKER." trigger={glitchReady} className="block gradient-text" as="span" />
        </h1>

        {/* Typewriter Subtitle Box */}
        <div className="h-10 sm:h-12 flex items-center justify-center my-2 sm:my-3 text-center">
          <p className="text-base sm:text-2xl md:text-3xl font-mono theme-subtext tracking-wider">
            {displayed}<span className="typewriter-cursor" />
          </p>
        </div>

        {/* Travel Narrative */}
        <p className="max-w-2xl mx-auto text-sm sm:text-lg theme-subtext leading-relaxed mb-10 sm:mb-12 font-normal text-center px-3">
          Documenting raw mountain summits, extreme backpacking expeditions, and cinematic drone landscapes across the globe.
          Turning extreme outdoor adventures into viral visual stories.
        </p>

        {/* Action Buttons - Including Direct Follow Link */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center mb-14 sm:mb-16 w-full sm:w-auto px-4 sm:px-0">
          <a
            href="https://www.instagram.com/d_bagpacker_/"
            target="_blank"
            rel="noopener noreferrer"
            className="neon-btn-filled w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2"
          >
            <InstagramIcon className="w-4 h-4" /> Follow @d_bagpacker_
          </a>
          <MagneticButton
            onClick={scrollToContact}
            id="hero-collab-cta"
            className="neon-btn w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2"
          >
            🤝 Book Expedition Collab
          </MagneticButton>
          <MagneticButton
            onClick={scrollToWork}
            id="hero-watch-cta"
            className="glass-card px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold theme-subtext hover:text-[var(--accent)] hover:border-[var(--accent)] w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5" fill="currentColor" /> Watch Travel Reels
          </MagneticButton>
        </div>

        {/* 3 Travel Metric Pillars */}
        <div className="grid grid-cols-3 gap-4 sm:gap-14 max-w-xl mx-auto w-full pt-8 sm:pt-10 border-t border-[var(--card-border)] mt-4">
          {[
            { value: 284, suffix: "K", label: "Travel Community" },
            { value: 47, suffix: "M+", label: "Expedition Views" },
            { value: 28, suffix: "+", label: "High Treks & Passes" },
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
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase">Explore Expeditions</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </button>
    </section>
  );
}
