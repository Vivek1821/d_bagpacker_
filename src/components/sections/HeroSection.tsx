"use client";

import { useEffect, useRef, useState } from "react";
import { Compass, Mountain, MapPin, Play, ChevronDown, ArrowUpRight, Flame, Heart, Tent, Sparkles } from "lucide-react";
import TravelAtmosphereCanvas from "@/components/ui/TravelAtmosphereCanvas";
import GlitchText from "@/components/ui/GlitchText";
import MagneticButton from "@/components/ui/MagneticButton";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import InstagramIcon from "@/components/ui/InstagramIcon";

const TYPEWRITER_TEXTS = [
  "Solo Backpacker & Explorer 🇮🇳",
  "Sahyadri Treks & Monsoon Trails.",
  "Coastal Roadtrips & Moto Adventures.",
  "Heritage Forts, Nature & Waterfalls.",
  "Raw Travel Documentaries.",
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
    <section className="relative min-h-[95vh] sm:min-h-screen flex flex-col items-center justify-center overflow-hidden grid-bg pt-28 sm:pt-44 pb-20 sm:pb-36 px-3 sm:px-8 text-center min-w-0">
      {/* Travel & Nature Atmosphere Canvas (Contour curves & mist particles) */}
      <TravelAtmosphereCanvas opacity={0.35} />

      {/* Atmospheric Sunrise Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 75% 55% at 50% 35%, var(--accent-glow) 0%, transparent 75%)",
        }}
      />

      {/* Center Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center">

        {/* Real Profile Milestone & Indian Explorer Badge */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 glass-card-sm rounded-full mb-6 sm:mb-10 border border-[var(--card-border)] shadow-lg px-3.5 py-1.5 sm:py-2 max-w-full">
          <div className="flex items-center gap-1.5 text-[var(--accent)] font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" style={{ animationDuration: "20s" }} />
            <span>EXPLORING INCREDIBLE INDIA 🇮🇳</span>
          </div>
          <div className="hidden sm:block w-px h-3.5 bg-[var(--card-border)]" />
          <div className="flex items-center gap-1.5 theme-subtext text-[10px] sm:text-xs font-mono">
            <Sparkles className="w-3 h-3 text-[var(--accent)]" />
            <span>20K+ COMMUNITY · 300+ POSTS</span>
          </div>
          <div className="w-px h-3.5 bg-[var(--card-border)]" />
          <a
            href="https://www.instagram.com/d_bagpacker_/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] sm:text-xs font-mono text-[var(--accent)] hover:underline font-bold"
          >
            <InstagramIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>@d_bagpacker_</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>

        {/* Main Display Headline with Trailing Underscore */}
        <h1 className="text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.96] mb-4 sm:mb-6 text-center">
          <GlitchText text="UNPACK" trigger={glitchReady} className="block gradient-text" as="span" />
          <span className="block theme-heading my-1.5 sm:my-3">THE ADVENTURE.</span>
          <GlitchText text="D_BAGPACKER_" trigger={glitchReady} className="block gradient-text" as="span" />
        </h1>

        {/* Typewriter Subtitle Box */}
        <div className="h-8 sm:h-12 flex items-center justify-center my-1.5 sm:my-3 text-center">
          <p className="text-sm sm:text-2xl md:text-3xl font-mono theme-subtext tracking-wider">
            {displayed}<span className="typewriter-cursor" />
          </p>
        </div>

        {/* Travel Narrative */}
        <p className="max-w-2xl mx-auto text-xs sm:text-base md:text-lg theme-subtext leading-relaxed mb-8 sm:mb-12 font-normal text-center px-2 sm:px-3">
          Solo female backpacking, Sahyadri mountain treks, coastal road trips, hidden waterfalls, and heritage fort expeditions across India. Capturing raw travel stories and outdoor brand collaborations.
        </p>

        {/* Action Buttons - Direct Instagram Follow */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-center justify-center mb-10 sm:mb-16 w-full sm:w-auto px-2 sm:px-0">
          <a
            href="https://www.instagram.com/d_bagpacker_/"
            target="_blank"
            rel="noopener noreferrer"
            className="neon-btn-filled w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 py-3 text-xs sm:text-sm"
          >
            <InstagramIcon className="w-4 h-4" /> Follow @d_bagpacker_ (20K)
          </a>
          <MagneticButton
            onClick={scrollToContact}
            id="hero-collab-cta"
            className="neon-btn w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 py-3 text-xs sm:text-sm"
          >
            🤝 Book Brand Collaboration
          </MagneticButton>
          <MagneticButton
            onClick={scrollToWork}
            id="hero-watch-cta"
            className="glass-card px-5 sm:px-6 py-3 rounded-full text-xs sm:text-sm font-bold theme-subtext hover:text-[var(--accent)] hover:border-[var(--accent)] w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5" fill="currentColor" /> Watch Travel Reels
          </MagneticButton>
        </div>

        {/* 3 Real Travel Metric Pillars from Instagram */}
        <div className="grid grid-cols-3 gap-2 sm:gap-14 max-w-xl mx-auto w-full pt-6 sm:pt-10 border-t border-[var(--card-border)] mt-2">
          {[
            { value: 20, suffix: "K+", label: "IG Followers" },
            { value: 302, suffix: "+", label: "Travel Posts" },
            { value: 12, suffix: "M+", label: "Video Views" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="text-xl sm:text-4xl font-bold neon-text font-mono">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[9px] sm:text-xs theme-muted font-mono mt-1 sm:mt-2 tracking-wider uppercase truncate">
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
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase">Explore Travel Vault</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </button>
    </section>
  );
}
