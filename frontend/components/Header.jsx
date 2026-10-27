// frontend/components/Header.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, LogOut, Dumbbell, Sparkles } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, user, gymBranding, logout } = useAuth();
  const pathname = usePathname();

  const isLandingPage = pathname === "/";

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-surface border-b border-line">
      {/* Top Brand Accent Line */}
      <div className="h-[3px] bg-primary w-full transition-colors" />

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            {gymBranding?.gymLogo ? (
              <img
                src={gymBranding.gymLogo}
                alt={gymBranding.name || "Gym Logo"}
                className="h-8 max-h-8 w-auto max-w-[120px] object-contain rounded-control border border-line"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-control bg-primary flex items-center justify-center text-on-primary font-semibold text-xs border"
                style={{
                  border: "var(--fill-border)",
                  backgroundColor: "rgb(var(--primary))",
                }}
              >
                <Dumbbell className="w-4 h-4 text-on-primary" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-semibold text-base md:text-lg tracking-tight text-ink group-hover:text-primary-ink transition-colors flex items-center gap-1.5">
                {gymBranding?.name || "FitConnect"}
                {gymBranding?.themeColor && (
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: gymBranding.themeColor }}
                    title={`Brand Color: ${gymBranding.themeColor}`}
                  />
                )}
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {!isLoggedIn ? (
            <>
              {isLandingPage ? (
                <>
                  <a
                    href="#how-it-works"
                    className="text-[13px] font-medium text-ink-soft hover:text-ink transition-colors"
                  >
                    How it works
                  </a>
                  <a
                    href="#what-you-manage"
                    className="text-[13px] font-medium text-ink-soft hover:text-ink transition-colors"
                  >
                    What you manage
                  </a>
                  <a
                    href="#your-gym-your-look"
                    className="text-[13px] font-medium text-ink-soft hover:text-ink transition-colors"
                  >
                    Your gym your look
                  </a>
                  <Link
                    href="/login?email=demo%40gym.com&role=gymOwner"
                    className="text-[13px] font-medium text-ink-soft hover:text-ink transition-colors"
                  >
                    Demo
                  </Link>
                </>
              ) : (
                <Link
                  href="/"
                  className="text-[13px] font-medium text-ink-soft hover:text-ink transition-colors"
                >
                  Home
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className={`text-[13px] font-medium transition-colors pb-1 border-b-2 ${
                  pathname === "/dashboard"
                    ? "text-primary-ink font-semibold border-primary"
                    : "border-transparent text-ink-soft hover:text-ink"
                }`}
              >
                {user?.role === "gymOwner" ? "Dashboard" : "Today's Schedule"}
              </Link>

              {user?.role === "gymOwner" && (
                <Link
                  href="/request"
                  className={`text-[13px] font-medium transition-colors pb-1 border-b-2 ${
                    pathname === "/request"
                      ? "text-primary-ink font-semibold border-primary"
                      : "border-transparent text-ink-soft hover:text-ink"
                  }`}
                >
                  Join Requests
                </Link>
              )}

              <Link
                href="/gyms"
                className={`text-[13px] font-medium transition-colors pb-1 border-b-2 ${
                  pathname.startsWith("/gyms")
                    ? "text-primary-ink font-semibold border-primary"
                    : "border-transparent text-ink-soft hover:text-ink"
                }`}
              >
                Gyms Directory
              </Link>
            </>
          )}
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="text-[13px] font-medium text-ink-soft hover:text-ink px-3 py-1.5 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/login?email=demo%40gym.com&role=gymOwner"
                className="h-9 px-4 bg-primary hover:bg-primary-hover text-on-primary text-[13px] font-semibold rounded-control inline-flex items-center transition-colors"
                style={{ border: "var(--fill-border)" }}
              >
                Try Demo
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1 bg-surface-alt rounded-control border border-line">
                <div className="w-6 h-6 rounded-avatar bg-primary text-on-primary flex items-center justify-center text-[11px] font-semibold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[12px] font-medium text-ink leading-tight">
                    {user?.name}
                  </span>
                  <span className="text-[10px] text-ink-soft uppercase leading-none">
                    {user?.role === "gymOwner" ? "Owner" : "Member"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => logout(true)}
                className="h-8 px-2.5 text-[12px] font-medium text-ink-soft hover:text-status-danger hover:bg-status-danger-soft/40 rounded-control border border-line flex items-center gap-1.5 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-control border border-line text-ink-soft hover:text-ink hover:bg-surface-alt"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface border-b border-line px-4 py-4 flex flex-col gap-3">
          {!isLoggedIn ? (
            <>
              {isLandingPage ? (
                <>
                  <a
                    href="#how-it-works"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-ink-soft py-1.5"
                  >
                    How it works
                  </a>
                  <a
                    href="#what-you-manage"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-ink-soft py-1.5"
                  >
                    What you manage
                  </a>
                  <a
                    href="#your-gym-your-look"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-ink-soft py-1.5"
                  >
                    Your gym your look
                  </a>
                  <Link
                    href="/login?email=demo%40gym.com&role=gymOwner"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-ink-soft py-1.5"
                  >
                    Demo
                  </Link>
                </>
              ) : (
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-ink-soft py-1.5"
                >
                  Home
                </Link>
              )}
              <div className="pt-2 border-t border-line flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-10 text-center flex items-center justify-center text-sm font-medium text-ink border border-line rounded-control"
                >
                  Sign in
                </Link>
                <Link
                  href="/login?email=demo%40gym.com&role=gymOwner"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-10 text-center flex items-center justify-center bg-primary text-on-primary text-sm font-semibold rounded-control"
                  style={{ border: "var(--fill-border)" }}
                >
                  Try Demo
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2.5 pb-2 border-b border-line">
                <div className="w-8 h-8 rounded-avatar bg-primary text-on-primary flex items-center justify-center text-xs font-semibold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink">{user?.name}</div>
                  <div className="text-xs text-ink-soft capitalize">{user?.role}</div>
                </div>
              </div>

              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-ink-soft py-1.5"
              >
                Dashboard
              </Link>

              {user?.role === "gymOwner" && (
                <Link
                  href="/request"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-ink-soft py-1.5"
                >
                  Join Requests
                </Link>
              )}

              <Link
                href="/gyms"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-ink-soft py-1.5"
              >
                Gyms Directory
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout(true);
                }}
                className="text-sm font-medium text-status-danger text-left py-1.5 pt-2 border-t border-line flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
