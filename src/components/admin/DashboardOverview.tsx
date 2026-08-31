"use client";

import { useState } from "react";
import { Eye, Film, Folder, Inbox, TrendingUp, Users, BarChart2, Zap } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const STATS_CARDS = [
  { icon: Eye, label: "Total Views", value: 47, suffix: "M+", color: "#00ff7f", delta: "+2.3M this week" },
  { icon: Film, label: "Published Reels", value: 312, suffix: "", color: "#f97316", delta: "+8 this month" },
  { icon: Users, label: "IG Followers", value: 284, suffix: "K", color: "#818cf8", delta: "+2.1K this week" },
  { icon: Inbox, label: "New Inquiries", value: 3, suffix: "", color: "#06b6d4", delta: "Awaiting reply" },
  { icon: Folder, label: "Completed Projects", value: 120, suffix: "+", color: "#ec4899", delta: "3 active" },
  { icon: TrendingUp, label: "Avg Engagement", value: 8, suffix: ".4%", color: "#84cc16", delta: "+0.3% MoM" },
];

const RECENT_ACTIVITY = [
  { text: 'Published reel "Golden Hour Bali — FX3 + 24mm" — 1.2M views in 48hrs', time: "2h ago", emoji: "🎬" },
  { text: "New brand inquiry from Samsung India (₹3L–₹5L budget)", time: "5h ago", emoji: "📩" },
  { text: "Added 12 posts to Content Vault — Ladakh series", time: "1d ago", emoji: "📸" },
  { text: 'Project "Nike India Run Campaign" marked Completed', time: "2d ago", emoji: "✅" },
  { text: "Spotify India inquiry accepted — contract sent", time: "3d ago", emoji: "🎵" },
  { text: "Monthly stats updated — 9.7M views in August", time: "4d ago", emoji: "📊" },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-10">
      {/* Welcome */}
      <div className="flex items-center gap-4 pb-6 border-b border-[rgba(0,255,127,0.06)]">
        <div className="w-12 h-12 rounded-2xl bg-[#00ff7f] flex items-center justify-center flex-shrink-0">
          <Zap className="w-6 h-6 text-[#020202]" fill="#020202" />
        </div>
        <div>
          <h2 className="text-white font-bold text-xl">Welcome back, Vivek 👋</h2>
          <p className="text-white/40 text-sm font-mono mt-0.5">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {STATS_CARDS.map((card, i) => (
          <div key={card.label} className="glass-card p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <card.icon className="w-4 h-4" style={{ color: card.color }} />
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full" style={{ background: card.color + "15", color: card.color }}>
                {card.delta}
              </span>
            </div>
            <div className="text-2xl font-bold font-mono mb-1.5" style={{ color: card.color }}>
              <AnimatedCounter target={card.value} suffix={card.suffix} />
            </div>
            <p className="text-white/40 text-xs">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-white/30 text-xs font-mono tracking-[0.2em] uppercase mb-4">Quick Actions</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Add Post", emoji: "📸", color: "#00ff7f" },
            { label: "Add Reel", emoji: "🎬", color: "#f97316" },
            { label: "New Project", emoji: "🗂️", color: "#818cf8" },
            { label: "Update Stats", emoji: "📊", color: "#06b6d4" },
          ].map((a) => (
            <button key={a.label} className="glass-card p-5 rounded-2xl text-center hover:border-[rgba(0,255,127,0.15)] transition-all duration-200 group">
              <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform duration-200">{a.emoji}</span>
              <span className="text-xs font-medium text-white/50 group-hover:text-white/80 transition-colors">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <p className="text-white/30 text-xs font-mono tracking-[0.2em] uppercase mb-4">Recent Activity</p>
        <div className="space-y-2.5">
          {RECENT_ACTIVITY.map((a, i) => (
            <div key={i} className="glass-card p-4 rounded-xl flex items-start gap-4">
              <span className="text-xl flex-shrink-0 mt-0.5">{a.emoji}</span>
              <p className="text-white/60 text-sm flex-1 leading-relaxed">{a.text}</p>
              <span className="text-white/25 text-xs font-mono flex-shrink-0 whitespace-nowrap">{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly chart */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-8">
          <BarChart2 className="w-4 h-4 text-[#00ff7f]" />
          <p className="text-white/60 text-sm font-semibold">Weekly Views (in millions)</p>
          <span className="ml-auto text-xs font-mono text-[#00ff7f]">+18% vs last week</span>
        </div>
        <div className="flex items-end gap-3 h-32">
          {[
            { h: 55, day: "Mon", val: "2.1M" },
            { h: 70, day: "Tue", val: "2.7M" },
            { h: 42, day: "Wed", val: "1.6M" },
            { h: 88, day: "Thu", val: "3.4M" },
            { h: 65, day: "Fri", val: "2.5M" },
            { h: 100, day: "Sat", val: "3.8M" },
            { h: 78, day: "Sun", val: "3.0M" },
          ].map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="text-[9px] font-mono text-white/20 group-hover:text-[#00ff7f] transition-colors">{d.val}</span>
              <div className="w-full rounded-t-lg transition-all duration-500 group-hover:opacity-100"
                style={{
                  height: `${d.h}%`,
                  background: i === 5 ? "#00ff7f" : "rgba(0,255,127,0.15)",
                  boxShadow: i === 5 ? "0 0 15px rgba(0,255,127,0.3)" : undefined,
                  opacity: 0.85,
                }} />
              <span className="text-[10px] font-mono text-white/25">{d.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
