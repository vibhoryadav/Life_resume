"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import {
  Settings,
  Download,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  Lock,
  LogOut,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Deletion modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        const json = await res.json();
        if (json.authenticated) {
          setUser(json.user);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const handleExportData = () => {
    window.location.href = "/api/user/export-data";
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleting(true);
    setDeleteError("");

    try {
      const res = await fetch("/api/user/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmationText: deleteConfirmation,
          password: deletePassword,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setDeleteError(json.error || "Failed to delete account.");
        setDeleting(false);
        return;
      }

      alert("Your account and all associated data have been permanently deleted.");
      router.push("/");
      router.refresh();
    } catch {
      setDeleteError("Network error. Please try again.");
      setDeleting(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/signin");
    router.refresh();
  };

  if (loading) {
    return <div className="py-16 text-center text-xs text-brand-muted">Loading settings...</div>;
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">Account & Privacy Settings</h1>
        <p className="text-xs sm:text-sm text-brand-muted">
          Manage your security, data portability, consent, and account lifecycle.
        </p>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-4">
        <h2 className="text-base font-bold text-brand-dark flex items-center gap-2">
          <Settings className="w-5 h-5 text-brand-yellow" /> Account Credentials
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-brand-muted block font-medium">Full Name</span>
            <span className="font-bold text-brand-dark block text-sm mt-0.5">{user?.full_name}</span>
          </div>
          <div>
            <span className="text-brand-muted block font-medium">Registered Email</span>
            <span className="font-bold text-brand-dark block text-sm mt-0.5">{user?.email}</span>
          </div>
          <div>
            <span className="text-brand-muted block font-medium">Account Role</span>
            <span className="font-bold text-brand-dark block text-sm mt-0.5">{user?.role}</span>
          </div>
          <div>
            <span className="text-brand-muted block font-medium">Email Verification Status</span>
            <span className="font-bold text-emerald-700 block text-sm mt-0.5">
              {user?.email_verified ? "Verified" : "Pending Confirmation"}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-brand-border flex items-center justify-between">
          <span className="text-xs text-brand-muted">Need to change your password?</span>
          <button
            onClick={() => router.push("/auth/forgot-password")}
            className="text-xs font-bold text-brand-dark hover:underline"
          >
            Request Password Reset Link
          </button>
        </div>
      </div>

      {/* DPDP Data Portability */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-brand-dark">Data Portability (DPDP Compliance)</h2>
        </div>
        <p className="text-xs text-brand-muted leading-relaxed">
          Under the Digital Personal Data Protection framework, you have the sovereign right to download all personal achievements, evidence metadata, skills, and resume documents in a standardized, machine-readable JSON format.
        </p>

        <Button onClick={handleExportData} variant="secondary" size="md" className="gap-2">
          <Download className="w-4 h-4" /> Download Complete Personal Archive (.json)
        </Button>
      </div>

      {/* Danger Zone: Account Erasure */}
      <div className="bg-red-50/50 rounded-3xl p-6 sm:p-8 border border-red-200/80 space-y-4">
        <div className="flex items-center gap-2 text-red-800">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h2 className="text-base font-bold">Right to Erasure (&quot;Delete Account&quot;)</h2>
        </div>
        <p className="text-xs text-red-700 leading-relaxed">
          Permanent account deletion will immediately wipe your portfolio handle, cascade delete all logged achievements, delete evidence files from the storage vault, and revoke all active verification links. This action cannot be undone.
        </p>

        <Button onClick={() => setShowDeleteModal(true)} variant="danger" size="md" className="gap-2">
          <Trash2 className="w-4 h-4" /> Delete My Life Resume Account
        </Button>
      </div>

      {/* DELETION CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-red-200 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-brand-dark">Confirm Permanent Deletion</h3>
            </div>

            <p className="text-xs text-brand-muted leading-relaxed">
              To prevent accidental deletion, please type the phrase{" "}
              <strong className="text-brand-dark">DELETE MY LIFE RESUME</strong> and enter your password.
            </p>

            {deleteError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Confirmation Phrase</label>
                <input
                  type="text"
                  required
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="DELETE MY LIFE RESUME"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  variant="secondary"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="danger"
                  size="sm"
                  isLoading={deleting}
                  disabled={deleteConfirmation !== "DELETE MY LIFE RESUME"}
                >
                  Permanently Erase Everything
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
