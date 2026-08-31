"use client";

import { ReactNode } from "react";

interface InfiniteMarqueeProps {
  children: ReactNode[];
  speed?: number;
  direction?: "left" | "right";
  className?: string;
  gap?: number;
}

export default function InfiniteMarquee({
  children,
  speed = 30,
  direction = "left",
  className = "",
  gap = 32,
}: InfiniteMarqueeProps) {
  const duration = `${speed}s`;

  return (
    <div className={`marquee-wrapper overflow-hidden ${className}`}>
      <div
        className="flex"
        style={{
          animation: `${direction === "left" ? "marquee" : "marqueeReverse"} ${duration} linear infinite`,
          gap: `${gap}px`,
          width: "max-content",
        }}
      >
        {/* Duplicate for seamless loop */}
        {[...children, ...children].map((child, i) => (
          <div key={i} className="flex-shrink-0" style={{ paddingRight: `${gap}px` }}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
