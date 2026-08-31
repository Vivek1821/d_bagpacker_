"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Eye, Filter } from "lucide-react";

const INITIAL_POSTS = [
  { id: 1, title: "Golden Hour Bali — FX3 + 24mm", type: "reel", category: "Cinematic", views: "5.2M", likes: "421K", published: true, date: "2025-08-20" },
  { id: 2, title: "OnePlus Open First Impressions Hook", type: "reel", category: "UGC", views: "3.8M", likes: "198K", published: true, date: "2025-08-18" },
  { id: 3, title: "Day in My Life — Full-Time Creator", type: "reel", category: "Lifestyle", views: "7.1M", likes: "562K", published: true, date: "2025-08-15" },
  { id: 4, title: "Mumbai Monsoon — 4K Cinematic Sequence", type: "reel", category: "Travel", views: "4.4M", likes: "334K", published: true, date: "2025-08-12" },
  { id: 5, title: "When WiFi Cuts Out Mid-Collab", type: "reel", category: "Skits", views: "8.3M", likes: "712K", published: true, date: "2025-08-08" },
  { id: 6, title: "Color Grading in DaVinci in 60s", type: "reel", category: "Tutorial", views: "1.7M", likes: "89K", published: true, date: "2025-08-02" },
  { id: 7, title: "Dubai Skyline Drone POV (ProRes)", type: "reel", category: "Cinematic", views: "6.1M", likes: "498K", published: true, date: "2025-07-28" },
  { id: 8, title: "How I Grew to 200K Followers in 6 Months", type: "post", category: "Talking Head", views: "1.3M", likes: "67K", published: true, date: "2025-07-20" },
  { id: 9, title: "Sony WH-1000XM5 Honest Long-Term Review", type: "reel", category: "UGC", views: "2.9M", likes: "167K", published: true, date: "2025-07-15" },
  { id: 10, title: "Maldives Overwater Bungalow Sunset", type: "reel", category: "Travel", views: "9.7M", likes: "821K", published: true, date: "2025-07-10" },
];

type Post = typeof INITIAL_POSTS[0];

