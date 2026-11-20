"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { Menu, X, ArrowRight } from "lucide-react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <Logo />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-dark">
          <Link href="/features" className="hover:text-brand-yellow transition-colors">
            Features
          </Link>
          <Link href="/how-it-works" className="hover:text-brand-yellow transition-colors">
            How It Works
          </Link>
          <Link href="/pricing" className="hover:text-brand-yellow transition-colors">
            Pricing
          </Link>
          <Link href="/about" className="hover:text-brand-yellow transition-colors">
            About
          </Link>
          <Link href="/faq" className="hover:text-brand-yellow transition-colors">
            FAQ
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/signin">
            <Button variant="ghost" size="md">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="primary" size="md" className="gap-2">
              Build Your Life Resume
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-brand-dark hover:bg-brand-soft rounded-lg"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-b border-brand-border bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/features"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 text-base font-medium text-brand-dark hover:bg-brand-soft rounded-lg"
          >
            Features
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 text-base font-medium text-brand-dark hover:bg-brand-soft rounded-lg"
          >
            How It Works
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 text-base font-medium text-brand-dark hover:bg-brand-soft rounded-lg"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 text-base font-medium text-brand-dark hover:bg-brand-soft rounded-lg"
          >
            About
          </Link>
          <Link
            href="/faq"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 text-base font-medium text-brand-dark hover:bg-brand-soft rounded-lg"
          >
            FAQ
          </Link>
          <div className="pt-4 border-t border-brand-border flex flex-col gap-2">
            <Link href="/auth/signin" onClick={() => setMobileOpen(false)}>
              <Button variant="secondary" size="md" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup" onClick={() => setMobileOpen(false)}>
              <Button variant="primary" size="md" className="w-full">
                Build Your Life Resume
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
