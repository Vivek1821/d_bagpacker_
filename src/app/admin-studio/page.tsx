"use client";

import { useState } from "react";
import { Zap, Eye, EyeOff, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simple credential check — replace with Supabase Auth
    if (username === "admin" && password === "creator2025") {
      // Set a session cookie
      document.cookie = "admin_session=valid; path=/; max-age=86400";
      router.push("/admin-studio/dashboard");
    } else {
      setError("Invalid credentials. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020202] grid-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#00ff7f] mb-4">
            <Zap className="w-7 h-7 text-[#020202]" fill="#020202" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Studio</h1>
          <p className="text-white/40 text-sm mt-1 font-mono">Creator Content Management</p>
        </div>

        {/* Form */}
        <div className="glass-card p-8 rounded-3xl border border-[rgba(0,255,127,0.1)]">
          <div className="flex items-center gap-2 mb-6 text-white/40 text-xs font-mono">
            <Lock className="w-3 h-3 text-[#00ff7f]" />
            SECURE LOGIN — NOT PUBLICLY LISTED
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-white/50 text-xs font-mono tracking-wider block mb-2">USERNAME</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="neon-input w-full px-4 py-3 text-sm"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs font-mono tracking-wider block mb-2">PASSWORD</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="neon-input w-full px-4 py-3 pr-12 text-sm"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm font-mono bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-lg">
                ⚠ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full neon-btn-filled py-3 rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Authenticating..." : "Enter Studio →"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6 font-mono">
          Default: admin / creator2025 (change in env)
        </p>
      </div>
    </div>
  );
}
