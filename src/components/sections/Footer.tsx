"use client";

import { Camera, Tv2, Mail, ArrowUp, Compass, Heart } from "lucide-react";
import GlitchText from "@/components/ui/GlitchText";
import InstagramIcon from "@/components/ui/InstagramIcon";

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
                <Compass className="w-4 h-4 text-[#030712]" />
              </div>
              <div>
                <GlitchText
                  text="D BAGPACKER"
                  className="font-bold text-base sm:text-lg neon-text tracking-widest font-mono"
                />
                <a
                  href="https://www.instagram.com/d_bagpacker_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-[var(--accent)] hover:underline flex items-center gap-1 font-bold"
                >
                  <InstagramIcon className="w-3.5 h-3.5" /> @d_bagpacker_ · Travel & Expeditions
                </a>
              </div>
            </div>
            <p className="theme-subtext text-xs sm:text-sm leading-relaxed max-w-sm">
              Extreme travel filmmaker & high-altitude documentarian collaborating with global outdoor, tech, and adventure brands.
            </p>
          </div>

          {/* Quick links Column */}
          <div className="md:col-span-4 space-y-2.5">
            <p className="theme-muted text-xs font-mono tracking-[0.2em] uppercase mb-2">Navigation</p>
            <div className="grid grid-cols-2 gap-2.5 text-xs sm:text-sm theme-subtext">
              {[
                { label: "Expeditions", id: "work" },
                { label: "9:16 Travel Reels", id: "reels" },
                { label: "ROI Estimator", id: "calculator" },
                { label: "Color Science", id: "casestudy" },
                { label: "Trek Rig & Gear", id: "gear" },
                { label: "Explorer Story", id: "about" },
                { label: "Book Expedition", id: "contact" },
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
            <p className="theme-muted text-xs font-mono tracking-[0.2em] uppercase mb-2">Follow The Journey</p>
            <div className="flex items-center gap-2.5">
              <a
                href="https://www.instagram.com/d_bagpacker_/"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card-sm p-2.5 text-xs text-[var(--accent)] hover:border-[var(--accent)] transition-all shadow-sm font-bold flex items-center gap-1.5"
                title="Follow @d_bagpacker_ on Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>Instagram</span>
              </a>
              <a
                href="https://youtube.com/@d_bagpacker"
                target="_blank"
                rel="noreferrer"
                className="glass-card-sm p-2.5 text-xs theme-subtext hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all shadow-sm"
                title="YouTube Expeditions"
              >
                <Tv2 className="w-4 h-4" />
              </a>
              <a
                href="mailto:hello@vivekcreates.in"
                className="glass-card-sm p-2.5 text-xs theme-subtext hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all shadow-sm"
                title="Email Collabs"
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
              Expedition Collabs: <span className="text-[var(--accent)]">hello@vivekcreates.in</span>
            </p>
          </div>
        </div>

        <div className="neon-divider mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs theme-muted font-mono">
          <p>© {new Date().getFullYear()} Vivek | D Bagpacker. All visual rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Extreme Adventure
          </p>
          <p>Available worldwide for Expeditions</p>
        </div>
      </div>
    </footer>
  );
}
