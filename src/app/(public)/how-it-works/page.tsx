import Link from "next/link";
import { Button } from "@/components/Button";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Create Your Portfolio Account",
      desc: "Sign up in 30 seconds. Confirm your email and set up your personal handle. We support both direct email registration and institution-linked logins.",
    },
    {
      num: "02",
      title: "Document Achievements as They Happen",
      desc: "Log internships, hackathon victories, community volunteer hours, leadership roles, or research papers. Add measurable metrics like attendance or revenue.",
    },
    {
      num: "03",
      title: "Attach Concrete Evidence",
      desc: "Upload scanned letters, signed certificates, code repositories, or event links into your encrypted vault. Each piece of evidence is timestamped.",
    },
    {
      num: "04",
      title: "Request Verification with One Click",
      desc: "Provide the email of the organizer or professor who supervised you. Life Resume sends them an official, secure token link that requires no signup for them.",
    },
    {
      num: "05",
      title: "Verifier Review & Attestation",
      desc: "The verifier clicks the link, inspects the evidence, and confirms your role and figures. The verification is sealed with a cryptographic hash.",
    },
    {
      num: "06",
      title: "Synthesize ATS Resumes with AI",
      desc: "Select a goal (Internship, Full-Time Job, College App). Life Resume synthesizes only your verified facts into an ATS-optimized, high-impact resume.",
    },
  ];

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-dark bg-brand-yellow px-3 py-1 rounded-full">
            The Verification Lifecycle
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark">How Life Resume Works</h1>
          <p className="text-base sm:text-lg text-brand-muted max-w-2xl mx-auto">
            From rough accomplishment to verified credential and tailored resume in six simple steps.
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((st, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-border shadow-card flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-yellow text-brand-dark font-extrabold text-xl flex items-center justify-center shrink-0 shadow-sm">
                {st.num}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-brand-dark">{st.title}</h3>
                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-8">
          <Link href="/auth/signup">
            <Button variant="primary" size="lg" className="shadow-hover">
              Start Building Now
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
