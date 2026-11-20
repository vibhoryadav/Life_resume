"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import {
  FileText,
  Sparkles,
  Printer,
  Save,
  CheckCircle2,
  Layers,
  Award,
  ChevronRight,
  Download,
} from "lucide-react";

export default function ResumeBuilderPage() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [selectedAchIds, setSelectedAchIds] = useState<string[]>([]);
  const [resumeType, setResumeType] = useState("JOB");
  const [template, setTemplate] = useState("MODERN_MINIMAL");
  const [resumeTitle, setResumeTitle] = useState("My Tailored Resume");

  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resumeContent, setResumeContent] = useState<any | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadAchievements() {
      try {
        const res = await fetch("/api/achievements");
        const json = await res.json();
        if (json.achievements) {
          setAchievements(json.achievements);
          setSelectedAchIds(json.achievements.map((a: any) => a.id));
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadAchievements();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/ai/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeType,
          achievementIds: selectedAchIds,
        }),
      });

      const json = await res.json();
      if (res.ok && json.resumeContent) {
        setResumeContent(json.resumeContent);
      } else {
        alert(json.error || "Failed to generate resume.");
      }
    } catch {
      alert("Network error generating resume.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!resumeContent) return;
    setSaving(true);
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: resumeTitle,
          resume_type: resumeType,
          template,
          content: resumeContent,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch {
      alert("Failed to save resume.");
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleSelectAch = (id: string) => {
    setSelectedAchIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">AI Resume Builder</h1>
          <p className="text-xs sm:text-sm text-brand-muted">
            Synthesize verified portfolio records into an ATS-friendly, tailored professional resume.
          </p>
        </div>

        {resumeContent && (
          <div className="flex items-center gap-2">
            <Button onClick={handleSave} variant="secondary" size="md" className="gap-2" isLoading={saving}>
              <Save className="w-4 h-4" /> Save
            </Button>
            <Button onClick={handlePrint} variant="primary" size="md" className="gap-2 shadow-hover">
              <Printer className="w-4 h-4" /> Print / Export PDF
            </Button>
          </div>
        )}
      </div>

      {saveSuccess && (
        <div className="no-print p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Resume saved successfully to your account!
        </div>
      )}

      {/* Configuration Panel */}
      <div className="no-print bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Target Goal / Resume Type */}
          <div>
            <label className="block text-xs font-bold text-brand-dark mb-1.5">Target Resume Type</label>
            <select
              value={resumeType}
              onChange={(e) => setResumeType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
            >
              <option value="JOB">Full-Time Job / Professional</option>
              <option value="INTERNSHIP">Internship & Apprenticeship</option>
              <option value="COLLEGE_APPLICATION">College & Graduate School</option>
              <option value="SCHOLARSHIP">Scholarship & Research Grant</option>
              <option value="FOUNDER">Founder / Venture Pitch</option>
            </select>
          </div>

          {/* Template Style */}
          <div>
            <label className="block text-xs font-bold text-brand-dark mb-1.5">Design Template</label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
            >
              <option value="MODERN_MINIMAL">Modern Minimal (Clean Monospace & Sans)</option>
              <option value="EXECUTIVE_IVORY">Executive Ivory (Warm & Formal)</option>
              <option value="TECH_FOCUS">Tech Focus (Dense & Skills-First)</option>
            </select>
          </div>

          {/* Resume Title */}
          <div>
            <label className="block text-xs font-bold text-brand-dark mb-1.5">Document Label</label>
            <input
              type="text"
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
              placeholder="e.g. Software Engineer 2025"
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
            />
          </div>
        </div>

        {/* Milestone Selection Chips */}
        <div>
          <label className="block text-xs font-bold text-brand-dark mb-2">
            Select Achievements to Include ({selectedAchIds.length} of {achievements.length} selected)
          </label>
          <div className="flex flex-wrap gap-2">
            {achievements.map((ach) => {
              const isSelected = selectedAchIds.includes(ach.id);
              return (
                <button
                  key={ach.id}
                  type="button"
                  onClick={() => toggleSelectAch(ach.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all text-left flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-brand-soft border-brand-yellow text-brand-dark font-bold shadow-sm"
                      : "bg-white border-brand-border text-brand-muted hover:bg-brand-ivory"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-brand-yellow" : "bg-gray-300"}`} />
                  <span className="truncate max-w-[200px]">{ach.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <Button
            onClick={handleGenerate}
            variant="primary"
            size="lg"
            className="gap-2 shadow-hover"
            isLoading={generating}
          >
            <Sparkles className="w-4 h-4" /> Generate Tailored Resume with AI
          </Button>
        </div>
      </div>

      {/* Live Resume Sheet Preview */}
      {resumeContent && (
        <div className="space-y-4">
          <div className="no-print flex items-center justify-between text-xs text-brand-muted px-2">
            <span>ATS Resume Document Sheet (Click text to edit before printing)</span>
            <span className="font-semibold text-brand-dark">Template: {template.replace("_", " ")}</span>
          </div>

          <div
            className={`mx-auto max-w-4xl bg-white p-8 sm:p-14 rounded-2xl border border-brand-border shadow-2xl transition-all ${
              template === "EXECUTIVE_IVORY"
                ? "bg-[#FCFAF5] font-serif border-[#E8E2D5]"
                : template === "TECH_FOCUS"
                ? "font-mono text-sm leading-relaxed"
                : "font-sans leading-normal"
            }`}
          >
            {/* Header */}
            <div className="border-b border-brand-border pb-6 space-y-1 text-center">
              <h2
                contentEditable
                suppressContentEditableWarning
                className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight outline-none focus:ring-1 focus:ring-brand-yellow"
              >
                {resumeContent.headline}
              </h2>
              <p
                contentEditable
                suppressContentEditableWarning
                className="text-xs sm:text-sm text-brand-muted max-w-2xl mx-auto pt-2 outline-none focus:ring-1 focus:ring-brand-yellow"
              >
                {resumeContent.summary}
              </p>
            </div>

            {/* Sections */}
            <div className="pt-6 space-y-8">
              {resumeContent.sections?.map((sec: any, idx: number) => (
                <div key={idx} className="space-y-3">
                  <h3
                    contentEditable
                    suppressContentEditableWarning
                    className="text-xs font-bold uppercase tracking-wider text-brand-dark border-b border-brand-border pb-1 outline-none"
                  >
                    {sec.title}
                  </h3>
                  <div className="space-y-4">
                    {sec.items?.map((item: any, iIdx: number) => (
                      <div key={iIdx} className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs sm:text-sm">
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            className="font-bold text-brand-dark outline-none"
                          >
                            {item.title}
                          </span>
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            className="text-xs text-brand-muted outline-none"
                          >
                            {item.dateRange}
                          </span>
                        </div>
                        <p
                          contentEditable
                          suppressContentEditableWarning
                          className="text-xs text-brand-dark font-medium outline-none"
                        >
                          {item.subtitle}
                        </p>
                        <ul className="list-disc pl-5 text-xs text-brand-dark space-y-1 pt-1">
                          {item.bullets?.map((b: string, bIdx: number) => (
                            <li
                              key={bIdx}
                              contentEditable
                              suppressContentEditableWarning
                              className="outline-none"
                            >
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Skills Grouped */}
              {resumeContent.skillsGrouped && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark border-b border-brand-border pb-1">
                    Demonstrated Capabilities & Skills
                  </h3>
                  <div className="space-y-2 text-xs">
                    {resumeContent.skillsGrouped.map((grp: any, gIdx: number) => (
                      <div key={gIdx} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                        <span className="font-bold text-brand-dark w-44 shrink-0">{grp.category}:</span>
                        <span className="text-brand-dark/90">{grp.skills?.join(" • ")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Official verification seal footnote */}
            <div className="mt-12 pt-4 border-t border-brand-border text-[10px] text-brand-muted flex items-center justify-between">
              <span>Authenticity attested via Life Resume verified records</span>
              <span>Single source of truth: lifresume.com</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
