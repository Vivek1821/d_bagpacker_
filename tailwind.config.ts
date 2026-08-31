import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        matrix: {
          50: "#e6fff0",
          100: "#b3ffd1",
          200: "#66ffaa",
          300: "#00ff7f",
          400: "#00e070",
          500: "#00c060",
          600: "#009948",
          700: "#007335",
          800: "#004d23",
          900: "#002612",
        },
        neon: {
          green: "#00ff7f",
          cyan: "#00ffff",
          blue: "#0080ff",
          purple: "#8000ff",
        },
        dark: {
          50: "#1a1a1a",
          100: "#141414",
          200: "#0f0f0f",
          300: "#0a0a0a",
          400: "#050505",
          500: "#020202",
        },
        glass: {
          white: "rgba(255,255,255,0.05)",
          green: "rgba(0,255,127,0.08)",
          border: "rgba(0,255,127,0.15)",
        },
      },
      fontFamily: {
        grotesk: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "matrix-fall": "matrixFall 20s linear infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "border-flow": "borderFlow 3s linear infinite",
        "float-up": "floatUp 6s ease-in-out infinite",
        "slide-in-left": "slideInLeft 0.6s ease forwards",
        "slide-in-right": "slideInRight 0.6s ease forwards",
        "fade-up": "fadeUp 0.8s ease forwards",
        "counter-up": "counterUp 2s ease forwards",
        marquee: "marquee 30s linear infinite",
        "marquee-reverse": "marqueeReverse 30s linear infinite",
        shimmer: "shimmer 2s linear infinite",
        scan: "scan 3s linear infinite",
        "glitch-1": "glitch1 0.4s steps(2) infinite",
        "glitch-2": "glitch2 0.4s steps(2) infinite",
        "spin-slow": "spin 8s linear infinite",
        breathe: "breathe 4s ease-in-out infinite",
      },
      keyframes: {
        matrixFall: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 10px #00ff7f, 0 0 20px #00ff7f40" },
          "50%": { boxShadow: "0 0 30px #00ff7f, 0 0 60px #00ff7f60, 0 0 90px #00ff7f20" },
        },
        borderFlow: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        floatUp: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-60px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(60px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        fadeUp: {
          "0%": { transform: "translateY(40px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        counterUp: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        marqueeReverse: {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        glitch1: {
          "0%": { clipPath: "polygon(0 0%, 100% 0%, 100% 35%, 0 35%)", transform: "translate(-5px)" },
          "50%": { clipPath: "polygon(0 65%, 100% 65%, 100% 100%, 0 100%)", transform: "translate(5px)" },
          "100%": { clipPath: "polygon(0 0%, 100% 0%, 100% 35%, 0 35%)", transform: "translate(-5px)" },
        },
        glitch2: {
          "0%": { clipPath: "polygon(0 40%, 100% 40%, 100% 60%, 0 60%)", transform: "translate(5px, -5px)" },
          "50%": { clipPath: "polygon(0 20%, 100% 20%, 100% 50%, 0 50%)", transform: "translate(-5px, 5px)" },
          "100%": { clipPath: "polygon(0 40%, 100% 40%, 100% 60%, 0 60%)", transform: "translate(5px, -5px)" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.7" },
          "50%": { transform: "scale(1.05)", opacity: "1" },
        },
      },
      backgroundImage: {
        "matrix-gradient": "linear-gradient(180deg, #020202 0%, #0a1a0a 50%, #020202 100%)",
        "neon-glow": "radial-gradient(ellipse at center, rgba(0,255,127,0.15) 0%, transparent 70%)",
        "glass-gradient": "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(0,255,127,0.05) 0%, rgba(0,0,0,0.8) 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      screens: {
        xs: "380px",
      },
    },
  },
  plugins: [],
};

export default config;
