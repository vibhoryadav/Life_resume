export default function TermsPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark">Terms of Service</h1>
          <p className="text-xs text-brand-muted">Effective Date: November 21, 2024</p>
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 border border-brand-border shadow-card space-y-8 text-sm text-brand-dark leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-dark">1. Acceptance of Terms</h2>
            <p>
              By creating an account or accessing Life Resume (&quot;Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the Platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-dark">2. Authenticity & Truth in Achievement Reporting</h2>
            <p>
              Life Resume is built on trust and verification. Users agree to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-brand-muted">
              <li>Upload only genuine, authentic evidence that they have the legal right to present.</li>
              <li>Accurately represent their roles, attendance, responsibilities, and dates.</li>
              <li>Never impersonate verifiers, forge certificates, or send fraudulent verification links.</li>
            </ul>
            <p className="text-xs text-brand-muted">
              Submitting intentionally falsified documents or attempting to manipulate token hashes will result in immediate and permanent account termination.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-dark">3. Acceptable Use Policy</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-brand-muted">
              <li>Upload malware, viruses, or unauthorized tracking scripts into the evidence vault.</li>
              <li>Bypass rate limits, authorization checks, or signed URL expiration windows.</li>
              <li>Harvest or scrape public profile data for commercial training without explicit authorization.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-dark">4. Termination & Deletion</h2>
            <p>
              You may terminate your account at any time via the Settings dashboard. Upon confirmation, your profile, achievements, and documents will be permanently erased.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
