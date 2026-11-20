"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Mail, ShieldCheck, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Support Request",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-dark bg-brand-yellow px-3 py-1 rounded-full">
            Get in Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark">Contact Life Resume</h1>
          <p className="text-base sm:text-lg text-brand-muted max-w-xl mx-auto">
            Questions, institutional partnerships, or privacy inquiries? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-card space-y-3">
              <div className="flex items-center gap-2 font-bold text-brand-dark text-sm">
                <Mail className="w-4 h-4 text-brand-yellow" /> General Support
              </div>
              <p className="text-xs text-brand-muted">support@liferesume.com</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-card space-y-3">
              <div className="flex items-center gap-2 font-bold text-brand-dark text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Data Protection Officer
              </div>
              <p className="text-xs text-brand-muted">dpo@liferesume.com</p>
              <p className="text-[11px] text-brand-muted">DPDP Grievance Redressal Officer</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-card space-y-3">
              <div className="flex items-center gap-2 font-bold text-brand-dark text-sm">
                <MapPin className="w-4 h-4 text-brand-dark" /> Location
              </div>
              <p className="text-xs text-brand-muted">Bengaluru, Karnataka, India</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white p-8 rounded-2xl border border-brand-border shadow-card">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark">Message Dispatched</h3>
                  <p className="text-xs text-brand-muted max-w-md mx-auto">
                    Thank you for reaching out. Our support team or Data Protection Officer will review and respond within 24 business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-dark mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-dark mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-dark mb-1">Inquiry Type</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
                    >
                      <option>General Support</option>
                      <option>Institutional Campus Partnership</option>
                      <option>Verification Dispute</option>
                      <option>DPDP / Privacy Request</option>
                      <option>Security Vulnerability Report</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-dark mb-1">Message</label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we assist you?"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
                    />
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full gap-2">
                    <Send className="w-4 h-4" /> Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
