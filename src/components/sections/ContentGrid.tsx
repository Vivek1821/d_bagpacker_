"use client";

import { useState, useEffect } from "react";
import { Play, Eye, Heart, Sparkles, Compass, Film } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import TiltCard from "@/components/ui/TiltCard";
import { PostItem } from "@/components/ui/VideoModal";
import { getCleanInstagramEmbedUrl, getInstagramThumbnailUrl, isInstagramUrl } from "@/lib/instagram";

const CATEGORIES = ["All", "Riding", "Nature", "Adventure", "Trekking", "Drone FPV", "Roadtrips", "Lifestyle"];

// Exploration, Riding, Nature, Adventure, and Trekking Post items
const POSTS: (PostItem & { height: number })[] = [
  { id: 1, category: "Riding", height: 320, emoji: "🏍️", views: "6.8M", likes: "540K", title: "Spiti Valley High-Speed Moto Ride — 15,000ft", type: "reel", color: "from-amber-950/70 to-orange-950/70", trackType: "riding" },
  { id: 2, category: "Nature", height: 250, emoji: "🌊", views: "4.2M", likes: "310K", title: "Meghalaya Living Root Bridges & Deep Jungle", type: "reel", color: "from-teal-950/70 to-emerald-950/70", trackType: "nature" },
  { id: 3, category: "Trekking", height: 290, emoji: "⛰️", views: "5.7M", likes: "480K", title: "Kedarkantha Summit Sunrise 12,500ft", type: "reel", color: "from-blue-950/70 to-slate-950/70", trackType: "cinematic" },
  { id: 4, category: "Drone FPV", height: 350, emoji: "🦅", views: "8.1M", likes: "690K", title: "Ladakh Drone FPV Mountain Pass Dive", type: "reel", color: "from-indigo-950/70 to-sky-950/70", trackType: "cinematic" },
  { id: 5, category: "Adventure", height: 230, emoji: "🏕️", views: "3.9M", likes: "280K", title: "Solo Camp Under the Milky Way Galaxy", type: "reel", color: "from-purple-950/70 to-violet-950/70", trackType: "nature" },
  { id: 6, category: "Riding", height: 270, emoji: "🏍️", views: "5.1M", likes: "410K", title: "Coastal Goa to Gokarna Highway Tour", type: "reel", color: "from-orange-950/70 to-red-950/70", trackType: "riding" },
  { id: 7, category: "Nature", height: 310, emoji: "🌧️", views: "7.3M", likes: "590K", title: "Western Ghats Monsoon Waterfalls 4K", type: "reel", color: "from-cyan-950/70 to-blue-950/70", trackType: "nature" },
  { id: 8, category: "Adventure", height: 240, emoji: "🧗", views: "4.8M", likes: "360K", title: "Cliff Jumping in Bali Hidden Canyon", type: "reel", color: "from-emerald-950/70 to-teal-950/70", trackType: "cinematic" },
  { id: 9, category: "Roadtrips", height: 300, emoji: "🎒", views: "6.4M", likes: "510K", title: "14 Days Backpacking Across Northeast India", type: "reel", color: "from-rose-950/70 to-pink-950/70", trackType: "chill" },
  { id: 10, category: "Nature", height: 340, emoji: "🏜️", views: "9.2M", likes: "780K", title: "Thar Desert Dunes Star Photography", type: "reel", color: "from-amber-950/70 to-yellow-950/70", trackType: "nature" },
  { id: 11, category: "Riding", height: 220, emoji: "🏍️", views: "7.9M", likes: "630K", title: "Royal Enfield Himalayan High Pass Tour", type: "reel", color: "from-stone-900/70 to-zinc-950/70", trackType: "riding" },
  { id: 12, category: "Trekking", height: 260, emoji: "🏔️", views: "5.4M", likes: "430K", title: "Khardung La Pass at Minus 15°C", type: "reel", color: "from-sky-950/70 to-blue-950/70", trackType: "cinematic" },
  { id: 13, category: "Lifestyle", height: 280, emoji: "☕", views: "3.2M", likes: "260K", title: "Morning Chai at 14,000ft Homestay", type: "reel", color: "from-amber-950/70 to-orange-950/70", trackType: "chill" },
  { id: 14, category: "Adventure", height: 330, emoji: "🌊", views: "8.4M", likes: "710K", title: "Spiti Valley River Crossing POV", type: "reel", color: "from-blue-950/70 to-cyan-950/70", trackType: "riding" },
  { id: 15, category: "Nature", height: 250, emoji: "🌲", views: "4.6M", likes: "370K", title: "Himalayan Pine Forest Fog Sequence", type: "reel", color: "from-emerald-950/70 to-green-950/70", trackType: "nature" },
  { id: 16, category: "Riding", height: 310, emoji: "🏍️", views: "8.8M", likes: "740K", title: "Leh to Nubra Valley Sand Dunes Ride", type: "reel", color: "from-orange-950/70 to-amber-950/70", trackType: "riding" },
];

