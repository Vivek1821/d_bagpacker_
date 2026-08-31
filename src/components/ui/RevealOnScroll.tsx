"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale" | "none";
  duration?: number;
}

export default function RevealOnScroll({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.55,
}: RevealOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      setIsVisible(true);
      return;
    }

    // Safety fallback: guaranteed to be visible after 250ms even if observer is delayed
    const safetyTimer = setTimeout(() => {
      setIsVisible(true);
    }, 250);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          clearTimeout(safetyTimer);
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.01,
        rootMargin: "80px 0px 80px 0px", // Pre-trigger before entering viewport for instant pop
      }
    );

    observer.observe(el);

    return () => {
      clearTimeout(safetyTimer);
      observer.disconnect();
    };
  }, []);

  const getTransform = () => {
    if (isVisible) return "translate3d(0, 0, 0) scale(1)";
    switch (direction) {
      case "up":
        return "translate3d(0, 20px, 0) scale(0.99)";
      case "down":
        return "translate3d(0, -20px, 0) scale(0.99)";
      case "left":
        return "translate3d(20px, 0, 0) scale(0.99)";
      case "right":
        return "translate3d(-20px, 0, 0) scale(0.99)";
      case "scale":
        return "translate3d(0, 0, 0) scale(0.96)";
      case "none":
      default:
        return "translate3d(0, 0, 0) scale(1)";
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}
