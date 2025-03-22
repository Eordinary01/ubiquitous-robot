"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Check, X } from "lucide-react";
import { Transition } from "@headlessui/react";

export default function Request() {
  const { token, user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const fetchRequests = async () => {
    if (!token || !user?.role) {
      setError("Unauthorized access. Please log in.");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching requests with token:", token);
      const response = await fetch("http://localhost:8010/join/requests", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch requests");
      }

      const data = await response.json();
      console.log("Fetched requests:", data); // Debug log
      setRequests(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.role) {
      fetchRequests();
    }
  }, [token, user]);

  const handleProcessRequest = async (requestId, status) => {
    if (processing) return;

    setProcessing(true);
    try {
      console.log(`Processing request ${requestId} with status: ${status}`);
      const response = await fetch("http://localhost:8010/join/process", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId, status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${status} request`);
      }

      await fetchRequests(); 
    } catch (error) {
      console.error("Error processing request:", error);
      setError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const renderRequestStatus = (request) => {
    console.log("Rendering request status for:", request); // Debug log

    if (user?.role === "gymOwner") {
      if (request.status === "approved" || request.status === "rejected") {
        return (
          <p
            className={`px-4 py-2 text-white rounded-lg shadow-md ${
              request.status === "approved" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {request.status === "approved" ? "Accepted" : "Rejected"}
          </p>
        );
      }
      // Show action buttons for pending requests
      return (
        <div className="flex space-x-2">
          <button
            disabled={processing}
            onClick={() => handleProcessRequest(request._id, "approved")}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition disabled:opacity-50"
          >
            <Check className="w-5 h-5" />
            <span>Accept</span>
          </button>
          <button
            disabled={processing}
            onClick={() => handleProcessRequest(request._id, "rejected")}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
            <span>Decline</span>
          </button>
        </div>
      );
    }

    // Member view
    return (
      <p
        className={`mt-2 text-sm font-medium ${
          request.status === "approved"
            ? "text-green-600"
            : request.status === "rejected"
            ? "text-red-600"
            : "text-yellow-600"
        }`}
      >
        {request.status === "approved"
          ? "Your request has been accepted! You can  access the gym shortly."
          : request.status === "rejected"
          ? "Your request was rejected. Contact the gym owner."
          : "Your request is pending approval."}
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {user?.role === "gymOwner" ? "Join Requests" : "My Join Requests"}
        </h1>
        <p className="text-gray-600">
          {user?.role === "gymOwner"
            ? "Manage gym membership requests efficiently"
            : "Track your gym membership requests"}
        </p>
      </div>

      {loading && (
        <div className="text-indigo-600 font-medium animate-pulse">
          Loading...
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-6">
          {requests.length === 0 ? (
            <div className="text-center text-gray-500">No requests found.</div>
          ) : (
            <div className="space-y-4">
              {requests?.map((request) => (
                <Transition
                  key={request._id}
                  show={true}
                  enter="transition-opacity duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                >
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {request.member?.name}
                      </p>
                      <p className="text-gray-600">{request.member?.email}</p>
                      {request.status === "pending" && (
                        <p className="text-yellow-600 text-sm mt-1">Pending</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {renderRequestStatus(request)}
                    </div>
                  </div>
                </Transition>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
