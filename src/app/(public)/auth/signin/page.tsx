"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Login failed. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      // Check if user is admin or regular user
      if (data.user?.role === "SUPER_ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch {
      setErrorMessage("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-brand-border shadow-card relative">
        {/* Soft yellow decorative pill */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-soft border border-brand-yellow/50 text-brand-dark px-3 py-0.5 rounded-full text-xs font-semibold">
          Secure Authenticated Access
        </div>

        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo />
          </div>
          <h2 className="text-2xl font-extrabold text-brand-dark pt-2">Sign in to your Life Resume</h2>
          <p className="text-xs text-brand-muted">
            Access your achievements, manage verification, and generate resumes.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-brand-dark mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-brand-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-brand-dark">Password</label>
              <Link href="/auth/forgot-password" className="text-xs text-brand-muted hover:text-brand-dark font-medium">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-brand-muted" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-brand-muted hover:text-brand-dark"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full mt-2" isLoading={isLoading}>
            Sign In to Dashboard
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        {/* Demo credentials hint */}
        <div className="bg-brand-soft rounded-xl p-3 border border-brand-border/80 text-[11px] text-brand-dark space-y-1">
          <p className="font-bold">Quick Demo Accounts:</p>
          <div className="flex justify-between text-brand-muted">
            <span>Student: <code>student@liferesume.demo</code></span>
            <span><code>Password123!</code></span>
          </div>
          <div className="flex justify-between text-brand-muted">
            <span>Admin: <code>admin@liferesume.demo</code></span>
            <span><code>Password123!</code></span>
          </div>
        </div>

        <div className="text-center pt-2 border-t border-brand-border">
          <p className="text-xs text-brand-muted">
            Don&apos;t have an account yet?{" "}
            <Link href="/auth/signup" className="font-bold text-brand-dark hover:underline">
              Create your Life Resume
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
