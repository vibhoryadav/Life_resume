"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { VerificationBadge } from "@/components/Badge";
import {
  Award,
  Plus,
  Sparkles,
  Upload,
  Send,
  Trash2,
  Edit2,
  FileCheck2,
  CheckCircle2,
  X,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState<string | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState<any | null>(null);

  // Create/Edit Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "LEADERSHIP",
    organization: "",
    role: "",
    start_date: "",
    end_date: "",
    measurable_impact: "",
    location: "",
    visibility: "PUBLIC",
    skills: "",
  });

  // AI helper states
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiImproving, setAiImproving] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any | null>(null);

  // Evidence upload state
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [uploadingEvidence, setUploadingEvidence] = useState(false);

  // Verification request state
  const [verifierEmail, setVerifierEmail] = useState("");
  const [verifierMessage, setVerifierMessage] = useState("");
  const [requestingVerify, setRequestingVerify] = useState(false);

  const loadAchievements = async () => {
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
  };

  useEffect(() => {
    loadAchievements();
  }, []);

  const handleCreateAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const skillsArray = formData.skills
        ? formData.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const payload = {
        ...formData,
        skills: skillsArray,
        start_date: formData.start_date || undefined,
        end_date: formData.end_date || undefined,
      };

      const res = await fetch("/api/achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setFormData({
          title: "",
          description: "",
          category: "LEADERSHIP",
          organization: "",
          role: "",
          start_date: "",
          end_date: "",
          measurable_impact: "",
          location: "",
          visibility: "PUBLIC",
          skills: "",
        });
        setAiSuggestion(null);
        loadAchievements();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save achievement.");
      }
    } catch {
      alert("Network error saving achievement.");
    }
  };

  const handleDeleteAchievement = async (id: string) => {
    if (!confirm("Are you sure you want to delete this achievement? This will remove attached evidence and verification records.")) {
      return;
    }
    try {
      const res = await fetch(`/api/achievements/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadAchievements();
      }
    } catch {
      alert("Failed to delete achievement.");
    }
  };

  // AI Feature A: Analyze
  const handleAiAnalyze = async () => {
    if (!formData.title || !formData.description) {
      alert("Please enter a title and description first.");
      return;
    }
    setAiAnalyzing(true);
    try {
      const res = await fetch("/api/ai/analyze-achievement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAiSuggestion(data.analysis);
        const extractedSkills = data.analysis.suggestedSkills.map((s: any) => s.name).join(", ");
        if (extractedSkills) {
          setFormData((prev) => ({
            ...prev,
            skills: prev.skills ? `${prev.skills}, ${extractedSkills}` : extractedSkills,
            category: data.analysis.suggestedCategory || prev.category,
          }));
        }
      }
    } catch {
      alert("Failed to analyze with AI.");
    } finally {
      setAiAnalyzing(false);
    }
  };

  // AI Feature B: Polish Description
  const handleAiImprove = async () => {
    if (!formData.description) {
      alert("Please provide a description to polish.");
      return;
    }
    setAiImproving(true);
    try {
      const res = await fetch("/api/ai/improve-achievement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          role: formData.role,
          organization: formData.organization,
          measurableImpact: formData.measurable_impact,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFormData((prev) => ({
          ...prev,
          description: data.improvement.improvedDescription,
        }));
      }
    } catch {
      alert("Failed to polish with AI.");
    } finally {
      setAiImproving(false);
    }
  };

  // Evidence Upload
  const handleUploadEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceFile || !showEvidenceModal) return;

    setUploadingEvidence(true);
    try {
      const data = new FormData();
      data.append("file", evidenceFile);
      if (evidenceDesc) data.append("description", evidenceDesc);

      const res = await fetch(`/api/achievements/${showEvidenceModal}/evidence`, {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        setShowEvidenceModal(null);
        setEvidenceFile(null);
        setEvidenceDesc("");
        loadAchievements();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to upload evidence.");
      }
    } catch {
      alert("Error uploading file.");
    } finally {
      setUploadingEvidence(false);
    }
  };

  // Verification Request Submit
  const handleRequestVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showVerifyModal || !verifierEmail) return;

    setRequestingVerify(true);
    try {
      const res = await fetch("/api/verification/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          achievement_id: showVerifyModal.id,
          verifier_email: verifierEmail,
          message: verifierMessage,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        alert(json.message || "Verification request dispatched.");
        setShowVerifyModal(null);
        setVerifierEmail("");
        setVerifierMessage("");
        loadAchievements();
      } else {
        alert(json.error || "Failed to send request.");
      }
    } catch {
      alert("Network error sending verification request.");
    } finally {
      setRequestingVerify(false);
    }
  };

  const filteredAchievements =
    selectedCategory === "ALL"
      ? achievements
      : achievements.filter((a) => a.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">Achievements & Milestones</h1>
          <p className="text-xs sm:text-sm text-brand-muted">
            Document authentic accomplishments, attach evidence, and request third-party verification.
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} variant="primary" size="md" className="gap-2 shadow-hover">
          <Plus className="w-4 h-4" /> Add Achievement
        </Button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {["ALL", "LEADERSHIP", "EVENTS", "TECHNOLOGY", "RESEARCH", "COMPETITIONS", "VOLUNTEERING", "ACADEMICS", "ENTREPRENEURSHIP"].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-brand-yellow text-brand-dark shadow-sm"
                  : "bg-white text-brand-muted border border-brand-border hover:bg-brand-soft"
              }`}
            >
              {cat.replace("_", " ")}
            </button>
          )
        )}
      </div>

      {/* Achievement Cards List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-brand-muted">Loading your achievements...</div>
      ) : filteredAchievements.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-brand-border shadow-card text-center space-y-4">
          <Award className="w-10 h-10 text-brand-muted mx-auto" />
          <h3 className="text-base font-bold text-brand-dark">No achievements found in this view</h3>
          <p className="text-xs text-brand-muted max-w-sm mx-auto">
            Document your leadership, events, open source contributions, or competitions to start building your record.
          </p>
          <Button onClick={() => setShowCreateModal(true)} variant="primary" size="md">
            Add Your First Achievement
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAchievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-white rounded-2xl p-6 border border-brand-border shadow-card hover:border-brand-yellow transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-amber-900 bg-brand-soft px-2 py-0.5 rounded border border-brand-yellow/40">
                      {ach.category.replace("_", " ")}
                    </span>
                    <span className="text-xs text-brand-muted">
                      {formatDate(ach.start_date)} {ach.end_date ? `– ${formatDate(ach.end_date)}` : ""}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-brand-dark mt-1">{ach.title}</h3>
                  <p className="text-xs text-brand-muted">
                    {ach.role ? `${ach.role} • ` : ""}
                    {ach.organization ? `${ach.organization} • ` : ""}
                    {ach.location ? `${ach.location}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <VerificationBadge status={ach.verification_status} />
                  <button
                    onClick={() => handleDeleteAchievement(ach.id)}
                    className="p-1.5 text-brand-muted hover:text-red-600 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-brand-dark leading-relaxed">{ach.description}</p>

              {ach.measurable_impact && (
                <div className="bg-brand-soft rounded-xl p-3 border border-brand-border text-xs">
                  <span className="font-bold text-brand-dark">Impact: </span>
                  <span className="text-brand-dark/90">{ach.measurable_impact}</span>
                </div>
              )}

              {/* Verified remark preview if verified */}
              {ach.verificationRecords?.length > 0 && (
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-xs">
                  <span className="font-bold text-emerald-900">Attested by {ach.verificationRecords[0].verifier_name}: </span>
                  <span className="text-emerald-950 italic">{ach.verificationRecords[0].verification_comment}</span>
                </div>
              )}

              {/* Evidence attachments */}
              {ach.evidence?.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-bold text-brand-dark uppercase tracking-wider block">
                    Attached Evidence Artifacts ({ach.evidence.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {ach.evidence.map((ev: any) => (
                      <span
                        key={ev.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-ivory border border-brand-border text-xs text-brand-dark"
                      >
                        <FileCheck2 className="w-3.5 h-3.5 text-brand-yellow" />
                        <span className="truncate max-w-[180px]">{ev.file_name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons footer */}
              <div className="pt-3 border-t border-brand-border flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {ach.achievementSkills?.map((askill: any) => (
                    <span
                      key={askill.skill.id}
                      className="px-2 py-0.5 rounded-md bg-brand-soft text-[10px] font-semibold text-brand-dark border border-brand-border"
                    >
                      {askill.skill.name}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setShowEvidenceModal(ach.id)}
                    variant="secondary"
                    size="sm"
                    className="gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Evidence
                  </Button>

                  {ach.verification_status !== "VERIFIED" && (
                    <Button
                      onClick={() => setShowVerifyModal(ach)}
                      variant="primary"
                      size="sm"
                      className="gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Request Verification
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-brand-border shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-brand-border pb-4">
              <div>
                <h2 className="text-xl font-bold text-brand-dark">Document New Achievement</h2>
                <p className="text-xs text-brand-muted">Record authentic experiences with verified evidence.</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-brand-muted hover:text-brand-dark"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAchievement} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Achievement Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Lead Convener, State Tech Summit 2024"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
                  >
                    <option value="LEADERSHIP">Leadership</option>
                    <option value="EVENTS">Events</option>
                    <option value="TECHNOLOGY">Technology</option>
                    <option value="RESEARCH">Research</option>
                    <option value="COMPETITIONS">Competitions</option>
                    <option value="VOLUNTEERING">Volunteering</option>
                    <option value="ACADEMICS">Academics</option>
                    <option value="ENTREPRENEURSHIP">Entrepreneurship</option>
                    <option value="SPORTS">Sports</option>
                    <option value="ARTS">Arts</option>
                    <option value="CERTIFICATIONS">Certifications</option>
                    <option value="PROFESSIONAL_EXPERIENCE">Professional Experience</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Organization / Event</label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="e.g. Campus Tech Collective"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Your Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Lead Organizer / Core Contributor"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Bengaluru, India"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">End Date (or ongoing)</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
                  />
                </div>
              </div>

              {/* Description & AI Helpers */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-brand-dark">Detailed Description *</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAiImprove}
                      disabled={aiImproving}
                      className="text-[11px] font-bold text-amber-900 bg-brand-soft px-2.5 py-1 rounded-md border border-brand-yellow/50 hover:bg-brand-yellow transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      {aiImproving ? "Polishing..." : "Polish with AI"}
                    </button>
                    <button
                      type="button"
                      onClick={handleAiAnalyze}
                      disabled={aiAnalyzing}
                      className="text-[11px] font-bold text-brand-dark bg-white px-2.5 py-1 rounded-md border border-brand-border hover:bg-brand-soft transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-brand-dark" />
                      {aiAnalyzing ? "Analyzing..." : "Auto-Extract Skills"}
                    </button>
                  </div>
                </div>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what you built or organized, the team size, and key responsibilities..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Measurable Impact / Figures</label>
                <input
                  type="text"
                  value={formData.measurable_impact}
                  onChange={(e) => setFormData({ ...formData, measurable_impact: e.target.value })}
                  placeholder="e.g. 4,000 attendees, 14 volunteer committees, ₹5L sponsorships raised"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Demonstrated Skills (comma-separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="Event Management, Leadership, Team Coordination"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
                />
              </div>

              <div className="pt-4 border-t border-brand-border flex justify-end gap-3">
                <Button type="button" onClick={() => setShowCreateModal(false)} variant="secondary" size="md">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" className="shadow-hover">
                  Save Achievement
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EVIDENCE UPLOAD MODAL */}
      {showEvidenceModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-brand-border shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h3 className="text-lg font-bold text-brand-dark">Upload Primary Evidence</h3>
              <button onClick={() => setShowEvidenceModal(null)} className="text-brand-muted hover:text-brand-dark">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadEvidence} className="space-y-4">
              <p className="text-xs text-brand-muted">
                Supported formats: PDF, JPG, PNG, WebP (max 10MB). Stored securely in your private vault.
              </p>

              <div>
                <input
                  type="file"
                  required
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={(e) => setEvidenceFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-brand-dark file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-soft file:text-brand-dark hover:file:bg-brand-yellow cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Description of Document</label>
                <input
                  type="text"
                  value={evidenceDesc}
                  onChange={(e) => setEvidenceDesc(e.target.value)}
                  placeholder="e.g. Official signed certificate from university patron"
                  className="w-full px-3 py-2 rounded-xl border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" onClick={() => setShowEvidenceModal(null)} variant="secondary" size="sm">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={uploadingEvidence}>
                  Upload File
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REQUEST VERIFICATION MODAL */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-brand-border shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-brand-dark">Request Third-Party Verification</h3>
                <p className="text-xs text-brand-muted">{showVerifyModal.title}</p>
              </div>
              <button onClick={() => setShowVerifyModal(null)} className="text-brand-muted hover:text-brand-dark">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestVerification} className="space-y-4">
              <p className="text-xs text-brand-muted leading-relaxed">
                We will dispatch an official verification link to the organizer or faculty member. They can review your claim and attached evidence without needing an account.
              </p>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Verifier Email Address *</label>
                <input
                  type="email"
                  required
                  value={verifierEmail}
                  onChange={(e) => setVerifierEmail(e.target.value)}
                  placeholder="professor@university.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Personal Message to Verifier (Optional)</label>
                <textarea
                  rows={3}
                  value={verifierMessage}
                  onChange={(e) => setVerifierMessage(e.target.value)}
                  placeholder="e.g. Hello Professor, could you please verify my lead convener role for the summit?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" onClick={() => setShowVerifyModal(null)} variant="secondary" size="sm">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={requestingVerify}>
                  Dispatch Verification Link
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
