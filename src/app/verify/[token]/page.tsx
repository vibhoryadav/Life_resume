"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  AlertTriangle,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default function VerificationPortalPage({ params }: PageProps) {
  const { token } = use(params);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Form states
  const [verifierName, setVerifierName] = useState("");
  const [verifierOrg, setVerifierOrg] = useState("");
  const [comment, setComment] = useState("");
  const [roleConfirmed, setRoleConfirmed] = useState(true);
  const [impactConfirmed, setImpactConfirmed] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetch(`/api/verification/verify?token=${encodeURIComponent(token)}`);
        const json = await res.json();

        if (!res.ok) {
          setErrorStatus(json.error || "Unable to load verification request.");
          setLoading(false);
          return;
        }

        setData(json);
      } catch {
        setErrorStatus("Network error while validating link.");
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [token]);

  const handleDecision = async (decision: "APPROVE" | "REJECT") => {
    if (!verifierName.trim()) {
      alert("Please provide your full name as the certifying verifier.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/verification/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          decision,
          verifier_name: verifierName,
          verifier_organization: verifierOrg,
          verification_comment: comment,
          role_confirmed: roleConfirmed,
          impact_confirmed: impactConfirmed,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Submission failed.");
        setSubmitting(false);
        return;
      }

      setResultMessage(json.message);
    } catch {
      alert("Network error submitting verification.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-ivory pb-20">
      <header className="bg-white border-b border-brand-border py-4 px-6 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Logo />
          <span className="text-xs text-brand-muted bg-brand-soft px-3 py-1 rounded-full border border-brand-yellow/40 font-semibold">
            Official Attestation Portal
          </span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10">
        {loading ? (
          <div className="bg-white p-12 rounded-3xl border border-brand-border text-center space-y-4">
            <Loader2 className="w-8 h-8 text-brand-yellow animate-spin mx-auto" />
            <p className="text-xs text-brand-muted">Validating secure token hash...</p>
          </div>
        ) : errorStatus ? (
          <div className="bg-white p-10 rounded-3xl border border-brand-border text-center space-y-4 shadow-card">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-brand-dark">Verification Link Inactive</h2>
            <p className="text-xs text-brand-muted max-w-md mx-auto">{errorStatus}</p>
            <div className="pt-2">
              <Link href="/">
                <Button variant="secondary" size="sm">Go to Life Resume Homepage</Button>
              </Link>
            </div>
          </div>
        ) : resultMessage ? (
          <div className="bg-white p-10 rounded-3xl border border-brand-border text-center space-y-4 shadow-card">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-brand-dark">Attestation Submitted</h2>
            <p className="text-sm text-brand-dark max-w-md mx-auto">{resultMessage}</p>
            <p className="text-xs text-brand-muted">
              A cryptographic record has been generated and the candidate portfolio has been updated.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header intro */}
            <div className="bg-brand-soft rounded-3xl p-6 sm:p-8 border border-brand-border space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-700" /> Third-Party Attestation Request
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
                Review & Verify: {data.requesterName}
              </h1>
              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                <strong>{data.requesterName}</strong> has logged an achievement on Life Resume and requested your formal attestation as a supervisor, organizer, or mentor.
              </p>
              {data.message && (
                <div className="bg-white rounded-xl p-3 border border-brand-border/60 text-xs italic text-brand-dark">
                  &quot;{data.message}&quot;
                </div>
              )}
            </div>

            {/* Achievement Details Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-6">
              <div className="border-b border-brand-border pb-4">
                <span className="text-[11px] font-bold text-amber-900 bg-brand-soft px-2 py-0.5 rounded border border-brand-yellow/40">
                  {data.achievement.category.replace("_", " ")}
                </span>
                <h2 className="text-xl font-bold text-brand-dark mt-2">{data.achievement.title}</h2>
                <p className="text-xs text-brand-muted mt-1">
                  {data.achievement.role ? `Role: ${data.achievement.role} • ` : ""}
                  {data.achievement.organization ? `Organization: ${data.achievement.organization} • ` : ""}
                  {formatDate(data.achievement.startDate)} {data.achievement.endDate ? `– ${formatDate(data.achievement.endDate)}` : ""}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">Claim Description</h3>
                <p className="text-xs sm:text-sm text-brand-dark leading-relaxed bg-brand-ivory p-4 rounded-xl border border-brand-border">
                  {data.achievement.description}
                </p>
              </div>

              {data.achievement.measurableImpact && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">Claimed Measurable Impact</h3>
                  <p className="text-xs font-semibold text-brand-dark bg-brand-soft p-3 rounded-xl border border-brand-border">
                    {data.achievement.measurableImpact}
                  </p>
                </div>
              )}

              {/* Evidence Artifacts */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-3">Attached Evidence Artifacts</h3>
                {data.achievement.evidence.length === 0 ? (
                  <p className="text-xs text-brand-muted italic">No attached documents.</p>
                ) : (
                  <div className="space-y-2">
                    {data.achievement.evidence.map((ev: any) => (
                      <div
                        key={ev.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-brand-border bg-white text-xs hover:border-brand-yellow transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-brand-yellow" />
                          <div>
                            <span className="font-semibold text-brand-dark block">{ev.fileName}</span>
                            <span className="text-[10px] text-brand-muted">{ev.fileType}</span>
                          </div>
                        </div>
                        <a
                          href={ev.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-soft text-brand-dark font-semibold text-xs border border-brand-border hover:bg-brand-yellow transition-colors"
                        >
                          Inspect Evidence
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Verifier Form */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-6">
              <h3 className="text-lg font-bold text-brand-dark">Your Official Statement</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={verifierName}
                    onChange={(e) => setVerifierName(e.target.value)}
                    placeholder="e.g. Dr. Sarah Jenkins"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Your Organization / Title</label>
                  <input
                    type="text"
                    value={verifierOrg}
                    onChange={(e) => setVerifierOrg(e.target.value)}
                    placeholder="e.g. Festival Director / University Chair"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={roleConfirmed}
                    onChange={(e) => setRoleConfirmed(e.target.checked)}
                    className="rounded border-brand-border text-brand-dark focus:ring-brand-yellow"
                  />
                  <span className="text-xs text-brand-dark font-medium">I confirm the applicant performed this role.</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={impactConfirmed}
                    onChange={(e) => setImpactConfirmed(e.target.checked)}
                    className="rounded border-brand-border text-brand-dark focus:ring-brand-yellow"
                  />
                  <span className="text-xs text-brand-dark font-medium">I confirm the stated scale and metrics are accurate.</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Attestation Comments / Remarks</label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Optional verification note that will appear on the applicant's verified record..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
                />
              </div>

              <div className="pt-4 border-t border-brand-border flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => handleDecision("APPROVE")}
                  variant="primary"
                  size="lg"
                  className="flex-1 gap-2 shadow-hover bg-emerald-600 hover:bg-emerald-700 text-white border-none"
                  isLoading={submitting}
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve & Sign Verification
                </Button>
                <Button
                  onClick={() => handleDecision("REJECT")}
                  variant="outline"
                  size="lg"
                  className="gap-2 text-rose-700 border-rose-200 hover:bg-rose-50"
                  isLoading={submitting}
                >
                  <XCircle className="w-4 h-4" /> Decline Claim
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
