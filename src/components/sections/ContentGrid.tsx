"use client";

import { useState } from "react";
import { Play, Eye, Heart, Sparkles } from "lucide-react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import TiltCard from "@/components/ui/TiltCard";
import { PostItem } from "@/components/ui/VideoModal";

const CATEGORIES = ["All", "Cinematic", "Skits", "UGC", "Travel", "Talking Head", "Tutorial", "Lifestyle"];

// Varied staggered heights for the dynamic masonry mismatched look
const POSTS: (PostItem & { height: number })[] = [
  { id: 1, category: "Cinematic", height: 320, emoji: "🌅", views: "5.2M", likes: "421K", title: "Golden Hour Bali — FX3 + 24mm", type: "reel", color: "from-amber-950/70 to-orange-950/70" },
  { id: 2, category: "UGC", height: 240, emoji: "📱", views: "3.8M", likes: "198K", title: "OnePlus Open First Impressions", type: "reel", color: "from-blue-950/70 to-indigo-950/70" },
  { id: 3, category: "Lifestyle", height: 280, emoji: "☕", views: "2.1M", likes: "134K", title: "Morning Routine as a Creator", type: "reel", color: "from-stone-900/70 to-amber-950/70" },
  { id: 4, category: "Travel", height: 340, emoji: "🌧️", views: "4.4M", likes: "334K", title: "Mumbai Monsoon — 4K Cinematic", type: "reel", color: "from-slate-900/70 to-blue-950/70" },
  { id: 5, category: "Skits", height: 220, emoji: "😂", views: "8.3M", likes: "712K", title: "When WiFi Cuts Out Mid-Collab", type: "reel", color: "from-yellow-950/70 to-orange-950/70" },
  { id: 6, category: "Tutorial", height: 260, emoji: "🎨", views: "1.7M", likes: "89K", title: "Color Grading in DaVinci in 60s", type: "reel", color: "from-purple-950/70 to-violet-950/70" },
  { id: 7, category: "Cinematic", height: 310, emoji: "🏙️", views: "6.1M", likes: "498K", title: "Dubai Skyline — Drone + FX3", type: "reel", color: "from-cyan-950/70 to-blue-950/70" },
  { id: 8, category: "Talking Head", height: 250, emoji: "🎙️", views: "1.3M", likes: "67K", title: "How I Grew to 200K Followers", type: "post", color: "from-green-950/70 to-teal-950/70" },
  { id: 9, category: "UGC", height: 290, emoji: "🎧", views: "2.9M", likes: "167K", title: "Sony WH-1000XM5 Honest Review", type: "reel", color: "from-rose-950/70 to-pink-950/70" },
  { id: 10, category: "Travel", height: 350, emoji: "🏝️", views: "9.7M", likes: "821K", title: "Maldives Overwater POV", type: "reel", color: "from-teal-950/70 to-emerald-950/70" },
  { id: 11, category: "Skits", height: 210, emoji: "🤦", views: "5.5M", likes: "443K", title: "Every Brand Brief Ever (POV)", type: "reel", color: "from-red-950/70 to-rose-950/70" },
  { id: 12, category: "Tutorial", height: 260, emoji: "💡", views: "2.2M", likes: "112K", title: "3-Second Hook Formula Explained", type: "post", color: "from-yellow-950/70 to-lime-950/70" },
  { id: 13, category: "Lifestyle", height: 300, emoji: "🏠", views: "3.4M", likes: "276K", title: "My Creator Studio Setup 2025", type: "reel", color: "from-indigo-950/70 to-purple-950/70" },
  { id: 14, category: "Cinematic", height: 360, emoji: "🌊", views: "7.8M", likes: "634K", title: "Goa Ocean 120fps Slow-Mo", type: "reel", color: "from-blue-950/70 to-cyan-950/70" },
  { id: 15, category: "UGC", height: 240, emoji: "👟", views: "4.1M", likes: "312K", title: "Nike Air Max Launch Campaign", type: "reel", color: "from-orange-950/70 to-red-950/70" },
  { id: 16, category: "Travel", height: 330, emoji: "🏔️", views: "8.4M", likes: "711K", title: "Ladakh at Sunrise — S-Log3", type: "reel", color: "from-indigo-950/70 to-sky-950/70" },
];

