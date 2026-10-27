// frontend/app/gyms/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  MapPin,
  Phone,
  Mail,
  Dumbbell,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  CreditCard,
  UserPlus,
  Building2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function GymDetailsPage() {
  const [gym, setGym] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [applying, setApplying] = useState(false);
  const [toast, setToast] = useState(null);

  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchGymDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/gyms/${params.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch gym details");
        const data = await response.json();
        setGym(data.data?.gym || null);

        // Check if member already applied to this gym
        if (user?.role === "member" && token) {
          try {
            const reqRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/join/requests`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            if (reqRes.ok) {
              const reqs = await reqRes.json();
              if (Array.isArray(reqs)) {
                const found = reqs.some(
                  (r) => (r.gym?._id || r.gym) === params.id
                );
                if (found) setIsApplied(true);
              }
            }
          } catch (e) {
            console.error("Failed to check join status:", e);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchGymDetails();
    }
  }, [params?.id, user, token]);

  const handleApply = async () => {
    if (!user) {
      router.push(`/login?redirect=/gyms/${params.id}`);
      return;
    }
    setApplying(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/join/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gymId: gym._id }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to submit application");

      setIsApplied(true);
      setToast("Application submitted successfully. Status: Applied (Awaiting approval)");
      setTimeout(() => setToast(null), 6000);
    } catch (err) {
      alert(err.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-canvas flex flex-col items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-xs text-muted-ink mt-3 font-mono">Loading facility profile...</span>
      </div>
    );
  }

  if (error || !gym) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-canvas py-12 px-4">
        <div className="max-w-md mx-auto bg-surface border border-border rounded-[6px] p-6 text-center shadow-xs">
          <Building2 size={32} className="mx-auto text-muted-ink mb-3" />
          <h2 className="text-base font-bold text-ink">Facility Not Found</h2>
          <p className="text-xs text-muted-ink mt-1 mb-4">
            {error || "The requested training facility could not be located."}
          </p>
          <Link
            href="/gyms"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[4px] border border-border bg-surface text-ink hover:bg-surface-elevated"
          >
            <ArrowLeft size={14} /> Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-canvas pb-16">
      {/* Institutional Top Breadcrumb Bar */}
      <div className="bg-surface border-b border-border shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/gyms"
              className="p-1.5 rounded-[4px] border border-border text-muted-ink hover:text-ink hover:bg-surface-elevated transition-colors"
            >
              <ArrowLeft size={16} />
            </Link>
            <div className="flex items-center gap-3">
              {gym.gymLogo ? (
                <img
                  src={gym.gymLogo}
                  alt={gym.name}
                  className="w-10 h-10 rounded-[4px] object-cover border border-border"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-[4px] border border-border flex items-center justify-center font-bold font-mono text-base uppercase"
                  style={{
                    backgroundColor: gym.themeColor ? `${gym.themeColor}15` : "var(--color-surface-elevated)",
                    color: gym.themeColor || "var(--color-ink)",
                    borderColor: gym.themeColor ? `${gym.themeColor}30` : "var(--color-border)",
                  }}
                >
                  {gym.name ? gym.name.charAt(0) : "G"}
                </div>
              )}
              <div>
                <h1 className="text-base font-bold text-ink">{gym.name}</h1>
                <div className="flex items-center gap-1 text-xs text-muted-ink">
                  <MapPin size={12} />
                  <span>
                    {gym.address?.street}, {gym.address?.city}, {gym.address?.state} {gym.address?.zipCode}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {user?.role === "member" && (
            isApplied ? (
              <button
                type="button"
                disabled
                className="h-9 px-4 text-xs font-semibold rounded-[4px] border border-border bg-surface-elevated text-muted-ink flex items-center gap-1.5 cursor-default opacity-90 shadow-2xs"
                title="Application submitted"
              >
                <CheckCircle2 size={14} className="text-success" />
                <span>Applied</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApply}
                disabled={applying}
                className="btn-primary flex items-center gap-1.5 shadow-xs"
              >
                {applying ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <UserPlus size={14} /> Submit Join Request
                  </>
                )}
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Toast Feedback */}
        {toast && (
          <div className="p-4 rounded-[6px] border border-success/30 bg-success/10 text-success flex items-center gap-2 text-xs font-medium shadow-xs">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        {/* Segmented Tab Navigation */}
        <div className="flex gap-1 p-1 bg-surface-elevated border border-border rounded-[6px] w-full sm:w-fit shadow-xs">
          {[
            { id: "overview", label: "Overview & Hours" },
            { id: "amenities", label: "Facility Amenities" },
            { id: "membership", label: "Tier Pricing Plans" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-[4px] transition-colors ${
                activeTab === tab.id
                  ? "bg-surface text-ink border border-border shadow-xs"
                  : "text-muted-ink hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface border border-border rounded-[6px] p-5 space-y-4 shadow-xs">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-ink">
                Contact &amp; Administration
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-[4px] bg-canvas border border-border text-muted-ink">
                    <Phone size={14} />
                  </div>
                  <div>
                    <span className="text-muted-ink block">Phone Inquiries</span>
                    <a
                      href={`tel:${gym.contact?.phone || "7793813999"}`}
                      className="font-mono tabular-nums text-ink font-medium hover:text-primary transition-colors"
                    >
                      {gym.contact?.phone || "7793813999"}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-[4px] bg-canvas border border-border text-muted-ink">
                    <Mail size={14} />
                  </div>
                  <div>
                    <span className="text-muted-ink block">Direct Email</span>
                    <span className="font-mono text-ink font-medium">
                      {gym.contact?.email || "contact@gym.com"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-[6px] p-5 space-y-4 shadow-xs">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-ink">
                Operating Schedule
              </h3>
              <div className="flex items-center gap-3 text-xs">
                <div className="p-2 rounded-[4px] bg-canvas border border-border text-muted-ink">
                  <Clock size={14} />
                </div>
                <div>
                  <span className="text-muted-ink block">Standard Facility Hours</span>
                  <span className="font-mono tabular-nums text-ink font-medium">
                    {gym.operatingHours?.openTime || "06:00"} - {gym.operatingHours?.closeTime || "22:00"}
                  </span>
                  <span className="text-[11px] text-muted-ink block mt-0.5">
                    Open: {gym.operatingHours?.daysOpen?.join(", ") || "Mon, Tue, Wed, Thu, Fri, Sat"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Amenities */}
        {activeTab === "amenities" && (
          <div className="bg-surface border border-border rounded-[6px] p-6 space-y-4 shadow-xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-ink">
              Verified Facility Equipment &amp; Amenities
            </h3>
            {gym.amenities && gym.amenities.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {gym.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-canvas border border-border rounded-[4px] flex items-center gap-2.5 text-xs text-ink"
                  >
                    <Dumbbell size={14} className="text-muted-ink shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-ink">No amenities registered for this facility.</p>
            )}
          </div>
        )}

        {/* Tab 3: Membership Plans */}
        {activeTab === "membership" && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-ink">
              Available Enrollment Plans
            </h3>
            {gym.memberShipPlans && gym.memberShipPlans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {gym.memberShipPlans.map((plan, idx) => (
                  <div
                    key={idx}
                    className="bg-surface border border-border rounded-[6px] p-5 flex flex-col justify-between space-y-4 hover:border-border-strong transition-colors shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-ink">{plan.name}</h4>
                        <span className="px-2 py-0.5 text-[10px] font-mono uppercase font-semibold rounded-[4px] bg-canvas border border-border text-muted-ink">
                          {plan.duration}
                        </span>
                      </div>
                      <p className="text-2xl font-bold font-mono tabular-nums text-ink mt-3">
                        ₹{plan.price}
                        <span className="text-xs font-normal text-muted-ink ml-1 font-sans">
                          / {plan.duration?.toLowerCase()}
                        </span>
                      </p>
                    </div>

                    {user?.role === "member" && (
                      isApplied ? (
                        <button
                          type="button"
                          disabled
                          className="w-full text-xs h-8 flex items-center justify-center gap-1.5 rounded-[4px] border border-border bg-surface-elevated text-muted-ink font-semibold opacity-90 cursor-default"
                        >
                          <CheckCircle2 size={13} className="text-success" />
                          <span>Applied</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleApply}
                          disabled={applying}
                          className="btn-primary w-full text-xs h-8 flex items-center justify-center gap-1.5"
                        >
                          Select Plan &amp; Apply
                        </button>
                      )
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-surface border border-border rounded-[6px] p-6 text-center text-xs text-muted-ink">
                No custom pricing tiers configured. Standard membership applied upon request approval.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}