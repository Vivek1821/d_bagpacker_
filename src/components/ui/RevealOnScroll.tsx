"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

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
  duration = 0.7,
}: RevealOnScrollProps) {
  const shouldReduceMotion = useReducedMotion();

  const getInitial = () => {
    if (shouldReduceMotion) return { opacity: 0 };
    switch (direction) {
      case "up":
        return { opacity: 0, y: 36, scale: 0.98 };
      case "down":
        return { opacity: 0, y: -36, scale: 0.98 };
      case "left":
        return { opacity: 0, x: 40, scale: 0.98 };
      case "right":
        return { opacity: 0, x: -40, scale: 0.98 };
      case "scale":
        return { opacity: 0, scale: 0.9 };
      case "none":
      default:
        return { opacity: 0 };
    }
  };

  const getAnimate = () => {
    return {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
    };
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={getAnimate()}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Custom snappy spring-like cubic bezier
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
