import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Digital Personal Data Protection (DPDP) Compliant
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark">Privacy Policy & Data Protection Charter</h1>
          <p className="text-xs text-brand-muted">Last updated: November 21, 2024</p>
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 border border-brand-border shadow-card space-y-8 text-sm text-brand-dark leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-dark">1. Commitment to Data Privacy</h2>
            <p>
              Life Resume (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) values the privacy and autonomy of every Data Principal. This policy outlines how we collect, process, store, and protect your personal information in accordance with applicable Indian laws, including the Digital Personal Data Protection Act (DPDP), and international standards.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-dark">2. Purpose Limitation & Data Minimization</h2>
            <p>We collect only personal information strictly necessary for achievement verification and portfolio management:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-brand-muted">
              <li><strong>Account Identification:</strong> Full name, verified email address, hashed passwords, date of birth (for age assurance).</li>
              <li><strong>Achievement Artifacts:</strong> Roles, titles, dates, measurable outcomes, certificates, and attached evidence files.</li>
              <li><strong>Verification Records:</strong> Verifier email, verification decision, comments, and single-use cryptographic token hashes.</li>
              <li><strong>Telemetry & Security:</strong> Structured audit logs, IP rate-limiting telemetry, and session cookies.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-dark">3. Protection of Minors & Age Assurance</h2>
            <p>
              In compliance with DPDP provisions concerning children (individuals under 18 years of age), we require verifiable parental or guardian consent before processing personal data or permitting public profile sharing for minors. We do not engage in targeted advertising, behavioral tracking, or profiling directed at minors.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-dark">4. Rights of the Data Principal</h2>
            <p>Under our platform architecture, you retain absolute sovereign rights over your data:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-brand-muted">
              <li><strong>Right to Access:</strong> You can view all processed data and active verifications at any time.</li>
              <li><strong>Right to Data Portability:</strong> You may instantly download a comprehensive machine-readable JSON export of your complete portfolio via your account settings.</li>
              <li><strong>Right to Correction:</strong> You can edit or amend any self-reported achievement or bio.</li>
              <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> You can permanently delete your account, triggering cascade deletion of all stored documents, credentials, and profile links.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-dark">5. Storage, Encryption & Signed Downloads</h2>
            <p>
              All evidence files are stored in private, isolated vaults. Public access is disabled by default; access is granted only via time-limited cryptographically signed URLs dispatched to authorized verifiers or active portfolio owners.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-dark">6. Grievance Redressal Officer</h2>
            <p>
              In accordance with DPDP rules, any questions, consent revocations, or grievance reports should be directed to our designated Data Protection Officer:
            </p>
            <div className="bg-brand-soft p-4 rounded-xl border border-brand-border text-xs">
              <p><strong>Grievance Officer:</strong> Data Protection & Trust Officer, Life Resume</p>
              <p><strong>Email:</strong> dpo@liferesume.com / privacy@liferesume.com</p>
              <p><strong>Address:</strong> Bengaluru, Karnataka, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
