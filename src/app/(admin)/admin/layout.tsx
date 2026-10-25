"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "📊" },
  { label: "Profile", href: "/admin/profile", icon: "👤" },
  { label: "Skills", href: "/admin/skills", icon: "⚡" },
  { label: "Experience", href: "/admin/experience", icon: "💼" },
  { label: "Education", href: "/admin/education", icon: "🎓" },
  { label: "Services", href: "/admin/services", icon: "🛠️" },
  { label: "Projects", href: "/admin/projects", icon: "📁" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "💬" },
  { label: "Blog", href: "/admin/blog", icon: "📝" },
  { label: "Social Links", href: "/admin/social-links", icon: "🔗" },
  { label: "Theme", href: "/admin/theme", icon: "🎨" },
  { label: "Resume", href: "/admin/resume", icon: "📄" },
  { label: "Analytics", href: "/admin/analytics", icon: "📈" },
  { label: "Smart Links", href: "/admin/smart-links", icon: "🔗" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <button
        className="fixed left-4 top-4 z-50 rounded-lg bg-white/10 p-2 text-white lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl transition-transform duration-200 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 p-6">
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-red-400 transition hover:bg-white/5 hover:text-red-300"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-end gap-4 border-b border-white/10 bg-[#0a0a0a]/80 px-8 py-4 backdrop-blur-xl">
          <button
            onClick={handleLogout}
            className="rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
          >
            Logout
          </button>
        </header>

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
