"use client";

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function EducationPage() {
  const [educations, setEducations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/auth/me");
        const json = await res.json();
        if (json.user?.profile) {
          const pRes = await fetch(`/api/public/profile/${json.user.profile.custom_username}`);
          const pJson = await pRes.json();
          if (pJson.profile?.educations) {
            setEducations(pJson.profile.educations);
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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">Education & Qualifications</h1>
        <p className="text-xs sm:text-sm text-brand-muted">
          Your formal academic degrees, diplomas, and continuous learning qualifications.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-6">
        <h2 className="text-lg font-bold text-brand-dark flex items-center gap-2 border-b border-brand-border pb-4">
          <BookOpen className="w-5 h-5 text-brand-yellow" /> Academic Record ({educations.length})
        </h2>

        {educations.length === 0 ? (
          <div className="text-center py-10 text-xs text-brand-muted">No education records added yet.</div>
        ) : (
          <div className="space-y-4">
            {educations.map((edu) => (
              <div key={edu.id} className="p-5 rounded-2xl bg-brand-soft border border-brand-border space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="text-base font-bold text-brand-dark">{edu.qualification}</h3>
                  <span className="text-xs text-brand-muted font-medium">
                    {formatDate(edu.start_date)} – {edu.end_date ? formatDate(edu.end_date) : "Present"}
                  </span>
                </div>
                <p className="text-xs font-semibold text-brand-dark">
                  {edu.institution} {edu.field_of_study ? `• ${edu.field_of_study}` : ""}
                </p>
                {edu.description && <p className="text-xs text-brand-muted pt-1 leading-relaxed">{edu.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
