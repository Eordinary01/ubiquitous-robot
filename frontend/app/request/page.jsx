"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, AlertCircle, CheckCircle, Clock, X, Check } from "lucide-react";

export default function JoinRequestsPage() {
  const { token, user } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [rejectModalData, setRejectModalData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, isSuccess = true) => {
    setToastMessage({ message, isSuccess });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const fetchRequests = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/join/requests`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch join requests");
      }

      const data = await response.json();
      setRequests(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRequests();
    }
  }, [token]);

  // Quick Approve Handler (design.md Pattern 1)
  const handleQuickApprove = async (joinRequestId, memberName) => {
    if (processingId) return;
    setProcessingId(joinRequestId);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/join/quick-approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ joinRequestId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to quick approve request");
      }

      showToast(`${memberName || "Member"} approved with a starter plan.`);
      // Update local state
      setRequests((prev) =>
        prev.map((r) => (r._id === joinRequestId ? { ...r, status: "approved" } : r))
      );
    } catch (err) {
      showToast(err.message, false);
    } finally {
      setProcessingId(null);
    }
  };

  // Reject Request Handler
  const handleConfirmReject = async () => {
    if (!rejectModalData) return;
    const { requestId, memberName } = rejectModalData;
    setProcessingId(requestId);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/join/process`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId, status: "rejected" }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to reject request");
      }

      showToast(`Request from ${memberName} rejected.`);
      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status: "rejected" } : r))
      );
    } catch (err) {
      showToast(err.message, false);
    } finally {
      setProcessingId(null);
      setRejectModalData(null);
    }
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-background py-8 px-4 md:px-6 lg:px-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-panel border shadow-md flex items-center gap-2.5 text-[13px] bg-surface transition-all ${
            toastMessage.isSuccess
              ? "border-status-success text-status-success-text"
              : "border-status-danger text-status-danger-text"
          }`}
        >
          {toastMessage.isSuccess ? (
            <CheckCircle className="w-4 h-4 text-status-success" />
          ) : (
            <AlertCircle className="w-4 h-4 text-status-danger" />
          )}
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      {rejectModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-[460px] bg-surface border border-line rounded-panel p-6 flex flex-col gap-4 shadow-lg">
            <h2 className="text-lg font-semibold text-ink">Reject Join Request</h2>
            <p className="text-[14px] text-ink-soft leading-relaxed">
              Reject request from <strong className="text-ink">{rejectModalData.memberName}</strong>?
              This will update their application status to rejected.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalData(null)}
                className="h-9 px-4 bg-surface hover:bg-surface-alt border border-line text-ink text-[13px] font-medium rounded-control"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="h-9 px-4 bg-status-danger text-white hover:bg-status-danger-text text-[13px] font-semibold rounded-control"
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
              Operations
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-ink mt-0.5">
              Join Requests Queue
            </h1>
            <p className="text-[13px] text-ink-soft mt-1">
              Review and provision membership plans for pending applicants.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[12px] px-2.5 py-1 rounded-[2px] bg-status-warning-soft text-status-warning-text border border-status-warning/40 font-medium">
              {pendingCount} Pending Review
            </span>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-status-danger-soft border border-status-danger/40 rounded-control flex items-center gap-3 text-[13px] text-status-danger-text">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Requests Table Panel */}
        <div className="w-full bg-surface border border-line rounded-panel overflow-hidden">
          <div className="px-5 py-3 bg-surface-alt border-b border-line flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
              Applicant Queue
            </span>
            <span className="font-mono text-[11px] text-ink-faint">
              Total Requests: {requests.length}
            </span>
          </div>

          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-3 text-ink-soft">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-sm">Loading applications...</span>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-2">
              <Clock className="w-8 h-8 text-ink-faint mb-1" />
              <h3 className="font-semibold text-base text-ink">No requests in queue</h3>
              <p className="text-[13px] text-ink-soft max-w-sm">
                Prospective members will appear here when they submit a join request through your gym profile.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-line">
              {requests.map((req) => {
                const isPending = req.status === "pending";
                const isApproved = req.status === "approved";
                const isRejected = req.status === "rejected";
                const isBusy = processingId === req._id;

                const memberName = req.member?.name || "Applicant";
                const memberEmail = req.member?.email || "";

                return (
                  <div
                    key={req._id}
                    className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-alt/40 transition-colors"
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2.5">
                        <span className="font-semibold text-sm text-ink">{memberName}</span>
                        {isPending && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-status-warning-soft text-status-warning-text border border-status-warning/40 font-semibold uppercase">
                            Pending
                          </span>
                        )}
                        {isApproved && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-status-success-soft text-status-success-text border border-status-success/40 font-semibold uppercase">
                            Approved
                          </span>
                        )}
                        {isRejected && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-status-danger-soft text-status-danger-text border border-status-danger/40 font-semibold uppercase">
                            Rejected
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[12px] text-ink-soft">
                        {memberEmail} • Gym: {req.gym?.name || "Iron Paradise"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto">
                      {isPending ? (
                        <>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleQuickApprove(req._id, memberName)}
                            className="h-8 px-3 bg-primary hover:bg-primary-hover disabled:opacity-50 text-on-primary text-[12px] font-semibold rounded-control flex items-center gap-1.5 transition-colors"
                            style={{ border: "var(--fill-border)" }}
                          >
                            {isBusy ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                            <span>Quick approve</span>
                          </button>

                          <Link
                            href={`/dashboard/${req._id}`}
                            className="h-8 px-3 bg-surface hover:bg-surface-alt border border-line text-ink text-[12px] font-medium rounded-control flex items-center transition-colors"
                          >
                            Set up plan
                          </Link>

                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() =>
                              setRejectModalData({
                                requestId: req._id,
                                memberName,
                              })
                            }
                            className="h-8 px-2.5 text-status-danger-text hover:bg-status-danger-soft/40 disabled:opacity-50 text-[12px] font-medium rounded-control transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          {isApproved && (
                            <Link
                              href="/dashboard"
                              className="text-[12px] font-semibold text-primary-ink hover:underline"
                            >
                              View in members table →
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
