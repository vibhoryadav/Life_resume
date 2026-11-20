import { notFound } from "next/navigation";
import Link from "next/link";
import { VerificationBadge } from "@/components/Badge";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import {
  MapPin,
  Calendar,
  Award,
  BookOpen,
  Briefcase,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";
import prisma from "@/lib/db";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;

  const profile = await prisma.userProfile.findUnique({
    where: { custom_username: username },
    include: {
      user: {
        include: {
          achievements: {
            where: { visibility: "PUBLIC" },
            include: {
              evidence: true,
              achievementSkills: { include: { skill: true } },
              verificationRecords: true,
            },
            orderBy: [
              { verification_status: "desc" },
              { created_at: "desc" },
            ],
          },
          educations: {
            orderBy: { start_date: "desc" },
          },
          projects: {
            orderBy: { created_at: "desc" },
          },
          userSkills: {
            include: { skill: true },
            orderBy: { evidence_count: "desc" },
          },
          recommendationsReceived: {
            where: { status: "APPROVED" },
          },
        },
      },
    },
  });

  if (!profile) {
    notFound();
  }

  if (!profile.public_profile_enabled) {
    return (
      <div className="min-h-screen bg-brand-ivory flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl border border-brand-border shadow-card max-w-md space-y-4">
          <ShieldCheck className="w-12 h-12 text-brand-muted mx-auto" />
          <h2 className="text-xl font-bold text-brand-dark">Profile Is Private</h2>
          <p className="text-xs text-brand-muted">
            The user has set their Life Resume profile to private mode.
          </p>
          <Link href="/">
            <Button variant="secondary" size="sm">Go to Homepage</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { user } = profile;
  const verifiedCount = user.achievements.filter((a) => a.verification_status === "VERIFIED").length;

  return (
    <div className="min-h-screen bg-brand-ivory pb-20">
      {/* Top Navigation */}
      <header className="bg-white border-b border-brand-border py-4 px-6 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex text-xs text-brand-muted">Verified Achievement Identity</span>
            <Link href="/auth/signup">
              <Button variant="primary" size="sm">Build Yours</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Profile Header */}
      <div className="bg-brand-soft border-b border-brand-border py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-brand-yellow text-brand-dark font-black text-2xl flex items-center justify-center shadow-card border-2 border-white">
                {user.full_name.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">{user.full_name}</h1>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Identity
                  </span>
                </div>
                <p className="text-sm font-medium text-brand-dark/80">{profile.headline || "Lifelong Achiever"}</p>
                {user.location && (
                  <p className="text-xs text-brand-muted flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {user.location}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-brand-border shadow-sm">
              <div className="text-center">
                <span className="block text-xl font-black text-brand-dark">{user.achievements.length}</span>
                <span className="text-[10px] text-brand-muted uppercase font-bold">Logged</span>
              </div>
              <div className="w-px h-8 bg-brand-border" />
              <div className="text-center">
                <span className="block text-xl font-black text-emerald-700">{verifiedCount}</span>
                <span className="text-[10px] text-brand-muted uppercase font-bold">Verified</span>
              </div>
              <div className="w-px h-8 bg-brand-border" />
              <div className="text-center">
                <span className="block text-xl font-black text-brand-dark">{user.userSkills.length}</span>
                <span className="text-[10px] text-brand-muted uppercase font-bold">Skills</span>
              </div>
            </div>
          </div>

          {/* Bio & Professional Summary */}
          {(user.bio || profile.professional_summary) && (
            <div className="mt-8 pt-6 border-t border-brand-border/60 max-w-3xl">
              <p className="text-sm text-brand-dark leading-relaxed">
                {profile.professional_summary || user.bio}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Profile Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        {/* Achievements Timeline */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-brand-dark flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-yellow" /> Documented & Verified Achievements
            </h2>
            <span className="text-xs text-brand-muted">Showing {user.achievements.length} public records</span>
          </div>

          <div className="space-y-4">
            {user.achievements.map((ach) => (
              <div
                key={ach.id}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-brand-border shadow-card hover:border-brand-yellow/80 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-amber-900 bg-brand-soft px-2 py-0.5 rounded border border-brand-yellow/40">
                      {ach.category.replace("_", " ")}
                    </span>
                    <h3 className="text-lg font-bold text-brand-dark mt-1.5">{ach.title}</h3>
                    <p className="text-xs text-brand-muted">
                      {ach.role ? `${ach.role} • ` : ""}
                      {ach.organization ? `${ach.organization} • ` : ""}
                      {formatDate(ach.start_date)} {ach.end_date ? `– ${formatDate(ach.end_date)}` : ""}
                    </p>
                  </div>
                  <VerificationBadge status={ach.verification_status} />
                </div>

                <p className="text-xs sm:text-sm text-brand-dark leading-relaxed">{ach.description}</p>

                {ach.measurable_impact && (
                  <div className="bg-brand-ivory rounded-xl p-3 border border-brand-border text-xs">
                    <span className="font-bold text-brand-dark">Measurable Outcome: </span>
                    <span className="text-brand-dark/90">{ach.measurable_impact}</span>
                  </div>
                )}

                {/* Third Party Verification Quote */}
                {ach.verificationRecords.length > 0 && (
                  <div className="bg-emerald-50/60 rounded-xl p-3.5 border border-emerald-200/80 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900">
                      <span>Attested by {ach.verificationRecords[0].verifier_name}</span>
                      <span className="text-emerald-700">Official Attestation</span>
                    </div>
                    {ach.verificationRecords[0].verifier_organization && (
                      <p className="text-[11px] text-emerald-800 font-medium">
                        {ach.verificationRecords[0].verifier_organization}
                      </p>
                    )}
                    {ach.verificationRecords[0].verification_comment && (
                      <p className="text-[11px] text-emerald-950 italic pt-1">
                        &quot;{ach.verificationRecords[0].verification_comment}&quot;
                      </p>
                    )}
                  </div>
                )}

                {/* Evidence & Skills Footnotes */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-brand-border text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {ach.achievementSkills.map((askill) => (
                      <span
                        key={askill.skill.id}
                        className="px-2 py-0.5 rounded-md bg-brand-soft text-brand-dark text-[11px] font-medium border border-brand-border"
                      >
                        {askill.skill.name}
                      </span>
                    ))}
                  </div>

                  {ach.evidence.length > 0 && (
                    <span className="text-xs text-brand-muted flex items-center gap-1">
                      <FileCheck2 className="w-3.5 h-3.5 text-brand-yellow" />
                      {ach.evidence.length} Evidence Artifact Attached
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Demonstrated Skills */}
        {user.userSkills.length > 0 && (
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-border shadow-card space-y-4">
            <h2 className="text-xl font-extrabold text-brand-dark flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-yellow" /> Demonstrated Capabilities & Skills
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {user.userSkills.map((us) => (
                <div
                  key={us.id}
                  className="px-3 py-1.5 rounded-xl bg-brand-ivory border border-brand-border text-xs font-semibold text-brand-dark flex items-center gap-2"
                >
                  <span>{us.skill.name}</span>
                  {us.evidence_count > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-brand-yellow text-brand-dark text-[10px] font-black">
                      {us.evidence_count} proofs
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education & Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Education */}
          {user.educations.length > 0 && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-border shadow-card space-y-4">
              <h2 className="text-lg font-extrabold text-brand-dark flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-yellow" /> Education
              </h2>
              <div className="space-y-4">
                {user.educations.map((edu) => (
                  <div key={edu.id} className="border-l-2 border-brand-yellow pl-4 space-y-1">
                    <h3 className="text-sm font-bold text-brand-dark">{edu.qualification}</h3>
                    <p className="text-xs text-brand-muted">{edu.institution} {edu.field_of_study ? `• ${edu.field_of_study}` : ""}</p>
                    <p className="text-[11px] text-brand-muted">{formatDate(edu.start_date)} – {edu.end_date ? formatDate(edu.end_date) : "Present"}</p>
                    {edu.description && <p className="text-xs text-brand-dark pt-1">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {user.projects.length > 0 && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-border shadow-card space-y-4">
              <h2 className="text-lg font-extrabold text-brand-dark flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-brand-yellow" /> Key Projects
              </h2>
              <div className="space-y-4">
                {user.projects.map((proj) => (
                  <div key={proj.id} className="border-l-2 border-brand-border pl-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-brand-dark">{proj.title}</h3>
                      {proj.project_url && (
                        <a href={proj.project_url} target="_blank" rel="noreferrer" className="text-brand-muted hover:text-brand-dark">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-brand-dark">{proj.description}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.technologies.map((t, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-brand-soft border border-brand-border text-brand-dark">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
