"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react";
import { travelAudio } from "@/lib/travelAudioEngine";
import { getCleanInstagramEmbedUrl, getDirectVideoUrl, isInstagramUrl } from "@/lib/instagram";

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

function formatTime(secs: number): string {
  if (isNaN(secs) || secs < 0) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 1. Check if direct video exists (e.g. /media/Dcla50ahuGq.mp4 or .mp4/.webm link)
  const directVideo = getDirectVideoUrl(videoUrl);
  
  // 2. Only use Instagram iframe if there is no direct video AND it's an Instagram URL
  const effectiveVideoSrc = directVideo || (videoUrl && !isInstagramUrl(videoUrl) ? videoUrl : null) || VIDEO_PRESETS[category] || VIDEO_PRESETS.Cinematic;
  const isPureVideo = Boolean(effectiveVideoSrc);
  const hasRealAudio = Boolean(directVideo || (videoUrl && videoUrl.includes("media/")));

  useEffect(() => {
    // If it's pure video with real audio, we control audio through the HTML5 video element
    if (hasRealAudio) {
      travelAudio.stop();
      if (videoRef.current) {
        videoRef.current.muted = muted;
      }
      return;
    }

    // Otherwise for presets without audio, use the ambient synthesizer if unmuted
    if (playing) {
      if (!muted) {
        travelAudio.playTrack(trackType);
      }
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    } else {
      travelAudio.stop();
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [playing, muted, trackType, hasRealAudio]);

  useEffect(() => {
    return () => {
      travelAudio.stop();
    };
  }, []);

  // Sync play/pause with prop
  useEffect(() => {
    if (!videoRef.current) return;
    if (playing && !isEnded) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [playing, isEnded]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !muted;
    setMuted(next);
    if (videoRef.current) {
      videoRef.current.muted = next;
    }
    if (!hasRealAudio) {
      if (next) {
        travelAudio.stop();
      } else if (playing) {
        travelAudio.playTrack(trackType);
      }
    }
  };

  // Replay from beginning
  const handleReplay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsEnded(false);
      videoRef.current.play().catch(() => {});
      if (!playing) onTogglePlay();
    }
  };

  // Interactive scrubbing / seek bar
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = ratio * (duration || 20);
    setCurrentTime(targetTime);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
      if (isEnded) {
        setIsEnded(false);
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEnded) {
      handleReplay();
      return;
    }
    onTogglePlay();
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="relative w-full h-full rounded-[28px] sm:rounded-[32px] overflow-hidden cursor-pointer select-none group bg-black"
      onClick={handleVideoClick}
    >
      {/* 100% PURE HTML5 VIDEO: Zero Instagram branding, zero white box, zero external overlays */}
      <video
        ref={videoRef}
        src={effectiveVideoSrc}
        playsInline
        muted={muted}
        loop={false}
        onTimeUpdate={() => {
          if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            if (videoRef.current.duration) {
              setDuration(videoRef.current.duration);
            }
          }
        }}
        onLoadedMetadata={() => {
          if (videoRef.current && videoRef.current.duration) {
            setDuration(videoRef.current.duration);
          }
        }}
        onEnded={() => {
          setIsEnded(true);
        }}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          playing && !isEnded ? "opacity-100" : "opacity-75"
        }`}
      />

      {/* Center Play / Pause / Replay Indicator */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        {isEnded ? (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/75 backdrop-blur-md border-2 border-[var(--accent)] flex flex-col items-center justify-center shadow-[0_0_25px_var(--accent-glow)] group-hover:scale-110 transition-transform pointer-events-auto">
            <RotateCcw className="w-7 h-7 text-[var(--accent)]" />
            <span className="text-[9px] font-mono text-white font-bold mt-1">Replay</span>
          </div>
        ) : !playing ? (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110">
            <Play className="w-7 h-7 sm:w-9 sm:h-9 text-[var(--accent)] ml-1" fill="currentColor" />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Pause className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      {/* Top Header Controls: Audio Mute & Pure Video Tag */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-auto">
        <span className="tag-pill text-[9px] uppercase font-mono px-2.5 py-0.5 bg-black/70 backdrop-blur-md border border-white/15 text-white">
          {category}
        </span>

        <button
          onClick={toggleMute}
          className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center text-white border border-white/15 hover:border-[var(--accent)] transition-all cursor-pointer shadow-lg"
          title={muted ? "Unmute Audio" : "Mute Audio"}
        >
          {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[var(--accent)]" />}
        </button>
      </div>

      {/* Real Interactive Scrubber & Timeline Bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30 p-3.5 pb-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Interactive Scrubbing Track: Click anywhere to jump to middle, start, or end */}
        <div
          className="relative w-full h-5 flex items-center cursor-pointer group/scrub"
          onClick={handleSeek}
          title="Click to seek position"
        >
          {/* Background Bar */}
          <div className="w-full h-1.5 bg-white/25 rounded-full overflow-hidden transition-all group-hover/scrub:h-2">
            <div
              className="h-full bg-[var(--accent)] rounded-full shadow-[0_0_10px_var(--accent)] transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {/* Glowing Scrubber Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_10px_white] border-2 border-[var(--accent)] scale-0 group-hover/scrub:scale-100 transition-transform pointer-events-none"
            style={{ left: `calc(${progressPercent}% - 7px)` }}
          />
        </div>

        {/* Timestamps, Play/Pause Toggle & Replay Control */}
        <div className="flex items-center justify-between mt-1.5 text-[10px] font-mono text-white/90">
          <div className="flex items-center gap-2">
            <button
              onClick={handleVideoClick}
              className="w-5 h-5 rounded-full bg-white/15 hover:bg-[var(--accent)] hover:text-[#030712] transition-colors flex items-center justify-center cursor-pointer"
            >
              {playing && !isEnded ? <Pause className="w-2.5 h-2.5 text-white" /> : <Play className="w-2.5 h-2.5 ml-0.5 text-white" fill="currentColor" />}
            </button>
            <span className="font-semibold text-white/80">
              {formatTime(currentTime)} / {formatTime(duration || 20)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isEnded ? (
              <button
                onClick={handleReplay}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--accent)] text-[#030712] font-bold text-[10px] hover:brightness-110 shadow-sm cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Replay
              </button>
            ) : (
              <button
                onClick={handleReplay}
                className="text-white/50 hover:text-[var(--accent)] transition-colors p-1 cursor-pointer"
                title="Restart from beginning"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