interface ContentGridProps {
  onSelectPost?: (post: PostItem) => void;
}

export default function ContentGrid({ onSelectPost }: ContentGridProps) {
  const [allPosts, setAllPosts] = useState<(PostItem & { height: number })[]>(POSTS);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          const apiPosts = data.data.map((p: any, idx: number) => {
            const hasMedia = Boolean(p.media_url);
            const isIg = isInstagramUrl(p.media_url || "");
            const embedUrl = isIg ? getCleanInstagramEmbedUrl(p.media_url) : "";
            return {
              id: p.id || 200 + idx,
              title: p.title,
              category: p.category || "Tutorial",
              emoji: hasMedia ? (isIg ? "📸" : "🎬") : "🎨",
              views: p.views || "1.7M",
              likes: p.likes || "89K",
              type: p.type || "reel",
              color: "from-zinc-950 via-zinc-900 to-black",
              trackType: (p.category === "Riding" ? "riding" : p.category === "Nature" ? "nature" : p.category === "Lifestyle" ? "chill" : "cinematic") as any,
              height: 290,
              media_url: p.media_url || "",
              videoUrl: embedUrl || p.media_url || "",
            };
          });

          // Match by title or prepend
          const existingTitles = new Set(apiPosts.map((p: any) => p.title.toLowerCase()));
          const remainingStatic = POSTS.filter((p) => !existingTitles.has(p.title.toLowerCase()));
          setAllPosts([...apiPosts, ...remainingStatic]);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = activeFilter === "All" ? allPosts : allPosts.filter((p) => p.category === activeFilter);

  return (
    <section id="work" className="section-wrapper">
      <div className="section-container max-w-7xl mx-auto">

        {/* Centered Section Header */}
        <RevealOnScroll className="section-header">
          <span className="section-label">// EXPEDITIONS, RIDES & NATURE VAULT</span>
          <h2 className="text-3xl sm:text-6xl md:text-7xl font-bold theme-heading mb-4 sm:mb-6 section-title">
            500+ <span className="gradient-text">Exploration Reels</span>
          </h2>
          <p className="section-desc">
            Motorcycle touring, high-altitude summits, wild nature, drone aerials, and solo backpacking documentaries. Click any card to play with live soundtrack!
          </p>
        </RevealOnScroll>

        {/* Filter Navigation Pills */}
        <RevealOnScroll className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-12 sm:mb-16 px-2">
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

        {/* Dynamic Masonry Columns */}
        <div className="masonry-container">
          {filtered.map((post, i) => (
            <div key={`post-${post.id}-${i}`} className="masonry-card">
              <RevealOnScroll delay={i * 0.03}>
                <div onClick={() => onSelectPost && onSelectPost(post)}>
                  <TiltCard className="glass-card glass-card-hover rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between border border-[var(--card-border)] group" intensity={5}>
                    {/* Visual Card Canvas */}
                    <div
                      className={`relative w-full bg-gradient-to-b ${post.color} flex items-center justify-center overflow-hidden rounded-t-2xl`}
                      style={{ height: `${post.height}px` }}
                    >
                      {(() => {
                        const poster = post.media_url && isInstagramUrl(post.media_url) ? getInstagramThumbnailUrl(post.media_url) : null;
                        return poster ? (
                          <div className="absolute inset-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={poster}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          </div>
                        ) : (
                          <span className="text-6xl sm:text-7xl opacity-35 group-hover:scale-110 group-hover:opacity-60 transition-all duration-500 select-none">
                            {post.emoji}
                          </span>
                        );
                      })()}

                      {/* Format Badge */}
                      <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/15">
                        <Play className="w-2.5 h-2.5 text-[var(--accent)]" fill="currentColor" />
                        <span className="text-[9px] font-mono text-white uppercase tracking-wider font-bold">
                          {post.category}
                        </span>
                      </div>

                      {/* Live Media Badge */}
                      {post.media_url && (
                        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-2.5 py-0.5 rounded-full shadow-lg text-[9px] font-mono font-bold uppercase tracking-wider z-10 animate-pulse">
                          {post.media_url.includes("instagram.com") ? <InstagramIcon className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                          <span>Live Reel</span>
                        </div>
                      )}

                      {/* Hover Overlay with Click to Play Notification */}
                      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                        <div className="w-14 h-14 rounded-full bg-[var(--accent-glow)] border-2 border-[var(--accent)] flex items-center justify-center mb-2 shadow-[0_0_25px_var(--accent-glow)] group-hover:scale-105 transition-transform">
                          <Play className="w-6 h-6 text-[var(--accent)] ml-0.5" fill="currentColor" />
                        </div>
                        <p className="text-white text-xs font-mono font-bold">Click to Play Video & Sound</p>
                        <p className="text-white/50 text-[10px] font-mono mt-0.5">Includes synced audio soundtrack</p>
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
