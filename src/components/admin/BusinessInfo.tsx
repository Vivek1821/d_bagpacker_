"use client";

import { useEffect, useState } from "react";
import { Building2, Save, MapPin, Camera, Tv2, Phone, Mail, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function BusinessInfo() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "Vivek Creates",
    handle: "@vivek.creates",
    email: "hello@vivekcreates.in",
    phone: "+91 98765 43210",
    location: "Mumbai, India",
    bio: "Full-time cinematic storyteller creating high-retention commercial reels and UGC campaigns.",
    instagram: "https://instagram.com/vivek.creates",
    youtube: "https://youtube.com/@vivek.creates",
    primary_rate: "₹35,000 / Reel",
    retainer_rate: "₹1,50,000 / Month",
  });

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.data) setProfile(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Business profile saved! 💼");
      }
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-6 border-b border-[var(--card-border)]">
        <div>
          <h2 className="theme-heading font-bold text-xl sm:text-2xl">Profile, Rates & Social Links</h2>
          <p className="theme-muted text-xs sm:text-sm font-mono mt-0.5">Manage public brand information and commercial rates</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="neon-btn-filled px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50 w-full sm:w-auto justify-center"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Profile
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 theme-muted flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
          <span className="text-xs font-mono">Loading profile from Supabase database...</span>
        </div>
      ) : (
        <div className="glass-card-lg p-6 sm:p-10 rounded-[32px] space-y-6">
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Full Creator Name</label>
              <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="neon-input" />
            </div>
            <div>
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Instagram Handle</label>
              <input value={profile.handle} onChange={(e) => setProfile({ ...profile, handle: e.target.value })} className="neon-input" />
            </div>
            <div>
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Public Business Email</label>
              <input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="neon-input" />
            </div>
            <div>
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Location</label>
              <input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} className="neon-input" />
            </div>
            <div>
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Standard Reel Rate (₹)</label>
              <input value={profile.primary_rate} onChange={(e) => setProfile({ ...profile, primary_rate: e.target.value })} className="neon-input font-mono" />
            </div>
            <div>
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Monthly Retainer Rate (₹)</label>
              <input value={profile.retainer_rate} onChange={(e) => setProfile({ ...profile, retainer_rate: e.target.value })} className="neon-input font-mono" />
            </div>
            <div className="sm:col-span-2">
              <label className="theme-muted text-xs font-mono block mb-1.5 uppercase">Creator Bio Summary</label>
              <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows={3} className="neon-input resize-none text-xs leading-relaxed" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
