"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { VerificationBadge } from "@/components/Badge";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Send,
  AlertCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function VerificationHubPage() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/achievements");
        const json = await res.json();
        if (json.achievements) {
          setAchievements(json.achievements);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const verified = achievements.filter((a) => a.verification_status === "VERIFIED");
  const pending = achievements.filter((a) => a.verification_status === "VERIFICATION_REQUESTED");
  const unverified = achievements.filter((a) => a.verification_status === "SELF_REPORTED" || a.verification_status === "EVIDENCE_ATTACHED");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">Verification Hub</h1>
        <p className="text-xs sm:text-sm text-brand-muted">
          Track official attestations, outgoing requests to mentors, and tamper-evident records.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-card space-y-1">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Officially Verified</span>
          <span className="text-3xl font-black text-emerald-700 block">{verified.length}</span>
          <p className="text-[11px] text-brand-muted">Attested by third-party organizers and mentors</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-card space-y-1">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Pending Review</span>
          <span className="text-3xl font-black text-amber-800 block">{pending.length}</span>
          <p className="text-[11px] text-brand-muted">Awaiting verifier response via token link</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-card space-y-1">
          <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">Unverified Milestones</span>
          <span className="text-3xl font-black text-brand-dark block">{unverified.length}</span>
          <p className="text-[11px] text-brand-muted">Self-reported or evidence attached without attestation</p>
        </div>
      </div>

      {/* Pending Verifications */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-dark flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" /> Active Verification Requests ({pending.length})
          </h2>
        </div>

        {pending.length === 0 ? (
          <p className="text-xs text-brand-muted italic py-4">No pending verification requests.</p>
        ) : (
          <div className="divide-y divide-brand-border">
            {pending.map((ach) => {
              const req = ach.verificationRequests?.[0];
              return (
                <div key={ach.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-brand-dark bg-brand-soft px-2 py-0.5 rounded border border-brand-border">
                      {ach.category.replace("_", " ")}
                    </span>
                    <h3 className="text-sm font-bold text-brand-dark">{ach.title}</h3>
                    {req && (
                      <p className="text-xs text-brand-muted">
                        Dispatched to: <strong>{req.verifier_email}</strong> • Expires: {formatDate(req.expires_at)}
                      </p>
                    )}
                  </div>
                  <VerificationBadge status={ach.verification_status} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Verified Milestones */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-4">
        <h2 className="text-lg font-bold text-brand-dark flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Verified Achievements History ({verified.length})
        </h2>

        {verified.length === 0 ? (
          <p className="text-xs text-brand-muted italic py-4">
            No achievements verified yet. Go to your Achievements page to dispatch your first verification link.
          </p>
        ) : (
          <div className="space-y-4">
            {verified.map((ach) => {
              const rec = ach.verificationRecords?.[0];
              return (
                <div key={ach.id} className="p-4 rounded-2xl bg-brand-soft border border-brand-border space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-dark text-sm">{ach.title}</span>
                    <VerificationBadge status="VERIFIED" />
                  </div>
                  {rec && (
                    <div className="text-emerald-950 space-y-0.5">
                      <p>
                        <strong>Attested by:</strong> {rec.verifier_name} {rec.verifier_organization ? `(${rec.verifier_organization})` : ""}
                      </p>
                      {rec.verification_comment && (
                        <p className="italic pt-1">&quot;{rec.verification_comment}&quot;</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
