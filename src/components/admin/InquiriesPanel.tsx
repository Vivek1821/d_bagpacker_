"use client";

import { useEffect, useState } from "react";
import { Inbox, Mail, Calendar, DollarSign, FileVideo, Trash2, CheckCircle, Clock, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

interface Inquiry {
  id: number;
  brand_name: string;
  contact_email: string;
  budget_range: string;
  deliverables: string[];
  timeline: string;
  notes: string;
  status: string;
  created_at: string;
}

export default function InquiriesPanel() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/inquiry");
      const data = await res.json();
      if (data.data) setInquiries(data.data);
    } catch {
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch("/api/inquiry", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq)));
        toast.success(`Status marked as ${status}`);
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this inquiry from inbox?")) return;
    try {
      const res = await fetch(`/api/inquiry?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setInquiries(inquiries.filter((inq) => inq.id !== id));
        toast.success("Inquiry removed");
      }
    } catch {
      toast.error("Failed to delete inquiry");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-6 border-b border-[var(--card-border)]">
        <div>
          <h2 className="theme-heading font-bold text-xl sm:text-2xl">Brand Collab Inbox</h2>
          <p className="theme-muted text-xs sm:text-sm font-mono mt-0.5">{inquiries.length} received collaboration briefs</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 theme-muted flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
          <span className="text-xs font-mono">Loading inquiries from Supabase database...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div key={inq.id} className="glass-card p-5 sm:p-7 rounded-3xl space-y-4 border border-[var(--card-border)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[var(--accent-glow)] border border-[var(--accent)] flex items-center justify-center text-[var(--accent)] font-bold text-sm">
                    {inq.brand_name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="theme-heading font-bold text-base sm:text-lg">{inq.brand_name}</h3>
                    <a href={`mailto:${inq.contact_email}`} className="text-[var(--accent)] text-xs font-mono hover:underline flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {inq.contact_email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={inq.status}
                    onChange={(e) => updateStatus(inq.id, e.target.value)}
                    className="neon-input text-xs py-1.5 px-3 min-w-[130px]"
                  >
                    <option value="New">New</option>
                    <option value="In Discussion">In Discussion</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Declined">Declined</option>
                  </select>
                  <button
                    onClick={() => handleDelete(inq.id)}
                    className="p-2 rounded-xl theme-muted hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[var(--subtle-bg)] text-xs font-mono">
                <div>
                  <span className="theme-muted block mb-0.5">Budget Allocated</span>
                  <span className="theme-heading font-bold">{inq.budget_range}</span>
                </div>
                <div>
                  <span className="theme-muted block mb-0.5">Deliverables</span>
                  <span className="theme-subtext font-medium truncate block">
                    {Array.isArray(inq.deliverables) ? inq.deliverables.join(", ") : inq.deliverables}
                  </span>
                </div>
                <div>
                  <span className="theme-muted block mb-0.5">Timeline</span>
                  <span className="theme-subtext font-medium">{inq.timeline}</span>
                </div>
              </div>

              {inq.notes && (
                <div className="p-3.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs">
                  <p className="theme-muted font-mono uppercase text-[10px] mb-1">Brand Brief Notes:</p>
                  <p className="theme-subtext leading-relaxed">{inq.notes}</p>
                </div>
              )}
            </div>
          ))}

          {inquiries.length === 0 && (
            <div className="text-center py-16 theme-muted text-xs font-mono">
              Inbox is clean. No inquiries submitted yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
