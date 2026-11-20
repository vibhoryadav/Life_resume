"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import {
  LayoutDashboard,
  User,
  Award,
  Briefcase,
  BookOpen,
  Sparkles,
  ShieldCheck,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Bell,
  Heart,
  ChevronRight,
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        const json = await res.json();
        if (!json.authenticated) {
          router.push("/auth/signin");
          return;
        }
        setUser(json.user);
      } catch {
        router.push("/auth/signin");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/signin");
    router.refresh();
  };

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Profile", href: "/dashboard/profile", icon: User },
    { label: "Achievements", href: "/dashboard/achievements", icon: Award },
    { label: "Projects", href: "/dashboard/projects", icon: Briefcase },
    { label: "Education", href: "/dashboard/education", icon: BookOpen },
    { label: "Skills", href: "/dashboard/skills", icon: Sparkles },
    { label: "Verification Hub", href: "/dashboard/verification", icon: ShieldCheck },
    { label: "Recommendations", href: "/dashboard/recommendations", icon: Heart },
    { label: "Resume Builder", href: "/dashboard/resume-builder", icon: FileText },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-ivory flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-brand-yellow border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 bg-white border-r border-brand-border flex-col justify-between shrink-0 sticky top-0 h-screen z-30">
        <div>
          <div className="p-6 border-b border-brand-border">
            <Logo />
          </div>

          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-brand-soft text-brand-dark border-l-4 border-brand-yellow shadow-sm font-bold"
                      : "text-brand-muted hover:text-brand-dark hover:bg-brand-ivory"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-brand-dark" : "text-brand-muted"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-brand-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-brand-yellow text-brand-dark font-bold text-xs flex items-center justify-center shrink-0">
                {user?.full_name?.charAt(0) || "U"}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-brand-dark block truncate">
                  {user?.full_name || "User"}
                </span>
                <span className="text-[10px] text-brand-muted block truncate">
                  {user?.email || ""}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-brand-muted hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {user?.profile?.custom_username && (
            <Link
              href={`/u/${user.profile.custom_username}`}
              target="_blank"
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-brand-soft border border-brand-border text-[11px] font-semibold text-brand-dark hover:bg-brand-yellow transition-colors"
            >
              View Public Life Resume
              <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-brand-border px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Logo />
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 text-brand-dark hover:bg-brand-soft rounded-lg"
        >
          {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="md:hidden bg-white border-b border-brand-border px-4 py-4 space-y-2 z-40">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                  isActive
                    ? "bg-brand-soft text-brand-dark border-l-4 border-brand-yellow font-bold"
                    : "text-brand-muted hover:text-brand-dark"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-brand-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
