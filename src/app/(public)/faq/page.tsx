import Link from "next/link";
import { Button } from "@/components/Button";

export default function FAQPage() {
  const faqs = [
    {
      q: "What makes Life Resume different from LinkedIn or standard resume builders?",
      a: "Traditional platforms rely entirely on self-reported assertions without attached primary evidence or formal third-party verification. Life Resume acts as an evidence vault and attestation engine: you attach certificates, code, or letters, and organizers verify them via cryptographic single-use tokens.",
    },
    {
      q: "How does third-party verification work for someone without an account?",
      a: "Verifiers (teachers, hackathon organizers, employers) do NOT need to create an account. When you request verification, Life Resume generates a secure, single-use, 14-day cryptographic link sent directly to their email. They can review your claims, view permitted evidence, and confirm or dispute with comments.",
    },
    {
      q: "Can I keep sensitive achievements private?",
      a: "Yes. Every single achievement has granular visibility settings: Public (visible on your public URL), Unlisted (accessible only via direct link), or Private (visible only to you).",
    },
    {
      q: "How does the AI Resume Builder work?",
      a: "The AI engine accesses only the achievements, skills, and education currently in your saved profile. You choose a target role (e.g. Technology Internship, Research Grant, Full-Time Job) and a template (Modern Minimal, Executive Ivory, Tech Focus). It generates ATS-compliant bullet points without hallucinating metrics.",
    },
    {
      q: "How does Life Resume comply with the Digital Personal Data Protection (DPDP) Act?",
      a: "We adhere strictly to DPDP principles: purpose limitation, consent-first processing, right to data access (full JSON export), right to correction, and right to permanent account erasure. We do not sell personal data, and we do not collect personal data from minors without parental consent.",
    },
    {
      q: "What file types can I upload as evidence?",
      a: "We support PDF, JPG, JPEG, PNG, and WebP documents up to 10MB per file. Files are scanned and served via secure, signed download URLs.",
    },
  ];

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-dark bg-brand-yellow px-3 py-1 rounded-full">
            Knowledge Base
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark">Frequently Asked Questions</h1>
          <p className="text-base sm:text-lg text-brand-muted">
            Find answers to common questions about verification, evidence, AI, and data privacy.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-card">
              <h3 className="text-base sm:text-lg font-bold text-brand-dark mb-2">{faq.q}</h3>
              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-8 bg-brand-soft rounded-2xl p-8 border border-brand-border space-y-4">
          <h3 className="text-xl font-bold text-brand-dark">Still have questions?</h3>
          <p className="text-xs sm:text-sm text-brand-muted">
            Our team is always happy to walk you through verification workflows or institutional onboarding.
          </p>
          <Link href="/contact">
            <Button variant="primary" size="md">Contact Support</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
