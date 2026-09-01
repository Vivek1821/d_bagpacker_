"use client";

import { useEffect, useState, useRef } from "react";
import {
  Plus, Pencil, Trash2, Film, Eye, Sparkles, Loader2, Link2,
  Play, Pause, Volume2, VolumeX, Camera, ExternalLink, CheckCircle2, HelpCircle, AlertCircle, RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";
import { travelAudio } from "@/lib/travelAudioEngine";
import { getCleanInstagramEmbedUrl, getInstagramThumbnailUrl, isInstagramUrl } from "@/lib/instagram";

interface Reel {
  id: number;
  title: string;
  url: string;
  thumbnail: string;
  thumbnailUrl?: string;
  views: string;
  likes: string;
  category: string;
  published: boolean;
  date: string;
  mediaType?: "video" | "instagram_embed" | "image";
  embedUrl?: string;
  suggestedMusic?: "riding" | "nature" | "cinematic" | "chill";
}

export default function ReelsManager() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetchingMedia, setFetchingMedia] = useState(false);
  const [editReel, setEditReel] = useState<Reel | null>(null);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    directVideoUrl: "",
    thumbnail: "🎬",
    thumbnailUrl: "",
    views: "120K",
    likes: "528",
    category: "Cinematic",
    published: true,
    mediaType: "video" as "video" | "instagram_embed" | "image",
    embedUrl: "",
    suggestedMusic: "cinematic" as "riding" | "nature" | "cinematic" | "chill",
  });

  // Preview Player State
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [previewMuted, setPreviewMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const [syncingAll, setSyncingAll] = useState(false);

  useEffect(() => {
    fetchReels();
  }, []);

  // Live Refresh All Reels Metrics
  const handleSyncAllReels = async () => {
    setSyncingAll(true);
    let updatedCount = 0;
    try {
      const igReels = reels.filter((r) => isInstagramUrl(r.url));
      if (igReels.length === 0) {
        toast("No Instagram reels found to refresh");
        return;
      }

      toast.loading("Refreshing latest live metrics from Instagram...", { id: "sync-toast" });

      const updatedReels = [...reels];
      for (const reelItem of igReels) {
        try {
          const res = await fetch("/api/media/resolve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: reelItem.url }),
          });
          const data = await res.json();
          if (data.success) {
            const idx = updatedReels.findIndex((r) => r.id === reelItem.id);
            if (idx !== -1) {
              const updated = {
                ...updatedReels[idx],
                likes: data.likes || updatedReels[idx].likes,
                views: data.views || updatedReels[idx].views,
                thumbnailUrl: data.thumbnailUrl || updatedReels[idx].thumbnailUrl,
              };
              updatedReels[idx] = updated;

              await fetch("/api/reels", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated),
              });
              updatedCount++;
            }
          }
        } catch (e) {
          console.warn("Error syncing reel:", reelItem.id, e);
        }
      }

      setReels(updatedReels);
      toast.success(`⚡ Refreshed live metrics for ${updatedCount} Instagram reels!`, { id: "sync-toast" });
    } catch {
      toast.error("Failed to refresh reels", { id: "sync-toast" });
    } finally {
      setSyncingAll(false);
    }
  };

  // Control preview audio & video
  useEffect(() => {
    if (previewPlaying) {
      if (!previewMuted) {
        travelAudio.playTrack(formData.suggestedMusic);
      }
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    } else {
      travelAudio.stop();
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
    return () => {
      travelAudio.stop();
    };
  }, [previewPlaying, previewMuted, formData.suggestedMusic]);

  // AUTO-FETCH FROM INSTAGRAM OR GOOGLE PHOTOS URL
  const handleAutoFetch = async (targetUrl?: string) => {
    const urlToFetch = (targetUrl || formData.url).trim();
    if (!urlToFetch) {
      toast.error("Please paste an Instagram Reel or Google Photos URL first");
      return;
    }

    setFetchingMedia(true);
    setPreviewPlaying(false);
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
          url: urlToFetch, // NEVER overwrite original link!
          directVideoUrl: data.videoUrl || "", // Store the resolved HD mp4 separately
          thumbnailUrl: data.thumbnailUrl || prev.thumbnailUrl,
          category: data.category || prev.category,
          mediaType: data.mediaType || "video",
          embedUrl: data.embedUrl || "",
          suggestedMusic: data.suggestedMusic || prev.suggestedMusic,
          views: data.views !== undefined ? data.views : "0",
          likes: data.likes !== undefined ? data.likes : "0",
        }));

        toast.success(`✨ Auto-fetched ${data.platform === "instagram" ? "Instagram Reel" : "Google Photos"} video & audio!`);
        // Start live preview automatically
        setPreviewPlaying(true);
      } else {
        toast.error(data.error || "Could not resolve media URL");
      }
    } catch {
      toast.error("Error connecting to media resolver");
    } finally {
      setFetchingMedia(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    setSaving(true);
    travelAudio.stop();
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
          toast.success("New 9:16 reel published to live portfolio! 🎬");
        }
      }
      setShowForm(false);
      setEditReel(null);
      setPreviewPlaying(false);
      setFormData({
        title: "",
        url: "",
        directVideoUrl: "",
        thumbnail: "🎬",
        thumbnailUrl: "",
        views: "120K",
        likes: "528",
        category: "Cinematic",
        published: true,
        mediaType: "video",
        embedUrl: "",
        suggestedMusic: "cinematic",
      });
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
      directVideoUrl: (r as any).directVideoUrl || "",
      thumbnail: r.thumbnail,
      thumbnailUrl: r.thumbnailUrl || "",
      views: r.views,
      likes: r.likes,
      category: r.category,
      published: r.published,
      mediaType: r.mediaType || "video",
      embedUrl: r.embedUrl || "",
      suggestedMusic: r.suggestedMusic || "cinematic",
    });
    setShowForm(true);
    setPreviewPlaying(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this reel from portfolio?")) return;
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
          <div className="flex items-center gap-2">
            <h2 className="theme-heading font-bold text-xl sm:text-2xl">9:16 Reels & Video Library</h2>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30">
              Live Auto-Fetch Enabled
            </span>
          </div>
          <p className="theme-muted text-xs sm:text-sm font-mono mt-0.5">
            Auto-fetch videos, audio tracks, and previews from Instagram Reels & Google Photos
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap sm:flex-nowrap">
          <button
            onClick={handleSyncAllReels}
            disabled={syncingAll}
            className="neon-btn px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center hover:border-[var(--accent)]"
            title="Refresh views, likes, and comments for all Instagram reels"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[var(--accent)] ${syncingAll ? "animate-spin" : ""}`} />
            <span>{syncingAll ? "Refreshing..." : "Refresh Views"}</span>
          </button>

          <button
            onClick={() => setShowGoogleModal(true)}
            className="neon-btn px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
            title="Connect personal Google Photos library"
          >
            <Camera className="w-4 h-4 text-emerald-400" />
            Google Photos Guide
          </button>

          <button
            onClick={() => {
              setShowForm(true);
              setEditReel(null);
              setPreviewPlaying(false);
            }}
            className="neon-btn-filled px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" /> Add New Reel
          </button>
        </div>
      </div>

      {/* Add / Edit Form Modal Card */}
      {showForm && (
        <div className="glass-card-lg p-6 sm:p-8 rounded-[32px] space-y-6 border border-[var(--accent)] shadow-2xl animate-float-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--accent)]" />
              <h3 className="theme-heading font-bold text-lg sm:text-xl">
                {editReel ? "Edit Reel" : "Add Reel via Instagram or Google Photos"}
              </h3>
            </div>
            <span className="text-xs font-mono theme-muted">Auto-Extracts Video + Sound</span>
          </div>

          {/* ⚡ SMART AUTO-FETCH URL INPUT BAR */}
          <div className="p-4 rounded-2xl bg-[var(--subtle-bg)] border border-[var(--accent)]/40 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                Paste Any Video URL (Auto-Extract Video, Audio & Poster)
              </label>
              <button
                type="button"
                onClick={() => setShowGoogleModal(true)}
                className="text-[11px] font-mono text-[var(--accent)] hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" /> How to get Google Photos Link
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Link2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 theme-muted" />
                <input
                  value={formData.url}
                  onChange={(e) => {
                    const newUrl = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      url: newUrl,
                      directVideoUrl: newUrl === prev.url ? prev.directVideoUrl : "",
                    }));
                  }}
                  className="neon-input pl-10 text-xs font-mono"
                  placeholder="https://www.instagram.com/reel/C... or https://photos.app.goo.gl/..."
                />
              </div>
              <button
                type="button"
                onClick={() => handleAutoFetch()}
                disabled={fetchingMedia || !formData.url.trim()}
                className="neon-btn-filled px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                {fetchingMedia ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Extracting Stream...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Auto-Fetch Video & Sound
                  </>
                )}
              </button>
            </div>

            {formData.directVideoUrl && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">High-Res Stream Cached: {formData.directVideoUrl} (Original link preserved)</span>
              </div>
            )}

            <p className="text-[11px] theme-muted font-mono">
              💡 Works with public <strong>Instagram Reels</strong>, <strong>Google Photos Single Links</strong>, <strong>YouTube Shorts</strong>, or direct <strong>MP4 streams</strong>.
            </p>
          </div>

          {/* TWO COLUMN LAYOUT: Form Fields on Left, Live 9:16 Interactive Preview on Right */}
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Form Fields (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Reel Title / Caption</label>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="neon-input"
                  placeholder="e.g. Spiti Valley High-Speed Moto Ride"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="neon-input"
                  >
                    {["Riding", "Nature", "Adventure", "Trekking", "Cinematic", "Roadtrips", "Lifestyle"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Audio Soundtrack</label>
                  <select
                    value={formData.suggestedMusic}
                    onChange={(e) => setFormData({ ...formData, suggestedMusic: e.target.value as any })}
                    className="neon-input"
                  >
                    <option value="riding">🏍️ Himalayan Moto Riding Beat</option>
                    <option value="nature">🌊 Deep Rainforest Symphony</option>
                    <option value="cinematic">⛰️ Epic Mountain Alpine Score</option>
                    <option value="chill">🌴 Coastal Roadtrip Sunset Lofi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Thumbnail Emoji</label>
                  <input
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="neon-input text-center text-lg"
                    placeholder="🏍️"
                  />
                </div>
                <div>
                  <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Views Count</label>
                  <input
                    value={formData.views}
                    onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                    className="neon-input"
                    placeholder="5.2M"
                  />
                </div>
                <div>
                  <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Likes Count</label>
                  <input
                    value={formData.likes}
                    onChange={(e) => setFormData({ ...formData, likes: e.target.value })}
                    className="neon-input"
                    placeholder="420K"
                  />
                </div>
              </div>

              <div>
                <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">High-Res Poster Image URL (Optional)</label>
                <input
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  className="neon-input text-xs font-mono"
                  placeholder="https://... extracted automatically from URL"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="neon-btn-filled px-6 py-2.5 rounded-full text-xs font-bold cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editReel ? "Save Changes" : "Publish Reel to Live Site"}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditReel(null);
                    setPreviewPlaying(false);
                    travelAudio.stop();
                  }}
                  className="neon-btn px-5 py-2.5 rounded-full text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* LIVE 9:16 PHONE SIMULATOR PREVIEW (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold uppercase theme-muted flex items-center gap-1.5">
                  <Play className="w-3 h-3 text-[var(--accent)]" /> Live 9:16 Video + Audio Preview
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewMuted(!previewMuted)}
                    className="p-1 rounded-md text-xs font-mono text-[var(--accent)] hover:bg-[var(--subtle-bg)] flex items-center gap-1"
                  >
                    {previewMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    {previewMuted ? "Unmute" : "Sound On"}
                  </button>
                </div>
              </div>

              {/* 9:16 Mobile Bezel Frame */}
              <div className="relative w-[240px] sm:w-[260px] h-[460px] sm:h-[490px] rounded-[36px] bg-black border-4 border-zinc-800 shadow-2xl overflow-hidden flex flex-col justify-between p-3 select-none">
                {/* Camera punch hole notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-zinc-900 rounded-full z-20" />

                {/* Media Player Container */}
                <div className="absolute inset-0 bg-zinc-950 flex items-center justify-center overflow-hidden">
                  {formData.directVideoUrl || (formData.url && formData.url.match(/\.(mp4|mov|webm)(\?.*)?$/i)) ? (
                    <video
                      ref={videoRef}
                      src={formData.directVideoUrl || formData.url}
                      loop
                      muted={previewMuted}
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : isInstagramUrl(formData.url) ? (
                    <iframe
                      src={getCleanInstagramEmbedUrl(formData.url) || ""}
                      className="w-full h-full border-0 pointer-events-auto bg-black"
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      title="Instagram Live Reel Preview"
                    />
                  ) : formData.thumbnailUrl ? (
                    <div className="relative w-full h-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.thumbnailUrl}
                        alt="Preview poster"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <span className="text-6xl mb-2 animate-pulse">{formData.thumbnail || "🎬"}</span>
                      <p className="text-[11px] theme-muted font-mono">Paste URL above to see live 9:16 video stream</p>
                    </div>
                  )}

                  {/* Play/Pause Overlay Button (For native/cached video) */}
                  {(formData.directVideoUrl || (formData.url && formData.url.match(/\.(mp4|mov|webm)(\?.*)?$/i))) && (
                    <button
                      type="button"
                      onClick={() => setPreviewPlaying(!previewPlaying)}
                      className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:scale-110 transition-transform cursor-pointer z-10"
                    >
                      {previewPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                    </button>
                  )}
                </div>

                {/* Overlay Reel Info */}
                <div className="relative z-10 mt-auto p-2 bg-gradient-to-t from-black/90 via-black/40 to-transparent rounded-b-[28px] space-y-1">
                  <span className="tag-pill text-[9px] uppercase font-mono px-2 py-0.5">
                    {formData.category}
                  </span>
                  <h4 className="text-white font-bold text-xs line-clamp-2 leading-snug">
                    {formData.title || "Untitled Reel"}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[var(--accent)] pt-1">
                    <span>{formData.views} views</span>
                    <span>{formData.likes} likes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REELS GRID DISPLAY */}
      {loading ? (
        <div className="text-center py-16 theme-muted flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
          <span className="text-xs font-mono">Loading reels library...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {reels.map((reel) => (
            <div
              key={reel.id}
              className="glass-card p-5 rounded-[28px] space-y-4 border border-[var(--card-border)] hover:border-[var(--accent)]/50 transition-all duration-300 group"
            >
              {/* Thumbnail Container */}
              <div className="relative h-44 rounded-2xl overflow-hidden bg-zinc-950 border border-[var(--card-border)] flex items-center justify-center">
                {(() => {
                  const poster = reel.thumbnailUrl || (isInstagramUrl(reel.url) ? getInstagramThumbnailUrl(reel.url) : null);
                  return poster ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={poster}
                      alt={reel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                      {reel.thumbnail}
                    </span>
                  );
                })()}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <span className="absolute top-3 left-3 tag-pill text-[9px] uppercase font-mono px-2 py-0.5">
                  {reel.category}
                </span>

                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-[var(--accent)] font-bold">
                  <span>{reel.views} views</span>
                  <span>{reel.likes} likes</span>
                </div>
              </div>

              {/* Title & Details */}
              <div>
                <h4 className="theme-heading font-bold text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                  {reel.title}
                </h4>
                <p className="theme-muted text-[11px] font-mono mt-1 truncate">
                  {reel.url || "No direct link attached"}
                </p>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[var(--card-border)] text-xs font-mono">
                <span className="theme-muted text-[11px]">{reel.date}</span>
                <div className="flex items-center gap-1.5">
                  {reel.url && (
                    <a
                      href={reel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl theme-muted hover:text-[var(--accent)] hover:bg-[var(--subtle-bg)] transition-colors"
                      title="Open Media Source"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => handleEdit(reel)}
                    className="p-2 rounded-xl theme-subtext hover:text-[var(--accent)] hover:bg-[var(--subtle-bg)] transition-colors cursor-pointer"
                    title="Edit Reel"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(reel.id)}
                    className="p-2 rounded-xl theme-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Delete Reel"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* GOOGLE PHOTOS INTEGRATION GUIDE MODAL */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-card-lg p-6 sm:p-8 rounded-[32px] max-w-lg w-full space-y-5 border border-emerald-500/50 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-6 h-6 text-emerald-400" />
                <h3 className="theme-heading font-bold text-lg sm:text-xl">
                  Google Photos Live Connection
                </h3>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="text-sm font-mono theme-muted hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <span className="text-emerald-400 font-bold uppercase text-[11px] block">
                  Method 1: Single Video Link (Instant — No Shared Album Needed)
                </span>
                <ol className="list-decimal list-inside space-y-1.5 text-zinc-300 leading-relaxed">
                  <li>Open the <strong>Google Photos</strong> app on your phone or browser.</li>
                  <li>Tap on any video or reel you want to add.</li>
                  <li>Tap the <strong>Share</strong> icon at the bottom.</li>
                  <li>Tap <strong>&quot;Create link&quot;</strong> (gives a link like <code className="text-emerald-400">photos.app.goo.gl/...</code>).</li>
                  <li>Paste it into the <strong>Auto-Fetch Video & Sound</strong> input bar above.</li>
                </ol>
                <p className="text-[11px] text-zinc-400 pt-1">
                  ✅ Our resolver automatically extracts the raw MP4 video stream, high-res poster, and syncs the audio.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--subtle-bg)] border border-[var(--card-border)] space-y-2">
                <span className="text-[var(--accent)] font-bold uppercase text-[11px] block">
                  Method 2: Google Photos Picker API (Direct Account Sign-in)
                </span>
                <p className="text-zinc-400 leading-relaxed">
                  To enable a direct pop-up window that browses your private Google Photos library without copying links, add your Google Cloud OAuth Client ID to <code className="text-[var(--accent)]">.env.local</code>:
                </p>
                <div className="p-2 rounded-lg bg-black/60 text-zinc-300 font-mono text-[10px] select-all">
                  NEXT_PUBLIC_GOOGLE_CLIENT_ID=&quot;your-id.apps.googleusercontent.com&quot;
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowGoogleModal(false)}
                className="neon-btn-filled px-6 py-2 rounded-full text-xs font-bold cursor-pointer"
              >
                Got It, Let&apos;s Add Videos!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
