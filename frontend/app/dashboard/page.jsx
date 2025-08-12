"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  User,
  Clipboard,
  Heart,
  Search,
  Bell,
  ChevronDown,
  Users,
  Activity,
} from "lucide-react";
import { Menu, Transition } from "@headlessui/react";

const Dashboard = () => {
  const { token, isLoggedIn, user, gymId } = useAuth();
  const [members, setMembers] = useState([]);
  const [memberStatus, setMemberStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
  if (!isLoggedIn) return;

  const fetchData = async () => {
    try {
      if (user.role === "gymOwner") {
        if (!gymId) {
          setError("Gym ID is missing");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/members/gym-members?gymId=${gymId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch members");
        const data = await response.json();
        setMembers(data.data.members);
      }

      if (user.role === "member") {
        const response = await fetch(`http://localhost:8010/members/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch member status");
        const data = await response.json();
        setMemberStatus(data.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [isLoggedIn, user, gymId, token]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );

  // Member View
  if (user?.role === "member") {
    return (
      <div className="min-h-screen bg-gray-50">
       

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Membership Status Card - This is working */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-indigo-600 mb-6">
                Membership Status
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 p-4 bg-indigo-50 rounded-lg">
                  <Heart className="text-indigo-600" size={24} />
                  <span className="text-lg text-indigo-800">
                    Status:{" "}
                    <span className="font-semibold">
                      {memberStatus?.status}
                    </span>
                  </span>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Gym</p>
                    <p className="font-semibold text-gray-900">
                      {memberStatus?.gymName}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Plan</p>
                    <p className="font-semibold text-gray-900">
                      {memberStatus?.planName}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Valid Until</p>
                    <p className="font-semibold text-gray-900">
                      {memberStatus?.endDate &&
                        new Date(memberStatus.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-indigo-600 mb-6">
                Body Measurements
              </h2>
              {memberStatus?.measurements ? (
                <div className="grid md:grid-cols-3 gap-6">
                  {Object.entries(memberStatus.measurements).map(
                    ([key, value], index) =>
                      key !== "date" && (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-500 mb-2">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </h3>
                          <p className="text-lg font-semibold text-gray-900">
                            {value}
                          </p>
                        </div>
                      )
                  )}
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">
                    Measurements data not available.
                  </p>
                </div>
              )}
            </div>

            {/* Health Information - Modified to always show */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-indigo-600 mb-6">
                Health Information
              </h2>
              {memberStatus?.healthInfo ? (
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Blood Group
                    </h3>
                    <p className="text-lg font-semibold text-gray-900">
                      {memberStatus.healthInfo.bloodGroup}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Medical Conditions
                    </h3>
                    <div className="space-y-1">
                      {memberStatus.healthInfo.medicalConditions.map(
                        (condition, index) => (
                          <p key={index} className="text-gray-900">
                            {condition === "none"
                              ? "No medical conditions"
                              : condition}
                          </p>
                        )
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Allergies
                    </h3>
                    <div className="space-y-1">
                      {memberStatus.healthInfo.allergies.map(
                        (allergy, index) => (
                          <p key={index} className="text-gray-900">
                            {allergy === "none"
                              ? "No known allergies"
                              : allergy}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">
                    Health information not yet provided.
                  </p>
                </div>
              )}
            </div>

            {/* Exercise Plan - Modified to always show */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-indigo-600 mb-6">
                Exercise Plan
              </h2>
              {memberStatus?.exercisePlan &&
              Object.keys(memberStatus.exercisePlan).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(memberStatus.exercisePlan).map(
                    ([day, workout]) => (
                      <div
                        key={day}
                        className="border rounded-lg p-5 bg-gray-50 shadow-sm"
                      >
                        <h3 className="text-lg font-semibold text-indigo-700 mb-3">
                          {day}
                        </h3>
                        <div className="space-y-3">
                          {workout.exercises?.map((exercise, exIndex) => (
                            <div
                              key={exIndex}
                              className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border"
                            >
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {exercise.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Muscle Group: {exercise.muscleGroup}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Weight: {exercise.weight} kg
                                </p>
                              </div>
                              <div className="text-sm text-indigo-600 font-medium">
                                {exercise.sets} Sets x {exercise.reps} Reps
                                <p className="text-xs text-gray-500">
                                  Rest: {exercise.restBetweenSets} sec
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-100 rounded-lg">
                  <p className="text-gray-500">
                    Your trainer hasn't assigned an exercise plan yet.
                  </p>
                </div>
              )}
            </div>

            {/* Diet Plan - Modified to always show */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-indigo-600 mb-6">
                Diet Plan
              </h2>
              {memberStatus?.dietPlan?.length > 0 ? (
                <div className="space-y-4">
                  {memberStatus.dietPlan.map((meal, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-medium text-lg mb-2 capitalize">
                        {meal.type}
                      </h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {meal.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-gray-700">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">
                    Your trainer hasn't assigned a diet plan yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  // Gym Owner View
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Members Overview</h1>
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-50 px-4 py-2 rounded-lg">
              <span className="text-indigo-600 font-medium">
                Total Members: {members.length}
              </span>
            </div>
          </div>
        </div>

        {members.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No members found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div
                key={member._id}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all duration-200 hover:shadow-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {member.member?.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {member.member?.email}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      member?.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {member?.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Plan: {member?.gym}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Join Id: {member?._id}</p>
                </div>
                <button
                  onClick={() => router.push(`/dashboard/${member._id}`)}
                  className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Clipboard size={18} />
                  <span>View Details</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
