"use client";

import { useState } from "react";
import { Save, RefreshCw, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

const INITIAL = {
  name: "Vivek Creates",
  tagline: "Cinematic Storyteller · High-Retention Viral Reels",
  email: "hello@vivekcreates.in",
  phone: "+91 98765 43210",
  location: "Mumbai, Maharashtra, India",
  instagram: "https://instagram.com/vivek.creates",
  youtube: "https://youtube.com/@vivek.creates",
  available: true,
  reel_rate: "₹25,000 – ₹75,000 per Reel",
  post_rate: "₹15,000 – ₹35,000 per Post",
  campaign_rate: "₹1,50,000 – ₹5,00,000 Full Campaign",
  niche: "Cinematic Travel, Tech Reviews, Lifestyle, High-Retention Storytelling",
  bio: "Full-time cinematic content creator and director specializing in high-retention reels, brand-aligned visual storytelling, and performance UGC. Operating an in-house Sony FX3 cinema setup with DaVinci Resolve color mastering.",
  packages: "Tier 1: Single Reel (₹35K) | Tier 2: Reel + Story Set + Cutdowns (₹65K) | Tier 3: Full Brand Campaign 3 Reels + Whitelisting (₹1.8L)",
};

export default function BusinessInfo() {
  const [info, setInfo] = useState(INITIAL);
  const [saving, setSaving] = useState(false);

  const update = (key: string, value: string | boolean) => setInfo((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast.success("Business profile & ratecard updated!");
  };

  const SECTIONS = [
    {
      title: "Creator Identity",
      fields: [
        { key: "name", label: "Display Name" },
        { key: "tagline", label: "Hero Subtitle / Tagline" },
        { key: "location", label: "Location & Timezone" },
        { key: "niche", label: "Core Content Niches" },
      ],
    },
    {
      title: "Official Contact Channels",
      fields: [
        { key: "email", label: "Business Email" },
        { key: "phone", label: "Direct WhatsApp / Phone" },
        { key: "instagram", label: "Instagram Handle URL" },
        { key: "youtube", label: "YouTube Channel URL" },
      ],
    },
    {
      title: "Standard Rate Card (₹ INR)",
      fields: [
        { key: "reel_rate", label: "Single 9:16 Reel Rate" },
        { key: "post_rate", label: "Carousel / Post Rate" },
        { key: "campaign_rate", label: "Multi-Asset Campaign Rate" },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-6 border-b border-[rgba(0,255,127,0.06)]">
        <div>
          <h2 className="text-white font-bold text-xl">Business Profile & Rate Card</h2>
          <p className="text-white/40 text-sm font-mono mt-0.5">Control creator bio, commercial rates, and collaboration availability</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="neon-btn-filled px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2.5 disabled:opacity-60">
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving Profile..." : "Save Business Info"}
        </button>
      </div>

      {/* Availability Status Card */}
      <div className="glass-card p-6 rounded-3xl flex items-center justify-between border border-[rgba(0,255,127,0.18)]">
        <div>
          <p className="text-white font-bold text-base flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ff7f] animate-ping" />
            Accepting Q4 2025 / Q1 2026 Brand Collaborations
          </p>
          <p className="text-white/40 text-xs mt-1">Displays live badge in navigation and collaboration brief form</p>
        </div>
        <div
          className={`w-14 h-7 rounded-full transition-all duration-200 relative cursor-pointer ${info.available ? "bg-[#00ff7f] shadow-[0_0_15px_rgba(0,255,127,0.4)]" : "bg-white/10"}`}
          onClick={() => update("available", !info.available)}
        >
          <div className={`absolute top-1 w-5 h-5 rounded-full bg-[#020202] transition-all duration-200 ${info.available ? "left-8" : "left-1"}`} />
        </div>
      </div>

      {/* Field sections */}
      <div className="space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.title} className="glass-card p-8 rounded-3xl space-y-5">
            <p className="section-label">{section.title.toUpperCase()}</p>
            <div className="grid sm:grid-cols-2 gap-5">
              {section.fields.map((f) => (
                <div key={f.key}>
                  <label className="text-white/40 text-xs font-mono block mb-2 tracking-wider uppercase">{f.label}</label>
                  <input
                    value={(info as Record<string, string | boolean>)[f.key] as string}
                    onChange={(e) => update(f.key, e.target.value)}
                    className="neon-input w-full px-4 py-3 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bio text area */}
      <div className="glass-card p-8 rounded-3xl space-y-4">
        <p className="section-label">CREATOR STATEMENT & BIO</p>
        <textarea
          value={info.bio}
          onChange={(e) => update("bio", e.target.value)}
          rows={4}
          className="neon-input w-full px-5 py-4 text-sm resize-none leading-relaxed"
        />
      </div>

      {/* Packages */}
      <div className="glass-card p-8 rounded-3xl space-y-4">
        <p className="section-label">COMMERCIAL BUNDLES & TIERS</p>
        <textarea
          value={info.packages}
          onChange={(e) => update("packages", e.target.value)}
          rows={3}
          className="neon-input w-full px-5 py-4 text-sm resize-none font-mono text-xs leading-relaxed"
        />
      </div>
    </div>
  );
}
