"use client";

import { useEffect, useRef, ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export default function TiltCard({ children, className = "", intensity = 15 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = ref.current;
    if (!card) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (y - 0.5) * -intensity;
      const rotateY = (x - 0.5) * intensity;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      // Glare
      const glare = card.querySelector(".tilt-glare") as HTMLElement;
      if (glare) {
        const angle = Math.atan2(y - 0.5, x - 0.5) * (180 / Math.PI);
        glare.style.background = `linear-gradient(${angle}deg, rgba(0,255,127,0.12) 0%, transparent 80%)`;
        glare.style.opacity = "1";
      }
    };

    const onMouseLeave = () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
      const glare = card.querySelector(".tilt-glare") as HTMLElement;
      if (glare) glare.style.opacity = "0";
    };

    card.addEventListener("mousemove", onMouseMove);
    card.addEventListener("mouseleave", onMouseLeave);

    return () => {
      card.removeEventListener("mousemove", onMouseMove);
      card.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [intensity]);

  return (
    <div
      ref={ref}
      className={`tilt-card relative overflow-hidden transition-transform duration-100 ease-out ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        className="tilt-glare absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0"
        style={{ zIndex: 5 }}
      />
      {children}
    </div>
  );
}