interface ContentGridProps {
  onSelectPost?: (post: PostItem) => void;
}

export default function ContentGrid({ onSelectPost }: ContentGridProps) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All" ? POSTS : POSTS.filter((p) => p.category === activeFilter);

  return (
    <section id="work" className="section-wrapper">
      <div className="section-container max-w-7xl mx-auto">

        {/* Centered Section Header */}
        <RevealOnScroll className="section-header">
          <span className="section-label">// CREATOR CONTENT VAULT</span>
          <h2 className="text-3xl sm:text-6xl md:text-7xl font-bold theme-heading mb-4 sm:mb-6 section-title">
            500+ <span className="gradient-text">Viral Posts & Reels</span>
          </h2>
          <p className="section-desc">
            Every niche. Every format. Click any piece to inspect the cinematic color science, retention breakdown, and campaign insights.
          </p>
        </RevealOnScroll>

        {/* Filter Navigation Pills */}
        <RevealOnScroll className="flex flex-wrap gap-2.5 sm:gap-3.5 justify-center mb-12 sm:mb-16 px-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`tag-pill cursor-pointer transition-all duration-200 ${
                activeFilter === cat ? "active" : "opacity-65 hover:opacity-100"
              }`}
            >
              {activeFilter === cat && <Sparkles className="w-3 h-3 mr-1.5" />}
              {cat}
            </button>
          ))}
        </RevealOnScroll>

        {/* Dynamic Masonry Columns — Optimized for XL view & mobile */}
        <div className="masonry-container">
          {filtered.map((post, i) => (
            <div key={post.id} className="masonry-card">
              <RevealOnScroll delay={i * 0.03}>
                <div onClick={() => onSelectPost && onSelectPost(post)}>
                  <TiltCard className="glass-card glass-card-hover rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between border border-[var(--card-border)] group" intensity={5}>
                    {/* Dynamic Height Visual Area */}
                    <div
                      className={`relative w-full bg-gradient-to-b ${post.color} flex items-center justify-center overflow-hidden rounded-t-2xl`}
                      style={{ height: `${post.height}px` }}
                    >
                      <span className="text-6xl sm:text-7xl opacity-30 group-hover:scale-110 group-hover:opacity-50 transition-all duration-500 select-none">
                        {post.emoji}
                      </span>

                      {/* Format Badge */}
                      <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/15">
                        <Play className="w-2.5 h-2.5 text-[var(--accent)]" fill="currentColor" />
                        <span className="text-[9px] font-mono text-white uppercase tracking-wider font-bold">
                          {post.type}
                        </span>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                        <div className="w-12 h-12 rounded-full bg-[var(--accent-glow)] border border-[var(--accent)] flex items-center justify-center mb-2 shadow-[0_0_20px_var(--accent-glow)]">
                          <Play className="w-5 h-5 text-[var(--accent)] ml-0.5" fill="currentColor" />
                        </div>
                        <p className="text-white text-xs font-mono">Inspect Breakdown</p>
                      </div>
                    </div>

                    {/* Information Card Footer */}
                    <div className="p-4 sm:p-5 bg-[var(--card-bg)] border-t border-[var(--card-border)] space-y-2">
                      <span className="tag-pill text-[9px] uppercase font-mono">{post.category}</span>
                      <h3 className="theme-heading font-bold text-xs sm:text-sm leading-snug line-clamp-2">{post.title}</h3>
                      <div className="flex items-center justify-between pt-2.5 border-t border-[var(--card-border)] text-xs font-mono theme-muted">
                        <span className="flex items-center gap-1 text-[var(--accent)] font-semibold">
                          <Eye className="w-3.5 h-3.5" /> {post.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-rose-500" /> {post.likes}
                        </span>
                      </div>
                    </div>
                  </TiltCard>
                </div>
              </RevealOnScroll>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