export default function PostsManager() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({ title: "", category: "Cinematic", type: "reel", views: "", likes: "", published: true });

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "All" || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const handleSave = () => {
    if (editPost) {
      setPosts(posts.map((p) => (p.id === editPost.id ? { ...editPost, ...formData } : p)));
    } else {
      setPosts([{ id: Date.now(), date: new Date().toISOString().split("T")[0], ...formData }, ...posts]);
    }
    setShowForm(false);
    setEditPost(null);
    setFormData({ title: "", category: "Cinematic", type: "reel", views: "0", likes: "0", published: true });
  };

  const handleEdit = (p: Post) => {
    setEditPost(p);
    setFormData({ title: p.title, category: p.category, type: p.type, views: p.views, likes: p.likes, published: p.published });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this post?")) setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-6 border-b border-white/10">
        <div>
          <h2 className="text-white font-bold text-2xl">Content Vault Manager</h2>
          <p className="text-white/45 text-sm font-mono mt-1">{posts.length} published pieces across IG & YT</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditPost(null); }}
          className="neon-btn-filled px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Post
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or category..."
            className="neon-input pl-11 pr-4"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="neon-input px-4 py-3 text-sm bg-[#0b0f19] text-white min-w-[170px] cursor-pointer"
        >
          {["All", "Cinematic", "UGC", "Lifestyle", "Travel", "Skits", "Tutorial", "Talking Head"].map((c) => (
            <option key={c} value={c} className="bg-[#0b0f19] text-white py-2">
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Add / Edit Form Card */}
      {showForm && (
        <div className="glass-card-lg p-8 sm:p-10 rounded-[36px] space-y-6 border border-[var(--accent)] shadow-2xl animate-float-up">
          <h3 className="text-white font-bold text-xl">{editPost ? "Edit Content Piece" : "Add New Content Piece"}</h3>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-white/40 text-xs font-mono block mb-2 uppercase">Post Title</label>
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="neon-input"
                placeholder="e.g. Golden Hour Drone Chase"
              />
            </div>
            <div>
              <label className="text-white/40 text-xs font-mono block mb-2 uppercase">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="neon-input bg-[#0b0f19] text-white"
              >
                {["Cinematic", "UGC", "Lifestyle", "Travel", "Skits", "Tutorial", "Talking Head"].map((c) => (
                  <option key={c} value={c} className="bg-[#0b0f19] text-white">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-white/40 text-xs font-mono block mb-2 uppercase">Content Format</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="neon-input bg-[#0b0f19] text-white"
              >
                <option value="reel" className="bg-[#0b0f19] text-white">Instagram Reel (9:16)</option>
                <option value="post" className="bg-[#0b0f19] text-white">Carousel / Single Post</option>
              </select>
            </div>
            <div>
              <label className="text-white/40 text-xs font-mono block mb-2 uppercase">Approximate Views</label>
              <input
                value={formData.views}
                onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                className="neon-input"
                placeholder="e.g. 5.2M"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className={`w-12 h-6 rounded-full transition-all duration-200 relative ${formData.published ? "bg-[var(--accent)]" : "bg-white/10"}`}
                onClick={() => setFormData({ ...formData, published: !formData.published })}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-[#030712] transition-all duration-200 ${formData.published ? "left-6" : "left-0.5"}`}
                />
              </div>
              <span className="text-white/80 text-sm font-medium">Publish to Live Portfolio</span>
            </label>
          </div>
          <div className="flex gap-4 pt-2">
            <button onClick={handleSave} className="neon-btn-filled px-8 py-3 rounded-full text-sm font-bold cursor-pointer">
              {editPost ? "Save Changes" : "Publish Post"}
            </button>
            <button onClick={() => { setShowForm(false); setEditPost(null); }} className="neon-btn px-6 py-3 rounded-full text-sm cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass-card rounded-[32px] overflow-hidden border border-white/10">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-black/40">
              <th className="text-left text-xs font-mono text-white/40 tracking-wider p-5 uppercase">Content Title</th>
              <th className="text-left text-xs font-mono text-white/40 tracking-wider p-5 hidden sm:table-cell uppercase">Category</th>
              <th className="text-left text-xs font-mono text-white/40 tracking-wider p-5 hidden md:table-cell uppercase">Views</th>
              <th className="text-left text-xs font-mono text-white/40 tracking-wider p-5 hidden lg:table-cell uppercase">Date</th>
              <th className="text-left text-xs font-mono text-white/40 tracking-wider p-5 uppercase">Status</th>
              <th className="text-right text-xs font-mono text-white/40 tracking-wider p-5 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((post) => (
              <tr key={post.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] bg-white/10 text-[var(--accent)] px-2.5 py-1 rounded-lg font-mono uppercase font-bold">
                      {post.type}
                    </span>
                    <span className="text-white font-medium text-sm">{post.title}</span>
                  </div>
                </td>
                <td className="p-5 hidden sm:table-cell">
                  <span className="tag-pill text-[10px]">{post.category}</span>
                </td>
                <td className="p-5 hidden md:table-cell">
                  <span className="text-[var(--accent)] text-xs font-mono font-bold flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> {post.views}
                  </span>
                </td>
                <td className="p-5 hidden lg:table-cell">
                  <span className="text-white/40 text-xs font-mono">{post.date}</span>
                </td>
                <td className="p-5">
                  <span
                    className={`text-[10px] font-mono px-3 py-1 rounded-full font-bold uppercase ${
                      post.published
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-white/10 text-white/40"
                    }`}
                  >
                    {post.published ? "Live" : "Draft"}
                  </span>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-3 justify-end">
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 rounded-xl text-white/40 hover:text-[var(--accent)] hover:bg-white/10 transition-all cursor-pointer"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/40 text-sm font-mono">
            No content matches your filter.
          </div>
        )}
      </div>
    </div>
  );
}
