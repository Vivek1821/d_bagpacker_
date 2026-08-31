"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Palette, Sparkles, Check } from "lucide-react";

const ACCENTS = [
  { id: "cyan", name: "Electric Cyan", color: "#00f2fe" },
  { id: "violet", name: "Neon Violet", color: "#a855f7" },
  { id: "sunset", name: "Sunset Flare", color: "#ff4b4b" },
  { id: "emerald", name: "Cyber Emerald", color: "#10b981" },
  { id: "amber", name: "Solar Amber", color: "#f59e0b" },
];

export default function ThemeCustomizer() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [accent, setAccent] = useState("cyan");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const savedTheme = (localStorage.getItem("creator_theme") as "dark" | "light") || "dark";
    const savedAccent = localStorage.getItem("creator_accent") || "cyan";
    setTheme(savedTheme);
    setAccent(savedAccent);
    document.documentElement.setAttribute("data-theme", savedTheme);
    document.documentElement.setAttribute("data-accent", savedAccent);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("creator_theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const selectAccent = (id: string) => {
    setAccent(id);
    localStorage.setItem("creator_accent", id);
    document.documentElement.setAttribute("data-accent", id);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {/* Dark / Light Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white/80 hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all cursor-pointer shadow-lg"
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          style={{ padding: "0" }}
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
        </button>

        {/* Palette Selector Trigger */}
        <button
          onClick={() => setOpen(!open)}
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white/80 hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all cursor-pointer shadow-lg relative"
          title="Change Color Theme"
          style={{ padding: "0" }}
        >
          <Palette className="w-4 h-4 text-[var(--accent)]" />
          <span
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-black"
            style={{ background: ACCENTS.find((a) => a.id === accent)?.color || "#00f2fe" }}
          />
        </button>
      </div>

      {/* Palette Dropdown Popover */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-50 glass-card-sm p-4 rounded-2xl w-56 border border-[var(--card-border)] shadow-2xl animate-float-up">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10 text-xs font-mono text-[var(--text-muted)]">
              <span>COLOR PALETTES</span>
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
            </div>
            <div className="space-y-1.5">
              {ACCENTS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => selectAccent(a.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    accent === a.id
                      ? "bg-white/10 text-white font-bold"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ background: a.color }} />
                    <span>{a.name}</span>
                  </div>
                  {accent === a.id && <Check className="w-3.5 h-3.5 text-[var(--accent)]" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
