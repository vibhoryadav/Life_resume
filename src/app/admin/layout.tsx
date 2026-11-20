"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { ShieldCheck, LogOut, ArrowLeft } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await fetch("/api/auth/me");
        const json = await res.json();
        if (!json.authenticated || json.user?.role !== "SUPER_ADMIN") {
          router.push("/dashboard");
          return;
        }
      } catch {
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }
    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-ivory flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-brand-yellow border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ivory">
      <header className="bg-white border-b border-brand-border sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="px-2.5 py-1 rounded-full bg-brand-yellow text-brand-dark text-xs font-black uppercase tracking-wider">
              Super Admin Console
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-brand-muted hover:text-brand-dark flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Student Dashboard
            </Link>
            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                router.push("/auth/signin");
              }}
              className="p-1.5 rounded-lg text-brand-muted hover:text-red-600 hover:bg-red-50"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 space-y-8">
        {children}
      </main>
    </div>
  );
}
