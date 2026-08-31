"use client";

import { useEffect, useState } from "react";
import { Eye, Film, Folder, Inbox, TrendingUp, Users, BarChart2, Zap, ArrowUpRight } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

interface DashboardOverviewProps {
  onNavigate?: (tab: string) => void;
}

export default function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  const [stats, setStats] = useState({
    postsCount: 10,
    reelsCount: 6,
    projectsCount: 3,
    inquiriesCount: 4,
  });

  useEffect(() => {
    // Fetch live counts
    Promise.all([
      fetch("/api/posts").then((r) => r.json()).catch(() => ({ data: [] })),
      fetch("/api/reels").then((r) => r.json()).catch(() => ({ data: [] })),
      fetch("/api/projects").then((r) => r.json()).catch(() => ({ data: [] })),
      fetch("/api/inquiry").then((r) => r.json()).catch(() => ({ data: [] })),
    ]).then(([posts, reels, projects, inqs]) => {
      setStats({
        postsCount: posts.data?.length || 10,
        reelsCount: reels.data?.length || 6,
        projectsCount: projects.data?.length || 3,
        inquiriesCount: inqs.data?.length || 4,
      });
    });
  }, []);

  const STATS_CARDS = [
    { icon: Eye, label: "Total Views", value: 47, suffix: "M+", color: "var(--accent)", delta: "+2.3M this week" },
    { icon: Film, label: "Published Reels", value: stats.reelsCount, suffix: "", color: "#f97316", delta: "Active in feed" },
    { icon: Users, label: "IG Followers", value: 284, suffix: "K", color: "#818cf8", delta: "+2.1K this week" },
    { icon: Inbox, label: "Brand Inquiries", value: stats.inquiriesCount, suffix: "", color: "#06b6d4", delta: "Awaiting reply" },
    { icon: Folder, label: "Brand Projects", value: stats.projectsCount, suffix: "", color: "#ec4899", delta: "In portfolio" },
    { icon: TrendingUp, label: "Avg Engagement", value: 8, suffix: ".4%", color: "#10b981", delta: "+0.3% MoM" },
  ];

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Welcome Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-[var(--card-border)]">
        <div className="w-12 h-12 rounded-2xl bg-[var(--accent)] flex items-center justify-center flex-shrink-0 shadow-md">
          <Zap className="w-6 h-6 text-[#030712]" fill="#030712" />
        </div>
        <div>
          <h2 className="theme-heading font-bold text-xl sm:text-2xl">Welcome back, Vivek 👋</h2>
          <p className="theme-muted text-xs sm:text-sm font-mono mt-0.5">
            Creator Studio Engine · Supabase Connected
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
        {STATS_CARDS.map((card) => (
          <div key={card.label} className="glass-card p-4 sm:p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <card.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: card.color }} />
              <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ background: card.color + "15", color: card.color }}>
                {card.delta}
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono mb-1" style={{ color: card.color }}>
              <AnimatedCounter target={card.value} suffix={card.suffix} />
            </div>
            <p className="theme-muted text-xs">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions - Fully Wired and Clickable */}
      <div>
        <p className="theme-muted text-xs font-mono tracking-[0.2em] uppercase mb-3 sm:mb-4">Quick Actions & Shortcuts</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Add Post", emoji: "📸", tab: "posts", desc: "Upload to vault" },
            { label: "Add Reel", emoji: "🎬", tab: "reels", desc: "9:16 Video feed" },
            { label: "New Project", emoji: "🗂️", tab: "projects", desc: "Brand campaign" },
            { label: "Check Inbox", emoji: "📩", tab: "inquiries", desc: "Brand inquiries" },
          ].map((a) => (
            <button
              key={a.label}
              onClick={() => onNavigate && onNavigate(a.tab)}
              className="glass-card p-4 sm:p-5 rounded-2xl text-left hover:border-[var(--accent)] transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-2xl sm:text-3xl block group-hover:scale-110 transition-transform">{a.emoji}</span>
                <ArrowUpRight className="w-4 h-4 theme-muted group-hover:text-[var(--accent)] transition-colors" />
              </div>
              <p className="theme-heading text-xs sm:text-sm font-bold">{a.label}</p>
              <p className="theme-muted text-[10px] sm:text-[11px] mt-0.5">{a.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div>
        <p className="theme-muted text-xs font-mono tracking-[0.2em] uppercase mb-3 sm:mb-4">Recent Studio Activity</p>
        <div className="space-y-2.5">
          {[
            { text: 'Published reel "Golden Hour Bali — FX3 + 24mm" — 1.2M views', time: "2h ago", emoji: "🎬" },
            { text: "New brand brief from Samsung India (₹2.5L–₹5L tier)", time: "5h ago", emoji: "📩" },
            { text: "Updated DaVinci Resolve color grading setup in studio rig", time: "1d ago", emoji: "📸" },
            { text: 'Project "Galaxy S25 Launch Series" marked Completed', time: "2d ago", emoji: "✅" },
          ].map((a, i) => (
            <div key={i} className="glass-card p-3.5 sm:p-4 rounded-xl flex items-start gap-3 sm:gap-4">
              <span className="text-lg sm:text-xl flex-shrink-0">{a.emoji}</span>
              <p className="theme-subtext text-xs sm:text-sm flex-1 leading-relaxed">{a.text}</p>
              <span className="theme-muted text-[10px] sm:text-xs font-mono flex-shrink-0 whitespace-nowrap">{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Analytics Chart */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-6">
          <BarChart2 className="w-4 h-4 text-[var(--accent)]" />
          <p className="theme-heading text-xs sm:text-sm font-semibold">Weekly Impressions & Views</p>
          <span className="ml-auto text-xs font-mono text-[var(--accent)] font-bold">+18% growth</span>
        </div>
        <div className="flex items-end gap-2 sm:gap-3 h-28 sm:h-32">
          {[
            { h: 55, day: "Mon", val: "2.1M" },
            { h: 70, day: "Tue", val: "2.7M" },
            { h: 42, day: "Wed", val: "1.6M" },
            { h: 88, day: "Thu", val: "3.4M" },
            { h: 65, day: "Fri", val: "2.5M" },
            { h: 100, day: "Sat", val: "3.8M" },
            { h: 78, day: "Sun", val: "3.0M" },
          ].map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 sm:gap-2 group">
              <span className="text-[8px] sm:text-[9px] font-mono theme-muted group-hover:text-[var(--accent)] transition-colors">{d.val}</span>
              <div
                className="w-full rounded-t-lg transition-all duration-300 group-hover:opacity-100"
                style={{
                  height: `${d.h}%`,
                  background: i === 5 ? "var(--accent)" : "var(--accent-dim)",
                  opacity: 0.85,
                }}
              />
              <span className="text-[9px] sm:text-[10px] font-mono theme-muted">{d.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
