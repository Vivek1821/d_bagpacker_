"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Folder, DollarSign, CheckCircle2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Project {
  id: number;
  title: string;
  client: string;
  deliverables: string;
  results: string;
  budget: string;
  emoji: string;
  status: string;
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editProj, setEditProj] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    client: "",
    deliverables: "",
    results: "",
    budget: "",
    emoji: "📱",
    status: "Active",
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.data) setProjects(data.data);
    } catch {
      toast.error("Failed to load projects from API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.client.trim()) {
      toast.error("Please provide title and client name");
      return;
    }
    setSaving(true);
    try {
      if (editProj) {
        const res = await fetch("/api/projects", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editProj.id, ...formData }),
        });
        const data = await res.json();
        if (data.success) {
          setProjects(projects.map((p) => (p.id === editProj.id ? { ...p, ...formData } : p)));
          toast.success("Campaign updated! ✨");
        }
      } else {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success && data.data) {
          setProjects([data.data, ...projects]);
          toast.success("Brand campaign created! 💼");
        }
      }
      setShowForm(false);
      setEditProj(null);
      setFormData({ title: "", client: "", deliverables: "", results: "", budget: "", emoji: "📱", status: "Active" });
    } catch {
      toast.error("Error saving campaign");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p: Project) => {
    setEditProj(p);
    setFormData({
      title: p.title,
      client: p.client,
      deliverables: p.deliverables || "",
      results: p.results || "",
      budget: p.budget || "",
      emoji: p.emoji || "📱",
      status: p.status || "Active",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this campaign?")) return;
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProjects(projects.filter((p) => p.id !== id));
        toast.success("Campaign deleted");
      }
    } catch {
      toast.error("Failed to delete campaign");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-6 border-b border-[var(--card-border)]">
        <div>
          <h2 className="theme-heading font-bold text-xl sm:text-2xl">Brand Campaigns & Projects</h2>
          <p className="theme-muted text-xs sm:text-sm font-mono mt-0.5">{projects.length} brand partnerships in database</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditProj(null); }}
          className="neon-btn-filled px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> Add New Project
        </button>
      </div>

      {/* Add / Edit Form Modal Card */}
      {showForm && (
        <div className="glass-card-lg p-6 sm:p-8 rounded-[32px] space-y-5 border border-[var(--accent)] shadow-2xl animate-float-up">
          <h3 className="theme-heading font-bold text-lg sm:text-xl">{editProj ? "Edit Campaign" : "Add Brand Campaign"}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Campaign Title</label>
              <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="neon-input" placeholder="e.g. Galaxy S25 Launch Series" />
            </div>
            <div>
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Brand / Client</label>
              <input value={formData.client} onChange={(e) => setFormData({ ...formData, client: e.target.value })} className="neon-input" placeholder="e.g. Samsung India" />
            </div>
            <div>
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Deliverables Scope</label>
              <input value={formData.deliverables} onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })} className="neon-input" placeholder="e.g. 3 Reels, 5 Story Sets" />
            </div>
            <div>
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Results / KPIs</label>
              <input value={formData.results} onChange={(e) => setFormData({ ...formData, results: e.target.value })} className="neon-input" placeholder="e.g. 8.3M views, 340% sales lift" />
            </div>
            <div>
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Campaign Budget (₹)</label>
              <input value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} className="neon-input" placeholder="₹4,50,000" />
            </div>
            <div>
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="neon-input">
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Contract Sent">Contract Sent</option>
                <option value="In Discussion">In Discussion</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="neon-btn-filled px-6 py-2.5 rounded-full text-xs font-bold cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {editProj ? "Save Changes" : "Create Project"}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditProj(null); }}
              className="neon-btn px-5 py-2.5 rounded-full text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-16 theme-muted flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
          <span className="text-xs font-mono">Loading campaigns from Supabase database...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((proj) => (
            <div key={proj.id} className="glass-card p-5 sm:p-6 rounded-3xl flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-3xl p-2 rounded-2xl bg-[var(--subtle-bg)] border border-[var(--card-border)]">{proj.emoji}</span>
                  <span
                    className={`text-[9px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      proj.status === "Completed"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-[var(--accent-glow)] text-[var(--accent)]"
                    }`}
                  >
                    {proj.status}
                  </span>
                </div>
                <h3 className="theme-heading font-bold text-base">{proj.title}</h3>
                <p className="theme-muted text-xs font-mono mt-0.5">{proj.client}</p>

                <div className="space-y-1.5 mt-4 text-xs">
                  <div className="flex justify-between">
                    <span className="theme-muted">Scope:</span>
                    <span className="theme-subtext font-medium">{proj.deliverables}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="theme-muted">Impact:</span>
                    <span className="text-[var(--accent)] font-semibold">{proj.results}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="theme-muted">Budget:</span>
                    <span className="theme-heading font-mono font-bold">{proj.budget}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--card-border)]">
                <button
                  onClick={() => handleEdit(proj)}
                  className="p-1.5 rounded-xl theme-subtext hover:text-[var(--accent)] hover:bg-[var(--subtle-bg)] transition-all cursor-pointer"
                  title="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(proj.id)}
                  className="p-1.5 rounded-xl theme-muted hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
