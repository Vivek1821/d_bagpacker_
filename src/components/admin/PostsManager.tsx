"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, Eye, Filter, Loader2, Link2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

interface Post {
  id: number;
  title: string;
  category: string;
  type: string;
  views: string;
  likes: string;
  published: boolean;
  media_url?: string;
  date: string;
}

export default function PostsManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetchingMedia, setFetchingMedia] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Cinematic",
    type: "reel",
    views: "1.2M",
    likes: "85K",
    media_url: "",
    published: true,
  });

  const handleAutoFetch = async (targetUrl?: string) => {
    const urlToFetch = (targetUrl || formData.media_url).trim();
    if (!urlToFetch) {
      toast.error("Please paste an Instagram or Google Photos URL first");
      return;
    }

    setFetchingMedia(true);
    try {
      const res = await fetch("/api/media/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToFetch }),
      });
      const data = await res.json();

      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          title: data.title || prev.title,
          media_url: data.videoUrl || data.thumbnailUrl || urlToFetch,
          category: data.category || prev.category,
          views: data.views || prev.views,
          likes: data.likes || prev.likes,
        }));
        toast.success(`✨ Auto-fetched ${data.platform === "instagram" ? "Instagram post" : "Google Photos"} media!`);
      } else {
        toast.error(data.error || "Could not resolve media URL");
      }
    } catch {
      toast.error("Error connecting to media resolver");
    } finally {
      setFetchingMedia(false);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      if (data.data) setPosts(data.data);
    } catch {
      toast.error("Failed to load posts from API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "All" || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    setSaving(true);
    try {
      if (editPost) {
        const res = await fetch("/api/posts", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editPost.id, ...formData }),
        });
        const data = await res.json();
        if (data.success) {
          setPosts(posts.map((p) => (p.id === editPost.id ? { ...p, ...formData } : p)));
          toast.success("Post updated successfully! ✨");
        }
      } else {
        const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success && data.data) {
          setPosts([data.data, ...posts]);
          toast.success("New post published! 🚀");
        }
      }
      setShowForm(false);
      setEditPost(null);
      setFormData({ title: "", category: "Cinematic", type: "reel", views: "1.2M", likes: "85K", media_url: "", published: true });
    } catch {
      toast.error("Error saving post");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p: Post) => {
    setEditPost(p);
    setFormData({
      title: p.title,
      category: p.category,
      type: p.type,
      views: p.views,
      likes: p.likes,
      media_url: p.media_url || "",
      published: p.published,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/posts?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setPosts(posts.filter((p) => p.id !== id));
        toast.success("Post deleted");
      }
    } catch {
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-6 border-b border-[var(--card-border)]">
        <div>
          <h2 className="theme-heading font-bold text-xl sm:text-2xl">Content Vault Manager</h2>
          <p className="theme-muted text-xs sm:text-sm font-mono mt-0.5">{posts.length} published pieces across IG & YT</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditPost(null); }}
          className="neon-btn-filled px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> Add New Post
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 theme-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or category..."
            className="neon-input pl-11 pr-4 text-xs sm:text-sm"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="neon-input px-4 py-2.5 text-xs sm:text-sm min-w-[160px] cursor-pointer"
        >
          {["All", "Cinematic", "UGC", "Lifestyle", "Travel", "Skits", "Tutorial", "Talking Head"].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Add / Edit Form Modal Card */}
      {showForm && (
        <div className="glass-card-lg p-6 sm:p-8 rounded-[32px] space-y-5 border border-[var(--accent)] shadow-2xl animate-float-up">
          <div className="flex items-center justify-between">
            <h3 className="theme-heading font-bold text-lg sm:text-xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--accent)]" />
              {editPost ? "Edit Content Piece" : "Add Content via Instagram or Google Photos"}
            </h3>
            <span className="text-xs font-mono theme-muted">Auto-Extracts Media & Stats</span>
          </div>

          {/* ⚡ SMART AUTO-FETCH URL INPUT BAR */}
          <div className="p-4 rounded-2xl bg-[var(--subtle-bg)] border border-[var(--accent)]/40 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Paste Instagram Post / Reel or Google Photos Link
            </label>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Link2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 theme-muted" />
                <input
                  value={formData.media_url}
                  onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                  className="neon-input pl-10 text-xs font-mono"
                  placeholder="https://www.instagram.com/p/... or https://photos.app.goo.gl/..."
                />
              </div>
              <button
                type="button"
                onClick={() => handleAutoFetch()}
                disabled={fetchingMedia || !formData.media_url.trim()}
                className="neon-btn-filled px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                {fetchingMedia ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Extracting Media...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Auto-Fetch Media
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] theme-muted font-mono">
              💡 Supports public Instagram posts, reels, single Google Photos links, and direct media URLs.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Post Title</label>
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="neon-input"
                placeholder="e.g. Golden Hour Drone Chase"
              />
            </div>
            <div>
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="neon-input"
              >
                {["Cinematic", "UGC", "Lifestyle", "Travel", "Skits", "Tutorial", "Talking Head"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Content Format</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="neon-input"
              >
                <option value="reel">Instagram Reel (9:16)</option>
                <option value="post">Carousel / Single Post</option>
              </select>
            </div>
            <div>
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Approximate Views</label>
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
            <div className="sm:col-span-2">
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">
                Media URL (Google Photos / Video Direct Link / Instagram Reel)
              </label>
              <input
                value={formData.media_url}
                onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                className="neon-input text-xs font-mono"
                placeholder="https://photos.app.goo.gl/... or https://instagram.com/reel/..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className={`w-11 h-6 rounded-full transition-all relative ${formData.published ? "bg-[var(--accent)]" : "bg-[var(--subtle-bg)] border border-[var(--card-border)]"}`}
                onClick={() => setFormData({ ...formData, published: !formData.published })}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-[#030712] transition-all ${formData.published ? "left-5" : "left-0.5"}`}
                />
              </div>
              <span className="theme-subtext text-xs font-medium">Publish to Live Portfolio</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="neon-btn-filled px-6 py-2.5 rounded-full text-xs font-bold cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {editPost ? "Save Changes" : "Publish Post"}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditPost(null); }}
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
          <span className="text-xs font-mono">Loading posts from Supabase database...</span>
        </div>
      ) : (
        <>
          {/* Mobile Card List View (Phones) */}
          <div className="block sm:hidden space-y-3">
            {filtered.map((post) => (
              <div key={post.id} className="glass-card p-4 rounded-2xl space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="tag-pill text-[9px] uppercase font-mono mb-1">{post.category}</span>
                    <h4 className="theme-heading font-bold text-sm leading-snug">{post.title}</h4>
                  </div>
                  <span
                    className={`text-[9px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase flex-shrink-0 ${
                      post.published ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 theme-muted"
                    }`}
                  >
                    {post.published ? "Live" : "Draft"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono theme-muted pt-2 border-t border-[var(--card-border)]">
                  <span className="text-[var(--accent)] font-bold flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {post.views}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-1.5 rounded-lg theme-subtext hover:text-[var(--accent)] hover:bg-[var(--subtle-bg)]"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-1.5 rounded-lg theme-muted hover:text-rose-400 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop/Tablet Table View */}
          <div className="hidden sm:block glass-card rounded-[28px] overflow-hidden border border-[var(--card-border)]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--card-border)] bg-[var(--subtle-bg)]">
                    <th className="text-left text-xs font-mono theme-muted tracking-wider p-4 uppercase">Content Title</th>
                    <th className="text-left text-xs font-mono theme-muted tracking-wider p-4 uppercase">Category</th>
                    <th className="text-left text-xs font-mono theme-muted tracking-wider p-4 uppercase">Views</th>
                    <th className="text-left text-xs font-mono theme-muted tracking-wider p-4 uppercase">Date</th>
                    <th className="text-left text-xs font-mono theme-muted tracking-wider p-4 uppercase">Status</th>
                    <th className="text-right text-xs font-mono theme-muted tracking-wider p-4 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((post) => (
                    <tr key={post.id} className="border-b border-[var(--card-border)] hover:bg-[var(--subtle-bg)] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[9px] bg-[var(--subtle-bg)] text-[var(--accent)] px-2 py-0.5 rounded-md font-mono uppercase font-bold border border-[var(--card-border)]">
                            {post.type}
                          </span>
                          <span className="theme-heading font-medium text-xs sm:text-sm truncate max-w-xs">{post.title}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="tag-pill text-[9px]">{post.category}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-[var(--accent)] text-xs font-mono font-bold flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {post.views}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="theme-muted text-xs font-mono">{post.date}</span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-[9px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase ${
                            post.published
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-white/10 theme-muted"
                          }`}
                        >
                          {post.published ? "Live" : "Draft"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => handleEdit(post)}
                            className="p-1.5 rounded-xl theme-subtext hover:text-[var(--accent)] hover:bg-[var(--subtle-bg)] transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
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
            {filtered.length === 0 && (
              <div className="text-center py-12 theme-muted text-xs font-mono">
                No content matches your filter.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
