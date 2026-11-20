import Link from "next/link";
import { Button } from "@/components/Button";
import { ShieldCheck, Award, Heart, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-dark bg-brand-yellow px-3 py-1 rounded-full">
            Our Purpose
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark">About Life Resume</h1>
          <p className="text-lg text-brand-muted max-w-2xl mx-auto">
            We are building a portable, tamper-evident achievement identity platform where authentic effort replaces resume embellishment.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 border border-brand-border shadow-card space-y-6">
          <h2 className="text-2xl font-bold text-brand-dark">The Digital Achievement Identity</h2>
          <p className="text-sm sm:text-base text-brand-dark leading-relaxed">
            A traditional resume was invented in the 20th century for factory and corporate roles. It assumes that human potential can be summarized in 300 words of buzzwords on a piece of paper.
          </p>
          <p className="text-sm sm:text-base text-brand-dark leading-relaxed">
            In reality, learners today organize 4,000-person tech symposiums, code open-source tools with thousands of users, volunteer across disaster relief networks, and master skills outside conventional classrooms.
          </p>
          <p className="text-sm sm:text-base text-brand-dark leading-relaxed">
            <strong>Life Resume</strong> bridges this gap. We empower students and lifelong builders to permanently preserve their milestones, attach primary evidence, and request cryptographic verification from mentors and organizers who witnessed their work firsthand.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-brand-border">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-brand-soft text-brand-dark flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-brand-dark">Authenticity First</h3>
              <p className="text-xs text-brand-muted">Claims backed by real evidence and human attestation.</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-brand-soft text-brand-dark flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="text-sm font-bold text-brand-dark">Privacy by Design</h3>
              <p className="text-xs text-brand-muted">Full granular control over what stays private or public.</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-brand-soft text-brand-dark flex items-center justify-center">
                <Heart className="w-4 h-4 text-rose-600" />
              </div>
              <h3 className="text-sm font-bold text-brand-dark">Student Centric</h3>
              <p className="text-xs text-brand-muted">Generous free tier so every student can build their story.</p>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link href="/auth/signup">
            <Button variant="primary" size="lg">
              Start Documenting Your Journey
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
