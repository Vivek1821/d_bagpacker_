"use client";

import { useEffect, useState } from "react";
import { X, Play, Heart, Volume2, VolumeX, Eye } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

export interface PostItem {
  id: number;
  title: string;
  category: string;
  emoji: string;
  views: string;
  likes: string;
  type?: string;
  color?: string;
}

interface VideoModalProps {
  post: PostItem | null;
  onClose: () => void;
}

export default function VideoModal({ post, onClose }: VideoModalProps) {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [progress, setProgress] = useState(35);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl animate-float-up">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl glass-card-lg p-6 sm:p-10 rounded-[36px] border border-[var(--accent)] shadow-2xl overflow-hidden flex flex-col lg:flex-row gap-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-all cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Simulated 9:16 Video Player */}
        <div className="w-full lg:w-[300px] flex-shrink-0 flex justify-center">
          <div
            className="relative w-full max-w-[260px] sm:max-w-[300px] aspect-[9/16] rounded-[32px] overflow-hidden border-4 border-white/15 shadow-2xl flex flex-col justify-between p-4"
            style={{ background: "linear-gradient(180deg, #111827 0%, #030712 100%)" }}
          >
            {/* Play/Pause Overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={() => setPlaying(!playing)}
            >
              <span className="text-7xl sm:text-8xl opacity-30 select-none">{post.emoji}</span>
              {!playing && (
                <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl">
                  <Play className="w-6 h-6 text-[var(--accent)] ml-0.5" fill="currentColor" />
                </div>
              )}
            </div>

            {/* Video Controls Header */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="tag-pill text-[9px] bg-black/60 backdrop-blur-md uppercase text-white">{post.category}</span>
              <button
                onClick={() => setMuted(!muted)}
                className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white"
              >
                {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[var(--accent)]" />}
              </button>
            </div>

            {/* Video Timeline & Footer */}
            <div className="relative z-10 space-y-2.5 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 rounded-2xl">
              <p className="text-white font-bold text-xs sm:text-sm leading-snug">{post.title}</p>
              
              {/* Scrubbing Bar */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full accent-[var(--accent)] h-1 bg-white/20 rounded-full cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-white/50">
                  <span>0:14</span>
                  <span>0:42</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Metadata & Engagement Breakdown */}
        <div className="flex-1 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="tag-pill text-xs font-mono">{post.category}</span>
              <span className="text-xs font-mono text-[var(--accent)] font-bold">CINEMA 4K 120FPS</span>
            </div>
            <h3 className="theme-heading font-bold text-xl sm:text-2xl mb-3 leading-tight">{post.title}</h3>
            
            <p className="theme-subtext text-xs sm:text-sm leading-relaxed mb-6">
              Shot on Sony FX3 Cinema Line with active cooling and S-Log3 10-bit color profile. Mastered in DaVinci Resolve Studio with custom ACES color science.
            </p>

            {/* Performance Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="glass-card-sm p-3.5 rounded-2xl text-center border border-[var(--card-border)]">
                <p className="text-[10px] font-mono theme-muted uppercase mb-1">Total Views</p>
                <p className="text-lg sm:text-xl font-bold font-mono text-[var(--accent)] flex items-center justify-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {post.views}
                </p>
              </div>
              <div className="glass-card-sm p-3.5 rounded-2xl text-center border border-[var(--card-border)]">
                <p className="text-[10px] font-mono theme-muted uppercase mb-1">Likes</p>
                <p className="text-lg sm:text-xl font-bold font-mono theme-heading flex items-center justify-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500" /> {post.likes}
                </p>
              </div>
              <div className="glass-card-sm p-3.5 rounded-2xl text-center border border-[var(--card-border)]">
                <p className="text-[10px] font-mono theme-muted uppercase mb-1">Retention</p>
                <p className="text-lg sm:text-xl font-bold font-mono text-emerald-400">94.2%</p>
              </div>
            </div>

            {/* Simulated Live Comments */}
            <div className="space-y-2">
              <p className="text-[10px] font-mono theme-muted uppercase tracking-wider mb-1">Audience Reactions</p>
              {[
                { user: "@alex.cinematics", text: "That transition at 0:03 is genuinely insane 🔥" },
                { user: "@brand_director", text: "The color grade is cinematic perfection. DM sent for collab!" },
              ].map((c) => (
                <div key={c.user} className="glass-card-sm p-3 rounded-xl text-xs flex items-start gap-2.5 border border-[var(--card-border)]">
                  <span className="font-bold text-[var(--accent)]">{c.user}</span>
                  <span className="theme-subtext">{c.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3 pt-5 border-t border-[var(--card-border)]">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold font-mono transition-all cursor-pointer ${
                liked
                  ? "bg-rose-500 text-white shadow-md"
                  : "glass-card theme-subtext hover:theme-heading"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? "fill-white" : ""}`} /> {liked ? "Liked!" : "Like Reel"}
            </button>
            <MagneticButton
              onClick={() => {
                onClose();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="neon-btn-filled flex-1 text-xs py-2.5 cursor-pointer"
            >
              Collaborate on Similar Content →
            </MagneticButton>
          </div>
        </div>

      </div>
    </div>
  );
}
