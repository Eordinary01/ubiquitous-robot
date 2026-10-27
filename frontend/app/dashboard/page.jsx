"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users,
  CheckCircle,
  Clock,
  Dumbbell,
  Search,
  Loader2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Save,
  RotateCcw,
} from "lucide-react";
import { deriveBrandTokens, DEFAULT_BRAND_HEX } from "@/lib/themeEngine";

export default function DashboardPage() {
  const router = useRouter();
  const { token, user, gymId, gymBranding, updateGymBrandingState } = useAuth();
  const [members, setMembers] = useState([]);
  const [memberStatus, setMemberStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("members"); // 'members' | 'branding'
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'active' | 'pending_payment'

  // Branding Editor State
  const [brandingForm, setBrandingForm] = useState({
    gymLogo: gymBranding?.gymLogo || "",
    themeColor: gymBranding?.themeColor || "#1E3F20",
  });
  const [savingBranding, setSavingBranding] = useState(false);
  const [brandingMessage, setBrandingMessage] = useState(null);

  useEffect(() => {
    if (gymBranding) {
      setBrandingForm({
        gymLogo: gymBranding.gymLogo || "",
        themeColor: gymBranding.themeColor || "#1E3F20",
      });
    }
  }, [gymBranding]);

  useEffect(() => {
    if (!token || !user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        if (user.role === "gymOwner") {
          const effectiveGymId = gymId || gymBranding?.id;
          if (!effectiveGymId) {
            setError("Gym ID is missing for this account.");
            setLoading(false);
            return;
          }

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/members/gym-members?gymId=${effectiveGymId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!res.ok) throw new Error("Could not retrieve gym members");
          const data = await res.json();
          setMembers(data.data.members || []);
        } else if (user.role === "member") {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members/status`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!res.ok) throw new Error("Could not retrieve membership details");
          const data = await res.json();
          setMemberStatus(data.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user, gymId, gymBranding]);

  // Handle Save Branding
  const handleSaveBranding = async (e) => {
    e.preventDefault();
    const effectiveGymId = gymId || gymBranding?.id;
    if (!effectiveGymId) return;

    setSavingBranding(true);
    setBrandingMessage(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/gyms/${effectiveGymId}/branding`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gymLogo: brandingForm.gymLogo ? brandingForm.gymLogo.trim() : null,
            themeColor: brandingForm.themeColor ? brandingForm.themeColor.trim() : null,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update branding");

      updateGymBrandingState(data.data.gym);
      setBrandingMessage({ text: "Branding updated successfully.", isError: false });
    } catch (err) {
      setBrandingMessage({ text: err.message, isError: true });
    } finally {
      setSavingBranding(false);
    }
  };

  // Handle Reset Branding
  const handleResetBranding = async () => {
    const effectiveGymId = gymId || gymBranding?.id;
    if (!effectiveGymId) return;

    setSavingBranding(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/gyms/${effectiveGymId}/branding`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gymLogo: null,
            themeColor: null,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset branding");

      setBrandingForm({ gymLogo: "", themeColor: "#1E3F20" });
      updateGymBrandingState(data.data.gym);
      setBrandingMessage({ text: "Reset to default Pine (#1E3F20).", isError: false });
    } catch (err) {
      setBrandingMessage({ text: err.message, isError: true });
    } finally {
      setSavingBranding(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center p-8 text-ink-soft">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2.5 text-sm">Loading dashboard...</span>
      </div>
    );
  }

  // --- MEMBER PORTAL VIEW ---
  if (user?.role === "member") {
    const hasWorkout =
      memberStatus?.exercisePlan &&
      Object.keys(memberStatus.exercisePlan).some(
        (day) => memberStatus.exercisePlan[day]?.exercises?.length > 0
      );

    const hasDiet = memberStatus?.dietPlan && memberStatus.dietPlan.length > 0;
    const measurements = memberStatus?.measurements || {};

    return (
      <div className="w-full min-h-[calc(100vh-64px)] bg-background py-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-[960px] mx-auto flex flex-col gap-6">
          {/* Top Member Card */}
          <div className="bg-surface border border-line rounded-panel p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-semibold text-ink tracking-tight">
                  {memberStatus?.member?.name || user?.name}
                </h1>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-[2px] bg-status-success-soft text-status-success-text border border-status-success/30 font-semibold uppercase">
                  {memberStatus?.status || "Active"}
                </span>
              </div>
              <p className="font-mono text-[12px] text-ink-soft mt-1">
                Facility: <strong className="text-ink">{memberStatus?.gymName || "FitConnect Gym"}</strong>
              </p>
            </div>

            {memberStatus?.planName && (
              <div className="text-right sm:text-right">
                <span className="text-[11px] uppercase font-semibold text-ink-faint block">
                  Enrolled Plan
                </span>
                <span className="font-semibold text-sm text-ink">{memberStatus.planName}</span>
                {memberStatus.endDate && (
                  <span className="block font-mono text-[11px] text-ink-soft">
                    Valid thru: {new Date(memberStatus.endDate).toLocaleDateString("en-GB")}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Today's Workout Routine */}
          <div className="bg-surface border border-line rounded-panel overflow-hidden">
            <div className="px-5 py-3 bg-surface-alt border-b border-line flex items-center justify-between">
              <span className="text-sm font-semibold text-ink">Today&apos;s Workout Routine</span>
              <span className="text-[11px] font-mono text-ink-faint">ASSIGNED SPLIT</span>
            </div>

            {!hasWorkout ? (
              <div className="p-8 text-center text-[13px] text-ink-soft">
                Your gym has not added a workout plan yet. Check back after your trainer configures your routine.
              </div>
            ) : (
              <div className="divide-y divide-line">
                {Object.keys(memberStatus.exercisePlan)
                  .filter((day) => memberStatus.exercisePlan[day]?.exercises?.length > 0)
                  .slice(0, 1)
                  .map((day) => {
                    const dayObj = memberStatus.exercisePlan[day];
                    return (
                      <div key={day} className="p-5">
                        <div className="flex items-center justify-between pb-2 mb-3">
                          <span className="font-semibold text-sm text-primary-ink">
                            {day} Split ({dayObj.notes || "Core Workout"})
                          </span>
                          <span className="font-mono text-[11px] text-ink-faint">
                            Duration: {dayObj.duration || 60} mins
                          </span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-surface-alt/70 border-b border-line">
                                <th className="py-2 px-3 text-[11px] font-semibold uppercase text-ink-faint">
                                  Exercise
                                </th>
                                <th className="py-2 px-3 text-[11px] font-semibold uppercase text-ink-faint">
                                  Muscle
                                </th>
                                <th className="py-2 px-3 text-[11px] font-semibold uppercase text-ink-faint text-right">
                                  Sets
                                </th>
                                <th className="py-2 px-3 text-[11px] font-semibold uppercase text-ink-faint text-right">
                                  Reps
                                </th>
                                <th className="py-2 px-3 text-[11px] font-semibold uppercase text-ink-faint text-right">
                                  Weight
                                </th>
                                <th className="py-2 px-3 text-[11px] font-semibold uppercase text-ink-faint text-right">
                                  Rest
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-line font-mono text-[13px]">
                              {dayObj.exercises.map((ex, i) => (
                                <tr key={i}>
                                  <td className="py-2.5 px-3 font-sans font-medium text-ink">
                                    {ex.name}
                                  </td>
                                  <td className="py-2.5 px-3 text-ink-soft text-[11px]">
                                    {ex.muscleGroup}
                                  </td>
                                  <td className="py-2.5 px-3 text-right text-ink">{ex.sets}</td>
                                  <td className="py-2.5 px-3 text-right text-ink">{ex.reps}</td>
                                  <td className="py-2.5 px-3 text-right text-ink">
                                    {ex.weight ? `${ex.weight} kg` : "BW"}
                                  </td>
                                  <td className="py-2.5 px-3 text-right text-ink-soft">
                                    {ex.restBetweenSets ? `${ex.restBetweenSets}s` : "60s"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Daily Diet Targets */}
          <div className="bg-surface border border-line rounded-panel overflow-hidden">
            <div className="px-5 py-3 bg-surface-alt border-b border-line flex items-center justify-between">
              <span className="text-sm font-semibold text-ink">Daily Nutrition Targets</span>
              <span className="text-[11px] font-mono text-ink-faint">MACRONUTRIENTS</span>
            </div>

            {!hasDiet ? (
              <div className="p-8 text-center text-[13px] text-ink-soft">
                Your gym has not added a diet plan yet.
              </div>
            ) : (
              <div className="p-5 flex flex-col gap-4">
                {memberStatus.dietPlan.slice(0, 1).map((dPlan, i) => (
                  <div key={i} className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="p-3 bg-surface-alt border border-line rounded-control">
                        <span className="text-[10px] uppercase font-semibold text-ink-faint block">
                          Total Calories
                        </span>
                        <span className="font-mono text-xl font-semibold text-ink">
                          {dPlan.totalCalories || 2200}
                        </span>
                        <span className="font-mono text-[11px] text-ink-soft"> kcal/day</span>
                      </div>
                      <div className="p-3 bg-surface-alt border border-line rounded-control">
                        <span className="text-[10px] uppercase font-semibold text-ink-faint block">
                          Protein
                        </span>
                        <span className="font-mono text-xl font-semibold text-primary-ink">
                          {dPlan.totalProteins || 150}
                        </span>
                        <span className="font-mono text-[11px] text-ink-soft"> grams</span>
                      </div>
                      <div className="p-3 bg-surface-alt border border-line rounded-control">
                        <span className="text-[10px] uppercase font-semibold text-ink-faint block">
                          Carbs
                        </span>
                        <span className="font-mono text-xl font-semibold text-ink">
                          {dPlan.totalCarbs || 220}
                        </span>
                        <span className="font-mono text-[11px] text-ink-soft"> grams</span>
                      </div>
                      <div className="p-3 bg-surface-alt border border-line rounded-control">
                        <span className="text-[10px] uppercase font-semibold text-ink-faint block">
                          Fat
                        </span>
                        <span className="font-mono text-xl font-semibold text-ink">
                          {dPlan.totalFats || 60}
                        </span>
                        <span className="font-mono text-[11px] text-ink-soft"> grams</span>
                      </div>
                    </div>

                    {dPlan.meals && dPlan.meals.length > 0 && (
                      <div className="border border-line rounded-control divide-y divide-line font-mono text-[12px]">
                        {dPlan.meals.map((meal, mi) => (
                          <div key={mi} className="p-3 bg-surface-alt/40 flex justify-between items-center">
                            <div>
                              <span className="text-[12px] font-semibold text-ink font-sans">
                                {meal.type} ({meal.time || "Scheduled"})
                              </span>
                              <span className="text-ink-soft block font-sans text-[11px]">
                                {meal.items?.map((it) => `${it.name} (${it.quantity || "1 serving"})`).join(", ")}
                              </span>
                            </div>
                            <span className="font-mono text-ink text-[12px]">
                              {meal.items?.reduce((acc, it) => acc + (it.calories || 0), 0) || 400} kcal
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Biometrics Tile */}
          <div className="bg-surface border border-line rounded-panel p-5 flex flex-col gap-3">
            <span className="text-sm font-semibold text-ink">Body Metrics</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-sm">
              <div className="p-2.5 bg-surface-alt border border-line rounded-control">
                <span className="text-[10px] uppercase font-semibold text-ink-faint block">Weight</span>
                <span className="text-base font-semibold text-ink">
                  {measurements.weight ? `${measurements.weight} kg` : "N/A"}
                </span>
              </div>
              <div className="p-2.5 bg-surface-alt border border-line rounded-control">
                <span className="text-[10px] uppercase font-semibold text-ink-faint block">Height</span>
                <span className="text-base font-semibold text-ink">
                  {measurements.height ? `${measurements.height} cm` : "N/A"}
                </span>
              </div>
              <div className="p-2.5 bg-surface-alt border border-line rounded-control">
                <span className="text-[10px] uppercase font-semibold text-ink-faint block">BMI</span>
                <span className="text-base font-semibold text-ink">
                  {measurements.bmi || (measurements.weight && measurements.height ? ((measurements.weight / (measurements.height / 100) ** 2).toFixed(1)) : "N/A")}
                </span>
              </div>
              <div className="p-2.5 bg-surface-alt border border-line rounded-control">
                <span className="text-[10px] uppercase font-semibold text-ink-faint block">Body Fat</span>
                <span className="text-base font-semibold text-ink">
                  {measurements.bodyFatPercentage ? `${measurements.bodyFatPercentage}%` : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- GYM OWNER WORKSPACE VIEW ---
  const activeMembersCount = members.filter((m) => m.status === "active").length;
  const pendingPaymentsCount = members.filter((m) => m.paymentStatus === "pending").length;

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.memberEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter === "active") return m.status === "active";
    if (statusFilter === "pending_payment") return m.paymentStatus === "pending";
    return true;
  });

  const previewTokens = deriveBrandTokens(brandingForm.themeColor || DEFAULT_BRAND_HEX);

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-background py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-6">
        {/* Header with Title and Tab Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
              Facility Console
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-ink mt-0.5">
              {gymBranding?.name || "Iron Paradise Gym"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/request"
              className="h-9 px-3.5 bg-surface hover:bg-surface-alt border border-line text-ink text-[12px] font-semibold rounded-control flex items-center gap-1.5 transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-status-warning-text" />
              <span>Review Requests</span>
            </Link>
          </div>
        </div>

        {/* Metric Stat Tiles (Clickable Navigation & Filtering) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            onClick={() => {
              setActiveTab("members");
              setStatusFilter("all");
            }}
            className={`bg-surface border rounded-panel p-4 flex flex-col justify-between cursor-pointer transition-all hover:border-primary/50 shadow-xs ${
              activeTab === "members" && statusFilter === "all"
                ? "border-primary ring-1 ring-primary/20"
                : "border-line"
            }`}
            title="Click to view all enrolled members"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase text-ink-faint">Total Enrolled</span>
              {activeTab === "members" && statusFilter === "all" && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </div>
            <span className="font-mono text-2xl font-semibold text-ink mt-2">
              {members.length}
            </span>
            <span className="text-[11px] text-ink-soft mt-1">Verified members (All)</span>
          </div>

          <div
            onClick={() => {
              setActiveTab("members");
              setStatusFilter("active");
            }}
            className={`bg-surface border rounded-panel p-4 flex flex-col justify-between cursor-pointer transition-all hover:border-status-success/50 shadow-xs ${
              activeTab === "members" && statusFilter === "active"
                ? "border-status-success ring-1 ring-status-success/20"
                : "border-line"
            }`}
            title="Click to filter active members"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase text-ink-faint">Active Members</span>
              {activeTab === "members" && statusFilter === "active" && (
                <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
              )}
            </div>
            <span className="font-mono text-2xl font-semibold text-status-success-text mt-2">
              {activeMembersCount}
            </span>
            <span className="text-[11px] text-ink-soft mt-1">Filter active status</span>
          </div>

          <div
            onClick={() => {
              setActiveTab("members");
              setStatusFilter("pending_payment");
            }}
            className={`bg-surface border rounded-panel p-4 flex flex-col justify-between cursor-pointer transition-all hover:border-status-warning/50 shadow-xs ${
              activeTab === "members" && statusFilter === "pending_payment"
                ? "border-status-warning ring-1 ring-status-warning/20"
                : "border-line"
            }`}
            title="Click to filter pending payments"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase text-ink-faint">Pending Payments</span>
              {activeTab === "members" && statusFilter === "pending_payment" && (
                <span className="w-1.5 h-1.5 rounded-full bg-status-warning-text" />
              )}
            </div>
            <span className="font-mono text-2xl font-semibold text-status-warning-text mt-2">
              {pendingPaymentsCount}
            </span>
            <span className="text-[11px] text-ink-soft mt-1">Filter pending fees</span>
          </div>

          <div
            onClick={() => setActiveTab("branding")}
            className={`bg-surface border rounded-panel p-4 flex flex-col justify-between cursor-pointer transition-all hover:border-primary/50 shadow-xs ${
              activeTab === "branding"
                ? "border-primary ring-1 ring-primary/20"
                : "border-line"
            }`}
            title="Click to customize White-Label Branding"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase text-ink-faint">Brand Theme</span>
              {activeTab === "branding" && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </div>
            <span className="font-mono text-sm font-semibold text-ink mt-2 uppercase flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full border border-black/10 inline-block"
                style={{ backgroundColor: gymBranding?.themeColor || "#1E3F20" }}
              />
              {gymBranding?.themeColor || "#1E3F20"}
            </span>
            <span className="text-[11px] text-primary font-medium mt-1">Edit custom colors →</span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-line gap-2 text-sm font-medium">
          <button
            onClick={() => setActiveTab("members")}
            className={`pb-2.5 px-3 border-b-2 font-semibold transition-colors ${
              activeTab === "members"
                ? "border-primary text-primary-ink"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            Members Directory
          </button>
          <button
            onClick={() => setActiveTab("branding")}
            className={`pb-2.5 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === "branding"
                ? "border-primary text-primary-ink"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>White-Label Branding</span>
          </button>
        </div>

        {/* TAB 1: MEMBERS TABLE */}
        {activeTab === "members" && (
          <div className="w-full bg-surface border border-line rounded-panel overflow-hidden flex flex-col">
            <div className="p-4 bg-surface-alt border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-ink-faint absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filter by name or email..."
                    className="w-full h-9 pl-9 pr-3 bg-surface border border-line rounded-control text-sm text-ink placeholder:text-ink-faint focus:border-primary-ink focus:outline-none"
                  />
                </div>
                {statusFilter !== "all" && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface border border-line rounded-control text-xs font-mono text-ink">
                    <span>Filter: {statusFilter.replace("_", " ")}</span>
                    <button
                      type="button"
                      onClick={() => setStatusFilter("all")}
                      className="text-ink-soft hover:text-ink ml-1 font-bold"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              <span className="font-mono text-[12px] text-ink-soft">
                Showing {filteredMembers.length} of {members.length} members
              </span>
            </div>

            {filteredMembers.length === 0 ? (
              <div className="p-12 text-center text-ink-soft flex flex-col items-center gap-2">
                <Users className="w-8 h-8 text-ink-faint mb-1" />
                <span className="font-semibold text-ink">No members found</span>
                <span className="text-[13px] text-ink-faint">
                  {statusFilter !== "all"
                    ? "No members match the active filter criteria."
                    : "Approve applicants in the Join Requests queue to provision members."}
                </span>
                {statusFilter !== "all" && (
                  <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className="mt-2 px-3 py-1 text-xs font-semibold rounded-control border border-line bg-surface text-ink hover:bg-surface-alt"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-alt/70 border-b border-line">
                      <th className="py-2.5 px-4 text-[11px] font-semibold uppercase text-ink-faint">
                        Member
                      </th>
                      <th className="py-2.5 px-4 text-[11px] font-semibold uppercase text-ink-faint">
                        Enrolled Plan
                      </th>
                      <th className="py-2.5 px-4 text-[11px] font-semibold uppercase text-ink-faint">
                        Validity Dates
                      </th>
                      <th className="py-2.5 px-4 text-[11px] font-semibold uppercase text-ink-faint">
                        Status
                      </th>
                      <th className="py-2.5 px-4 text-[11px] font-semibold uppercase text-ink-faint text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line text-sm">
                    {filteredMembers.map((m) => (
                      <tr
                        key={m._id}
                        onClick={() => router.push(`/dashboard/${m.joinRequestId || m._id}`)}
                        className="hover:bg-primary/5 cursor-pointer transition-colors"
                        title="Click to view & edit member plan"
                      >
                        <td className="py-3 px-4">
                          <div className="font-semibold text-ink">{m.memberName}</div>
                          <div className="font-mono text-[12px] text-ink-soft">{m.memberEmail}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-[13px]">
                          <span className="font-sans font-medium text-ink">
                            {m.membershipPlanName || "Standard Plan"}
                          </span>
                          <span className="block text-[11px] text-ink-soft">
                            {m.membershipDuration} • ₹{m.membershipPrice || 50}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[12px] text-ink-soft">
                          {m.membershipStartDate || "Recent"} → {m.membershipEndDate || "Ongoing"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[11px] font-mono px-2 py-0.5 rounded-[2px] font-semibold uppercase border ${
                              m.status === "active"
                                ? "bg-status-success-soft text-status-success-text border-status-success/30"
                                : "bg-status-danger-soft text-status-danger-text border-status-danger/30"
                            }`}
                          >
                            {m.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span
                            className="h-8 px-3 bg-surface hover:bg-surface-alt border border-line text-ink text-[12px] font-medium rounded-control inline-flex items-center gap-1 transition-colors"
                          >
                            <span>Manage Plan</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BRANDING SETTINGS (design.md Section 10) */}
        {activeTab === "branding" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Editor Form */}
            <form
              onSubmit={handleSaveBranding}
              className="lg:col-span-6 bg-surface border border-line rounded-panel p-6 flex flex-col gap-5"
            >
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint block">
                  Configuration
                </span>
                <h2 className="text-lg font-semibold text-ink tracking-tight mt-0.5">
                  Gym Branding Settings
                </h2>
                <p className="text-[13px] text-ink-soft mt-1">
                  Customize your gym logo and primary brand color. The system derives accessible tokens
                  automatically using WCAG relative luminance contrast standards.
                </p>
              </div>

              {brandingMessage && (
                <div
                  className={`p-3 rounded-control border text-[13px] flex items-center gap-2 ${
                    brandingMessage.isError
                      ? "bg-status-danger-soft text-status-danger-text border-status-danger/40"
                      : "bg-status-success-soft text-status-success-text border-status-success/40"
                  }`}
                >
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{brandingMessage.text}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-ink">Logo URL (https only)</label>
                <input
                  type="url"
                  value={brandingForm.gymLogo}
                  onChange={(e) =>
                    setBrandingForm({ ...brandingForm, gymLogo: e.target.value })
                  }
                  placeholder="https://example.com/logo.png"
                  className="h-9 px-3 bg-surface border border-line rounded-control text-sm text-ink placeholder:text-ink-faint focus:border-primary-ink focus:outline-none"
                />
                <span className="text-[11px] text-ink-faint">
                  Leave blank to use your gym name text wordmark.
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-ink">
                  Theme Brand Color (Hex)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={brandingForm.themeColor || "#1E3F20"}
                    onChange={(e) =>
                      setBrandingForm({ ...brandingForm, themeColor: e.target.value })
                    }
                    className="w-10 h-9 p-0.5 border border-line rounded-control cursor-pointer bg-surface"
                  />
                  <input
                    type="text"
                    value={brandingForm.themeColor}
                    onChange={(e) =>
                      setBrandingForm({ ...brandingForm, themeColor: e.target.value })
                    }
                    placeholder="#1E3F20"
                    className="h-9 px-3 bg-surface border border-line rounded-control text-sm text-ink font-mono uppercase focus:border-primary-ink focus:outline-none w-36"
                  />
                  <span className="font-mono text-[12px] text-ink-soft">
                    Contrast: {previewTokens.contrastRatio}:1
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-line">
                <button
                  type="submit"
                  disabled={savingBranding}
                  className="h-9 px-4 bg-primary hover:bg-primary-hover disabled:opacity-50 text-on-primary text-[13px] font-semibold rounded-control inline-flex items-center gap-1.5"
                  style={{ border: "var(--fill-border)" }}
                >
                  {savingBranding ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save branding</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetBranding}
                  disabled={savingBranding}
                  className="h-9 px-3 bg-surface hover:bg-surface-alt border border-line text-ink text-[12px] font-medium rounded-control inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Pine (#1E3F20)</span>
                </button>
              </div>
            </form>

            {/* Live Token Preview Card (design.md Section 9 & 10) */}
            <div className="lg:col-span-6 bg-surface border border-line rounded-panel overflow-hidden flex flex-col">
              <div className="px-5 py-3 bg-surface-alt border-b border-line flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                  Live Derived Preview
                </span>
                <span className="font-mono text-[11px] text-primary-ink font-medium">
                  WCAG Verified
                </span>
              </div>

              <div className="p-5 flex flex-col gap-4">
                {/* Mock Header */}
                <div
                  className="p-3 rounded-control border border-line flex items-center justify-between"
                  style={{
                    backgroundColor: `rgb(${previewTokens.primary.r} ${previewTokens.primary.g} ${previewTokens.primary.b})`,
                    color: `rgb(${previewTokens.onPrimary.r} ${previewTokens.onPrimary.g} ${previewTokens.onPrimary.b})`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    {brandingForm.gymLogo ? (
                      <img
                        src={brandingForm.gymLogo}
                        alt="Logo"
                        className="h-6 w-auto object-contain bg-white rounded-[2px]"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-[2px] bg-white text-ink text-[10px] font-bold flex items-center justify-center">
                        GYM
                      </div>
                    )}
                    <span className="font-semibold text-sm">
                      {gymBranding?.name || "Iron Paradise Gym"}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-white text-ink font-semibold">
                    {brandingForm.themeColor}
                  </span>
                </div>

                {/* Primary Button Preview */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="h-9 px-4 font-semibold text-[13px] rounded-control transition-colors"
                    style={{
                      backgroundColor: `rgb(${previewTokens.primary.r} ${previewTokens.primary.g} ${previewTokens.primary.b})`,
                      color: `rgb(${previewTokens.onPrimary.r} ${previewTokens.onPrimary.g} ${previewTokens.onPrimary.b})`,
                      border: previewTokens.needsFillBorder ? "1px solid currentColor" : "none",
                    }}
                  >
                    Primary Button Preview
                  </button>

                  <div
                    className="h-9 px-3 rounded-control text-[12px] font-medium flex items-center"
                    style={{
                      backgroundColor: `rgb(${previewTokens.primarySoft.r} ${previewTokens.primarySoft.g} ${previewTokens.primarySoft.b})`,
                      color: `rgb(${previewTokens.primaryInk.r} ${previewTokens.primaryInk.g} ${previewTokens.primaryInk.b})`,
                    }}
                  >
                    Active Nav / Row Selection
                  </div>
                </div>

                {/* Token Table */}
                <div className="border border-line rounded-control divide-y divide-line font-mono text-[12px]">
                  <div className="p-2.5 flex justify-between bg-surface-alt/50">
                    <span className="text-ink-soft">on-primary contrast:</span>
                    <span className="text-ink font-semibold">
                      {previewTokens.contrastRatio}:1 (Text: {previewTokens.isWhiteText ? "White" : "Dark"})
                    </span>
                  </div>
                  <div className="p-2.5 flex justify-between bg-surface-alt/50">
                    <span className="text-ink-soft">Fill visibility border:</span>
                    <span className="text-ink">
                      {previewTokens.needsFillBorder ? "1px primary-ink required" : "None needed (>= 3:1)"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
