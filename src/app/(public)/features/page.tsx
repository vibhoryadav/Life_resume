import Link from "next/link";
import { Button } from "@/components/Button";
import {
  Sparkles,
  ShieldCheck,
  FileText,
  Lock,
  Layers,
  Award,
  Upload,
  CheckCircle2,
  Share2,
} from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: Award,
      title: "Comprehensive Achievement Logging",
      desc: "Document leadership, entrepreneurship, academics, sports, arts, volunteering, events, research, and competitive awards in one structured timeline.",
    },
    {
      icon: Upload,
      title: "Encrypted Evidence Vault",
      desc: "Attach primary documents, recommendation letters, certificates (PDF, JPG, PNG, WebP), and project URLs. Files are stored securely and served via signed download tokens.",
    },
    {
      icon: ShieldCheck,
      title: "Third-Party Attestation Workflow",
      desc: "Invite professors, mentors, and event organizers to verify your claims with single-use expiring token links. Verifiers can affirm numbers, dispute claims, or add remarks.",
    },
    {
      icon: Sparkles,
      title: "Safe AI Skill Extraction",
      desc: "Our AI engine analyzes your achievements to automatically identify demonstrated competencies without ever hallucinating or exaggerating numbers.",
    },
    {
      icon: FileText,
      title: "AI ATS-Resume Generator",
      desc: "Generate tailored resumes for job applications, graduate school, internships, or scholarships directly from your verified portfolio data in seconds.",
    },
    {
      icon: Share2,
      title: "Public Profile & Privacy Controls",
      desc: "Share your achievements through a verified public URL (e.g. lifresume.com/u/yourname) with granular controls over private and unlisted items.",
    },
  ];

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-dark bg-brand-yellow px-3 py-1 rounded-full">
            Capabilities
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark">Built for Trust and Long-Term Value</h1>
          <p className="text-base sm:text-lg text-brand-muted">
            Everything you need to turn raw experiences into structured, verifiable achievements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl p-8 border border-brand-border shadow-card hover:border-brand-yellow transition-all">
                <div className="w-12 h-12 rounded-xl bg-brand-soft text-brand-dark flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-brand-dark" />
                </div>
                <h3 className="text-lg font-bold text-brand-dark mb-2">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-8">
          <Link href="/auth/signup">
            <Button variant="primary" size="lg">Explore All Features</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
