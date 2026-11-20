"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { Briefcase, Plus, ExternalLink, Code2 } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/auth/me");
        const json = await res.json();
        if (json.user?.profile) {
          const pRes = await fetch(`/api/public/profile/${json.user.profile.custom_username}`);
          const pJson = await pRes.json();
          if (pJson.profile?.projects) {
            setProjects(pJson.profile.projects);
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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">Projects & Open Source</h1>
        <p className="text-xs sm:text-sm text-brand-muted">
          Showcase functional web applications, libraries, research prototypes, and repositories.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-brand-border pb-4">
          <h2 className="text-lg font-bold text-brand-dark flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-brand-yellow" /> Key Projects ({projects.length})
          </h2>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-10 text-xs text-brand-muted">No projects added yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-6 rounded-2xl bg-brand-soft border border-brand-border space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-brand-dark">{proj.title}</h3>
                    {proj.project_url && (
                      <a
                        href={proj.project_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-muted hover:text-brand-dark p-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-brand-dark pt-1 leading-relaxed">{proj.description}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-brand-border/60">
                  {proj.technologies?.map((tech: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-white border border-brand-border text-[10px] font-semibold text-brand-dark"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
