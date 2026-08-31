"use client";

import { useState, ReactNode } from "react";
import {
  LayoutDashboard, FileImage, Film, Folder, Wrench,
  Inbox, BarChart2, Building2, LogOut, Zap, Menu, X
} from "lucide-react";
import { useRouter } from "next/navigation";

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

const PANELS: Record<string, ReactNode> = {
  overview: <DashboardOverview />,
  posts: <PostsManager />,
  reels: <ReelsManager />,
  projects: <ProjectsManager />,
  gear: <GearManager />,
  inquiries: <InquiriesPanel />,
  stats: <StatsEditor />,
  business: <BusinessInfo />,
};

export default function AdminDashboard() {
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const logout = () => {
    document.cookie = "admin_session=; max-age=0; path=/";
    router.push("/admin-studio");
  };

  return (
    <div className="min-h-screen bg-[#020202] flex">
      {/* Sidebar */}
      <aside
        className={`admin-sidebar fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:flex border-r border-[rgba(0,255,127,0.08)] bg-[#050505]`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3.5 p-6 border-b border-[rgba(0,255,127,0.08)]">
          <div className="w-10 h-10 rounded-2xl bg-[#00ff7f] flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(0,255,127,0.4)]">
            <Zap className="w-5 h-5 text-[#020202]" fill="#020202" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Admin Studio</p>
            <p className="text-white/35 text-[11px] font-mono">Creator CMS Engine</p>
          </div>
        </div>

        {/* Nav list */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActive(item.id); setSidebarOpen(false); }}
              className={`admin-nav-item w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                active === item.id
                  ? "bg-[rgba(0,255,127,0.12)] text-[#00ff7f] border border-[rgba(0,255,127,0.3)] shadow-[0_0_20px_rgba(0,255,127,0.06)]"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
              {item.id === "inquiries" && (
                <span className="ml-auto px-2 py-0.5 rounded-full bg-[#00ff7f]/20 text-[#00ff7f] text-[10px] font-mono font-bold">
                  4
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-[rgba(0,255,127,0.08)]">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-md"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main panel container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 px-6 sm:px-10 py-5 bg-[rgba(2,2,2,0.95)] backdrop-blur-xl border-b border-[rgba(0,255,127,0.06)]">
          <button
            className="lg:hidden text-white/50 hover:text-[#00ff7f] transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <h1 className="text-white font-bold text-lg">
              {NAV_ITEMS.find((n) => n.id === active)?.label}
            </h1>
            <p className="text-white/30 text-xs font-mono">
              admin-studio / {active}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="hidden sm:inline-flex text-xs font-mono text-white/40 hover:text-[#00ff7f] glass-card px-3.5 py-2 rounded-xl border border-white/5 transition-colors"
            >
              ↗ View Live Site
            </a>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00ff7f] glass-card px-3.5 py-2 rounded-xl border border-[rgba(0,255,127,0.2)]">
              <div className="w-2 h-2 rounded-full bg-[#00ff7f] animate-ping" />
              LIVE
            </div>
          </div>
        </header>

        {/* Content Panel */}
        <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {PANELS[active]}
          </div>
        </main>
      </div>
    </div>
  );
}
