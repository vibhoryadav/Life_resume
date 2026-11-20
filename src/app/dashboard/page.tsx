"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { VerificationBadge } from "@/components/Badge";
import {
  Award,
  ShieldCheck,
  Clock,
  Sparkles,
  PlusCircle,
  FileText,
  Upload,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function DashboardOverviewPage() {
  const [user, setUser] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [meRes, achRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/achievements"),
        ]);

        const meJson = await meRes.json();
        const achJson = await achRes.json();

        if (meJson.authenticated) {
          setUser(meJson.user);
        }
        if (achJson.achievements) {
          setAchievements(achJson.achievements);
        }
      } catch (e) {
        console.error("Failed to load dashboard data", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalAchievements = achievements.length;
  const verifiedCount = achievements.filter((a) => a.verification_status === "VERIFIED").length;
  const pendingRequests = achievements.filter((a) => a.verification_status === "VERIFICATION_REQUESTED").length;

  // Calculate profile completion percentage
  let completionPoints = 0;
  if (user?.full_name) completionPoints += 20;
  if (user?.email_verified) completionPoints += 20;
  if (user?.profile?.headline) completionPoints += 20;
  if (totalAchievements > 0) completionPoints += 20;
  if (verifiedCount > 0) completionPoints += 20;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-soft text-[11px] font-bold text-amber-900 border border-brand-yellow/40">
            Life Resume Portfolio
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
            Welcome back, {user?.full_name?.split(" ")[0] || "Learner"}!
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted">
            Here is your verified achievement snapshot and attestation activity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/dashboard/achievements">
            <Button variant="primary" size="md" className="gap-2 shadow-hover">
              <PlusCircle className="w-4 h-4" /> Add Achievement
            </Button>
          </Link>
          <Link href="/dashboard/resume-builder">
            <Button variant="secondary" size="md" className="gap-2">
              <Sparkles className="w-4 h-4" /> AI Resume
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Completion Bar */}
      <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-brand-dark">Portfolio Strength & Verification Readiness</span>
          <span className="font-extrabold text-brand-dark">{completionPoints}% Complete</span>
        </div>
        <div className="w-full bg-brand-ivory rounded-full h-2.5 overflow-hidden border border-brand-border">
          <div
            className="bg-brand-yellow h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${completionPoints}%` }}
          />
        </div>
        {completionPoints < 100 && (
          <p className="text-[11px] text-brand-muted">
            Tip: Complete your profile headline and request your first mentor verification to reach 100% verified status.
          </p>
        )}
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-card space-y-1">
          <div className="flex items-center justify-between text-brand-muted text-xs">
            <span>Total Logged</span>
            <Award className="w-4 h-4 text-brand-yellow" />
          </div>
          <span className="text-3xl font-black text-brand-dark">{totalAchievements}</span>
          <span className="text-[11px] text-brand-muted block">Milestones documented</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-card space-y-1">
          <div className="flex items-center justify-between text-emerald-800 text-xs">
            <span>Verified</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-3xl font-black text-emerald-700">{verifiedCount}</span>
          <span className="text-[11px] text-brand-muted block">Third-party attested</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-card space-y-1">
          <div className="flex items-center justify-between text-amber-800 text-xs">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-3xl font-black text-amber-800">{pendingRequests}</span>
          <span className="text-[11px] text-brand-muted block">Awaiting mentor reply</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-card space-y-1">
          <div className="flex items-center justify-between text-brand-dark text-xs">
            <span>Public Identity</span>
            <ExternalLink className="w-4 h-4 text-brand-muted" />
          </div>
          <span className="text-base font-bold text-brand-dark truncate block mt-1">
            /{user?.profile?.custom_username || "profile"}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold block">Active & Verified</span>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/dashboard/achievements"
          className="bg-white p-4 rounded-2xl border border-brand-border hover:border-brand-yellow shadow-sm transition-all group flex flex-col items-center text-center gap-2"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-soft text-brand-dark flex items-center justify-center group-hover:bg-brand-yellow transition-colors">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-brand-dark">Log Milestone</span>
        </Link>

        <Link
          href="/dashboard/verification"
          className="bg-white p-4 rounded-2xl border border-brand-border hover:border-brand-yellow shadow-sm transition-all group flex flex-col items-center text-center gap-2"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-soft text-brand-dark flex items-center justify-center group-hover:bg-brand-yellow transition-colors">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-brand-dark">Verify Claim</span>
        </Link>

        <Link
          href="/dashboard/resume-builder"
          className="bg-white p-4 rounded-2xl border border-brand-border hover:border-brand-yellow shadow-sm transition-all group flex flex-col items-center text-center gap-2"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-soft text-brand-dark flex items-center justify-center group-hover:bg-brand-yellow transition-colors">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-brand-dark">Build Resume</span>
        </Link>

        <Link
          href={user?.profile?.custom_username ? `/u/${user.profile.custom_username}` : "/dashboard/profile"}
          target="_blank"
          className="bg-white p-4 rounded-2xl border border-brand-border hover:border-brand-yellow shadow-sm transition-all group flex flex-col items-center text-center gap-2"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-soft text-brand-dark flex items-center justify-center group-hover:bg-brand-yellow transition-colors">
            <ExternalLink className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-brand-dark">Public Profile</span>
        </Link>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-brand-dark">Recent Achievements</h2>
            <p className="text-xs text-brand-muted">Your latest logged accomplishments and evidence.</p>
          </div>
          <Link href="/dashboard/achievements">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {achievements.length === 0 ? (
          <div className="text-center py-10 space-y-3 bg-brand-ivory rounded-2xl border border-dashed border-brand-border">
            <Award className="w-8 h-8 text-brand-muted mx-auto" />
            <h3 className="text-sm font-bold text-brand-dark">No achievements logged yet</h3>
            <p className="text-xs text-brand-muted max-w-sm mx-auto">
              Start building your life resume by documenting a project, leadership role, or competition.
            </p>
            <Link href="/dashboard/achievements">
              <Button variant="primary" size="sm">Add First Achievement</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-brand-border">
            {achievements.slice(0, 4).map((ach) => (
              <div key={ach.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-brand-dark bg-brand-soft px-2 py-0.5 rounded border border-brand-border">
                      {ach.category.replace("_", " ")}
                    </span>
                    <span className="text-xs text-brand-muted">{formatDate(ach.created_at)}</span>
                  </div>
                  <h3 className="text-sm font-bold text-brand-dark">{ach.title}</h3>
                  <p className="text-xs text-brand-muted line-clamp-1">{ach.description}</p>
                </div>
                <VerificationBadge status={ach.verification_status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
