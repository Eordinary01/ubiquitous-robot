// frontend/app/page.js
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Copy,
  ArrowRight,
  Phone,
  X,
  Dumbbell,
  Sparkles,
  Activity,
  Calendar,
  Utensils,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("owner");
  const [copied, setCopied] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleFillDemo = (email, password, role) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`${email} / ${password}`).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    router.push(`/login?email=${encodeURIComponent(email)}&role=${role}`);
  };

  return (
    <div className="w-full bg-surface text-ink flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="w-full bg-surface min-h-[calc(100vh-4rem)] flex flex-col justify-center py-10 lg:py-14 border-b border-line">
        <div className="max-w-[1360px] mx-auto px-4 md:px-6 lg:px-8 flex flex-col gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column: Copy + CTA + Sample Creds Panel */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex flex-col gap-3.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-primary-soft text-primary-ink border border-primary/20 w-fit text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={13} />
                  <span>White-Label Infrastructure for Fitness Studios</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-[44px] leading-[1.18] font-bold tracking-tight text-ink">
                  The White-Label Operating System for Modern Gyms.
                </h1>
                <p className="text-base md:text-lg text-ink-soft max-w-xl leading-relaxed">
                  Stop managing workouts on chaotic WhatsApp threads. Give your members a branded portal to track their weekly routine, diet macro splits, and body progression.
                </p>
              </div>

              {/* Hero Actions */}
              <div className="flex flex-wrap items-center gap-3.5">
                <button
                  onClick={() => handleFillDemo("demo@gym.com", "password123", "gymOwner")}
                  className="h-11 px-6 bg-primary hover:bg-primary-hover text-on-primary font-bold text-sm rounded-control inline-flex items-center gap-2 transition-all shadow-sm"
                  style={{ border: "var(--fill-border)" }}
                >
                  <span>Launch Interactive Demo</span>
                  <ArrowRight size={16} />
                </button>
                <Link
                  href="/gyms"
                  className="h-11 px-6 bg-transparent border border-line hover:bg-surface-alt text-ink font-semibold text-sm rounded-control inline-flex items-center transition-colors"
                >
                  Browse Gym Directory
                </Link>
              </div>

              {/* Sample Account Panel */}
              <div className="w-full bg-surface border border-line rounded-panel flex flex-col overflow-hidden shadow-xs mt-1">
                <div className="px-4 py-2.5 bg-surface-alt border-b border-line flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">
                    Shared sample account &amp; test data
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setActiveTab("owner")}
                      className={`px-3 py-1 rounded-[3px] text-xs font-bold transition-colors ${
                        activeTab === "owner"
                          ? "bg-primary text-on-primary shadow-2xs"
                          : "bg-surface-alt text-ink-soft hover:text-ink"
                      }`}
                    >
                      Gym owner
                    </button>
                    <button
                      onClick={() => setActiveTab("member")}
                      className={`px-3 py-1 rounded-[3px] text-xs font-bold transition-colors ${
                        activeTab === "member"
                          ? "bg-primary text-on-primary shadow-2xs"
                          : "bg-surface-alt text-ink-soft hover:text-ink"
                      }`}
                    >
                      Member
                    </button>
                  </div>
                </div>

                {/* Owner Credentials */}
                {activeTab === "owner" && (
                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-ink-soft w-20 font-medium text-xs">Email:</span>
                        <span className="font-mono font-semibold text-ink text-sm select-all">demo@gym.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-ink-soft w-20 font-medium text-xs">Password:</span>
                        <span className="font-mono font-semibold text-ink text-sm select-all">password123</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFillDemo("demo@gym.com", "password123", "gymOwner")}
                      className="h-8 px-3.5 bg-surface hover:bg-surface-alt border border-line text-ink text-xs font-bold rounded-control self-start sm:self-auto transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-status-success-text" /> : <Copy className="w-3.5 h-3.5 text-ink-soft" />}
                      <span>Fill demo login</span>
                    </button>
                  </div>
                )}

                {/* Member Credentials */}
                {activeTab === "member" && (
                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-ink-soft w-20 font-medium text-xs">Email:</span>
                        <span className="font-mono font-semibold text-ink text-sm select-all">rahul@demo.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-ink-soft w-20 font-medium text-xs">Password:</span>
                        <span className="font-mono font-semibold text-ink text-sm select-all">password123</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFillDemo("rahul@demo.com", "password123", "member")}
                      className="h-8 px-3.5 bg-surface hover:bg-surface-alt border border-line text-ink text-xs font-bold rounded-control self-start sm:self-auto transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-status-success-text" /> : <Copy className="w-3.5 h-3.5 text-ink-soft" />}
                      <span>Fill demo login</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Live Applicants Card */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="w-full bg-surface border border-line rounded-panel overflow-hidden shadow-sm">
                <div className="px-4 py-3 bg-surface-alt border-b border-line flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary inline-block animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-ink">
                      Iron Paradise Gym — Live Applicants
                    </span>
                  </div>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-status-warning-soft text-status-warning-text font-bold border border-status-warning-border">
                    3 Pending
                  </span>
                </div>

                <div className="divide-y divide-line">
                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-alt/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-soft text-primary-ink font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        PS
                      </div>
                      <div>
                        <span className="font-bold text-sm text-ink block">Pooja Sharma</span>
                        <span className="text-xs text-ink-soft">14 min ago • Standard Tier • Hypertrophy</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleFillDemo("demo@gym.com", "password123", "gymOwner")}
                        className="h-7 px-2.5 bg-primary hover:bg-primary-hover text-on-primary font-bold text-xs rounded-control transition-colors"
                        style={{ border: "var(--fill-border)" }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleFillDemo("demo@gym.com", "password123", "gymOwner")}
                        className="h-7 px-2 bg-surface hover:bg-surface-alt border border-line text-ink font-medium text-xs rounded-control transition-colors"
                      >
                        Plan
                      </button>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-alt/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-soft text-primary-ink font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        AN
                      </div>
                      <div>
                        <span className="font-bold text-sm text-ink block">Arjun Nair</span>
                        <span className="text-xs text-ink-soft">2 hr ago • Quarterly Tier • Strength</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleFillDemo("demo@gym.com", "password123", "gymOwner")}
                        className="h-7 px-2.5 bg-primary hover:bg-primary-hover text-on-primary font-bold text-xs rounded-control transition-colors"
                        style={{ border: "var(--fill-border)" }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleFillDemo("demo@gym.com", "password123", "gymOwner")}
                        className="h-7 px-2 bg-surface hover:bg-surface-alt border border-line text-ink font-medium text-xs rounded-control transition-colors"
                      >
                        Plan
                      </button>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-alt/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-soft text-primary-ink font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        VK
                      </div>
                      <div>
                        <span className="font-bold text-sm text-ink block">Vikram Kapoor</span>
                        <span className="text-xs text-ink-soft">Yesterday • Annual Tier • Fat Loss</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleFillDemo("demo@gym.com", "password123", "gymOwner")}
                        className="h-7 px-2.5 bg-primary hover:bg-primary-hover text-on-primary font-bold text-xs rounded-control transition-colors"
                        style={{ border: "var(--fill-border)" }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleFillDemo("demo@gym.com", "password123", "gymOwner")}
                        className="h-7 px-2 bg-surface hover:bg-surface-alt border border-line text-ink font-medium text-xs rounded-control transition-colors"
                      >
                        Plan
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-surface-alt border-t border-line text-xs text-ink-soft flex items-center justify-between">
                  <span>Starter routine seeds on approval</span>
                  <button
                    onClick={() => handleFillDemo("demo@gym.com", "password123", "gymOwner")}
                    className="font-mono text-primary font-bold hover:underline"
                  >
                    Interactive Demo →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Institutional Trust & Capability Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-line">
            <div className="p-3.5 bg-surface-alt/60 border border-line rounded-control flex flex-col gap-0.5">
              <span className="font-mono text-xl font-bold text-ink">100% Brand</span>
              <span className="text-xs text-ink-soft">Your facility name, colors &amp; custom look</span>
            </div>
            <div className="p-3.5 bg-surface-alt/60 border border-line rounded-control flex flex-col gap-0.5">
              <span className="font-mono text-xl font-bold text-ink">16 Routine Splits</span>
              <span className="text-xs text-ink-soft">PPL, Arnold, Bro-Split, PHAT, Glutes &amp; more</span>
            </div>
            <div className="p-3.5 bg-surface-alt/60 border border-line rounded-control flex flex-col gap-0.5">
              <span className="font-mono text-xl font-bold text-ink">₹ Native INR</span>
              <span className="text-xs text-ink-soft">Monthly, quarterly &amp; annual billing tiers</span>
            </div>
            <div className="p-3.5 bg-surface-alt/60 border border-line rounded-control flex flex-col gap-0.5">
              <span className="font-mono text-xl font-bold text-ink">&lt; 60 Seconds</span>
              <span className="text-xs text-ink-soft">From applicant review to active logging</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OPERATIONAL COMPARISON */}
      <section className="w-full bg-surface-alt min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 lg:py-16 border-b border-line">
        <div className="max-w-[1360px] mx-auto px-4 md:px-6 lg:px-8 flex flex-col gap-8">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-faint">
              Operational Realities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              Why leading fitness facilities abandon fragmented spreadsheets.
            </h2>
            <p className="text-sm md:text-base text-ink-soft">
              Compare chaotic manual management against an institutional operating system designed for retention and compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* The Legacy Method */}
            <div className="p-6 lg:p-8 bg-surface border border-line rounded-panel flex flex-col justify-between gap-5 shadow-xs">
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 text-status-danger">
                  <X size={20} className="stroke-[2.5]" />
                  <span className="text-xs font-bold uppercase tracking-wider">The Legacy Method</span>
                </div>
                <h3 className="text-xl font-bold text-ink">Fragmented WhatsApp &amp; Paper Records</h3>
                <p className="text-sm text-ink-soft leading-relaxed">
                  Trainers text unformatted exercise lists across loose chat threads. Members lose their nutrition macros, forget previous loads, and owners have zero automated record of renewals.
                </p>
                <div className="pt-1 space-y-2 text-sm text-ink-soft">
                  <div className="flex items-start gap-2">
                    <span className="text-status-danger font-bold shrink-0 mt-0.5">✕</span>
                    <span>Workout logs vanish in personal chat archives with zero progression tracking.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-status-danger font-bold shrink-0 mt-0.5">✕</span>
                    <span>Nutrition macros sent as photos get lost, leading to poor member results.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-status-danger font-bold shrink-0 mt-0.5">✕</span>
                    <span>Staff chase fees manually over phone calls without automated expiry logs.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-status-danger font-bold shrink-0 mt-0.5">✕</span>
                    <span>Health alerts, body circumferences, and emergency contacts are unorganized.</span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-status-danger-soft/60 border border-status-danger/20 rounded-control text-xs text-status-danger font-medium flex items-center justify-between">
                <span>Result: Chaotic member drop-offs</span>
                <span className="font-mono font-bold">-35% Retention</span>
              </div>
            </div>

            {/* The FitConnect Standard */}
            <div className="p-6 lg:p-8 bg-surface border border-primary/40 rounded-panel flex flex-col justify-between gap-5 shadow-xs ring-1 ring-primary/20">
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 text-primary">
                  <Check size={20} className="stroke-[2.5]" />
                  <span className="text-xs font-bold uppercase tracking-wider">The FitConnect Standard</span>
                </div>
                <h3 className="text-xl font-bold text-ink">Unified Studio Operating Portal</h3>
                <p className="text-sm text-ink-soft leading-relaxed">
                  Every applicant is approved into an automated schedule with daily periodized workouts, target macronutrients, anthropometric metrics, and full white-labeling under your gym&apos;s identity.
                </p>
                <div className="pt-1 space-y-2 text-sm text-ink">
                  <div className="flex items-start gap-2">
                    <span className="text-primary font-bold shrink-0 mt-0.5">✓</span>
                    <span>1-Click library of 16 industry routine splits (PPL, Arnold, PHAT, PHUL, Glutes, 5x5, Calisthenics) with target sets, reps &amp; load.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary font-bold shrink-0 mt-0.5">✓</span>
                    <span>Auto-calculating daily protein, carbs, and fats with meal-by-meal portion plans.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary font-bold shrink-0 mt-0.5">✓</span>
                    <span>Automated ₹ (INR) payment status, renewal warnings, and roster filtering.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary font-bold shrink-0 mt-0.5">✓</span>
                    <span>Duty-of-care body weight, metric circumferences, and medical alert notes.</span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-primary-soft border border-primary/20 rounded-control text-xs text-primary-ink font-bold flex items-center justify-between">
                <span>Result: Consistent training adherence</span>
                <span className="font-mono font-bold">+94% Adherence</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="w-full bg-surface min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 lg:py-16 border-b border-line scroll-mt-16">
        <div className="max-w-[1360px] mx-auto px-4 md:px-6 lg:px-8 flex flex-col gap-8">
          <div className="flex flex-col gap-2 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Simple 3-Step Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              From application to active training in 60 seconds.
            </h2>
            <p className="text-sm md:text-base text-ink-soft">
              Zero manual spreadsheet entries. Every member receives a structured, institutional portal from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-surface-alt border border-line rounded-panel p-6 flex flex-col justify-between gap-5 shadow-xs">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl lg:text-4xl font-extrabold text-primary">01</span>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface border border-line text-ink-soft font-semibold">ADMISSION</span>
                </div>
                <h4 className="text-lg font-bold text-ink">Member Requests Access</h4>
                <p className="text-sm text-ink-soft leading-relaxed">
                  Prospective members discover your facility on the directory and submit contact info, targets, and medical history.
                </p>
                <div className="p-3 bg-surface border border-line rounded-control text-xs space-y-1">
                  <div className="font-semibold text-ink">Pooja Sharma • Annual Tier</div>
                  <div className="text-ink-soft">Target: Hypertrophy &amp; Posture</div>
                </div>
              </div>
              <div className="pt-3 border-t border-line text-xs font-mono font-semibold text-ink-faint flex items-center justify-between">
                <span>IN QUEUE</span>
                <span className="text-primary font-bold">Review →</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-surface-alt border border-line rounded-panel p-6 flex flex-col justify-between gap-5 shadow-xs">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl lg:text-4xl font-extrabold text-primary">02</span>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface border border-line text-ink-soft font-semibold">PERIODIZATION</span>
                </div>
                <h4 className="text-lg font-bold text-ink">Owner Assigns Routine</h4>
                <p className="text-sm text-ink-soft leading-relaxed">
                  With 1 click, auto-enroll members with standard terms, or select from 16 established weekly workout splits (PPL, Arnold, Bro-Split, PHAT, PHUL, Glutes, 5x5 Strength, Calisthenics) and macro plans.
                </p>
                <div className="p-3 bg-surface border border-line rounded-control text-xs flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-primary-soft text-primary-ink font-bold">PPL</span>
                  <span className="px-2 py-0.5 rounded bg-surface-alt border border-line text-ink-soft">Arnold Split</span>
                  <span className="px-2 py-0.5 rounded bg-surface-alt border border-line text-ink-soft">PHAT</span>
                  <span className="px-2 py-0.5 rounded bg-surface-alt border border-line text-ink-soft">PHUL</span>
                  <span className="px-2 py-0.5 rounded bg-surface-alt border border-line text-ink-soft">Glute Spec</span>
                  <span className="px-2 py-0.5 rounded bg-surface-alt border border-line text-ink-soft">5x5 Strength</span>
                  <span className="px-2 py-0.5 rounded bg-surface-alt border border-line text-ink-soft">+10 More</span>
                </div>
              </div>
              <div className="pt-3 border-t border-line text-xs font-mono font-semibold text-ink-faint flex items-center justify-between">
                <span>PRESCRIBED</span>
                <span className="text-primary font-bold">1-Click Assign →</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-surface-alt border border-line rounded-panel p-6 flex flex-col justify-between gap-5 shadow-xs">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl lg:text-4xl font-extrabold text-primary">03</span>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface border border-line text-ink-soft font-semibold">EXECUTION</span>
                </div>
                <h4 className="text-lg font-bold text-ink">Member Trains in Branded App</h4>
                <p className="text-sm text-ink-soft leading-relaxed">
                  Member signs in on mobile or desktop to view daily sets, target reps, load in kg, rest times, and custom diet targets.
                </p>
                <div className="p-3 bg-surface border border-line rounded-control text-xs space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="font-sans text-ink">Bench Press 4 × 8</span>
                    <strong className="text-primary">85 kg</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans text-ink">Incline DB 3 × 10</span>
                    <strong className="text-primary">32 kg</strong>
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-line text-xs font-mono font-semibold text-ink-faint flex items-center justify-between">
                <span>ACTIVE TRAINING</span>
                <span className="text-primary font-bold">Live Portal →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHAT YOU MANAGE */}
      <section id="what-you-manage" className="w-full bg-surface-alt min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 lg:py-16 border-b border-line scroll-mt-16">
        <div className="max-w-[1360px] mx-auto px-4 md:px-6 lg:px-8 flex flex-col gap-8">
          <div className="flex flex-col gap-2 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Management Modules
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              Complete operational control in one console.
            </h2>
            <p className="text-sm md:text-base text-ink-soft">
              Designed specifically for gym owners and personal trainers to manage rosters, routines, and retention.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Module 1 */}
            <div className="bg-surface border border-line rounded-panel p-6 flex flex-col justify-between gap-4 shadow-xs">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-control bg-primary-soft text-primary-ink flex items-center justify-center font-bold">
                  <Calendar size={20} />
                </div>
                <h4 className="text-lg font-bold text-ink">Membership &amp; Billings</h4>
                <p className="text-xs md:text-sm text-ink-soft leading-relaxed">
                  Track active vs. expiring memberships, fees in ₹ (INR), and automated billing expiration dates.
                </p>
                <div className="pt-2 border-t border-line text-xs text-ink-soft space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-primary shrink-0" />
                    <span>Monthly, Quarterly, Annual Tiers</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-primary shrink-0" />
                    <span>Payment Pending Filter</span>
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-primary">MODULE 01 • ROSTER</span>
            </div>

            {/* Module 2 */}
            <div className="bg-surface border border-line rounded-panel p-6 flex flex-col justify-between gap-4 shadow-xs">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-control bg-primary-soft text-primary-ink flex items-center justify-center font-bold">
                  <Dumbbell size={20} />
                </div>
                <h4 className="text-lg font-bold text-ink">6-Day Workout Splits</h4>
                <p className="text-xs md:text-sm text-ink-soft leading-relaxed">
                  Import PPL, Arnold Split, Bro-Split, Synergy, or 5x5 Strength volume with exact sets, reps, and rest.
                </p>
                <div className="pt-2 border-t border-line text-xs text-ink-soft space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-primary shrink-0" />
                    <span>8 Verified Split Presets</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-primary shrink-0" />
                    <span>Target Load (kg) &amp; Reps</span>
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-primary">MODULE 02 • TRAINING</span>
            </div>

            {/* Module 3 */}
            <div className="bg-surface border border-line rounded-panel p-6 flex flex-col justify-between gap-4 shadow-xs">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-control bg-primary-soft text-primary-ink flex items-center justify-center font-bold">
                  <Utensils size={20} />
                </div>
                <h4 className="text-lg font-bold text-ink">Diet &amp; Macro Splits</h4>
                <p className="text-xs md:text-sm text-ink-soft leading-relaxed">
                  Prescribe calorie and macro targets (protein, carbs, fats) with meal-by-meal breakdown and items.
                </p>
                <div className="pt-2 border-t border-line text-xs text-ink-soft space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-primary shrink-0" />
                    <span>Auto-Calculated Daily Macros</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-primary shrink-0" />
                    <span>Bulking, Cutting &amp; Veg Presets</span>
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-primary">MODULE 03 • NUTRITION</span>
            </div>

            {/* Module 4 */}
            <div className="bg-surface border border-line rounded-panel p-6 flex flex-col justify-between gap-4 shadow-xs">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-control bg-primary-soft text-primary-ink flex items-center justify-center font-bold">
                  <Activity size={20} />
                </div>
                <h4 className="text-lg font-bold text-ink">Anthropometric Metrics</h4>
                <p className="text-xs md:text-sm text-ink-soft leading-relaxed">
                  Log body weight, height, BMI calculations, circumference measurements, and body fat %.
                </p>
                <div className="pt-2 border-t border-line text-xs text-ink-soft space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-primary shrink-0" />
                    <span>Chest, Arm &amp; Waist Tracking</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-primary shrink-0" />
                    <span>Medical Notes &amp; History</span>
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-primary">MODULE 04 • METRICS</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MEMBER EXPERIENCE */}
      <section id="member-experience" className="w-full bg-surface min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 lg:py-16 border-b border-line scroll-mt-16">
        <div className="max-w-[1360px] mx-auto px-4 md:px-6 lg:px-8 flex flex-col gap-8">
          <div className="flex flex-col gap-2 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Member Interface
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              What your members see when they log in.
            </h2>
            <p className="text-sm md:text-base text-ink-soft">
              Clean, distraction-free execution. No cluttered social feeds or ads—just their daily periodization and nutrition.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Workout Prescription Table */}
            <div className="lg:col-span-7 bg-surface border border-line rounded-panel overflow-hidden shadow-sm">
              <div className="px-5 py-3.5 bg-surface-alt border-b border-line flex items-center justify-between">
                <div>
                  <h4 className="text-sm md:text-base font-bold text-ink">Today&apos;s Workout: Push A (Chest &amp; Triceps)</h4>
                  <span className="text-xs text-ink-soft">Duration: 60 mins • RPE 8 Target</span>
                </div>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-[4px] bg-primary-soft text-primary-ink border border-primary/20">
                  DAY 1 ACTIVE
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-line bg-surface-alt/50 text-ink-faint uppercase font-bold text-[11px]">
                      <th className="py-2.5 px-4">Exercise</th>
                      <th className="py-2.5 px-3">Muscle</th>
                      <th className="py-2.5 px-3 text-right">Sets</th>
                      <th className="py-2.5 px-3 text-right">Reps</th>
                      <th className="py-2.5 px-3 text-right">Load</th>
                      <th className="py-2.5 px-3 text-right">Rest</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line font-mono text-xs md:text-sm">
                    <tr>
                      <td className="py-2.5 px-4 font-sans font-semibold text-ink">Barbell Bench Press</td>
                      <td className="py-2.5 px-3 text-ink-soft font-sans">Chest</td>
                      <td className="py-2.5 px-3 text-right tabular-nums">4</td>
                      <td className="py-2.5 px-3 text-right tabular-nums">8</td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-bold text-ink">85 kg</td>
                      <td className="py-2.5 px-3 text-right tabular-nums">90s</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-sans font-semibold text-ink">Incline Dumbbell Press</td>
                      <td className="py-2.5 px-3 text-ink-soft font-sans">Chest</td>
                      <td className="py-2.5 px-3 text-right tabular-nums">3</td>
                      <td className="py-2.5 px-3 text-right tabular-nums">10</td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-bold text-ink">32 kg</td>
                      <td className="py-2.5 px-3 text-right tabular-nums">75s</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-sans font-semibold text-ink">Standing Overhead Press</td>
                      <td className="py-2.5 px-3 text-ink-soft font-sans">Shoulders</td>
                      <td className="py-2.5 px-3 text-right tabular-nums">3</td>
                      <td className="py-2.5 px-3 text-right tabular-nums">8</td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-bold text-ink">50 kg</td>
                      <td className="py-2.5 px-3 text-right tabular-nums">90s</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-sans font-semibold text-ink">Lateral Raises</td>
                      <td className="py-2.5 px-3 text-ink-soft font-sans">Shoulders</td>
                      <td className="py-2.5 px-3 text-right tabular-nums">3</td>
                      <td className="py-2.5 px-3 text-right tabular-nums">15</td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-bold text-ink">14 kg</td>
                      <td className="py-2.5 px-3 text-right tabular-nums">60s</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-sans font-semibold text-ink">Cable Tricep Pushdowns</td>
                      <td className="py-2.5 px-3 text-ink-soft font-sans">Triceps</td>
                      <td className="py-2.5 px-3 text-right tabular-nums">3</td>
                      <td className="py-2.5 px-3 text-right tabular-nums">12</td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-bold text-ink">35 kg</td>
                      <td className="py-2.5 px-3 text-right tabular-nums">60s</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Nutrition Macro Summary */}
            <div className="lg:col-span-5 bg-surface border border-line rounded-panel p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <div>
                  <h4 className="text-sm md:text-base font-bold text-ink">Daily Macro Prescription</h4>
                  <span className="text-xs text-ink-soft">Lean Hypertrophy Plan</span>
                </div>
                <span className="font-mono text-sm font-bold text-primary">2,400 kcal</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 font-mono text-center">
                <div className="p-3 bg-surface-alt border border-line rounded-control">
                  <span className="text-[11px] uppercase font-bold text-ink-faint block">Protein</span>
                  <span className="text-xl font-bold text-primary-ink mt-0.5 block">175g</span>
                  <span className="text-[10px] text-ink-soft block">700 kcal</span>
                </div>
                <div className="p-3 bg-surface-alt border border-line rounded-control">
                  <span className="text-[11px] uppercase font-bold text-ink-faint block">Carbs</span>
                  <span className="text-xl font-bold text-ink mt-0.5 block">260g</span>
                  <span className="text-[10px] text-ink-soft block">1,040 kcal</span>
                </div>
                <div className="p-3 bg-surface-alt border border-line rounded-control">
                  <span className="text-[11px] uppercase font-bold text-ink-faint block">Fats</span>
                  <span className="text-xl font-bold text-ink mt-0.5 block">65g</span>
                  <span className="text-[10px] text-ink-soft block">585 kcal</span>
                </div>
              </div>

              <div className="border border-line rounded-control divide-y divide-line font-mono text-xs">
                <div className="p-2.5 bg-surface-alt/40 flex justify-between items-center">
                  <div>
                    <span className="font-sans font-semibold text-ink text-xs block">Breakfast (08:30 AM)</span>
                    <span className="font-sans text-[11px] text-ink-soft">Oatmeal (80g), whey isolate &amp; banana</span>
                  </div>
                  <span className="font-bold text-ink">520 kcal</span>
                </div>
                <div className="p-2.5 bg-surface-alt/40 flex justify-between items-center">
                  <div>
                    <span className="font-sans font-semibold text-ink text-xs block">Lunch (01:30 PM)</span>
                    <span className="font-sans text-[11px] text-ink-soft">Grilled chicken breast (200g), steamed rice</span>
                  </div>
                  <span className="font-bold text-ink">750 kcal</span>
                </div>
                <div className="p-2.5 bg-surface-alt/40 flex justify-between items-center">
                  <div>
                    <span className="font-sans font-semibold text-ink text-xs block">Dinner (08:30 PM)</span>
                    <span className="font-sans text-[11px] text-ink-soft">Salmon fillet (180g), sweet potato &amp; greens</span>
                  </div>
                  <span className="font-bold text-ink">650 kcal</span>
                </div>
              </div>

              <div className="pt-2 text-xs text-ink-soft flex items-center justify-between">
                <span>Daily Hydration:</span>
                <span className="font-mono font-bold text-ink">3.5 Litres</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHITE-LABEL BRANDING */}
      <section id="your-gym-your-look" className="w-full bg-surface-alt min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 lg:py-16 border-b border-line scroll-mt-16">
        <div className="max-w-[1360px] mx-auto px-4 md:px-6 lg:px-8 flex flex-col gap-8">
          <div className="flex flex-col gap-2 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              White-Label Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              Your gym, your colors, your brand identity.
            </h2>
            <p className="text-sm md:text-base text-ink-soft">
              Our automated theme engine computes WCAG 2.1 accessible contrast ratios on the fly, tailoring button text, hover states, and highlights to your hex code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Screen A: Pine Accent (#1E3F20) */}
            <div className="bg-surface border border-line rounded-panel overflow-hidden shadow-sm">
              <div className="px-5 py-3.5 bg-[#1E3F20] text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-control bg-white/10 flex items-center justify-center font-bold text-xs text-white">
                    T
                  </div>
                  <span className="font-bold text-sm text-white">Titan Strength Lab</span>
                </div>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/20 text-white font-bold">
                  #1E3F20 (Deep Pine)
                </span>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center text-xs md:text-sm">
                  <span className="text-ink-soft">Member: Rohit Varma</span>
                  <span className="font-mono font-bold text-[#1E3F20]">₹2,499 / mo</span>
                </div>
                <div className="p-3.5 rounded-control border border-[#1E3F20]/30 bg-[#1E3F20]/5 text-xs md:text-sm text-ink flex justify-between items-center">
                  <div>
                    <span className="font-bold block">Push Day Routine Active</span>
                    <span className="text-xs text-ink-soft">Chest &amp; Triceps Periodization</span>
                  </div>
                  <button className="px-3 py-1.5 bg-[#1E3F20] text-white text-xs font-bold rounded-control">
                    Open Routine
                  </button>
                </div>
              </div>
            </div>

            {/* Screen B: Amber Accent (#B45309) */}
            <div className="bg-surface border border-line rounded-panel overflow-hidden shadow-sm">
              <div className="px-5 py-3.5 bg-[#B45309] text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-control bg-white/10 flex items-center justify-center font-bold text-xs text-white">
                    A
                  </div>
                  <span className="font-bold text-sm text-white">Apex Athletic Club</span>
                </div>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/20 text-white font-bold">
                  #B45309 (Warm Amber)
                </span>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center text-xs md:text-sm">
                  <span className="text-ink-soft">Member: Dev Rathore</span>
                  <span className="font-mono font-bold text-[#B45309]">₹2,999 / mo</span>
                </div>
                <div className="p-3.5 rounded-control border border-[#B45309]/30 bg-[#B45309]/5 text-xs md:text-sm text-ink flex justify-between items-center">
                  <div>
                    <span className="font-bold block">Olympic Conditioning Active</span>
                    <span className="text-xs text-ink-soft">Power Cleans &amp; High Pulls</span>
                  </div>
                  <button className="px-3 py-1.5 bg-[#B45309] text-white text-xs font-bold rounded-control">
                    Open Routine
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. EVALUATION & CLOSING */}
      <section id="demo" className="w-full bg-surface min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 lg:py-16 border-b border-line scroll-mt-16">
        <div className="max-w-[1360px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-surface border border-line rounded-panel p-8 md:p-10 text-center flex flex-col items-center gap-6 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-primary-soft text-primary-ink flex items-center justify-center mx-auto border border-primary/20">
              <Sparkles size={24} />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-ink-faint">
                Live Interactive Sandbox
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink mt-2">
                Evaluate FitConnect in real time.
              </h2>
              <p className="text-sm md:text-base text-ink-soft mt-2 max-w-xl leading-relaxed">
                Experience the exact facility owner dashboard and member training app right now using our pre-seeded accounts.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <button
                onClick={() => handleFillDemo("demo@gym.com", "password123", "gymOwner")}
                className="h-11 px-6 bg-primary hover:bg-primary-hover text-on-primary font-bold text-sm rounded-control inline-flex items-center gap-2 transition-all shadow-sm"
                style={{ border: "var(--fill-border)" }}
              >
                <span>Log In as Gym Owner</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => handleFillDemo("rahul@demo.com", "password123", "member")}
                className="h-11 px-6 bg-surface hover:bg-surface-alt border border-line text-ink font-bold text-sm rounded-control inline-flex items-center transition-colors"
              >
                Log In as Member
              </button>
            </div>

            <div className="pt-4 border-t border-line w-full flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm text-ink-soft">
              <span>Owner: <strong className="font-mono text-ink">demo@gym.com</strong></span>
              <span>•</span>
              <span>Member: <strong className="font-mono text-ink">rahul@demo.com</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. INSTITUTIONAL FOOTER */}
      <footer className="w-full bg-surface-alt py-8">
        <div className="max-w-[1360px] mx-auto px-4 md:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-base text-primary">FitConnect</span>
            <span className="text-xs text-ink-soft">
              © 2025 FitConnect India. Built for professional fitness facilities.
            </span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-5 text-xs font-semibold text-ink-soft">
            <a href="#how-it-works" className="hover:text-ink transition-colors">
              How it works
            </a>
            <button
              onClick={() => handleFillDemo("demo@gym.com", "password123", "gymOwner")}
              className="hover:text-ink transition-colors"
            >
              Demo
            </button>
            <button
              onClick={() => setShowPrivacy(true)}
              className="hover:text-ink transition-colors"
            >
              Privacy policy
            </button>
            <button
              onClick={() => setShowTerms(true)}
              className="hover:text-ink transition-colors"
            >
              Terms and conditions
            </button>
            <a
              href="tel:7793813999"
              className="hover:text-primary text-ink font-mono font-bold transition-colors flex items-center gap-1.5"
              title="Click to call direct support"
            >
              <Phone size={13} className="text-primary" />
              <span>7793813999</span>
            </a>
          </nav>
        </div>
      </footer>

      {/* PRIVACY POLICY MODAL */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-line rounded-panel max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h3 className="text-base font-bold text-ink">FitConnect Privacy Policy</h3>
              <button
                onClick={() => setShowPrivacy(false)}
                className="text-ink-soft hover:text-ink p-1"
              >
                <X size={18} />
              </button>
            </div>
            <div className="text-xs text-ink-soft space-y-3 max-h-[60vh] overflow-y-auto pr-2 leading-relaxed">
              <p>
                <strong>1. Data Collection:</strong> FitConnect collects facility profile details, member contact records, health notes, anthropometric measurements, and workout plans strictly for the operational delivery of fitness studio management services.
              </p>
              <p>
                <strong>2. Data Isolation:</strong> Member data is strictly isolated on a per-gym basis. Facility owners have access only to members registered to their facility.
              </p>
              <p>
                <strong>3. Information Security:</strong> All authentication tokens and passwords are encrypted using industry-standard hashing algorithms (bcrypt/JWT).
              </p>
              <p>
                <strong>4. Direct Inquiries:</strong> For data erasure or compliance questions, reach our compliance desk at <strong>+91 7793813999</strong>.
              </p>
            </div>
            <div className="pt-3 border-t border-line flex justify-end">
              <button
                onClick={() => setShowPrivacy(false)}
                className="px-4 py-2 text-xs font-semibold rounded-control bg-primary text-on-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TERMS AND CONDITIONS MODAL */}
      {showTerms && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-line rounded-panel max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h3 className="text-base font-bold text-ink">Terms and Conditions</h3>
              <button
                onClick={() => setShowTerms(false)}
                className="text-ink-soft hover:text-ink p-1"
              >
                <X size={18} />
              </button>
            </div>
            <div className="text-xs text-ink-soft space-y-3 max-h-[60vh] overflow-y-auto pr-2 leading-relaxed">
              <p>
                <strong>1. Software License:</strong> FitConnect grants registered gym owners a non-exclusive license to use the white-label membership and periodization portal for their fitness operations.
              </p>
              <p>
                <strong>2. Medical Disclaimer:</strong> Exercise prescriptions, periodization routines, and diet targets are created by gym trainers and owners. FitConnect provides the software infrastructure and assumes no liability for physical training injuries.
              </p>
              <p>
                <strong>3. Billing &amp; Pricing:</strong> All facility billing amounts are denominated in Indian Rupees (₹).
              </p>
              <p>
                <strong>4. Contact &amp; Support:</strong> Direct operational questions to <strong>+91 7793813999</strong>.
              </p>
            </div>
            <div className="pt-3 border-t border-line flex justify-end">
              <button
                onClick={() => setShowTerms(false)}
                className="px-4 py-2 text-xs font-semibold rounded-control bg-primary text-on-primary"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}