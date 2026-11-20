"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { Sparkles, Award, ShieldCheck, Check } from "lucide-react";

export default function SkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/auth/me");
        const json = await res.json();
        if (json.user?.profile) {
          // Fetch full user profile with skills
          const pRes = await fetch(`/api/public/profile/${json.user.profile.custom_username}`);
          const pJson = await pRes.json();
          if (pJson.profile?.skills) {
            setSkills(pJson.profile.skills);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">Demonstrated Skills & Capabilities</h1>
        <p className="text-xs sm:text-sm text-brand-muted">
          Unlike ordinary resumes where anyone can list skills, Life Resume links every skill directly to verified achievement evidence.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-brand-border pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-yellow" />
            <h2 className="text-lg font-bold text-brand-dark">Evidence-Backed Competencies ({skills.length})</h2>
          </div>
          <span className="text-xs text-brand-muted">Verified by Primary Proof</span>
        </div>

        {skills.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Award className="w-10 h-10 text-brand-muted mx-auto" />
            <h3 className="text-sm font-bold text-brand-dark">No skills linked yet</h3>
            <p className="text-xs text-brand-muted max-w-sm mx-auto">
              Add achievements and let the AI engine auto-extract your demonstrated capabilities.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {skills.map((s: any) => (
              <div
                key={s.id}
                className="p-4 rounded-2xl bg-brand-soft border border-brand-border hover:border-brand-yellow transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-brand-dark">{s.skill.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-brand-yellow text-brand-dark text-[10px] font-black shrink-0">
                    {s.evidence_count} proofs
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-brand-muted pt-1">
                  <span>Proficiency: {s.proficiency}</span>
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <Check className="w-3 h-3" /> Backed by Records
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
