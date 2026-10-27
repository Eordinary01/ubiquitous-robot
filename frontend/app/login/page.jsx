"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const { login, error, clearError, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [localError, setLocalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const qEmail = searchParams.get("email");
    if (qEmail) {
      setFormData((prev) => ({
        ...prev,
        email: qEmail,
        password: "password123",
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) clearError();
    if (localError) setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setLocalError("Email and password are required.");
      return;
    }
    await login(formData);
  };

  const fillQuick = (email, pass) => {
    setFormData({ email, password: pass });
    if (error) clearError();
    if (localError) setLocalError("");
  };

  const displayError = localError || error;

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-[460px] bg-surface border border-line rounded-panel overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-line bg-surface-alt">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint block">
            FitConnect Portal
          </span>
          <h1 className="text-xl font-semibold text-ink tracking-tight mt-1">Sign in to your account</h1>
          <p className="text-[13px] text-ink-soft mt-1">
            Access your facility dashboard, workout splits, and nutrition plans.
          </p>
        </div>

        {/* Demo Quick Fills */}
        <div className="px-6 py-3 bg-surface-alt/50 border-b border-line flex flex-wrap items-center justify-between gap-2 text-[12px]">
          <span className="text-ink-faint font-medium">Demo logins:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fillQuick("demo@gym.com", "password123")}
              className="px-2 py-0.5 rounded-[2px] bg-surface border border-line hover:border-ink-soft text-ink font-mono text-[11px] transition-colors"
            >
              Gym Owner
            </button>
            <button
              type="button"
              onClick={() => fillQuick("rahul@demo.com", "password123")}
              className="px-2 py-0.5 rounded-[2px] bg-surface border border-line hover:border-ink-soft text-ink font-mono text-[11px] transition-colors"
            >
              Member
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {displayError && (
            <div className="p-3 bg-status-danger-soft border border-status-danger/40 rounded-control flex items-start gap-2.5 text-[13px] text-status-danger-text">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{displayError}</span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-ink">
              Email address <span className="text-ink-faint text-[12px] font-normal">(required)</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. demo@gym.com"
              className="h-9 px-3 bg-surface border border-line rounded-control text-sm text-ink placeholder:text-ink-faint focus:border-primary-ink focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-medium text-ink">
                Password <span className="text-ink-faint text-[12px] font-normal">(required)</span>
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full h-9 pl-3 pr-10 bg-surface border border-line rounded-control text-sm text-ink placeholder:text-ink-faint focus:border-primary-ink focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2 text-ink-soft hover:text-ink transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-10 mt-2 bg-primary hover:bg-primary-hover disabled:opacity-50 text-on-primary font-semibold text-[13px] rounded-control flex items-center justify-center gap-2 transition-colors"
            style={{ border: "var(--fill-border)" }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface-alt border-t border-line text-center text-[13px] text-ink-soft">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary-ink font-semibold hover:underline">
            Register your gym or profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-ink-soft">Loading login...</div>}>
      <LoginForm />
    </Suspense>
  );
}
