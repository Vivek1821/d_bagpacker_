"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play, Pause, Volume2, VolumeX, Heart, MessageCircle,
  Share2, ChevronUp, ChevronDown, Bookmark, Repeat2, Sparkles, Disc, RotateCcw
} from "lucide-react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { travelAudio } from "@/lib/travelAudioEngine";
import { getCleanInstagramEmbedUrl, getInstagramThumbnailUrl, getDirectVideoUrl, isInstagramUrl } from "@/lib/instagram";

export interface ReelItem {
  id: number;
  title: string;
  tag: string;
  plays: string;
  likes: string;
  comments: string;
  shares: string;
  duration: string;
  color: string;
  accentColor: string;
  emoji: string;
  username: string;
  caption: string;
  audio: string;
  trackType: "riding" | "nature" | "cinematic" | "chill";
  videoUrl?: string;
  embedUrl?: string;
  thumbnailUrl?: string;
  mediaType?: "video" | "instagram_embed" | "image";
}

const REELS: ReelItem[] = [
  {
    id: 1,
    title: "Spiti Valley High-Speed Moto Ride",
    tag: "Moto Riding · 15,000ft",
    plays: "6.8M",
    likes: "540K",
    comments: "14.2K",
    shares: "48K",
    duration: "0:38",
    color: "from-amber-950 via-orange-950 to-rose-950",
    accentColor: "#f97316",
    emoji: "🏍️",
    username: "@d_bagpacker_",
    caption: "Riding through Spiti Valley at 15,000ft with Royal Enfield. Raw gravel roads, freezing river crossings, and endless peaks 🏍️💨",
    audio: "Himalayan Ridge Highway Beat · D Bagpacker",
    trackType: "riding" as const,
  },
  {
    id: 2,
    title: "Meghalaya Living Root Bridges & Deep Jungle",
    tag: "Nature · Expedition",
    plays: "4.2M",
    likes: "310K",
    comments: "9.5K",
    shares: "28K",
    duration: "0:45",
    color: "from-teal-950 via-emerald-950 to-green-950",
    accentColor: "#10b981",
    emoji: "🌊",
    username: "@d_bagpacker_",
    caption: "3,000 steps down into the wettest rainforest on Earth. Living root bridges built over 200 years ago by local Khasi tribes 🌿",
    audio: "Rainforest River Symphony · D Bagpacker",
    trackType: "nature" as const,
  },
  {
    id: 3,
    title: "Kedarkantha Summit Sunrise 12,500ft",
    tag: "Alpine Trekking · Snow",
    plays: "5.7M",
    likes: "480K",
    comments: "11.8K",
    shares: "41K",
    duration: "0:34",
    color: "from-blue-950 via-slate-900 to-indigo-950",
    accentColor: "#60a5fa",
    emoji: "⛰️",
    username: "@d_bagpacker_",
    caption: "Summit push started at 3:00 AM in -12°C. Standing on the peak as the first golden sun rays hit the Himalayan range 🌅",
    audio: "Epic Mountain Sunrise Score · D Bagpacker",
    trackType: "cinematic" as const,
  },
  {
    id: 4,
    title: "Coastal Highway Sunset Roadtrip",
    tag: "Adventure · Roadtrip",
    plays: "5.1M",
    likes: "410K",
    comments: "8.7K",
    shares: "32K",
    duration: "0:42",
    color: "from-rose-950 via-orange-950 to-amber-950",
    accentColor: "#f43f5e",
    emoji: "🌴",
    username: "@d_bagpacker_",
    caption: "Sunset coastal highway cruise from Goa to Gokarna. Sea breeze, open roads, and infinite ocean horizon 🌊",
    audio: "Coastal Sunset Lofi · D Bagpacker",
    trackType: "chill" as const,
  },
];

