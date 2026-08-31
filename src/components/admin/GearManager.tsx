"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Camera, Wrench, CheckCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface GearItem {
  id: number;
  name: string;
  category: string;
  desc: string;
  emoji: string;
  badge: string;
  in_rig: boolean;
}

export default function GearManager() {
  const [gear, setGear] = useState<GearItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editGear, setEditGear] = useState<GearItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Camera",
    desc: "",
    emoji: "📷",
    badge: "In Studio",
    in_rig: true,
  });

  const fetchGear = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gear");
      const data = await res.json();
      if (data.data) setGear(data.data);
    } catch {
      toast.error("Failed to load gear list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGear();
  }, []);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Please enter equipment name");
      return;
    }
    setSaving(true);
    try {
      if (editGear) {
        const res = await fetch("/api/gear", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editGear.id, ...formData }),
        });
        const data = await res.json();
        if (data.success) {
          setGear(gear.map((g) => (g.id === editGear.id ? { ...g, ...formData } : g)));
          toast.success("Gear updated! 🎥");
        }
      } else {
        const res = await fetch("/api/gear", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success && data.data) {
          setGear([data.data, ...gear]);
          toast.success("New gear added to rig! 🛠️");
        }
      }
      setShowForm(false);
      setEditGear(null);
      setFormData({ name: "", category: "Camera", desc: "", emoji: "📷", badge: "In Studio", in_rig: true });
    } catch {
      toast.error("Error saving gear");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (g: GearItem) => {
    setEditGear(g);
    setFormData({
      name: g.name,
      category: g.category,
      desc: g.desc || "",
      emoji: g.emoji || "📷",
      badge: g.badge || "In Studio",
      in_rig: g.in_rig,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this equipment from studio rig?")) return;
    try {
      const res = await fetch(`/api/gear?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setGear(gear.filter((g) => g.id !== id));
        toast.success("Gear removed");
      }
    } catch {
      toast.error("Failed to delete gear");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-6 border-b border-[var(--card-border)]">
        <div>
          <h2 className="theme-heading font-bold text-xl sm:text-2xl">Production Gear & Rig</h2>
          <p className="theme-muted text-xs sm:text-sm font-mono mt-0.5">{gear.length} cinema tools in active studio setup</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditGear(null); }}
          className="neon-btn-filled px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> Add New Gear
        </button>
      </div>

      {/* Add / Edit Form Modal Card */}
      {showForm && (
        <div className="glass-card-lg p-6 sm:p-8 rounded-[32px] space-y-5 border border-[var(--accent)] shadow-2xl animate-float-up">
          <h3 className="theme-heading font-bold text-lg sm:text-xl">{editGear ? "Edit Equipment" : "Add Studio Equipment"}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Equipment Name</label>
              <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="neon-input" placeholder="e.g. Sony FX3 Cinema Line" />
            </div>
            <div>
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Category</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="neon-input">
                {["Camera", "Audio", "Editing", "Lighting", "Accessories"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Badge Tag</label>
              <input value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} className="neon-input" placeholder="e.g. A-Cam Cinema" />
            </div>
            <div>
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Emoji Icon</label>
              <input value={formData.emoji} onChange={(e) => setFormData({ ...formData, emoji: e.target.value })} className="neon-input text-center text-lg" placeholder="📷" />
            </div>
            <div className="sm:col-span-2">
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Technical Specifications / Description</label>
              <textarea value={formData.desc} onChange={(e) => setFormData({ ...formData, desc: e.target.value })} rows={2} className="neon-input resize-none text-xs" placeholder="Full-frame 4K 120fps 10-bit 4:2:2 internal recording..." />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="neon-btn-filled px-6 py-2.5 rounded-full text-xs font-bold cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {editGear ? "Save Changes" : "Add Equipment"}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditGear(null); }}
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
          <span className="text-xs font-mono">Loading gear from Supabase database...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {gear.map((item) => (
            <div key={item.id} className="glass-card p-5 rounded-3xl flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-2xl sm:text-3xl p-2 rounded-2xl bg-[var(--subtle-bg)] border border-[var(--card-border)]">{item.emoji}</span>
                  <span className="tag-pill text-[9px] uppercase font-mono">{item.badge}</span>
                </div>
                <h3 className="theme-heading font-bold text-sm sm:text-base">{item.name}</h3>
                <p className="theme-muted text-[10px] font-mono uppercase mt-0.5">{item.category}</p>
                <p className="theme-subtext text-xs leading-relaxed mt-2 line-clamp-3">{item.desc}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--card-border)] text-xs">
                <span className="text-[var(--accent)] font-semibold flex items-center gap-1">
                  ✓ In Studio Rig
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1.5 rounded-xl theme-subtext hover:text-[var(--accent)] hover:bg-[var(--subtle-bg)] transition-all cursor-pointer"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-xl theme-muted hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
