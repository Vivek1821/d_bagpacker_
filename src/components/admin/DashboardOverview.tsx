"use client";

import { useEffect, useState } from "react";
import { Eye, Film, Folder, Inbox, TrendingUp, Users, BarChart2, Zap, ArrowUpRight, FileText } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

interface DashboardOverviewProps {
  onNavigate?: (tab: string) => void;
}

export default function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  const [stats, setStats] = useState({
    postsCount: 302,
    reelsCount: 16,
    projectsCount: 4,
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
        postsCount: (posts.data?.length || 0) > 6 ? posts.data.length : 302,
        reelsCount: (reels.data?.length || 0) > 4 ? reels.data.length : 16,
        projectsCount: projects.data?.length || 4,
        inquiriesCount: inqs.data?.length || 4,
      });
    });
  }, []);

  const STATS_CARDS = [
    { icon: Users, label: "IG Followers", value: 20, suffix: "K+", color: "var(--accent)", delta: "@d_bagpacker_" },
    { icon: Eye, label: "Total Views", value: 12, suffix: "M+", color: "#10b981", delta: "+450K this month" },
    { icon: Film, label: "Published Content", value: stats.postsCount, suffix: "+", color: "#f97316", delta: "Posts & Reels" },
    { icon: Inbox, label: "Brand Inquiries", value: stats.inquiriesCount, suffix: "", color: "#06b6d4", delta: "Awaiting reply" },
    { icon: Folder, label: "Active Deals", value: stats.projectsCount, suffix: "", color: "#ec4899", delta: "In pipeline" },
    { icon: TrendingUp, label: "Avg Engagement", value: 8, suffix: ".6%", color: "#818cf8", delta: "3.2x benchmark" },
  ];

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Welcome Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-[var(--card-border)]">
        <div className="w-12 h-12 rounded-2xl bg-[var(--accent)] flex items-center justify-center flex-shrink-0 shadow-md">
          <Zap className="w-6 h-6 text-[#030712]" fill="#030712" />
        </div>
        <div>
          <h2 className="theme-heading font-bold text-xl sm:text-2xl">Welcome back, D_BagPacker_Girl_ 🎒</h2>
          <p className="theme-muted text-xs sm:text-sm font-mono mt-0.5">
            Creator Studio Engine · @d_bagpacker_ · Supabase & GST Invoicing Active
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

      {/* Quick actions - Including Invoice Generator */}
      <div>
        <p className="theme-muted text-xs font-mono tracking-[0.2em] uppercase mb-3 sm:mb-4">Studio Actions & Shortcuts</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "GST Tax Invoice", emoji: "📄", tab: "invoices", desc: "Generate client PDF" },
            { label: "Add Post", emoji: "📸", tab: "posts", desc: "Upload to vault" },
            { label: "Add Reel", emoji: "🎬", tab: "reels", desc: "9:16 Video feed" },
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
        <p className="theme-muted text-xs font-mono tracking-[0.2em] uppercase mb-3 sm:mb-4">Recent Creator Activity</p>
        <div className="space-y-2.5">
          {[
            { text: 'Published reel "Western Ghats Monsoon Waterfalls 4K" — 240K views', time: "3h ago", emoji: "🎬" },
            { text: "Generated GST Tax Invoice #DBG-2025-001 for Wildcraft India", time: "6h ago", emoji: "📄" },
            { text: "New brand collaboration brief received from Decathlon India", time: "1d ago", emoji: "📩" },
            { text: 'Milestone: Reached 302 published travel posts on @d_bagpacker_', time: "2d ago", emoji: "🎉" },
          ].map((a, i) => (
            <div key={i} className="glass-card p-3.5 sm:p-4 rounded-xl flex items-start gap-3 sm:gap-4">
              <span className="text-lg sm:text-xl flex-shrink-0">{a.emoji}</span>
              <p className="theme-subtext text-xs sm:text-sm flex-1 leading-relaxed">{a.text}</p>
              <span className="theme-muted text-[10px] sm:text-xs font-mono flex-shrink-0 whitespace-nowrap">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
