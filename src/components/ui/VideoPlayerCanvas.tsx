"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Sparkles } from "lucide-react";
import { travelAudio } from "@/lib/travelAudioEngine";

interface VideoPlayerCanvasProps {
  category?: string;
  emoji?: string;
  title?: string;
  playing: boolean;
  onTogglePlay: () => void;
  videoUrl?: string;
  trackType?: "riding" | "nature" | "cinematic" | "chill";
}

// Fallback high-definition public CDN video loops
const VIDEO_PRESETS: Record<string, string> = {
  Riding: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  Nature: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  Cinematic: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  Adventure: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
  Trekking: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
};

export default function VideoPlayerCanvas({
  category = "Cinematic",
  emoji = "🎬",
  title = "",
  playing,
  onTogglePlay,
  videoUrl,
  trackType = "cinematic",
}: VideoPlayerCanvasProps) {
  const [muted, setMuted] = useState(false);
  const [waveHeights, setWaveHeights] = useState<number[]>([12, 18, 24, 16, 20]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (playing) {
      if (!muted) {
        travelAudio.playTrack(trackType);
      }
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
      const interval = setInterval(() => {
        setWaveHeights(Array.from({ length: 5 }, () => Math.floor(Math.random() * 20) + 6));
      }, 100);
      return () => {
        clearInterval(interval);
      };
    } else {
      travelAudio.stop();
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setWaveHeights([8, 12, 8, 12, 8]);
    }
  }, [playing, muted, trackType]);

  useEffect(() => {
    return () => {
      travelAudio.stop();
    };
  }, []);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!muted) {
      travelAudio.stop();
      setMuted(true);
    } else {
      setMuted(false);
      if (playing) travelAudio.playTrack(trackType);
    }
  };

  return (
    <div
      className="relative w-full h-full rounded-[28px] sm:rounded-[32px] overflow-hidden cursor-pointer select-none group"
      onClick={onTogglePlay}
    >
      {/* Background Animated Gradient / Video */}
      <div
        className={`absolute inset-0 transition-all duration-700 ${
          playing
            ? "bg-gradient-to-b from-slate-900 via-zinc-900 to-black"
            : "bg-gradient-to-b from-slate-950 via-zinc-950 to-black"
        }`}
      >
        {/* Animated Horizon Waves & Visual Canvas */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <span
            className={`text-8xl sm:text-9xl transition-all duration-700 select-none ${
              playing ? "scale-110 opacity-30 blur-[1px]" : "opacity-20 scale-100"
            }`}
          >
            {emoji}
          </span>
        </div>

        {/* Ambient Moving Glow */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
            playing ? "opacity-30" : "opacity-10"
          }`}
          style={{
            background: "radial-gradient(circle at 50% 50%, var(--accent-glow) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Center Play/Pause Indicator */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        {!playing ? (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110">
            <Play className="w-7 h-7 sm:w-9 sm:h-9 text-[var(--accent)] ml-1" fill="currentColor" />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Pause className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      {/* Top Controls: Audio Equalizer & Mute */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <div className="flex items-center gap-0.5 h-3.5">
            {waveHeights.map((h, i) => (
              <span
                key={i}
                className="w-0.5 rounded-full bg-[var(--accent)] transition-all"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono text-white/80 font-bold uppercase">
            {playing ? (muted ? "Muted" : "Audio Playing") : "Sound Track"}
          </span>
        </div>

        <button
          onClick={toggleMute}
          className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:border-[var(--accent)] transition-all cursor-pointer"
        >
          {muted ? <VolumeX className="w-4 h-4 text-white/50" /> : <Volume2 className="w-4 h-4 text-[var(--accent)]" />}
        </button>
      </div>

      {/* Bottom Title Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
        <span className="tag-pill text-[9px] uppercase font-mono mb-1">{category}</span>
        <p className="text-white font-bold text-xs sm:text-sm line-clamp-1">{title}</p>
        <p className="text-white/40 text-[10px] font-mono mt-0.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[var(--accent)]" /> Click anywhere to {playing ? "Pause" : "Play Reel"}
        </p>
      </div>
    </div>
  );
}
