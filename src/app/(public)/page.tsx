import Link from "next/link";
import { Button } from "@/components/Button";
import { VerificationBadge } from "@/components/Badge";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  FileCheck2,
  Lock,
  Upload,
  Layers,
  ChevronRight,
  Users,
  Compass,
  Check,
  TrendingUp,
  School,
  Briefcase,
  HelpCircle,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-brand-soft border-b border-brand-border py-20 lg:py-28">
        {/* Subtle decorative geometric background elements */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-brand-yellow/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-brand-yellow/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-border text-xs font-semibold text-brand-dark shadow-sm">
                <span className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse" />
                Next-Gen Achievement Documentation & Verification
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-dark leading-[1.12]">
                Your life is bigger than{" "}
                <span className="underline decoration-brand-yellow decoration-wavy decoration-from-font underline-offset-4">
                  your resume.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-brand-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Capture your achievements, prove your experiences, and build a professional identity that grows with you.
                Don&apos;t just list what you can do. Show what you&apos;ve done.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="/auth/signup" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-hover">
                    Build Your Life Resume
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link href="/how-it-works" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Explore How It Works
                  </Button>
                </Link>
              </div>

              {/* Trust signals */}
              <div className="pt-6 border-t border-brand-border/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-brand-muted font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Third-Party Attestation
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-brand-dark" />
                  Tamper-Evident Tokens
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Safe AI Without Hallucination
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Layered Card 1: Verified Achievement */}
                <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-card relative z-10 transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Flagship Event
                      </span>
                      <h3 className="text-lg font-bold text-brand-dark mt-1.5">
                        Organized State Tech Summit 2024
                      </h3>
                      <p className="text-xs text-brand-muted">Campus Tech Collective • Lead Convener</p>
                    </div>
                    <VerificationBadge status="VERIFIED" />
                  </div>

                  <p className="text-xs text-brand-dark leading-relaxed mb-4">
                    Orchestrated 3-day hackathon & conference for 4,000 attendees. Directed 14 volunteer committees and handled sponsorship relations.
                  </p>

                  <div className="bg-brand-soft rounded-xl p-3 border border-brand-border/60 text-xs mb-4">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-brand-dark mb-1">
                      <span>Attested by Dr. Marcus Thorne</span>
                      <span className="text-emerald-700 font-bold">Verified on Chain & Token</span>
                    </div>
                    <p className="text-[11px] text-brand-muted italic">
                      &quot;Confirmed. Handled full audience logistics, sponsor deliverables, and volunteer safety flawlessly.&quot;
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-brand-border text-xs">
                    <span className="text-brand-muted flex items-center gap-1">
                      <FileCheck2 className="w-3.5 h-3.5 text-brand-yellow" />
                      1 Official Certificate Attached
                    </span>
                    <span className="text-[11px] font-semibold text-brand-dark bg-brand-ivory px-2 py-1 rounded border border-brand-border">
                      4,000 Attendees
                    </span>
                  </div>
                </div>

                {/* Layered Floating Accent Pill */}
                <div className="absolute -bottom-4 -left-4 bg-brand-yellow text-brand-dark rounded-xl px-4 py-2.5 shadow-lg border border-[#E8B835] z-20 flex items-center gap-2 text-xs font-bold">
                  <Sparkles className="w-4 h-4" />
                  AI Suggested 4 Demonstrated Skills
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM STATEMENT */}
      <section className="py-20 bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-yellow">
              The Fundamental Flaw in Traditional Resumes
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark">
              Traditional 1-page resumes hide 90% of your real story.
            </h2>
            <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
              PDF resumes are static, unverified, and reward buzzwords over authentic capability. Anyone can write anything, forcing recruiters and universities into tedious background checks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-brand-ivory rounded-2xl p-8 border border-brand-border">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold mb-4">
                ✕
              </div>
              <h3 className="text-lg font-bold text-brand-dark mb-2">No Proof of Claim</h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                Traditional resumes lack attached evidence. When you list a major project or leadership role, recruiters have no immediate way to confirm its validity.
              </p>
            </div>

            <div className="bg-brand-ivory rounded-2xl p-8 border border-brand-border">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold mb-4">
                ✕
              </div>
              <h3 className="text-lg font-bold text-brand-dark mb-2">Lost Life History</h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                Years of sports, hackathons, non-profit organizing, and creative projects get discarded just to squeeze onto one 8.5x11 page.
              </p>
            </div>

            <div className="bg-brand-ivory rounded-2xl p-8 border border-brand-border">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold mb-4">
                ✕
              </div>
              <h3 className="text-lg font-bold text-brand-dark mb-2">Rewriting from Scratch</h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                Applying for jobs, graduate school, grants, or scholarships means painful reformatting and starting from zero every single time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THE PRODUCT SOLUTION */}
      <section className="py-20 bg-brand-soft border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-dark bg-brand-yellow px-3 py-1 rounded-full">
              The Life Resume Solution
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark">
              &quot;Your achievements. Your evidence. Your story.&quot;
            </h2>
            <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
              Build your profile once throughout your life. Document every milestone with attached evidence, verify it through organizers and teachers, and generate tailored documents on demand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-sm hover:border-brand-yellow transition-all">
              <div className="w-10 h-10 rounded-xl bg-brand-soft text-brand-dark flex items-center justify-center mb-4">
                <Compass className="w-5 h-5 text-brand-dark" />
              </div>
              <h3 className="text-base font-bold text-brand-dark mb-2">1. Continuous Archive</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Log projects, hackathons, volunteering, education, and personal achievements as they happen.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-sm hover:border-brand-yellow transition-all">
              <div className="w-10 h-10 rounded-xl bg-brand-soft text-brand-dark flex items-center justify-center mb-4">
                <Upload className="w-5 h-5 text-brand-dark" />
              </div>
              <h3 className="text-base font-bold text-brand-dark mb-2">2. Evidence Vault</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Upload certificates, PDFs, and repository links. Back every claim with tangible, verifiable proof.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-sm hover:border-brand-yellow transition-all">
              <div className="w-10 h-10 rounded-xl bg-brand-soft text-brand-dark flex items-center justify-center mb-4">
                <FileCheck2 className="w-5 h-5 text-brand-dark" />
              </div>
              <h3 className="text-base font-bold text-brand-dark mb-2">3. Verifier Tokens</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Mentors, professors, and organizers confirm roles and numbers via secure, expiring single-use links.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-sm hover:border-brand-yellow transition-all">
              <div className="w-10 h-10 rounded-xl bg-brand-soft text-brand-dark flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-brand-dark" />
              </div>
              <h3 className="text-base font-bold text-brand-dark mb-2">4. AI Resume Engine</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Generate tailored ATS resumes for internships, tech roles, or grad applications from your verified data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-yellow">Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark">How Life Resume Works</h2>
            <p className="text-brand-muted">Four simple steps to turn your life milestones into an unshakeable career identity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-brand-yellow text-brand-dark font-extrabold flex items-center justify-center text-sm shadow-sm">
                01
              </div>
              <h3 className="text-base font-bold text-brand-dark">Document Achievement</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Enter what you did, your specific role, organization, and measurable results. AI extracts demonstrated skills automatically.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-brand-yellow text-brand-dark font-extrabold flex items-center justify-center text-sm shadow-sm">
                02
              </div>
              <h3 className="text-base font-bold text-brand-dark">Attach Supporting Evidence</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Upload letters of appreciation, certificates, project repos, or photo proof to your private, encrypted vault.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-brand-yellow text-brand-dark font-extrabold flex items-center justify-center text-sm shadow-sm">
                03
              </div>
              <h3 className="text-base font-bold text-brand-dark">Request Verification</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Send a time-limited verification token to your professor, organizer, or employer. They can attest with a single click.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-brand-yellow text-brand-dark font-extrabold flex items-center justify-center text-sm shadow-sm">
                04
              </div>
              <h3 className="text-base font-bold text-brand-dark">Export & Share</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Publish a privacy-controlled public portfolio or export tailored ATS-friendly resumes for specific applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SAMPLE ACHIEVEMENTS SHOWCASE */}
      <section className="py-20 bg-brand-ivory border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-yellow">Portfolio Scope</span>
              <h2 className="text-3xl font-extrabold text-brand-dark mt-1">Real Achievements, Documented & Verified</h2>
            </div>
            <Link href="/u/aarav">
              <Button variant="outline" size="sm">
                Preview Live Profile
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Events & Leadership
                  </span>
                  <VerificationBadge status="VERIFIED" />
                </div>
                <h3 className="text-base font-bold text-brand-dark mb-1">Lead Convener, Tech Summit</h3>
                <p className="text-xs text-brand-muted mb-3">Campus Tech Collective • 2024</p>
                <p className="text-xs text-brand-dark leading-relaxed">
                  Coordinated 14 volunteer committees and 4,000 attendees with 100% on-time execution.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-brand-border flex items-center justify-between text-[11px] text-brand-muted">
                <span>Verified by Sarah Jenkins</span>
                <span className="font-semibold text-brand-dark">1 Document</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Technology & Engineering
                  </span>
                  <VerificationBadge status="VERIFIED" />
                </div>
                <h3 className="text-base font-bold text-brand-dark mb-1">Disaster Alert SMS Gateway</h3>
                <p className="text-xs text-brand-muted mb-3">Open Disaster Aid Labs • 2024</p>
                <p className="text-xs text-brand-dark leading-relaxed">
                  Architected high-throughput offline emergency broadcast dispatching 120,000 localized flood warnings.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-brand-border flex items-center justify-between text-[11px] text-brand-muted">
                <span>Verified by Faculty Advisor</span>
                <span className="font-semibold text-brand-dark">GitHub Repo</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    Competitions & Research
                  </span>
                  <VerificationBadge status="EVIDENCE_ATTACHED" />
                </div>
                <h3 className="text-base font-bold text-brand-dark mb-1">National AI Hackathon Finalist</h3>
                <p className="text-xs text-brand-muted mb-3">Ministry of Electronics & IT • 2023</p>
                <p className="text-xs text-brand-dark leading-relaxed">
                  Ranked top 10 out of 1,200 teams for edge machine learning pest detection model.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-brand-border flex items-center justify-between text-[11px] text-brand-muted">
                <span>Official Finalist Certificate</span>
                <span className="font-semibold text-brand-dark">Evidence Attached</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-20 bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-yellow">Transparent Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark">Simple, Accessible Plans</h2>
            <p className="text-brand-muted">Start free as a student and upgrade when you need custom domains and institutional badges.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-brand-ivory rounded-2xl p-8 border border-brand-border flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-brand-dark">Lifelong Achiever</h3>
                <p className="text-xs text-brand-muted mt-1">For students and early career builders.</p>
                <div className="mt-6 mb-6">
                  <span className="text-4xl font-extrabold text-brand-dark">₹0</span>
                  <span className="text-xs text-brand-muted"> / forever free</span>
                </div>
                <ul className="space-y-3 text-xs text-brand-dark">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Unlimited achievements</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Up to 50MB evidence vault</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> 5 active verification requests</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> AI achievement analysis</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Public profile URL</li>
                </ul>
              </div>
              <Link href="/auth/signup" className="mt-8">
                <Button variant="secondary" size="md" className="w-full">Get Started Free</Button>
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-2xl p-8 border-2 border-brand-yellow shadow-card flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-yellow text-brand-dark text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-dark">Verified Identity Pro</h3>
                <p className="text-xs text-brand-muted mt-1">For active job seekers and researchers.</p>
                <div className="mt-6 mb-6">
                  <span className="text-4xl font-extrabold text-brand-dark">₹299</span>
                  <span className="text-xs text-brand-muted"> / month</span>
                </div>
                <ul className="space-y-3 text-xs text-brand-dark">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Everything in Lifelong Achiever</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> 1GB secure evidence vault</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Unlimited verification requests</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Unlimited AI tailored ATS resumes</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> 3 Premium resume templates & PDF export</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Priority verifier email delivery</li>
                </ul>
              </div>
              <Link href="/auth/signup" className="mt-8">
                <Button variant="primary" size="md" className="w-full">Start 14-Day Pro Trial</Button>
              </Link>
            </div>

            {/* Institution */}
            <div className="bg-brand-ivory rounded-2xl p-8 border border-brand-border flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-brand-dark">Campus & Enterprise</h3>
                <p className="text-xs text-brand-muted mt-1">For universities, colleges & bootcamps.</p>
                <div className="mt-6 mb-6">
                  <span className="text-4xl font-extrabold text-brand-dark">Custom</span>
                  <span className="text-xs text-brand-muted"> / institutional license</span>
                </div>
                <ul className="space-y-3 text-xs text-brand-dark">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Institutional admin dashboard</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Bulk student roster verification</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Official university verified badge</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> SSO & SIS data integration</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Dedicated compliance audit logging</li>
                </ul>
              </div>
              <Link href="/contact" className="mt-8">
                <Button variant="secondary" size="md" className="w-full">Contact Institutional Sales</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-brand-soft border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-dark bg-brand-yellow px-3 py-1 rounded-full">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl font-extrabold text-brand-dark">Everything You Need to Know</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 border border-brand-border shadow-sm">
              <h3 className="text-base font-bold text-brand-dark mb-2">How does third-party verification work?</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                When you document an achievement, you can request verification from the event organizer, faculty member, or supervisor who oversaw your work. They receive an email with a secure, expiring token link to view your claim, inspect the attached evidence, and confirm or dispute the details with official remarks.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-brand-border shadow-sm">
              <h3 className="text-base font-bold text-brand-dark mb-2">Can AI make up false experiences or fake numbers on my resume?</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Never. Life Resume&apos;s AI engine adheres to strict safety boundaries. It only reformulates and polishes experiences and metrics already entered in your saved profile. It will never fabricate jobs, companies, or numbers.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-brand-border shadow-sm">
              <h3 className="text-base font-bold text-brand-dark mb-2">Is my personal data protected under Indian and international privacy laws?</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Yes. Life Resume is engineered with privacy-by-design under the Digital Personal Data Protection (DPDP) framework. You retain 100% ownership of your data, can download a full JSON archive at any time, control the public/private visibility of every single achievement, and have the right to permanent account erasure.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-brand-border shadow-sm">
              <h3 className="text-base font-bold text-brand-dark mb-2">Can I export a standard PDF resume to apply for traditional jobs?</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Yes! The AI Resume Builder lets you generate, edit, and export clean, ATS-compliant PDF resumes in multiple professional styles including Modern Minimal, Executive Ivory, and Tech Focus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-24 bg-brand-ivory text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-brand-dark tracking-tight">
            Ready to build a resume that actually{" "}
            <span className="text-brand-yellow text-stroke">proves</span> what you&apos;ve done?
          </h2>
          <p className="text-base sm:text-lg text-brand-muted max-w-xl mx-auto">
            Join thousands of students and creators documenting their achievements with verified proof.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-hover">
                Create Your Free Life Resume
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/u/aarav">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                View Sample Profile
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
