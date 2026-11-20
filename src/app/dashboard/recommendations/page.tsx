"use client";

import { useEffect, useState } from "react";
import { Heart, CheckCircle2, User } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/auth/me");
        const json = await res.json();
        if (json.user?.profile) {
          const pRes = await fetch(`/api/public/profile/${json.user.profile.custom_username}`);
          const pJson = await pRes.json();
          if (pJson.profile?.recommendations) {
            setRecommendations(pJson.profile.recommendations);
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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">Recommendations & Testimonials</h1>
        <p className="text-xs sm:text-sm text-brand-muted">
          Written recommendations from mentors, colleagues, and collaborators.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-6">
        <h2 className="text-lg font-bold text-brand-dark flex items-center gap-2 border-b border-brand-border pb-4">
          <Heart className="w-5 h-5 text-rose-500" /> Received Recommendations ({recommendations.length})
        </h2>

        {recommendations.length === 0 ? (
          <div className="text-center py-10 text-xs text-brand-muted">No recommendations recorded yet.</div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="p-6 rounded-2xl bg-brand-soft border border-brand-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-yellow text-brand-dark font-bold text-xs flex items-center justify-center">
                      {rec.recommender_name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-brand-dark block">{rec.recommender_name}</span>
                      <span className="text-[10px] text-brand-muted block">{rec.relationship}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-brand-muted">{formatDate(rec.created_at)}</span>
                </div>
                <p className="text-xs sm:text-sm text-brand-dark italic leading-relaxed pt-1">
                  &quot;{rec.content}&quot;
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
