"use client";

import { Camera, Tv2, Mail, ArrowUp, Zap, Heart } from "lucide-react";
import GlitchText from "@/components/ui/GlitchText";

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative py-20 sm:py-24 border-t border-[var(--card-border)] overflow-hidden bg-[var(--bg-secondary)]">
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-12 mb-12 sm:mb-16 items-start">
          {/* Logo & Bio Column */}
          <div className="md:col-span-5 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[var(--accent)] flex items-center justify-center shadow-md">
                <Zap className="w-4 h-4 text-[#030712]" fill="#030712" />
              </div>
              <div>
                <GlitchText
                  text="VIVEK CREATES"
                  className="font-bold text-base sm:text-lg neon-text tracking-widest font-mono"
                />
                <p className="theme-muted text-xs font-mono">@vivek.creates · Mumbai, India</p>
              </div>
            </div>
            <p className="theme-subtext text-xs sm:text-sm leading-relaxed max-w-sm">
              Cinematic storyteller & viral reel strategist collaborating with global tech, lifestyle, and fashion brands.
            </p>
          </div>

          {/* Quick links Column */}
          <div className="md:col-span-4 space-y-2.5">
            <p className="theme-muted text-xs font-mono tracking-[0.2em] uppercase mb-2">Navigation</p>
            <div className="grid grid-cols-2 gap-2.5 text-xs sm:text-sm theme-subtext">
              {[
                { label: "Portfolio", id: "work" },
                { label: "9:16 Reels", id: "reels" },
                { label: "ROI Estimator", id: "calculator" },
                { label: "Case Study", id: "casestudy" },
                { label: "Production Gear", id: "gear" },
                { label: "About", id: "about" },
                { label: "Book Collab", id: "contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })}
                  className="text-left hover:text-[var(--accent)] transition-colors py-0.5 cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Social & Back-to-Top Column */}
          <div className="md:col-span-3 space-y-3.5">
            <p className="theme-muted text-xs font-mono tracking-[0.2em] uppercase mb-2">Connect</p>
            <div className="flex items-center gap-2.5">
              <a
                href="https://instagram.com/vivek.creates"
                target="_blank"
                rel="noreferrer"
                className="glass-card-sm p-2.5 text-xs theme-subtext hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all shadow-sm"
                title="Instagram"
              >
                <Camera className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@vivek.creates"
                target="_blank"
                rel="noreferrer"
                className="glass-card-sm p-2.5 text-xs theme-subtext hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all shadow-sm"
                title="YouTube"
              >
                <Tv2 className="w-4 h-4" />
              </a>
              <a
                href="mailto:hello@vivekcreates.in"
                className="glass-card-sm p-2.5 text-xs theme-subtext hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all shadow-sm"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <button
                onClick={scrollTop}
                className="neon-btn p-2.5 rounded-2xl ml-auto cursor-pointer"
                style={{ padding: "10px", minHeight: "40px", minWidth: "40px" }}
                title="Scroll to Top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
            <p className="theme-muted text-xs font-mono">
              Inquiries: <span className="text-[var(--accent)]">hello@vivekcreates.in</span>
            </p>
          </div>
        </div>

        <div className="neon-divider mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs theme-muted font-mono">
          <p>© {new Date().getFullYear()} Vivek Creates. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Next.js & TailwindCSS
          </p>
          <p>Available worldwide for 2025/2026</p>
        </div>
      </div>
    </footer>
  );
}
