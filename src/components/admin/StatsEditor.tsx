"use client";

import { useState } from "react";
import { Save, RefreshCw, BarChart2 } from "lucide-react";
import toast from "react-hot-toast";

const INITIAL_STATS = {
  ig_followers: "284000",
  ig_posts: "520",
  ig_avg_er: "8.4",
  yt_subscribers: "52000",
  yt_videos: "48",
  total_views: "47000000",
  brand_deals: "120",
  years_active: "6",
};

export default function StatsEditor() {
  const [stats, setStats] = useState(INITIAL_STATS);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast.success("Metrics updated on live portfolio!");
  };

  const FIELDS = [
    { key: "ig_followers", label: "Instagram Followers", platform: "Instagram" },
    { key: "ig_posts", label: "Total Reels & Posts", platform: "Instagram" },
    { key: "ig_avg_er", label: "Average Engagement Rate (%)", platform: "Instagram" },
    { key: "yt_subscribers", label: "YouTube Subscribers", platform: "YouTube" },
    { key: "yt_videos", label: "Published Videos / Shorts", platform: "YouTube" },
    { key: "total_views", label: "Lifetime Cross-Platform Views", platform: "Global" },
    { key: "brand_deals", label: "Completed Brand Collaborations", platform: "Business" },
    { key: "years_active", label: "Years in Content Production", platform: "Business" },
  ];

  const platforms = [...new Set(FIELDS.map((f) => f.platform))];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-6 border-b border-[rgba(0,255,127,0.06)]">
        <div>
          <h2 className="text-white font-bold text-xl">Portfolio Metrics & Stats Editor</h2>
          <p className="text-white/40 text-sm font-mono mt-0.5">Control the live numbers, follower counters, and proof badges</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="neon-btn-filled px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2.5 disabled:opacity-60">
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving Metrics..." : "Save Live Metrics"}
        </button>
      </div>

      {/* Grouped Platform Fields */}
      <div className="space-y-6">
        {platforms.map((platform) => (
          <div key={platform} className="glass-card p-8 rounded-3xl space-y-5">
            <p className="section-label">{platform.toUpperCase()} METRICS</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FIELDS.filter((f) => f.platform === platform).map((field) => (
                <div key={field.key}>
                  <label className="text-white/40 text-xs font-mono block mb-2 tracking-wider uppercase">{field.label}</label>
                  <input
                    type="number"
                    value={stats[field.key as keyof typeof stats]}
                    onChange={(e) => setStats({ ...stats, [field.key]: e.target.value })}
                    className="neon-input w-full px-4 py-3 text-sm font-mono"
                  />
                  <p className="text-white/20 text-[11px] font-mono mt-1.5">
                    Live Display: <span className="text-[#00ff7f]">{Number(stats[field.key as keyof typeof stats]).toLocaleString("en-IN")}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Live Preview Card */}
      <div className="glass-card p-8 rounded-3xl">
        <p className="section-label mb-6">// REAL-TIME DISPLAY PREVIEW</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "IG Followers", value: `${(Number(stats.ig_followers) / 1000).toFixed(0)}K` },
            { label: "Total Views", value: `${(Number(stats.total_views) / 1000000).toFixed(1)}M+` },
            { label: "Avg ER", value: `${stats.ig_avg_er}%` },
            { label: "Brand Partnerships", value: `${stats.brand_deals}+` },
          ].map((s) => (
            <div key={s.label} className="text-center glass-card p-5 rounded-2xl">
              <p className="text-[#00ff7f] font-bold text-2xl font-mono">{s.value}</p>
              <p className="text-white/40 text-xs mt-1 uppercase font-mono tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
