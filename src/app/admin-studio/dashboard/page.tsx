"use client";

import { useState } from "react";
import {
  LayoutDashboard, FileImage, Film, Folder, Wrench,
  Inbox, BarChart2, Building2, LogOut, Zap, Menu, X, Globe, Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";
import ThemeCustomizer from "@/components/ui/ThemeCustomizer";

// Panel imports
import DashboardOverview from "@/components/admin/DashboardOverview";
import PostsManager from "@/components/admin/PostsManager";
import ReelsManager from "@/components/admin/ReelsManager";
import ProjectsManager from "@/components/admin/ProjectsManager";
import GearManager from "@/components/admin/GearManager";
import InquiriesPanel from "@/components/admin/InquiriesPanel";
import StatsEditor from "@/components/admin/StatsEditor";
import BusinessInfo from "@/components/admin/BusinessInfo";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "posts", label: "Posts & Feed", icon: FileImage },
  { id: "reels", label: "9:16 Reels", icon: Film },
  { id: "projects", label: "Campaigns", icon: Folder },
  { id: "gear", label: "Production Gear", icon: Wrench },
  { id: "inquiries", label: "Brand Inbox", icon: Inbox },
  { id: "stats", label: "Stats & Metrics", icon: BarChart2 },
  { id: "business", label: "Profile & Rates", icon: Building2 },
];

export default function AdminDashboard() {
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const logout = () => {
    document.cookie = "admin_session=; max-age=0; path=/";
    router.push("/admin-studio");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col lg:flex-row text-[var(--text-primary)]">
      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:flex border-r border-[var(--card-border)] bg-[var(--bg-secondary)] shadow-2xl lg:shadow-none`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[var(--card-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--accent)] flex items-center justify-center flex-shrink-0 shadow-md">
              <Zap className="w-5 h-5 text-[#030712]" fill="#030712" />
            </div>
            <div>
              <p className="theme-heading font-bold text-sm">Admin Studio</p>
              <p className="theme-muted text-[11px] font-mono">Creator CMS Engine</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-xl theme-muted hover:theme-heading hover:bg-[var(--subtle-bg)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav list */}
        <nav className="flex-1 p-3 sm:p-4 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActive(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                active === item.id
                  ? "bg-[var(--accent-glow)] text-[var(--accent)] border border-[var(--accent)] font-bold shadow-sm"
                  : "theme-subtext hover:theme-heading hover:bg-[var(--subtle-bg)]"
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
              {item.id === "inquiries" && (
                <span className="ml-auto px-2 py-0.5 rounded-full bg-[var(--accent-glow)] text-[var(--accent)] text-[10px] font-mono font-bold">
                  Inbox
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom Theme & Logout Bar */}
        <div className="p-4 border-t border-[var(--card-border)] space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs theme-muted font-mono">Theme Mode</span>
            <ThemeCustomizer />
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Log Out Studio
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-md"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Panel Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 sm:py-4 bg-[var(--glass-dock)] backdrop-blur-xl border-b border-[var(--card-border)]">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-xl bg-[var(--subtle-bg)] border border-[var(--card-border)] theme-heading hover:text-[var(--accent)] transition-colors cursor-pointer"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="theme-heading font-bold text-base sm:text-lg">
                {NAV_ITEMS.find((n) => n.id === active)?.label}
              </h1>
              <p className="theme-muted text-[11px] font-mono">
                studio / {active}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-mono theme-subtext hover:text-[var(--accent)] glass-card px-3 py-1.5 rounded-xl border border-[var(--card-border)] transition-colors"
            >
              <Globe className="w-3.5 h-3.5" /> <span className="hidden sm:inline">View Live Site</span>
            </a>
            <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--accent)] glass-card px-3 py-1.5 rounded-xl border border-[var(--accent)]">
              <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
              LIVE
            </div>
          </div>
        </header>

        {/* Content View Panel */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            {active === "overview" && <DashboardOverview onNavigate={(tab) => setActive(tab)} />}
            {active === "posts" && <PostsManager />}
            {active === "reels" && <ReelsManager />}
            {active === "projects" && <ProjectsManager />}
            {active === "gear" && <GearManager />}
            {active === "inquiries" && <InquiriesPanel />}
            {active === "stats" && <StatsEditor />}
            {active === "business" && <BusinessInfo />}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Quick Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--glass-dock)] backdrop-blur-2xl border-t border-[var(--card-border)] px-3 py-2 flex items-center justify-around">
        {[
          { id: "overview", label: "Home", icon: LayoutDashboard },
          { id: "posts", label: "Posts", icon: FileImage },
          { id: "reels", label: "Reels", icon: Film },
          { id: "inquiries", label: "Inbox", icon: Inbox },
          { id: "projects", label: "Deals", icon: Folder },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-mono transition-all cursor-pointer ${
              active === item.id
                ? "text-[var(--accent)] font-bold"
                : "theme-muted hover:theme-heading"
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
