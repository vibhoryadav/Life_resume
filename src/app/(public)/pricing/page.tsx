import Link from "next/link";
import { Button } from "@/components/Button";
import { Check, HelpCircle } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-dark bg-brand-yellow px-3 py-1 rounded-full">
            Pricing Plans
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark">Invest in Your Lifetime Portfolio</h1>
          <p className="text-base sm:text-lg text-brand-muted">
            Choose the plan that fits where you are today. Free for students forever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white rounded-2xl p-8 border border-brand-border shadow-card flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-brand-dark">Lifelong Achiever</h3>
              <p className="text-xs text-brand-muted mt-1">For students building their initial record.</p>
              <div className="mt-6 mb-6">
                <span className="text-4xl font-extrabold text-brand-dark">₹0</span>
                <span className="text-xs text-brand-muted"> / forever free</span>
              </div>
              <ul className="space-y-3.5 text-xs text-brand-dark">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Unlimited achievements</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 50MB encrypted evidence vault</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 5 active verification requests</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> AI achievement analysis & skill tags</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Public life resume link</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Full DPDP data export & deletion rights</li>
              </ul>
            </div>
            <Link href="/auth/signup" className="mt-8">
              <Button variant="secondary" size="md" className="w-full">Get Started Free</Button>
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-white rounded-2xl p-8 border-2 border-brand-yellow shadow-hover flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-yellow text-brand-dark text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
              Most Popular
            </div>
            <div>
              <h3 className="text-xl font-bold text-brand-dark">Verified Identity Pro</h3>
              <p className="text-xs text-brand-muted mt-1">For active job seekers, consultants & founders.</p>
              <div className="mt-6 mb-6">
                <span className="text-4xl font-extrabold text-brand-dark">₹299</span>
                <span className="text-xs text-brand-muted"> / month (or ₹2,499/year)</span>
              </div>
              <ul className="space-y-3.5 text-xs text-brand-dark">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Everything in Free</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 1GB encrypted evidence vault</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Unlimited third-party verification requests</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Unlimited tailored ATS resumes</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 3 Premium templates & PDF export</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Priority verification token delivery</li>
              </ul>
            </div>
            <Link href="/auth/signup" className="mt-8">
              <Button variant="primary" size="md" className="w-full">Start 14-Day Pro Trial</Button>
            </Link>
          </div>

          {/* Institution Tier */}
          <div className="bg-white rounded-2xl p-8 border border-brand-border shadow-card flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-brand-dark">Campus & Enterprise</h3>
              <p className="text-xs text-brand-muted mt-1">For colleges, universities & student bodies.</p>
              <div className="mt-6 mb-6">
                <span className="text-4xl font-extrabold text-brand-dark">Custom</span>
                <span className="text-xs text-brand-muted"> / annual license</span>
              </div>
              <ul className="space-y-3.5 text-xs text-brand-dark">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Dedicated institutional admin portal</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Official institutional verification seal</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Bulk student cohort roster import</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> University SSO (SAML/Google Workspace)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Dedicated audit trail and compliance reporting</li>
              </ul>
            </div>
            <Link href="/contact" className="mt-8">
              <Button variant="secondary" size="md" className="w-full">Contact Campus Sales</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
