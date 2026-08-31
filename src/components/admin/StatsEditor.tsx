"use client";

import { useEffect, useState } from "react";
import { BarChart2, Save, Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface StatItem {
  id: number;
  label: string;
  value: number;
  suffix: string;
  desc: string;
  category: string;
}

export default function StatsEditor() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      if (data.data) setStats(data.data);
    } catch {
      toast.error("Failed to load metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const updateStatField = (id: number, field: string, val: string | number) => {
    setStats(stats.map((s) => (s.id === id ? { ...s, [field]: val } : s)));
  };

  const handleSaveStat = async (stat: StatItem) => {
    setSavingId(stat.id);
    try {
      const res = await fetch("/api/stats", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stat),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`${stat.label} updated! 📊`);
      }
    } catch {
      toast.error("Failed to save metric");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="pb-6 border-b border-[var(--card-border)]">
        <h2 className="theme-heading font-bold text-xl sm:text-2xl">Real-Time Stats & Social Proof</h2>
        <p className="theme-muted text-xs sm:text-sm font-mono mt-0.5">
          Edit live metrics shown in the hero badge and &quot;Numbers That Speak&quot; section
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 theme-muted flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
          <span className="text-xs font-mono">Loading metrics from Supabase database...</span>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {stats.map((stat) => (
            <div key={stat.id} className="glass-card p-5 sm:p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="tag-pill text-[9px] uppercase font-mono">{stat.category}</span>
                <button
                  onClick={() => handleSaveStat(stat)}
                  disabled={savingId === stat.id}
                  className="neon-btn-filled px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {savingId === stat.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                  Save
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="theme-muted text-[10px] font-mono block mb-1 uppercase">Metric Name</label>
                  <input
                    value={stat.label}
                    onChange={(e) => updateStatField(stat.id, "label", e.target.value)}
                    className="neon-input text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="theme-muted text-[10px] font-mono block mb-1 uppercase">Numeric Value</label>
                    <input
                      type="number"
                      value={stat.value}
                      onChange={(e) => updateStatField(stat.id, "value", Number(e.target.value))}
                      className="neon-input text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="theme-muted text-[10px] font-mono block mb-1 uppercase">Suffix (K, M+, %)</label>
                    <input
                      value={stat.suffix}
                      onChange={(e) => updateStatField(stat.id, "suffix", e.target.value)}
                      className="neon-input text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="theme-muted text-[10px] font-mono block mb-1 uppercase">Description</label>
                  <input
                    value={stat.desc}
                    onChange={(e) => updateStatField(stat.id, "desc", e.target.value)}
                    className="neon-input text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
