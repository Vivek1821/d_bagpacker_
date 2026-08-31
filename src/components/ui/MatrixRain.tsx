"use client";

import { useEffect, useRef } from "react";

interface MatrixRainProps {
  className?: string;
  opacity?: number;
}

export default function MatrixRain({ className = "", opacity = 0.12 }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars =
      "010101アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEF";
    const fontSize = 14;
    const cols = Math.floor(window.innerWidth / fontSize);
    const drops: number[] = Array(cols).fill(1);

    let animFrame: number;

    const draw = () => {
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      ctx.fillStyle = isLight ? `rgba(248, 250, 252, 0.08)` : `rgba(3, 7, 18, 0.07)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const computedAccent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#00f2fe";

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const brightness = Math.random();

        if (brightness > 0.95) {
          ctx.fillStyle = isLight ? "#0f172a" : "#ffffff";
        } else if (brightness > 0.75) {
          ctx.fillStyle = computedAccent;
        } else {
          ctx.fillStyle = isLight ? "rgba(100, 116, 139, 0.35)" : "rgba(100, 116, 139, 0.25)";
        }

        ctx.font = `${fontSize}px JetBrains Mono, monospace`;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrame);
    };
  }, [opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}
