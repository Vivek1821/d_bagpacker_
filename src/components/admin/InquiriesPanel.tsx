"use client";

import { useState } from "react";
import { Mail, DollarSign, Calendar, CheckCircle, Clock, X, Building2, ChevronRight } from "lucide-react";

const INQUIRIES = [
  { id: 1, brand: "Samsung India", email: "marketing.in@samsung.com", budget: "₹3,50,000 – ₹5,00,000", deliverables: ["3 Dedicated Reels", "Paid Ads UGC", "5 Story Frames"], timeline: "Urgent (Within 14 days)", rights: "Paid Meta & YouTube Ads", notes: "Looking to collaborate on our upcoming Galaxy S25 ultra nightography launch. Focus on low-light Mumbai cinematography.", status: "New", date: "Today, 4:30 PM" },
  { id: 2, brand: "Nike India (Run Club)", email: "collaborations@nike.in", budget: "₹5,00,000 – ₹10,00,000", deliverables: ["Full Brand Campaign", "2 Cinematic Reels", "Event Coverage"], timeline: "Planned (1–2 months)", rights: "Full Commercial Buyout", notes: "Annual brand partnership for our Mumbai Marathon 2026 activation. Looking for dynamic camera movement and storytelling.", status: "Reviewed", date: "Yesterday" },
  { id: 3, brand: "Spotify India", email: "creator.collab@spotify.com", budget: "₹1,50,000 – ₹3,00,000", deliverables: ["Instagram Reel", "Podcast Integration"], timeline: "Standard (2–4 weeks)", rights: "Whitelisting / Spark Ads", notes: "Podcast promotion campaign for our Q4 regional music show. Looking for relatable talking-head + B-roll mix.", status: "Accepted", date: "Aug 28, 2025" },
  { id: 4, brand: "Boat Audio India", email: "brandteam@boat-lifestyle.com", budget: "₹2,00,000 – ₹3,50,000", deliverables: ["2 UGC Product Reels", "Story Series"], timeline: "Standard (2–4 weeks)", rights: "Brand Organic Repost", notes: "Product unboxing and sound test for our new noise cancelling headphones.", status: "New", date: "Aug 27, 2025" },
];

type Inquiry = typeof INQUIRIES[0];

const STATUS_COLORS: Record<string, string> = {
  New: "#00ff7f",
  Reviewed: "#f97316",
  Accepted: "#06b6d4",
  Declined: "#ef4444",
};

export default function InquiriesPanel() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(INQUIRIES);
  const [selected, setSelected] = useState<Inquiry | null>(inquiries[0]);

  const updateStatus = (id: number, status: string) => {
    setInquiries(inquiries.map((i) => (i.id === id ? { ...i, status } : i)));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : prev);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[rgba(0,255,127,0.06)]">
        <div>
          <h2 className="text-white font-bold text-xl">Brand Collaboration Inbox</h2>
          <p className="text-white/40 text-sm font-mono mt-0.5">{inquiries.filter((i) => i.status === "New").length} new brief inquiries · {inquiries.length} total</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Inquiries List */}
        <div className="lg:col-span-5 space-y-3.5">
          {inquiries.map((inq) => (
            <button
              key={inq.id}
              onClick={() => setSelected(inq)}
              className={`w-full text-left glass-card p-5 rounded-3xl transition-all duration-300 ${
                selected?.id === inq.id
                  ? "border-[rgba(0,255,127,0.4)] bg-[rgba(0,255,127,0.05)] shadow-[0_0_25px_rgba(0,255,127,0.08)]"
                  : "glass-card-hover opacity-80"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-white font-bold text-sm">{inq.brand}</h3>
                    <span className="text-[9px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase" style={{ background: STATUS_COLORS[inq.status] + "15", color: STATUS_COLORS[inq.status], border: `1px solid ${STATUS_COLORS[inq.status]}30` }}>
                      {inq.status}
                    </span>
                  </div>
                  <p className="text-white/40 text-xs font-mono mt-1">{inq.email}</p>
                </div>
                <span className="text-white/25 text-xs font-mono">{inq.date}</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-[#00ff7f] font-mono font-semibold">{inq.budget}</span>
                <span className="text-white/40 flex items-center gap-1"><Calendar className="w-3 h-3" /> {inq.timeline.split(" (")[0]}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right: Detail View */}
        <div className="lg:col-span-7">
          {selected ? (
            <div className="glass-card p-8 rounded-3xl border border-[rgba(0,255,127,0.18)] shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6">
              <div className="flex items-start justify-between pb-6 border-b border-white/5">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-white font-bold text-2xl">{selected.brand}</h3>
                    <span className="text-[10px] font-mono px-3 py-1 rounded-full font-bold uppercase" style={{ background: STATUS_COLORS[selected.status] + "15", color: STATUS_COLORS[selected.status], border: `1px solid ${STATUS_COLORS[selected.status]}30` }}>
                      {selected.status}
                    </span>
                  </div>
                  <a href={`mailto:${selected.email}`} className="text-[#00ff7f] text-sm font-mono flex items-center gap-1.5 hover:underline">
                    <Mail className="w-3.5 h-3.5" /> {selected.email}
                  </a>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="glass-card p-4 rounded-2xl">
                    <p className="text-white/40 text-xs font-mono uppercase mb-1">Budget Tier</p>
                    <p className="text-[#00ff7f] font-mono font-bold text-base">{selected.budget}</p>
                  </div>
                  <div className="glass-card p-4 rounded-2xl">
                    <p className="text-white/40 text-xs font-mono uppercase mb-1">Target Timeline</p>
                    <p className="text-white/80 font-medium text-sm">{selected.timeline}</p>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-2xl">
                  <p className="text-white/40 text-xs font-mono uppercase mb-1">Licensing Scope</p>
                  <p className="text-white/80 font-medium text-sm">{selected.rights}</p>
                </div>

                <div>
                  <p className="text-white/40 text-xs font-mono tracking-wider mb-2.5 uppercase">Requested Deliverables</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.deliverables.map((d) => (
                      <span key={d} className="tag-pill text-xs px-3 py-1.5">{d}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-white/40 text-xs font-mono tracking-wider mb-2 uppercase">Brand Brief & Campaign Vision</p>
                  <div className="glass-card p-5 rounded-2xl bg-black/40 border border-white/5">
                    <p className="text-white/70 leading-relaxed text-sm">{selected.notes}</p>
                  </div>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-white/5">
                {["Reviewed", "Accepted", "Declined"].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(selected.id, status)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all duration-200 ${
                      selected.status === status
                        ? "border"
                        : "glass-card text-white/40 hover:text-white"
                    }`}
                    style={selected.status === status ? { borderColor: STATUS_COLORS[status], color: STATUS_COLORS[status], background: STATUS_COLORS[status] + "15" } : {}}
                  >
                    {status === "Reviewed" ? "Mark Reviewed" : status === "Accepted" ? "✓ Accept & Send Proposal" : "✕ Decline"}
                  </button>
                ))}
                <a
                  href={`mailto:${selected.email}?subject=Re:%20Collaboration%20with%20Vivek%20Creates`}
                  className="ml-auto neon-btn-filled px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5" /> Direct Email Reply
                </a>
              </div>
            </div>
          ) : (
            <div className="glass-card p-16 rounded-3xl flex flex-col items-center justify-center text-center">
              <Clock className="w-12 h-12 text-white/20 mb-4" />
              <p className="text-white/40 text-sm">Select an inquiry to view details & submit proposal</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
