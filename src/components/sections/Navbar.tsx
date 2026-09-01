"use client";

import { useEffect, useState } from "react";
import { Menu, X, Compass, ArrowUpRight } from "lucide-react";
import GlitchText from "@/components/ui/GlitchText";
import ThemeCustomizer from "@/components/ui/ThemeCustomizer";
import InstagramIcon from "@/components/ui/InstagramIcon";

const navLinks = [
  { label: "Expeditions", href: "#work" },
  { label: "9:16 Reels", href: "#reels" },
  { label: "ROI Estimator", href: "#calculator" },
  { label: "Color Grade", href: "#casestudy" },
  { label: "Trek Rig", href: "#gear" },
  { label: "Explorer Story", href: "#about" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);

      const sections = navLinks.map((l) => l.href.replace("#", ""));
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 220) {
          setActive(`#${section}`);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    const target = document.getElementById(href.replace("#", ""));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-3 sm:px-8 pt-3 sm:pt-5 pointer-events-none">
        <nav
          className={`pointer-events-auto w-full max-w-6xl transition-all duration-300 rounded-full flex items-center justify-between px-3 sm:px-8 py-2.5 sm:py-3.5 ${
            scrolled
              ? "bg-[var(--glass-dock)] backdrop-blur-2xl border border-[var(--dock-border)] shadow-[0_10px_35px_rgba(0,0,0,0.15)]"
              : "bg-[var(--glass-dock)] backdrop-blur-xl border border-[var(--dock-border)] shadow-[0_4px_25px_rgba(0,0,0,0.08)]"
          }`}
        >
          {/* Logo with trailing underscore */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer"
            id="nav-logo"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[var(--accent)] flex items-center justify-center shadow-[0_0_15px_var(--accent-glow)] flex-shrink-0">
              <Compass className="w-4 h-4 text-[#030712]" />
            </div>
            <div className="text-left">
              <GlitchText
                text="D_BAGPACKER_"
                className="text-xs sm:text-sm font-bold tracking-widest neon-text font-mono block leading-none"
              />
              <span className="text-[8px] sm:text-[9px] font-mono theme-muted tracking-wider block mt-0.5">TRAVEL FILMMAKER 🇮🇳</span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`relative text-xs xl:text-sm font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                  active === link.href
                    ? "text-[var(--accent)] font-bold"
                    : "theme-subtext hover:text-[var(--accent)]"
                }`}
              >
                {link.label}
                {active === link.href && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
                )}
              </button>
            ))}
          </div>

          {/* Theme Switcher & Instagram Follow */}
          <div className="hidden sm:flex items-center gap-2.5">
            <ThemeCustomizer />
            <a
              href="https://www.instagram.com/d_bagpacker_/"
              target="_blank"
              rel="noopener noreferrer"
              className="neon-btn-filled px-4 py-2 rounded-full text-xs font-bold tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>Follow IG</span>
            </a>
          </div>

          {/* Mobile hamburger & Theme icon */}
          <div className="flex items-center gap-1 sm:gap-2 lg:hidden">
            <ThemeCustomizer />
            <button
              className="p-2 theme-subtext hover:text-[var(--accent)] transition-colors cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              id="nav-mobile-toggle"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex flex-col justify-start pt-20 px-4 bg-[var(--bg-primary)]/95 backdrop-blur-3xl animate-float-up">
          <div className="glass-card p-6 rounded-3xl border border-[var(--card-border)] space-y-2 mt-4">
            {navLinks.map((link, i) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="w-full text-left px-4 py-3 rounded-2xl theme-subtext hover:text-[var(--accent)] hover:bg-[var(--subtle-bg)] text-base font-medium flex items-center justify-between transition-all"
              >
                <span>{link.label}</span>
                <span className="text-xs font-mono theme-muted">0{i + 1}</span>
              </button>
            ))}
            <div className="pt-3 border-t border-[var(--card-border)] space-y-2">
              <a
                href="https://www.instagram.com/d_bagpacker_/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full neon-btn-filled py-3 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <InstagramIcon className="w-4 h-4" /> Follow @d_bagpacker_ on Instagram
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
