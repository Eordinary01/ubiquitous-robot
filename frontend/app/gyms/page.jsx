"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Dumbbell, Clock, Loader2, UserPlus } from "lucide-react";
import { Transition } from "@headlessui/react";

export default function GymsPage() {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joiningGym, setJoiningGym] = useState(null);
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchGyms = async () => {
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

        if (!response.ok) throw new Error("Failed to fetch gyms");
        const data = await response.json();
        setGyms(data.data.gyms);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchGyms();
  }, [user, token]);

  const handleJoinRequest = async (gymId) => {
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
      if (!response.ok) throw new Error(data.message);

      alert("Join request sent successfully!");
    } catch (error) {
      alert(error.message);
    }
    setJoiningGym(null);
  };

  if (!user) return null;
  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-purple-600 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-white animate-spin" />
        <div className="text-white text-2xl font-medium">Loading...</div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-600 text-white text-2xl">
        Error: {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-24 px-4 text-center">
        <div className="container mx-auto">
          <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">
            {user.role === "gymOwner"
              ? "Manage Your Gym"
              : "Discover Fitness Centers"}
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-10">
            {user.role === "gymOwner"
              ? "View and Manage Your Fitness Center Details.."
              : "Explore top-rated gyms in your area. Find the perfect fitness environment to achieve your health goals."}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gyms.map((gym) => (
            <Transition
              key={gym._id}
              appear={true}
              show={true}
              enter="transition-opacity duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
            >
              <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-indigo-500">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {gym.name}
                    </h2>
                    <Dumbbell className="text-indigo-600" />
                  </div>

                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="mr-2 text-indigo-500" size={20} />
                    <span>
                      {gym.address.street}, {gym.address.city}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600 mb-4">
                    <Clock className="mr-2 text-indigo-500" size={20} />
                    <span>
                      {gym.operatingHours.openTime} -{" "}
                      {gym.operatingHours.closeTime}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {gym.amenities?.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full text-xs"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/gyms/${gym._id}`}
                    className="w-full block text-center bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {user.role === "gymOwner" ? "Manage Gym" : "View Details"}
                  </Link>
                  {user.role === "member" && (
                    <button
                      onClick={() => handleJoinRequest(gym._id)}
                      disabled={joiningGym === gym._id}
                      className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {joiningGym === gym._id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <UserPlus className="h-5 w-5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </Transition>
          ))}
        </div>
      </div>
    </div>
  );
}
