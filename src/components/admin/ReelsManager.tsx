"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Film, Eye, Sparkles, Loader2, Link2 } from "lucide-react";
import toast from "react-hot-toast";

interface Reel {
  id: number;
  title: string;
  url: string;
  thumbnail: string;
  views: string;
  likes: string;
  category: string;
  published: boolean;
  date: string;
}

export default function ReelsManager() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editReel, setEditReel] = useState<Reel | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    thumbnail: "🎬",
    views: "1.8M",
    likes: "120K",
    category: "Cinematic",
    published: true,
  });

  const fetchReels = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reels");
      const data = await res.json();
      if (data.data) setReels(data.data);
    } catch {
      toast.error("Failed to load reels from API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    setSaving(true);
    try {
      if (editReel) {
        const res = await fetch("/api/reels", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editReel.id, ...formData }),
        });
        const data = await res.json();
        if (data.success) {
          setReels(reels.map((r) => (r.id === editReel.id ? { ...r, ...formData } : r)));
          toast.success("Reel updated successfully! ✨");
        }
      } else {
        const res = await fetch("/api/reels", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success && data.data) {
          setReels([data.data, ...reels]);
          toast.success("New 9:16 reel published! 🎬");
        }
      }
      setShowForm(false);
      setEditReel(null);
      setFormData({ title: "", url: "", thumbnail: "🎬", views: "1.8M", likes: "120K", category: "Cinematic", published: true });
    } catch {
      toast.error("Error saving reel");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (r: Reel) => {
    setEditReel(r);
    setFormData({
      title: r.title,
      url: r.url,
      thumbnail: r.thumbnail,
      views: r.views,
      likes: r.likes,
      category: r.category,
      published: r.published,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this reel?")) return;
    try {
      const res = await fetch(`/api/reels?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setReels(reels.filter((r) => r.id !== id));
        toast.success("Reel deleted");
      }
    } catch {
      toast.error("Failed to delete reel");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-6 border-b border-[var(--card-border)]">
        <div>
          <h2 className="theme-heading font-bold text-xl sm:text-2xl">9:16 Reels Library</h2>
          <p className="theme-muted text-xs sm:text-sm font-mono mt-0.5">{reels.length} high-retention video reels in library</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditReel(null); }}
          className="neon-btn-filled px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> Add New Reel
        </button>
      </div>

      {/* Add / Edit Form Modal Card */}
      {showForm && (
        <div className="glass-card-lg p-6 sm:p-8 rounded-[32px] space-y-5 border border-[var(--accent)] shadow-2xl animate-float-up">
          <h3 className="theme-heading font-bold text-lg sm:text-xl">{editReel ? "Edit Reel" : "Add New 9:16 Reel"}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Reel Title</label>
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="neon-input"
                placeholder="e.g. Golden Hour Drone Chase"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">
                Video URL (Google Photos Video / Direct MP4 Link / Instagram Reel)
              </label>
              <input
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="neon-input text-xs font-mono"
                placeholder="https://photos.app.goo.gl/... or https://instagram.com/reel/..."
              />
            </div>
            <div>
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="neon-input"
              >
                {["Cinematic", "UGC", "Lifestyle", "Travel", "Skits", "Tutorial"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Thumbnail Emoji / Icon</label>
              <input
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                className="neon-input text-center text-lg"
                placeholder="🌅"
              />
            </div>
            <div>
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Views Count</label>
              <input
                value={formData.views}
                onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                className="neon-input"
                placeholder="e.g. 5.2M"
              />
            </div>
            <div>
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Likes Count</label>
              <input
                value={formData.likes}
                onChange={(e) => setFormData({ ...formData, likes: e.target.value })}
                className="neon-input"
                placeholder="e.g. 420K"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="neon-btn-filled px-6 py-2.5 rounded-full text-xs font-bold cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {editReel ? "Save Changes" : "Publish Reel"}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditReel(null); }}
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
          <span className="text-xs font-mono">Loading reels from Supabase database...</span>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="block sm:hidden space-y-3">
            {reels.map((reel) => (
              <div key={reel.id} className="glass-card p-4 rounded-2xl space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-3xl p-2 rounded-xl bg-[var(--subtle-bg)] border border-[var(--card-border)]">{reel.thumbnail}</span>
                  <div className="min-w-0 flex-1">
                    <span className="tag-pill text-[9px] uppercase font-mono mb-1">{reel.category}</span>
                    <h4 className="theme-heading font-bold text-sm leading-snug">{reel.title}</h4>
                    <p className="text-[var(--accent)] text-xs font-mono font-bold mt-1">{reel.views} views · {reel.likes} likes</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[var(--card-border)] text-xs font-mono">
                  <span className="theme-muted">{reel.date}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(reel)}
                      className="p-1.5 rounded-lg theme-subtext hover:text-[var(--accent)] hover:bg-[var(--subtle-bg)]"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(reel.id)}
                      className="p-1.5 rounded-lg theme-muted hover:text-rose-400 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop/Tablet Table */}
          <div className="hidden sm:block glass-card rounded-[28px] overflow-hidden border border-[var(--card-border)]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--card-border)] bg-[var(--subtle-bg)]">
                    <th className="text-left text-xs font-mono theme-muted tracking-wider p-4 uppercase">Reel Title</th>
                    <th className="text-left text-xs font-mono theme-muted tracking-wider p-4 uppercase">Category</th>
                    <th className="text-left text-xs font-mono theme-muted tracking-wider p-4 uppercase">Views & Likes</th>
                    <th className="text-left text-xs font-mono theme-muted tracking-wider p-4 uppercase">Date</th>
                    <th className="text-right text-xs font-mono theme-muted tracking-wider p-4 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reels.map((reel) => (
                    <tr key={reel.id} className="border-b border-[var(--card-border)] hover:bg-[var(--subtle-bg)] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{reel.thumbnail}</span>
                          <span className="theme-heading font-medium text-xs sm:text-sm truncate max-w-xs">{reel.title}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="tag-pill text-[9px]">{reel.category}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-[var(--accent)] text-xs font-mono font-bold flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {reel.views}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="theme-muted text-xs font-mono">{reel.date}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => handleEdit(reel)}
                            className="p-1.5 rounded-xl theme-subtext hover:text-[var(--accent)] hover:bg-[var(--subtle-bg)] transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(reel.id)}
                            className="p-1.5 rounded-xl theme-muted hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
