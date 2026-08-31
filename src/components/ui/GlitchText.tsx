"use client";

import { useEffect, useRef, useState } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  trigger?: boolean;
}

const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;:',.<>?/\\~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export default function GlitchText({ text, className = "", as: Tag = "span", trigger = false }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const runGlitch = () => {
    if (isGlitching) return;
    setIsGlitching(true);
    let iterations = 0;
    const maxIterations = text.length * 3;

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, idx) => {
            if (char === " ") return " ";
            if (idx < iterations / 3) return text[idx];
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join("")
      );
      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(intervalRef.current!);
        setDisplayText(text);
        setIsGlitching(false);
      }
    }, 30);
  };

  useEffect(() => {
    if (trigger) {
      timeoutRef.current = setTimeout(runGlitch, 500);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return (
    <Tag
      className={`${className} select-none font-mono`}
      onMouseEnter={runGlitch}
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {displayText}
    </Tag>
  );
}
