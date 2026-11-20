"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing from the URL.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage("Your email address has been verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed or token has expired.");
        }
      } catch {
        setStatus("error");
        setMessage("Network connection error. Please try again.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="text-center py-6 space-y-4">
      {status === "loading" && (
        <div className="space-y-3">
          <Loader2 className="w-8 h-8 text-brand-yellow animate-spin mx-auto" />
          <p className="text-xs text-brand-muted">Verifying your email token...</p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-brand-dark">Account Verified!</h3>
          <p className="text-xs text-brand-muted">{message}</p>
          <div className="pt-2">
            <Link href="/dashboard">
              <Button variant="primary" size="md">Proceed to Dashboard</Button>
            </Link>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <XCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-brand-dark">Verification Failed</h3>
          <p className="text-xs text-red-600">{message}</p>
          <div className="pt-2">
            <Link href="/dashboard">
              <Button variant="secondary" size="md">Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-brand-border shadow-card">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo />
          </div>
          <h2 className="text-2xl font-extrabold text-brand-dark pt-2">Email Verification</h2>
        </div>

        <Suspense fallback={<div className="text-center text-xs py-8 text-brand-muted">Loading verification...</div>}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
