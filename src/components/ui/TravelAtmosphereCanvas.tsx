"use client";

import { useEffect, useRef } from "react";

interface TravelAtmosphereProps {
  className?: string;
  opacity?: number;
}

export default function TravelAtmosphereCanvas({ className = "", opacity = 0.25 }: TravelAtmosphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Atmospheric mist particles (fireflies / mountain dust / stars)
    const particleCount = Math.min(80, Math.floor(width / 20));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.5 - 0.2, // Float upwards like mountain mist/ember
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));

    // Topographic contour altitude lines
    const lineCount = 6;
    let time = 0;

    const render = () => {
      time += 0.008;

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      ctx.clearRect(0, 0, width, height);

      const computedAccent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#00f2fe";

      // 1. Draw Topographic Elevation Waves (Contour Lines)
      for (let i = 0; i < lineCount; i++) {
        ctx.beginPath();
        const baseHeight = height * (0.45 + i * 0.1);
        const lineAlpha = (0.04 + (i / lineCount) * 0.08) * opacity * 2.5;

        ctx.strokeStyle = isLight ? `rgba(15, 23, 42, ${lineAlpha})` : `rgba(255, 255, 255, ${lineAlpha})`;
        ctx.lineWidth = 1.2;

        const mouseInfluence = (mouseRef.current.x / width - 0.5) * 60;
        const mouseInfluenceY = (mouseRef.current.y / height - 0.5) * 40;

        for (let x = 0; x <= width; x += 15) {
          const nx = x / 300;
          const ny = (time + i * 0.6);
          // Wave equation mimicking mountain peaks and ridges
          const peak =
            Math.sin(nx * 1.5 + ny) * 35 +
            Math.cos(nx * 3.2 - time * 0.5) * 20 +
            Math.sin(nx * 0.8 + time) * 45;

          const distanceToMouse = Math.hypot(x - mouseRef.current.x, baseHeight - mouseRef.current.y);
          const cursorDistort = Math.max(0, 1 - distanceToMouse / 280) * 30;

          const y = baseHeight + peak + cursorDistort + mouseInfluenceY;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // 2. Draw Atmospheric Mountain Mist Particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += 0.03;

        // Wrap around borders
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        const pulsatingAlpha = p.alpha * (0.6 + Math.sin(p.pulse) * 0.4);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = computedAccent;
        ctx.globalAlpha = pulsatingAlpha * opacity * 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = computedAccent;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      // 3. Horizon Grid Mesh at Bottom (Adventure trail grid)
      ctx.strokeStyle = isLight ? "rgba(15, 23, 42, 0.03)" : "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      const perspectiveHorizon = height * 0.75;

      for (let x = -width; x < width * 2; x += 120) {
        ctx.beginPath();
        ctx.moveTo(x + (mouseRef.current.x - width / 2) * 0.1, perspectiveHorizon);
        ctx.lineTo(x * 1.8 - width * 0.4, height);
        ctx.stroke();
      }

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
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
