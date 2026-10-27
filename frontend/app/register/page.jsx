"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, Loader2, ArrowRight, Check, Eye, EyeOff } from "lucide-react";

const AMENITIES_OPTIONS = [
  "Cardio Equipment",
  "Weight Training",
  "Group Classes",
  "Swimming Pool",
  "Sauna",
  "Locker Rooms",
  "Personal Training",
];

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function RegisterPage() {
  const { register, error, clearError, loading } = useAuth();
  const [role, setRole] = useState("member");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gymDetails: {
      name: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
      },
      contact: {
        phone: "",
        email: "",
      },
      amenities: ["Weight Training", "Cardio Equipment"],
      operatingHours: {
        openTime: "06:00 AM",
        closeTime: "10:00 PM",
        daysOpen: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      },
      memberShipPlans: [
        { name: "Monthly Standard", price: 50, duration: "Monthly" },
        { name: "Quarterly Pro", price: 135, duration: "Quarterly" },
      ],
      gymLogo: "",
      themeColor: "#1E3F20",
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) clearError();
    if (localError) setLocalError("");
  };

  const handleGymChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      gymDetails: {
        ...prev.gymDetails,
        [field]: value,
      },
    }));
  };

  const handleAddressChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      gymDetails: {
        ...prev.gymDetails,
        address: {
          ...prev.gymDetails.address,
          [field]: value,
        },
      },
    }));
  };

  const handleContactChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      gymDetails: {
        ...prev.gymDetails,
        contact: {
          ...prev.gymDetails.contact,
          [field]: value,
        },
      },
    }));
  };

  const toggleAmenity = (amenity) => {
    const current = formData.gymDetails.amenities;
    const updated = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    handleGymChange("amenities", updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setLocalError("Name, email, and password are required.");
      return;
    }

    if (role === "gymOwner") {
      if (!formData.gymDetails.name || !formData.gymDetails.contact.phone) {
        setLocalError("Gym name and contact phone are required.");
        return;
      }
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role,
      ...(role === "gymOwner" && {
        gymDetails: {
          ...formData.gymDetails,
          contact: {
            ...formData.gymDetails.contact,
            email: formData.gymDetails.contact.email || formData.email,
          },
        },
      }),
    };

    await register(payload);
  };

  const displayError = localError || error;

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-[560px] bg-surface border border-line rounded-panel overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-line bg-surface-alt">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint block">
            FitConnect Onboarding
          </span>
          <h1 className="text-xl font-semibold text-ink tracking-tight mt-1">
            Create your account
          </h1>
          <p className="text-[13px] text-ink-soft mt-1">
            Choose your account role to get started with FitConnect.
          </p>

          {/* Role Segmented Switcher */}
          <div className="mt-4 grid grid-cols-2 p-1 bg-surface border border-line rounded-control gap-1">
            <button
              type="button"
              onClick={() => {
                setRole("member");
                setStep(1);
              }}
              className={`py-1.5 text-[12px] font-semibold rounded-[2px] transition-colors ${
                role === "member"
                  ? "bg-primary text-on-primary"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              Fitness Enthusiast (Member)
            </button>
            <button
              type="button"
              onClick={() => setRole("gymOwner")}
              className={`py-1.5 text-[12px] font-semibold rounded-[2px] transition-colors ${
                role === "gymOwner"
                  ? "bg-primary text-on-primary"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              Gym Owner / Manager
            </button>
          </div>
        </div>

        {/* Stepper for Gym Owner */}
        {role === "gymOwner" && (
          <div className="px-6 py-2.5 bg-surface-alt/40 border-b border-line flex items-center justify-between text-[11px] font-mono">
            <span className={step === 1 ? "text-primary-ink font-semibold" : "text-ink-faint"}>
              1. Credentials
            </span>
            <span className="text-line">→</span>
            <span className={step === 2 ? "text-primary-ink font-semibold" : "text-ink-faint"}>
              2. Facility Details
            </span>
            <span className="text-line">→</span>
            <span className={step === 3 ? "text-primary-ink font-semibold" : "text-ink-faint"}>
              3. Branding
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {displayError && (
            <div className="p-3 bg-status-danger-soft border border-status-danger/40 rounded-control flex items-start gap-2.5 text-[13px] text-status-danger-text">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{displayError}</span>
            </div>
          )}

          {/* STEP 1: Basic Credentials (for Member or Gym Owner) */}
          {(role === "member" || step === 1) && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-ink">
                  Full name <span className="text-ink-faint text-[12px] font-normal">(required)</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Parth Sharma"
                  className="h-9 px-3 bg-surface border border-line rounded-control text-sm text-ink placeholder:text-ink-faint focus:border-primary-ink focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-ink">
                  Email address <span className="text-ink-faint text-[12px] font-normal">(required)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. parth@gym.com"
                  className="h-9 px-3 bg-surface border border-line rounded-control text-sm text-ink placeholder:text-ink-faint focus:border-primary-ink focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-ink">
                  Password <span className="text-ink-faint text-[12px] font-normal">(required, min 6 characters)</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleInputChange}
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
            </div>
          )}

          {/* STEP 2: Gym Details (for Gym Owner) */}
          {role === "gymOwner" && step === 2 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-ink">
                  Gym / Studio name <span className="text-ink-faint text-[12px] font-normal">(required)</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.gymDetails.name}
                  onChange={(e) => handleGymChange("name", e.target.value)}
                  placeholder="e.g. Iron Paradise Gym"
                  className="h-9 px-3 bg-surface border border-line rounded-control text-sm text-ink placeholder:text-ink-faint focus:border-primary-ink focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-ink">City</label>
                  <input
                    type="text"
                    value={formData.gymDetails.address.city}
                    onChange={(e) => handleAddressChange("city", e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="h-9 px-3 bg-surface border border-line rounded-control text-sm text-ink placeholder:text-ink-faint focus:border-primary-ink focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-ink">Phone</label>
                  <input
                    type="text"
                    required
                    value={formData.gymDetails.contact.phone}
                    onChange={(e) => handleContactChange("phone", e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="h-9 px-3 bg-surface border border-line rounded-control text-sm text-ink placeholder:text-ink-faint focus:border-primary-ink focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Amenities checkboxes */}
              <div className="flex flex-col gap-1.5 pt-1">
                <label className="text-[13px] font-medium text-ink">Available amenities</label>
                <div className="grid grid-cols-2 gap-2 text-[12px]">
                  {AMENITIES_OPTIONS.map((amenity) => {
                    const isSelected = formData.gymDetails.amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`p-2 rounded-control border text-left flex items-center justify-between transition-colors ${
                          isSelected
                            ? "bg-primary-soft text-primary-ink border-primary-ink/40 font-medium"
                            : "bg-surface border-line text-ink-soft hover:text-ink"
                        }`}
                      >
                        <span>{amenity}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Gym Branding (for Gym Owner) */}
          {role === "gymOwner" && step === 3 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-ink">
                  Gym Logo URL <span className="text-ink-faint text-[12px] font-normal">(optional, https only)</span>
                </label>
                <input
                  type="url"
                  value={formData.gymDetails.gymLogo}
                  onChange={(e) => handleGymChange("gymLogo", e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="h-9 px-3 bg-surface border border-line rounded-control text-sm text-ink placeholder:text-ink-faint focus:border-primary-ink focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-ink">
                  Theme Brand Color <span className="text-ink-faint text-[12px] font-normal">(hex, default #1E3F20)</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.gymDetails.themeColor || "#1E3F20"}
                    onChange={(e) => handleGymChange("themeColor", e.target.value)}
                    className="w-10 h-9 p-0.5 border border-line rounded-control cursor-pointer bg-surface"
                  />
                  <input
                    type="text"
                    value={formData.gymDetails.themeColor || "#1E3F20"}
                    onChange={(e) => handleGymChange("themeColor", e.target.value)}
                    placeholder="#1E3F20"
                    className="h-9 px-3 bg-surface border border-line rounded-control text-sm text-ink font-mono uppercase focus:border-primary-ink focus:outline-none w-32"
                  />
                  <span
                    className="h-9 px-3 text-white text-[12px] font-semibold rounded-control flex items-center justify-center shrink-0"
                    style={{ backgroundColor: formData.gymDetails.themeColor || "#1E3F20" }}
                  >
                    Sample Accent
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            {role === "gymOwner" && step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="h-9 px-4 bg-surface hover:bg-surface-alt border border-line text-ink text-[13px] font-medium rounded-control"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}

            {role === "gymOwner" && step < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && (!formData.name || !formData.email || !formData.password)) {
                    setLocalError("Please fill credentials first.");
                    return;
                  }
                  setLocalError("");
                  setStep(step + 1);
                }}
                className="h-9 px-4 bg-primary hover:bg-primary-hover text-on-primary text-[13px] font-semibold rounded-control inline-flex items-center gap-1.5"
                style={{ border: "var(--fill-border)" }}
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="h-10 px-6 bg-primary hover:bg-primary-hover disabled:opacity-50 text-on-primary text-[13px] font-semibold rounded-control inline-flex items-center gap-2"
                style={{ border: "var(--fill-border)" }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Complete registration</span>
                )}
              </button>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface-alt border-t border-line text-center text-[13px] text-ink-soft">
          Already registered?{" "}
          <Link href="/login" className="text-primary-ink font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}