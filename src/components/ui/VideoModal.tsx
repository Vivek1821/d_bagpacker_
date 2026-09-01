"use client";

import { useEffect, useState } from "react";
import { X, Play, Pause, Heart, Volume2, VolumeX, Eye, Sparkles, Radio, Compass, Disc, ExternalLink } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";
import MagneticButton from "@/components/ui/MagneticButton";
import VideoPlayerCanvas from "@/components/ui/VideoPlayerCanvas";
import { travelAudio } from "@/lib/travelAudioEngine";
import { isInstagramUrl } from "@/lib/instagram";

export interface PostItem {
  id: number;
  title: string;
  category: string;
  emoji: string;
  views: string;
  likes: string;
  type?: string;
  color?: string;
  trackType?: "riding" | "nature" | "cinematic" | "chill";
  videoUrl?: string;
  media_url?: string;
  thumbnailUrl?: string;
}

interface VideoModalProps {
  post: PostItem | null;
  onClose: () => void;
}

export default function VideoModal({ post, onClose }: VideoModalProps) {
  const [playing, setPlaying] = useState(true);
  const [liked, setLiked] = useState(false);
  const [progress, setProgress] = useState(25);
  const [seconds, setSeconds] = useState(8);

  useEffect(() => {
    if (post) {
      setPlaying(true);
      const isIg = isInstagramUrl(post.videoUrl || post.media_url || "");
      if (isIg) {
        travelAudio.stop();
        return;
      }
      const track =
        post.category === "Riding"
          ? "riding"
          : post.category === "Nature"
          ? "nature"
          : post.category === "Lifestyle"
          ? "chill"
          : "cinematic";
      travelAudio.playTrack(track, (step) => {
        setSeconds((p) => (p >= 38 ? 1 : p + 1));
        setProgress((p) => (p >= 100 ? 5 : p + 2.5));
      });
    } else {
      travelAudio.stop();
    }
  }, [post]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        travelAudio.stop();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      travelAudio.stop();
    };
  }, [onClose]);

  if (!post) return null;

  const isIg = Boolean(post && (isInstagramUrl(post.videoUrl || "") || isInstagramUrl(post.media_url || "")));

  const track =
    post.category === "Riding"
      ? "riding"
      : post.category === "Nature"
      ? "nature"
      : post.category === "Lifestyle"
      ? "chill"
      : "cinematic";

  const trackTitle =
    track === "riding"
      ? "🏍️ Himalayan Ridge High-Speed Moto Beat"
      : track === "nature"
      ? "🌲 Mountain Mist & Deep Forest Symphony"
      : track === "chill"
      ? "☕ Sunset Coastal Highway Lofi Roadtrip"
      : "🎬 Epic 4K Expedition Cinematic Score";

  const togglePlay = () => {
    if (playing) {
      travelAudio.stop();
      setPlaying(false);
    } else {
      travelAudio.playTrack(track, (step) => {
        setSeconds((p) => (p >= 38 ? 1 : p + 1));
        setProgress((p) => (p >= 100 ? 5 : p + 2.5));
      });
      setPlaying(true);
    }
  };

  const handleClose = () => {
    travelAudio.stop();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl animate-float-up">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={handleClose} />

      <div className="relative z-10 w-full max-w-4xl glass-card-lg p-5 sm:p-8 rounded-[36px] border border-[var(--accent)] shadow-2xl overflow-hidden flex flex-col lg:flex-row gap-6 sm:gap-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-all cursor-pointer z-40"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Interactive Video Player */}
        <div className="w-full lg:w-[320px] flex-shrink-0 flex justify-center">
          <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[9/16] rounded-[32px] overflow-hidden border-4 border-white/15 shadow-2xl">
            <VideoPlayerCanvas
              category={post.category}
              emoji={post.emoji}
              title={post.title}
              playing={playing}
              onTogglePlay={togglePlay}
              trackType={track}
              videoUrl={post.videoUrl || post.media_url}
            />
          </div>
        </div>

        {/* Right Side: Metadata, Live Audio Track, & Exploration Breakdown */}
        <div className="flex-1 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="tag-pill text-xs font-mono">{post.category}</span>
              <span className="text-xs font-mono text-[var(--accent)] font-bold">4K 120FPS CINEMA</span>
            </div>
            <h3 className="theme-heading font-bold text-xl sm:text-2xl mb-2 leading-tight">{post.title}</h3>
            
            {/* Live Audio / Instagram Feed Indicator */}
            {isIg ? (
              <div className="glass-card-sm p-3.5 rounded-2xl flex items-center gap-3 border border-pink-500/40 bg-pink-500/10 mb-4">
                <InstagramIcon className="w-5 h-5 text-pink-400 animate-pulse flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-mono text-pink-400 uppercase font-bold tracking-wider">Instagram Live Reel Stream</p>
                  <p className="theme-heading font-bold text-xs truncate">Original Reel Audio & Video · @d_bagpacker_</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase flex items-center gap-1 border border-emerald-500/30">
                  ● Live
                </span>
              </div>
            ) : (
              <div className="glass-card-sm p-3.5 rounded-2xl flex items-center gap-3 border border-[var(--accent)] bg-[var(--accent-glow)] mb-4">
                <Disc className="w-5 h-5 text-[var(--accent)] animate-spin" style={{ animationDuration: "4s" }} />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-mono text-[var(--accent)] uppercase font-bold tracking-wider">Audio Soundtrack Active</p>
                  <p className="theme-heading font-bold text-xs truncate">{trackTitle}</p>
                </div>
                <button
                  onClick={togglePlay}
                  className="px-3 py-1 rounded-full bg-[var(--accent)] text-[#030712] font-bold text-[10px] font-mono cursor-pointer shadow-sm"
                >
                  {playing ? "Pause" : "Play"}
                </button>
              </div>
            )}

            <p className="theme-subtext text-xs sm:text-sm leading-relaxed mb-5">
              Captured on location during high-altitude exploration using Sony FX3 + DJI Cine Drone. Mastered with ACES color science and synced environmental sound design.
            </p>

            {/* Performance Stats */}
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              <div className="glass-card-sm p-3 rounded-2xl text-center border border-[var(--card-border)]">
                <p className="text-[10px] font-mono theme-muted uppercase mb-0.5">Total Views</p>
                <p className="text-base sm:text-lg font-bold font-mono text-[var(--accent)] flex items-center justify-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {post.views}
                </p>
              </div>
              <div className="glass-card-sm p-3 rounded-2xl text-center border border-[var(--card-border)]">
                <p className="text-[10px] font-mono theme-muted uppercase mb-0.5">Likes</p>
                <p className="text-base sm:text-lg font-bold font-mono theme-heading flex items-center justify-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500" /> {post.likes}
                </p>
              </div>
              <div className="glass-card-sm p-3 rounded-2xl text-center border border-[var(--card-border)]">
                <p className="text-[10px] font-mono theme-muted uppercase mb-0.5">Retention</p>
                <p className="text-base sm:text-lg font-bold font-mono text-emerald-400">94.2%</p>
              </div>
            </div>

            {/* Audience Reactions */}
            <div className="space-y-2">
              <p className="text-[10px] font-mono theme-muted uppercase tracking-wider mb-1">Explorer Community Reactions</p>
              {[
                { user: "@moto.explorer", text: "That corner transition on the mountain ridge was pure art 🔥" },
                { user: "@adventure_brand", text: "Incredible scale and drone piloting. DM sent for collaboration!" },
              ].map((c) => (
                <div key={c.user} className="glass-card-sm p-2.5 rounded-xl text-xs flex items-start gap-2 border border-[var(--card-border)]">
                  <span className="font-bold text-[var(--accent)]">{c.user}</span>
                  <span className="theme-subtext">{c.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--card-border)]">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold font-mono transition-all cursor-pointer ${
                liked
                  ? "bg-rose-500 text-white shadow-md"
                  : "glass-card theme-subtext hover:theme-heading"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? "fill-white" : ""}`} /> {liked ? "Liked!" : "Like Reel"}
            </button>

            {(post.media_url || post.videoUrl) && (
              <a
                href={post.media_url || post.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold font-mono bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:brightness-110 shadow-lg cursor-pointer transition-all"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>Open Reel on Instagram ↗</span>
              </a>
            )}

            <MagneticButton
              onClick={() => {
                handleClose();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="neon-btn-filled flex-1 text-xs py-2.5 cursor-pointer min-w-[200px]"
            >
              Book Similar Expedition Collab →
            </MagneticButton>
          </div>
        </div>

      </div>
    </div>
  );
}
