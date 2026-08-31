"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, Sparkles } from "lucide-react";

const INITIAL_GEAR = [
  { id: 1, name: "Sony FX3 Cinema Line", category: "Camera", desc: "Dual base ISO 800/12,800 full-frame 4K 120p cinema camera", emoji: "📷", badge: "A-Cam Cinema" },
  { id: 2, name: "Sony FE 24-70mm f/2.8 GM II", category: "Camera", desc: "Flagship zoom lens with ultra-sharp de-clicked aperture", emoji: "🔭", badge: "Hero Lens" },
  { id: 3, name: "DJI Ronin RS4 Pro Gimbal", category: "Camera", desc: "Carbon fiber 3-axis gimbal with LiDAR autofocus integration", emoji: "🎥", badge: "Stabilizer" },
  { id: 4, name: "Rode Wireless PRO", category: "Audio", desc: "Dual 32-bit float backup wireless transmitter system", emoji: "🎙️", badge: "Wireless Audio" },
  { id: 5, name: "Aputure LS 600d Pro", category: "Lighting", desc: "600W daylight point-source LED with Bowens mount control", emoji: "💡", badge: "Key Light" },
  { id: 6, name: "DaVinci Resolve Studio 19", category: "Editing", desc: "Hollywood standard ACES color grading and video editor", emoji: "🎨", badge: "Color Grading" },
  { id: 7, name: "M3 Max MacBook Pro 16\"", category: "Editing", desc: "16-core CPU 64GB unified memory mobile workstation", emoji: "💻", badge: "Workstation" },
  { id: 8, name: "DJI Mavic 3 Pro Cine", category: "Accessories", desc: "Tri-camera ProRes 422 HQ 4/3 CMOS aerial cinema drone", emoji: "🛸", badge: "Aerial Drone" },
];

type Gear = typeof INITIAL_GEAR[0];

export default function GearManager() {
  const [gear, setGear] = useState<Gear[]>(INITIAL_GEAR);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", category: "Camera", desc: "", emoji: "📷", badge: "" });

  const handleSave = () => {
    setGear([{ id: Date.now(), ...formData }, ...gear]);
    setShowForm(false);
    setFormData({ name: "", category: "Camera", desc: "", emoji: "📷", badge: "" });
  };

  const catColor: Record<string, string> = {
    Camera: "#f97316",
    Audio: "#ec4899",
    Editing: "#00ff7f",
    Lighting: "#f59e0b",
    Accessories: "#818cf8",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-6 border-b border-[rgba(0,255,127,0.06)]">
        <div>
          <h2 className="text-white font-bold text-xl">Production Rig & Equipment</h2>
          <p className="text-white/40 text-sm font-mono mt-0.5">{gear.length} production items displayed on live portfolio</p>
        </div>
        <button onClick={() => setShowForm(true)} className="neon-btn-filled px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Gear Item
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-7 rounded-3xl border border-[rgba(0,255,127,0.3)] space-y-6 shadow-[0_15px_40px_rgba(0,0,0,0.8)] animate-float-up">
          <h3 className="text-white font-bold text-lg">Add Gear / Equipment</h3>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-white/40 text-xs font-mono block mb-2 uppercase">Equipment Name</label>
              <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="neon-input w-full px-4 py-3 text-sm" placeholder="e.g. Sony FX3 Cinema Line" />
            </div>
            <div>
              <label className="text-white/40 text-xs font-mono block mb-2 uppercase">Category</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="neon-input w-full px-4 py-3 text-sm bg-[#0a0a0a]">
                {["Camera", "Audio", "Editing", "Lighting", "Accessories"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-white/40 text-xs font-mono block mb-2 uppercase">Role / Badge Label</label>
              <input value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} className="neon-input w-full px-4 py-3 text-sm" placeholder="e.g. A-Cam Cinema" />
            </div>
            <div>
              <label className="text-white/40 text-xs font-mono block mb-2 uppercase">Icon / Emoji</label>
              <input value={formData.emoji} onChange={(e) => setFormData({ ...formData, emoji: e.target.value })} className="neon-input w-full px-4 py-3 text-sm" placeholder="📷" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-white/40 text-xs font-mono block mb-2 uppercase">Technical Description</label>
              <input value={formData.desc} onChange={(e) => setFormData({ ...formData, desc: e.target.value })} className="neon-input w-full px-4 py-3 text-sm" placeholder="Brief technical specifications and role in production..." />
            </div>
          </div>
          <div className="flex gap-4 pt-2">
            <button onClick={handleSave} className="neon-btn-filled px-7 py-3 rounded-xl text-sm font-bold">Add Equipment</button>
            <button onClick={() => setShowForm(false)} className="neon-btn px-6 py-3 rounded-xl text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Gear Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gear.map((item) => (
          <div key={item.id} className="glass-card glass-card-hover p-6 rounded-3xl flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: (catColor[item.category] || "#00ff7f") + "15", border: `1px solid ${(catColor[item.category] || "#00ff7f")}30` }}>
                  {item.emoji}
                </div>
                <button onClick={() => setGear(gear.filter(g => g.id !== item.id))} className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
              <h3 className="text-white font-bold text-base mb-1.5">{item.name}</h3>
              <p className="text-white/45 text-sm leading-relaxed mb-6">{item.desc}</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <span className="text-[10px] font-mono px-3 py-1 rounded-full font-bold uppercase" style={{ background: (catColor[item.category] || "#00ff7f") + "15", color: catColor[item.category] || "#00ff7f", border: `1px solid ${(catColor[item.category] || "#00ff7f")}30` }}>
                {item.badge}
              </span>
              <span className="text-xs text-white/35 font-mono uppercase">{item.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
