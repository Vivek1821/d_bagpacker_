"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Building2, Calendar, DollarSign, CheckCircle2 } from "lucide-react";

const INITIAL_PROJECTS = [
  { id: 1, title: "Samsung Galaxy S25 Launch Campaign", client: "Samsung India", deliverables: "3 Cinematic Reels, 5 Story Sets", results: "8.3M Organic Reach, 340% Store Visit Lift", budget: "₹4,50,000", status: "Completed", emoji: "📱" },
  { id: 2, title: "Nike Run India Awareness", client: "Nike India", deliverables: "2 Dedicated Reels, 1 YT Short", results: "6.1M Views, 42K Shares", budget: "₹3,75,000", status: "Completed", emoji: "👟" },
  { id: 3, title: "Spotify Podcast Discovery Series", client: "Spotify India", deliverables: "4 Reels + Podcast Feature", results: "180K New Listeners", budget: "₹2,50,000", status: "Active", emoji: "🎵" },
  { id: 4, title: "OnePlus Open Launch Series", client: "OnePlus", deliverables: "Unboxing Reel + Lifestyle Integration", results: "3.8M Views, 18K Comments", budget: "₹3,00,000", status: "Completed", emoji: "⚡" },
  { id: 5, title: "DJI Bali Aerial Expedition", client: "DJI Global", deliverables: "4K Drone Reel + Behind The Scenes", results: "9.2M Total Views Across Channels", budget: "₹6,00,000", status: "Active", emoji: "🛸" },
];

type Project = typeof INITIAL_PROJECTS[0];

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", client: "", deliverables: "", results: "", budget: "₹2,50,000", status: "Active", emoji: "🗂️" });

  const handleSave = () => {
    setProjects([{ id: Date.now(), ...formData }, ...projects]);
    setShowForm(false);
    setFormData({ title: "", client: "", deliverables: "", results: "", budget: "", status: "Active", emoji: "🗂️" });
  };

  const statusColor = (s: string) => s === "Active" ? "#00ff7f" : s === "Completed" ? "#06b6d4" : "#f97316";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-6 border-b border-[rgba(0,255,127,0.06)]">
        <div>
          <h2 className="text-white font-bold text-xl">Brand Campaigns & Projects</h2>
          <p className="text-white/40 text-sm font-mono mt-0.5">{projects.length} brand partnerships · {projects.filter(p => p.status === "Active").length} in progress</p>
        </div>
        <button onClick={() => setShowForm(true)} className="neon-btn-filled px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New Project
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-7 rounded-3xl border border-[rgba(0,255,127,0.3)] space-y-6 shadow-[0_15px_40px_rgba(0,0,0,0.8)] animate-float-up">
          <h3 className="text-white font-bold text-lg">Add Brand Campaign</h3>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { key: "title", label: "Campaign Title", placeholder: "e.g. Nike Air Max 2025" },
              { key: "client", label: "Brand / Client", placeholder: "e.g. Nike India" },
              { key: "deliverables", label: "Deliverables Scope", placeholder: "3 Reels, 5 Story Sets" },
              { key: "results", label: "KPIs / Results Achieved", placeholder: "8.3M views, 340% sales lift" },
              { key: "budget", label: "Campaign Budget (₹)", placeholder: "₹3,50,000" },
              { key: "emoji", label: "Campaign Icon", placeholder: "👟" },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-white/40 text-xs font-mono block mb-2 uppercase">{f.label}</label>
                <input
                  value={(formData as Record<string, string>)[f.key]}
                  onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                  className="neon-input w-full px-4 py-3 text-sm"
                  placeholder={f.placeholder}
                />
              </div>
            ))}
            <div>
              <label className="text-white/40 text-xs font-mono block mb-2 uppercase">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="neon-input w-full px-4 py-3 text-sm bg-[#0a0a0a]">
                <option>Active</option>
                <option>Completed</option>
                <option>On Hold</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4 pt-2">
            <button onClick={handleSave} className="neon-btn-filled px-7 py-3 rounded-xl text-sm font-bold">Save Campaign</button>
            <button onClick={() => setShowForm(false)} className="neon-btn px-6 py-3 rounded-xl text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((p) => (
          <div key={p.id} className="glass-card glass-card-hover p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-[rgba(0,255,127,0.08)] border border-[rgba(0,255,127,0.18)] flex items-center justify-center text-3xl flex-shrink-0">
              {p.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h3 className="text-white font-bold text-base">{p.title}</h3>
                <span className="text-[10px] font-mono px-3 py-1 rounded-full font-bold uppercase" style={{ background: statusColor(p.status) + "15", color: statusColor(p.status), border: `1px solid ${statusColor(p.status)}30` }}>
                  {p.status}
                </span>
                <span className="text-xs font-mono text-[#00ff7f] font-semibold">{p.budget}</span>
              </div>
              <p className="text-white/50 text-sm">{p.client} · <span className="text-white/70">{p.deliverables}</span></p>
              <p className="text-[#00ff7f] text-xs font-mono mt-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {p.results}
              </p>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button onClick={() => setProjects(projects.filter(x => x.id !== p.id))} className="p-2.5 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
