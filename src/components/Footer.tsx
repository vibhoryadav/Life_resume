import Link from "next/link";
import { Logo } from "./Logo";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-brand-border text-brand-dark pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-brand-border">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Logo />
            <p className="text-sm text-brand-muted max-w-sm leading-relaxed">
              &quot;Your achievements. Your evidence. Your story.&quot;
              <br />
              Life Resume is the digital achievement identity engine. Document your full journey, verify real evidence, and build a trusted portable portfolio.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-soft border border-brand-yellow/30 text-xs font-semibold text-brand-dark">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              DPDP & Privacy-First Architecture
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm text-brand-muted">
              <li><Link href="/features" className="hover:text-brand-dark transition-colors">Features</Link></li>
              <li><Link href="/how-it-works" className="hover:text-brand-dark transition-colors">How It Works</Link></li>
              <li><Link href="/pricing" className="hover:text-brand-dark transition-colors">Pricing</Link></li>
              <li><Link href="/dashboard/resume-builder" className="hover:text-brand-dark transition-colors">AI Resume Builder</Link></li>
              <li><Link href="/u/aarav" className="hover:text-brand-dark transition-colors">Sample Public Profile</Link></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-4">Ecosystem</h4>
            <ul className="space-y-2.5 text-sm text-brand-muted">
              <li><Link href="/about" className="hover:text-brand-dark transition-colors">About Us</Link></li>
              <li><Link href="/verify/sample" className="hover:text-brand-dark transition-colors">Verifier Portal</Link></li>
              <li><Link href="/faq" className="hover:text-brand-dark transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-brand-dark transition-colors">Support & Grievances</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-4">Trust & Compliance</h4>
            <ul className="space-y-2.5 text-sm text-brand-muted">
              <li><Link href="/privacy" className="hover:text-brand-dark transition-colors">Privacy Policy (DPDP)</Link></li>
              <li><Link href="/terms" className="hover:text-brand-dark transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-brand-dark transition-colors">Data Protection Officer</Link></li>
              <li><Link href="/api/health" className="hover:text-brand-dark transition-colors">System Health</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-muted gap-4">
          <p>© {new Date().getFullYear()} LIFE RESUME Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with strict security, cryptographic attestation, and data protection compliance.
          </p>
        </div>
      </div>
    </footer>
  );
}
