"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { User, Shield, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";

export default function ProfileManagementPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    custom_username: "",
    headline: "",
    education_summary: "",
    professional_summary: "",
    public_profile_enabled: true,
    profile_visibility: "PUBLIC",
    bio: "",
    location: "",
    full_name: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/user/profile");
        const json = await res.json();
        if (json.profile) {
          setFormData({
            custom_username: json.profile.custom_username || "",
            headline: json.profile.headline || "",
            education_summary: json.profile.education_summary || "",
            professional_summary: json.profile.professional_summary || "",
            public_profile_enabled: json.profile.public_profile_enabled ?? false,
            profile_visibility: json.profile.profile_visibility || "PUBLIC",
            bio: json.profile.user?.bio || "",
            location: json.profile.user?.location || "",
            full_name: json.profile.user?.full_name || "",
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to update profile.");
      } else {
        setMessage("Profile updated successfully!");
      }
    } catch {
      setError("Network error updating profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-xs text-brand-muted">Loading profile settings...</div>;
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">My Profile & Public Identity</h1>
        <p className="text-xs sm:text-sm text-brand-muted">
          Configure how your verified achievements and story are displayed to recruiters and universities.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-6">
        {/* Username / Handle */}
        <div>
          <label className="block text-xs font-bold text-brand-dark mb-1">
            Custom Life Resume Handle *
          </label>
          <div className="flex items-center">
            <span className="px-3.5 py-2.5 rounded-l-xl bg-brand-soft border border-r-0 border-brand-border text-xs text-brand-muted font-medium select-none">
              lifresume.com/u/
            </span>
            <input
              type="text"
              required
              value={formData.custom_username}
              onChange={(e) => setFormData({ ...formData, custom_username: e.target.value.toLowerCase() })}
              placeholder="username"
              className="w-full px-3.5 py-2.5 rounded-r-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
            />
          </div>
          <p className="text-[11px] text-brand-muted mt-1">Letters, numbers, underscores and hyphens only.</p>
        </div>

        {/* Public profile toggle */}
        <div className="p-4 rounded-2xl bg-brand-soft border border-brand-yellow/30 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-brand-dark block">Enable Public Life Resume Profile</span>
            <span className="text-[11px] text-brand-muted block">
              When enabled, anyone with your link can view your public and verified achievements.
            </span>
          </div>
          <input
            type="checkbox"
            checked={formData.public_profile_enabled}
            onChange={(e) => setFormData({ ...formData, public_profile_enabled: e.target.checked })}
            className="w-5 h-5 rounded border-brand-border text-brand-dark focus:ring-brand-yellow cursor-pointer"
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-brand-dark mb-1">Display Name</label>
          <input
            type="text"
            required
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
          />
        </div>

        {/* Headline */}
        <div>
          <label className="block text-xs font-bold text-brand-dark mb-1">Headline</label>
          <input
            type="text"
            value={formData.headline}
            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            placeholder="e.g. Full-Stack Engineer & Campus Tech Lead"
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
          />
        </div>

        {/* Location */}
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

        {/* Professional Summary */}
        <div>
          <label className="block text-xs font-bold text-brand-dark mb-1">Professional / Personal Summary</label>
          <textarea
            rows={4}
            value={formData.professional_summary}
            onChange={(e) => setFormData({ ...formData, professional_summary: e.target.value })}
            placeholder="A short overview of your core competencies and ambitions..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
          />
        </div>

        {/* Education Summary */}
        <div>
          <label className="block text-xs font-bold text-brand-dark mb-1">Education Summary</label>
          <input
            type="text"
            value={formData.education_summary}
            onChange={(e) => setFormData({ ...formData, education_summary: e.target.value })}
            placeholder="e.g. B.Tech Computer Science (2022 - 2026)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
          />
        </div>

        <div className="pt-4 border-t border-brand-border flex items-center justify-between">
          {formData.custom_username && (
            <Link
              href={`/u/${formData.custom_username}`}
              target="_blank"
              className="text-xs font-semibold text-brand-dark flex items-center gap-1 hover:underline"
            >
              Preview Public Profile <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
          <Button type="submit" variant="primary" size="md" isLoading={saving} className="ml-auto shadow-hover">
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
