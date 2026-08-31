"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Film, Eye, Sparkles } from "lucide-react";

const INITIAL_REELS = [
  { id: 1, title: "Golden Hour Bali — FX3 + 24mm", url: "https://instagram.com/reel/1", thumbnail: "🌅", views: "5.2M", likes: "421K", category: "Cinematic", published: true, date: "2025-08-20" },
  { id: 2, title: "OnePlus Open First Impressions", url: "https://instagram.com/reel/2", thumbnail: "📱", views: "3.8M", likes: "198K", category: "UGC", published: true, date: "2025-08-18" },
  { id: 3, title: "Day in My Life — Creator Edition", url: "https://instagram.com/reel/3", thumbnail: "🎬", views: "7.1M", likes: "562K", category: "Lifestyle", published: true, date: "2025-08-15" },
  { id: 4, title: "Mumbai Monsoon — 4K Cinematic", url: "https://instagram.com/reel/4", thumbnail: "🌧️", views: "4.4M", likes: "334K", category: "Travel", published: true, date: "2025-08-12" },
  { id: 5, title: "When WiFi Cuts Out Mid-Collab", url: "https://instagram.com/reel/5", thumbnail: "😂", views: "8.3M", likes: "712K", category: "Skits", published: true, date: "2025-08-08" },
  { id: 6, title: "Color Grading in DaVinci in 60s", url: "https://instagram.com/reel/6", thumbnail: "🎨", views: "1.7M", likes: "89K", category: "Tutorial", published: true, date: "2025-08-02" },
];

type Reel = typeof INITIAL_REELS[0];

export default function ReelsManager() {
  const [reels, setReels] = useState<Reel[]>(INITIAL_REELS);
  const [showForm, setShowForm] = useState(false);
  const [editReel, setEditReel] = useState<Reel | null>(null);
  const [formData, setFormData] = useState({ title: "", url: "", thumbnail: "🎬", views: "", likes: "", category: "Cinematic", published: true });

  const handleSave = () => {
    if (editReel) {
      setReels(reels.map((r) => (r.id === editReel.id ? { ...editReel, ...formData } : r)));
    } else {
      setReels([{ id: Date.now(), date: new Date().toISOString().split("T")[0], ...formData }, ...reels]);
    }
    setShowForm(false);
    setEditReel(null);
    setFormData({ title: "", url: "", thumbnail: "🎬", views: "", likes: "", category: "Cinematic", published: true });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-6 border-b border-[rgba(0,255,127,0.06)]">
        <div>
          <h2 className="text-white font-bold text-xl">9:16 Reels Library</h2>
          <p className="text-white/40 text-sm font-mono mt-0.5">{reels.length} high-retention video reels in library</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditReel(null); }}
          className="neon-btn-filled px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Reel
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-7 rounded-3xl border border-[rgba(0,255,127,0.3)] space-y-6 shadow-[0_15px_40px_rgba(0,0,0,0.8)] animate-float-up">
          <h3 className="text-white font-bold text-lg">{editReel ? "Edit Reel" : "Add New Reel"}</h3>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-white/40 text-xs font-mono block mb-2 uppercase">Reel Title</label>
              <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="neon-input w-full px-4 py-3 text-sm" placeholder="e.g. Golden Hour Drone Chase" />
            </div>
            <div>
              <label className="text-white/40 text-xs font-mono block mb-2 uppercase">Instagram / YouTube URL</label>
              <input value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} className="neon-input w-full px-4 py-3 text-sm" placeholder="https://instagram.com/reel/..." />
            </div>
            <div>
              <label className="text-white/40 text-xs font-mono block mb-2 uppercase">Cover Emoji</label>
              <input value={formData.thumbnail} onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })} className="neon-input w-full px-4 py-3 text-sm" placeholder="🎬" />
            </div>
            <div>
              <label className="text-white/40 text-xs font-mono block mb-2 uppercase">Category</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="neon-input w-full px-4 py-3 text-sm bg-[#0a0a0a]">
                {["Cinematic", "UGC", "Lifestyle", "Travel", "Skits", "Tutorial", "Talking Head"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-white/40 text-xs font-mono block mb-2 uppercase">Views Count</label>
              <input value={formData.views} onChange={(e) => setFormData({ ...formData, views: e.target.value })} className="neon-input w-full px-4 py-3 text-sm" placeholder="e.g. 5.2M" />
            </div>
            <div>
              <label className="text-white/40 text-xs font-mono block mb-2 uppercase">Likes Count</label>
              <input value={formData.likes} onChange={(e) => setFormData({ ...formData, likes: e.target.value })} className="neon-input w-full px-4 py-3 text-sm" placeholder="e.g. 421K" />
            </div>
          </div>
          <div className="flex gap-4 pt-2">
            <button onClick={handleSave} className="neon-btn-filled px-7 py-3 rounded-xl text-sm font-bold">{editReel ? "Save Changes" : "Publish Reel"}</button>
            <button onClick={() => setShowForm(false)} className="neon-btn px-6 py-3 rounded-xl text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Grid of Reels Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reels.map((reel) => (
          <div key={reel.id} className="glass-card glass-card-hover p-6 rounded-3xl flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 rounded-2xl bg-[rgba(0,255,127,0.06)] border border-[rgba(0,255,127,0.15)] flex items-center justify-center text-3xl">
                  {reel.thumbnail}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditReel(reel); setFormData({ title: reel.title, url: reel.url, thumbnail: reel.thumbnail, views: reel.views, likes: reel.likes, category: reel.category, published: reel.published }); setShowForm(true); }} className="p-2 rounded-lg text-white/30 hover:text-[#00ff7f] hover:bg-[rgba(0,255,127,0.05)] transition-all"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => setReels(reels.filter((r) => r.id !== reel.id))} className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <h3 className="text-white font-bold text-base mb-2">{reel.title}</h3>
              <div className="flex items-center gap-3 text-xs font-mono text-white/40 mb-4">
                <span className="flex items-center gap-1 text-[#00ff7f] font-semibold"><Eye className="w-3.5 h-3.5" /> {reel.views}</span>
                <span>·</span>
                <span>{reel.category}</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <span className={`text-[10px] font-mono px-3 py-1 rounded-full font-bold uppercase ${reel.published ? "bg-[rgba(0,255,127,0.12)] text-[#00ff7f]" : "bg-[rgba(255,255,255,0.05)] text-white/30"}`}>
                {reel.published ? "Live On Portfolio" : "Draft"}
              </span>
              <Film className="w-4 h-4 text-white/20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