export default function ReelPlayer() {
  const [allReels, setAllReels] = useState<ReelItem[]>(REELS);
  const [currentReel, setCurrentReel] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [liked, setLiked] = useState<number[]>([]);
  const [saved, setSaved] = useState<number[]>([]);
  const [waveBars, setWaveBars] = useState<number[]>([10, 16, 22, 14, 18]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/reels")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          const apiReels = data.data.map((r: any, idx: number) => {
            const igEmbed = isInstagramUrl(r.url || "") ? getCleanInstagramEmbedUrl(r.url) : null;
            return {
              id: r.id || 100 + idx,
              title: r.title,
              tag: `${r.category || "Expedition"} · Video`,
              plays: r.views || "1.8M",
              likes: r.likes || "120K",
              comments: "8.5K",
              shares: "24K",
              duration: "0:35",
              color: "from-zinc-950 via-zinc-900 to-black",
              accentColor: "#22c55e",
              emoji: r.thumbnail && r.thumbnail.length <= 4 ? r.thumbnail : "🎬",
              thumbnailUrl: r.thumbnailUrl || (r.thumbnail && r.thumbnail.startsWith("http") ? r.thumbnail : ""),
              videoUrl: r.url || "",
              embedUrl: r.embedUrl || igEmbed || "",
              mediaType: (igEmbed ? "instagram_embed" : r.mediaType) || (r.url && r.url.includes(".mp4") ? "video" : "instagram_embed"),
              username: "@d_bagpacker_",
              caption: r.title,
              audio: r.suggestedMusic ? `${r.category} Explorer Beat · D Bagpacker` : "Original Explorer Soundtrack · D Bagpacker",
              trackType: (r.suggestedMusic || "cinematic") as "riding" | "nature" | "cinematic" | "chill",
            };
          });
          setAllReels([...apiReels, ...REELS]);
        }
      })
      .catch(() => {});
  }, []);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const reel = allReels[currentReel] || allReels[0] || REELS[0];
  const directVideo = getDirectVideoUrl(reel.videoUrl);
  const effectiveVideoSrc = directVideo || (reel.videoUrl && !isInstagramUrl(reel.videoUrl) ? reel.videoUrl : null) || "/media/Dcla50ahuGq.mp4";
  const hasRealAudio = Boolean(directVideo || (reel.videoUrl && reel.videoUrl.includes("media/")));

  useEffect(() => {
    setVideoError(false);
  }, [currentReel]);

  useEffect(() => {
    if (hasRealAudio) {
      travelAudio.stop();
      if (videoRef.current) {
        videoRef.current.muted = muted;
        if (playing && !isEnded) {
          videoRef.current.play().catch(() => {});
        } else {
          videoRef.current.pause();
        }
      }
      return;
    }
    if (playing && !muted) {
      travelAudio.playTrack(reel.trackType);
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
      const int = setInterval(() => {
        setWaveBars(Array.from({ length: 5 }, () => Math.floor(Math.random() * 18) + 6));
      }, 120);
      return () => clearInterval(int);
    } else {
      travelAudio.stop();
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setWaveBars([6, 10, 6, 10, 6]);
    }
  }, [playing, currentReel, muted, reel.trackType, hasRealAudio, isEnded]);

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

  const handleReplay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsEnded(false);
      videoRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      travelAudio.stop();
    };
  }, []);

  // Stop playback and audio when scrolling away or moving to another page/tab
  useEffect(() => {
    const el = phoneRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If phone simulator scrolls out of view (less than 20% visible), stop video and audio immediately
          if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
            setPlaying(false);
            if (videoRef.current) {
              videoRef.current.pause();
            }
            travelAudio.stop();
          }
        });
      },
      { threshold: [0, 0.2, 0.5, 0.8, 1.0] }
    );

    observer.observe(el);

    const handleVisibility = () => {
      if (document.hidden) {
        setPlaying(false);
        if (videoRef.current) videoRef.current.pause();
        travelAudio.stop();
      }
    };

    const handleBlur = () => {
      travelAudio.stop();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  const goNext = () => {
    const next = Math.min(currentReel + 1, allReels.length - 1);
    setCurrentReel(next);
    setPlaying(true);
  };

  const goPrev = () => {
    const prev = Math.max(currentReel - 1, 0);
    setCurrentReel(prev);
    setPlaying(true);
  };

  const togglePlay = () => {
    setPlaying(!playing);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!muted) {
      travelAudio.stop();
      setMuted(true);
    } else {
      setMuted(false);
      if (playing) travelAudio.playTrack(reel.trackType);
    }
  };

  const toggleLike = (id: number) => setLiked((p) => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleSave = (id: number) => setSaved((p) => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  return (
    <section id="reels" className="section-wrapper">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 65% 50% at 50% 50%, var(--accent-glow) 0%, transparent 70%)",
        }}
      />

      <div className="section-container">

        {/* Section Header */}
        <RevealOnScroll className="section-header">
          <span className="section-label">// 9:16 VERTICAL SIMULATOR</span>
          <h2 className="text-3xl sm:text-6xl md:text-7xl font-bold theme-heading mb-4 sm:mb-6 section-title">
            Native <span className="gradient-text">9:16 Exploration Feed</span>
          </h2>
          <p className="section-desc">
            Experience high-altitude rides, rainforest expeditions, and summit pushes with synced travel soundtracks. Click anywhere to play!
          </p>
        </RevealOnScroll>

        {/* Main Grid: Phone simulator on left, list on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* Left Column: 9:16 Phone frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative">
              <div
                ref={phoneRef}
                className="relative w-[280px] h-[580px] sm:w-[320px] sm:h-[660px] rounded-[44px] sm:rounded-[48px] overflow-hidden border-4 sm:border-8 border-[var(--card-border)] shadow-2xl cursor-pointer"
                style={{ background: "#030712" }}
                onClick={togglePlay}
              >
                {/* Dynamic island / top notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 sm:w-28 h-5 sm:h-6 bg-black rounded-full z-30 flex items-center justify-center gap-2 border border-white/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-black border border-white/20" />
                </div>

                {/* Reel visual background: Pure HTML5 Video or Clean Embed Fallback */}
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${reel.color || "from-zinc-950 to-black"} transition-all duration-700 overflow-hidden`}
                >
                  {videoError && isInstagramUrl(reel.videoUrl || "") ? (
                    <iframe
                      src={getCleanInstagramEmbedUrl(reel.videoUrl || "") || ""}
                      className="w-full h-full border-0 pointer-events-auto bg-black"
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      title={reel.title}
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      src={effectiveVideoSrc}
                      playsInline
                      muted={muted}
                      loop={false}
                      onError={() => setVideoError(true)}
                      style={{
                        filter: "contrast(1.06) saturate(1.08) brightness(1.02)",
                        imageRendering: "-webkit-optimize-contrast",
                      }}
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
                      className="absolute inset-0 w-full h-full object-cover opacity-100"
                    />
                  )}

                  {/* Play / Pause / Replay Center Overlay */}
                  {isEnded ? (
                    <div
                      onClick={handleReplay}
                      className="absolute inset-0 flex items-center justify-center z-30 pointer-events-auto cursor-pointer"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/80 backdrop-blur-md border-2 border-[var(--accent)] flex flex-col items-center justify-center shadow-[0_0_25px_var(--accent-glow)] hover:scale-110 transition-transform">
                        <RotateCcw className="w-7 h-7 text-[var(--accent)]" />
                        <span className="text-[9px] font-mono text-white font-bold mt-1">Replay</span>
                      </div>
                    </div>
                  ) : !playing ? (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl transition-transform hover:scale-110">
                        <Play className="w-7 h-7 sm:w-9 sm:h-9 text-[var(--accent)] ml-1" fill="currentColor" />
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Reel top bar */}
                <div className="absolute top-10 sm:top-12 left-4 right-14 z-20 flex items-center gap-2 pointer-events-auto">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-[#030712] font-bold text-xs flex-shrink-0 shadow-md">
                    D
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-xs font-bold truncate">{reel.username}</p>
                  </div>
                  <a
                    href="https://www.instagram.com/d_bagpacker_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="ml-auto bg-[var(--accent)] text-[#030712] text-[9px] sm:text-[10px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0 hover:brightness-110"
                  >
                    Follow
                  </a>
                </div>

                {/* Audio Equalizer & Mute button */}
                <div className="absolute top-10 sm:top-12 right-4 z-20 pointer-events-auto">
                  <button
                    onClick={toggleMute}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:border-[var(--accent)] transition-all cursor-pointer"
                  >
                    {muted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-[var(--accent)]" />}
                  </button>
                </div>

                {/* Reel Bottom Information with Real Interactive Scrubber */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-5 pb-6 sm:pb-8 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none">
                  {/* Interactive Scrubbing Bar: Click anywhere to jump to middle, start, end */}
                  <div
                    className="relative w-full h-4 flex items-center cursor-pointer mb-2 pointer-events-auto group/scrub"
                    onClick={handleSeek}
                    title="Click to seek"
                  >
                    <div className="w-full h-1 bg-white/25 rounded-full overflow-hidden transition-all group-hover/scrub:h-1.5">
                      <div
                        className="h-full bg-[var(--accent)] rounded-full shadow-[0_0_8px_var(--accent)]"
                        style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                      />
                    </div>
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border border-[var(--accent)] shadow pointer-events-none scale-0 group-hover/scrub:scale-100 transition-transform"
                      style={{ left: `calc(${duration > 0 ? (currentTime / duration) * 100 : 0}% - 6px)` }}
                    />
                  </div>

                  <div className="mb-1 flex items-center justify-between pointer-events-auto">
                    <span
                      className="text-[9px] sm:text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase"
                      style={{ background: reel.accentColor + "30", color: "#fff", border: `1px solid ${reel.accentColor}50` }}
                    >
                      {reel.tag}
                    </span>
                    <span className="text-[10px] font-mono text-white/70 font-semibold">
                      {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60) < 10 ? "0" : ""}{Math.floor(currentTime % 60)} / {Math.floor((duration || 20) / 60)}:{Math.floor((duration || 20) % 60) < 10 ? "0" : ""}{Math.floor((duration || 20) % 60)}
                    </span>
                  </div>

                  <p className="text-white text-xs sm:text-sm leading-snug font-medium mb-1.5 line-clamp-2">{reel.caption}</p>
                  <div className="flex items-center justify-between text-white/80 text-[10px] sm:text-[11px] font-mono pointer-events-auto">
                    <div className="flex items-center gap-1.5 truncate">
                      <Disc className="w-3 h-3 text-[var(--accent)] animate-spin" style={{ animationDuration: "3s" }} />
                      <span className="truncate">{reel.audio}</span>
                    </div>
                    {isEnded && (
                      <button
                        onClick={handleReplay}
                        className="ml-2 px-2 py-0.5 rounded-full bg-[var(--accent)] text-[#030712] font-bold text-[9px] flex items-center gap-1 cursor-pointer flex-shrink-0"
                      >
                        <RotateCcw className="w-2.5 h-2.5" /> Replay
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Floating Actions */}
                <div className="absolute right-2.5 sm:right-3 bottom-24 sm:bottom-28 z-20 flex flex-col items-center gap-4 sm:gap-5 pointer-events-auto">
                  <button onClick={(e) => { e.stopPropagation(); toggleLike(reel.id); }} className="flex flex-col items-center gap-1 cursor-pointer">
                    <Heart className={`w-5 h-5 sm:w-6 sm:h-6 transition-all ${liked.includes(reel.id) ? "text-rose-500 fill-rose-500 scale-110" : "text-white"}`} />
                    <span className="text-white text-[9px] sm:text-[10px] font-mono">{reel.likes}</span>
                  </button>
                  <button onClick={(e) => e.stopPropagation()} className="flex flex-col items-center gap-1 cursor-pointer">
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    <span className="text-white text-[9px] sm:text-[10px] font-mono">{reel.comments}</span>
                  </button>
                  <button onClick={(e) => e.stopPropagation()} className="flex flex-col items-center gap-1 cursor-pointer">
                    <Repeat2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    <span className="text-white text-[9px] sm:text-[10px] font-mono">{reel.shares}</span>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); toggleSave(reel.id); }} className="cursor-pointer">
                    <Bookmark className={`w-5 h-5 sm:w-6 sm:h-6 ${saved.includes(reel.id) ? "text-[var(--accent)] fill-[var(--accent)]" : "text-white"}`} />
                  </button>
                </div>

                {/* Previous / Next Arrows */}
                <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2.5 pointer-events-auto">
                  <button onClick={(e) => { e.stopPropagation(); goPrev(); }} disabled={currentReel === 0} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center disabled:opacity-20 transition-all cursor-pointer">
                    <ChevronUp className="w-4 h-4 text-white" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); goNext(); }} disabled={currentReel === allReels.length - 1} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center disabled:opacity-20 transition-all cursor-pointer">
                    <ChevronDown className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Backlight Ambient Glow */}
              <div
                className="absolute inset-0 rounded-[48px] blur-3xl -z-10 opacity-25 transition-all duration-700"
                style={{ background: reel.accentColor }}
              />
            </div>
          </div>

          {/* Right Column: Interactive Exploration Playlist */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <p className="section-label mb-4 sm:mb-6">// EXPLORATION PLAYLIST (SELECT TO PLAY)</p>
            <div className="space-y-3 sm:space-y-4">
              {allReels.map((r, i) => (
                <button
                  key={`reel-${r.id}-${i}`}
                  onClick={() => { setCurrentReel(i); setPlaying(true); }}
                  className={`w-full text-left glass-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex items-center gap-4 sm:gap-6 transition-all duration-300 cursor-pointer ${
                    i === currentReel
                      ? "border-[var(--accent)] shadow-md"
                      : "glass-card-hover opacity-80 hover:opacity-100"
                  }`}
                >
                  <div
                    className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 shadow-sm overflow-hidden"
                    style={{ background: r.accentColor + "20", border: `1px solid ${r.accentColor}35`, width: "56px", height: "56px" }}
                  >
                    {(() => {
                      const thumb = r.thumbnailUrl || (r.videoUrl ? getInstagramThumbnailUrl(r.videoUrl) : null);
                      return thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={thumb}
                          alt={r.title}
                          className="w-full h-full object-cover"
                          style={{ imageRendering: "-webkit-optimize-contrast" }}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : (
                        <span>{r.emoji}</span>
                      );
                    })()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="theme-heading font-bold text-sm sm:text-base truncate">{r.title}</span>
                      {i === currentReel && playing && (
                        <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs theme-muted font-mono">
                      <span className="text-[var(--accent)] font-semibold">{r.plays} views</span>
                      <span>·</span>
                      <span>{r.likes} likes</span>
                      <span>·</span>
                      <span className="text-white/60 font-semibold">{r.audio.split(" · ")[0]}</span>
                    </div>
                  </div>
                  <span
                    className="text-[9px] sm:text-[10px] font-mono font-bold px-2.5 sm:px-3 py-1 rounded-full uppercase flex-shrink-0 hidden sm:inline-block"
                    style={{ background: r.accentColor + "20", color: r.accentColor, border: `1px solid ${r.accentColor}35` }}
                  >
                    {r.tag.split(" · ")[0]}
                  </span>
                </button>
              ))}
            </div>

            {/* Performance Summary Cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-5 pt-4 sm:pt-6">
              {[
                { label: "High Treks", value: "28+" },
                { label: "Avg Views", value: "1.8M" },
                { label: "Audio Sync Rate", value: "94.2%" },
              ].map((s) => (
                <div key={s.label} className="glass-card p-3 sm:p-5 rounded-2xl text-center">
                  <div className="text-lg sm:text-2xl font-bold neon-text font-mono">{s.value}</div>
                  <div className="text-[10px] sm:text-[11px] theme-muted font-mono mt-1 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
