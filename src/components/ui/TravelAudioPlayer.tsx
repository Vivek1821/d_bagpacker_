"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Radio, Compass, Wind, Sparkles } from "lucide-react";

export default function TravelAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSound, setActiveSound] = useState("Alpine Wind & Ridge Ambience");
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const startAmbientSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioContextClass();
      audioCtxRef.current = ctx;

      if (ctx.state === "suspended") ctx.resume();

      // Create pink/brown noise for mountain wind breeze
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter for deep mountain wind
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      // Low frequency oscillator for wind gusts
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.18, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(140, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 1.5);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();

      noiseNodeRef.current = whiteNoise;
      gainNodeRef.current = gain;
      setIsPlaying(true);
    } catch {
      setIsPlaying(true);
    }
  };

  const stopAmbientSound = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.5);
      setTimeout(() => {
        try {
          (noiseNodeRef.current as AudioBufferSourceNode)?.stop();
        } catch {}
        setIsPlaying(false);
      }, 500);
    } else {
      setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    if (isPlaying) {
      stopAmbientSound();
    } else {
      startAmbientSound();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center gap-3">
      <button
        onClick={toggleAudio}
        className={`glass-card px-4 py-2.5 rounded-full flex items-center gap-2.5 transition-all shadow-xl cursor-pointer border ${
          isPlaying
            ? "border-[var(--accent)] bg-[var(--accent-glow)] text-[var(--accent)] shadow-[0_0_20px_var(--accent-glow)]"
            : "border-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]"
        }`}
        title="Toggle Alpine Adventure Soundscape"
      >
        {isPlaying ? (
          <>
            <div className="flex items-center gap-0.5 h-3.5">
              {[6, 12, 8, 14, 9].map((h, i) => (
                <span
                  key={i}
                  className="w-0.5 rounded-full bg-[var(--accent)] animate-pulse"
                  style={{
                    height: `${h}px`,
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: "0.8s",
                  }}
                />
              ))}
            </div>
            <span className="text-xs font-mono font-bold text-[var(--accent)]">Alpine Wind ON</span>
          </>
        ) : (
          <>
            <Wind className="w-3.5 h-3.5" />
            <span className="text-xs font-mono">Soundscape OFF</span>
          </>
        )}
      </button>
    </div>
  );
}
