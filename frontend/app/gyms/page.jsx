// frontend/app/gyms/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  MapPin,
  Dumbbell,
  Clock,
  Loader2,
  UserPlus,
  Search,
  ArrowRight,
  Building2,
  CheckCircle2,
  Check,
} from "lucide-react";

export default function GymsPage() {
  const [gyms, setGyms] = useState([]);
  const [appliedGyms, setAppliedGyms] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joiningGym, setJoiningGym] = useState(null);
  const [successToast, setSuccessToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchGymsAndRequests = async () => {
      if (!user) return;
      try {
        const endpoint =
          user.role === "gymOwner"
            ? `${process.env.NEXT_PUBLIC_API_URL}/gyms/owner/${user.id}`
            : `${process.env.NEXT_PUBLIC_API_URL}/gyms`;

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch gym directory");
        const data = await response.json();
        setGyms(data.data?.gyms || []);

        // If logged in as member, fetch existing join requests to reflect "Applied" state
        if (user.role === "member") {
          try {
            const reqRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/join/requests`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            if (reqRes.ok) {
              const reqs = await reqRes.json();
              const map = {};
              if (Array.isArray(reqs)) {
                reqs.forEach((r) => {
                  const gId = r.gym?._id || r.gym;
                  if (gId) map[gId] = r.status || "pending";
                });
              }
              setAppliedGyms(map);
            }
          } catch (reqErr) {
            console.error("Failed to fetch member join requests:", reqErr);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGymsAndRequests();
  }, [user, token]);

  const handleJoinRequest = async (gymId, gymName) => {
    setJoiningGym(gymId);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/join/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gymId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to submit request");

      // Instantly mark as Applied
      setAppliedGyms((prev) => ({
        ...prev,
        [gymId]: "pending",
      }));

      setSuccessToast(`Application submitted to ${gymName}. Status: Applied (Awaiting approval)`);
      setTimeout(() => setSuccessToast(null), 5000);
    } catch (err) {
      alert(err.message);
    } finally {
      setJoiningGym(null);
    }
  };

  const filteredGyms = gyms.filter((g) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      g.name?.toLowerCase().includes(q) ||
      g.address?.city?.toLowerCase().includes(q) ||
      g.address?.street?.toLowerCase().includes(q)
    );
  });

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-canvas py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Block */}
        <div className="border border-border bg-surface rounded-[6px] p-6 mb-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-ink">
                  {user.role === "gymOwner" ? "Managed Facilities" : "Gym Directory"}
                </h1>
                <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded-[4px] bg-canvas border border-border text-muted-ink tabular-nums">
                  {filteredGyms.length} Facilities
                </span>
              </div>
              <p className="text-xs text-muted-ink mt-1">
                {user.role === "gymOwner"
                  ? "View and administer your registered fitness center facilities."
                  : "Explore partner training facilities, inspect equipment suites, and submit membership applications."}
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search size={14} className="absolute left-3 top-3 text-muted-ink" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by name or city..."
                className="w-full h-9 pl-9 pr-3 rounded-[4px] border border-border bg-canvas text-xs text-ink placeholder:text-muted-ink focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              />
            </div>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="mb-6 p-4 rounded-[6px] border border-success/30 bg-success/10 text-success flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-medium">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{successToast}</span>
            </div>
            <button
              onClick={() => setSuccessToast(null)}
              className="text-xs text-success/80 hover:text-success"
            >
              &times;
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-xs text-muted-ink mt-3 font-mono">Loading directory...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-[6px] border border-danger/30 bg-danger/10 text-danger text-xs font-medium">
            Error loading directory: {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredGyms.length === 0 && (
          <div className="p-12 text-center border border-dashed border-border rounded-[6px] bg-surface">
            <Building2 size={32} className="mx-auto text-muted-ink mb-2" />
            <h3 className="text-sm font-semibold text-ink">No facilities found</h3>
            <p className="text-xs text-muted-ink mt-1">Try adjusting your filter search terms.</p>
          </div>
        )}

        {/* Gym Grid */}
        {!loading && !error && filteredGyms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGyms.map((gym) => {
              const openHours = gym.operatingHours
                ? `${gym.operatingHours.openTime || "06:00"} - ${gym.operatingHours.closeTime || "22:00"}`
                : "Open Daily";
              const isApplied = Boolean(appliedGyms[gym._id]);

              return (
                <div
                  key={gym._id}
                  className="bg-surface border border-border rounded-[6px] p-5 flex flex-col justify-between hover:border-border-strong transition-colors shadow-xs"
                >
                  <div>
                    {/* Top Facility Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        {gym.gymLogo ? (
                          <img
                            src={gym.gymLogo}
                            alt={gym.name}
                            className="w-10 h-10 rounded-[4px] object-cover border border-border"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-[4px] border border-border flex items-center justify-center font-bold font-mono text-sm uppercase text-ink"
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
                          <h3 className="text-sm font-bold text-ink leading-tight">{gym.name}</h3>
                          <div className="flex items-center text-xs text-muted-ink mt-0.5">
                            <MapPin size={12} className="mr-1 shrink-0" />
                            <span className="truncate">
                              {gym.address?.city || "City"}, {gym.address?.state || "State"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Operational Details */}
                    <div className="space-y-2 py-3 border-y border-border my-3 text-xs">
                      <div className="flex items-center justify-between text-muted-ink">
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} /> Hours
                        </span>
                        <span className="font-mono tabular-nums text-ink">{openHours}</span>
                      </div>
                      <div className="flex items-center justify-between text-muted-ink">
                        <span className="flex items-center gap-1.5">
                          <Dumbbell size={12} /> Address
                        </span>
                        <span className="text-ink truncate max-w-[180px]">
                          {gym.address?.street || "Street address"}
                        </span>
                      </div>
                    </div>

                    {/* Amenities Badges */}
                    {gym.amenities && gym.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {gym.amenities.slice(0, 3).map((amenity, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-[11px] font-medium bg-canvas border border-border rounded-[4px] text-muted-ink"
                          >
                            {amenity}
                          </span>
                        ))}
                        {gym.amenities.length > 3 && (
                          <span className="px-1.5 py-0.5 text-[11px] font-mono font-medium text-muted-ink">
                            +{gym.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-border flex items-center gap-2">
                    <Link
                      href={`/gyms/${gym._id}`}
                      className="flex-1 h-8 px-3 text-xs font-semibold rounded-[4px] border border-border bg-surface text-ink hover:bg-surface-elevated flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowRight size={12} />
                    </Link>

                    {user.role === "member" && (
                      isApplied ? (
                        <button
                          type="button"
                          disabled
                          className="h-8 px-3 text-xs font-semibold rounded-[4px] border border-border bg-surface-elevated text-muted-ink flex items-center justify-center gap-1.5 cursor-default opacity-90 shadow-2xs"
                          title="Application already submitted"
                        >
                          <CheckCircle2 size={13} className="text-success" />
                          <span>Applied</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleJoinRequest(gym._id, gym.name)}
                          disabled={joiningGym === gym._id}
                          className="btn-primary h-8 px-3 text-xs flex items-center justify-center gap-1.5"
                        >
                          {joiningGym === gym._id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <>
                              <UserPlus size={13} /> Apply
                            </>
                          )}
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
