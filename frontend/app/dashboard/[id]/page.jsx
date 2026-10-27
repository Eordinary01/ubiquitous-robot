// frontend/app/dashboard/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Loader2,
  FileText,
  Heart,
  Ruler,
  Dumbbell,
  Utensils,
  ArrowLeft,
} from "lucide-react";
import {
  ExercisePlanForm,
  HealthInfoForm,
  MeasurementsForm,
  MemberShipPlanForm,
  DietPlanForm,
} from "@/components/MembershipPlanForm";

export default function MultiStepMemberFormPage() {
  const { token, user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [memberDataExists, setMemberDataExists] = useState(false);

  const joinRequestId = params?.id;

  const calculateEndDate = (startDate, duration) => {
    const start = new Date(startDate);
    switch (duration) {
      case "Monthly":
        return new Date(start.setMonth(start.getMonth() + 1))
          .toISOString()
          .substring(0, 10);
      case "Quarterly":
        return new Date(start.setMonth(start.getMonth() + 3))
          .toISOString()
          .substring(0, 10);
      case "Annual":
        return new Date(start.setFullYear(start.getFullYear() + 1))
          .toISOString()
          .substring(0, 10);
      default:
        return new Date(start.setMonth(start.getMonth() + 1))
          .toISOString()
          .substring(0, 10);
    }
  };

  const [formData, setFormData] = useState({
    memberShipPlan: {
      name: "",
      duration: "Monthly",
      price: "",
      startDate: new Date().toISOString().substring(0, 10),
      endDate: calculateEndDate(
        new Date().toISOString().substring(0, 10),
        "Monthly"
      ),
    },
    healthInfo: { medicalConditions: [], allergies: [], bloodGroup: "" },
    measurements: {
      weight: "",
      height: "",
      chest: "",
      waist: "",
      hips: "",
      biceps: "",
      thighs: "",
      bodyFatPercentage: "",
      bmi: "",
      date: new Date(),
    },
    exercisePlan: {
      Monday: { exercises: [], notes: "", duration: 0 },
      Tuesday: { exercises: [], notes: "", duration: 0 },
      Wednesday: { exercises: [], notes: "", duration: 0 },
      Thursday: { exercises: [], notes: "", duration: 0 },
      Friday: { exercises: [], notes: "", duration: 0 },
      Saturday: { exercises: [], notes: "", duration: 0 },
    },
    dietPlan: [],
  });

  const updateFormData = (section, data) => {
    setFormData((prev) => {
      if (section === "memberShipPlan") {
        const newStartDate = data.startDate || prev.memberShipPlan.startDate;
        const newDuration = data.duration || prev.memberShipPlan.duration;
        const updatedEndDate = calculateEndDate(newStartDate, newDuration);
        return {
          ...prev,
          [section]: {
            ...prev[section],
            ...data,
            endDate: updatedEndDate,
          },
        };
      }
      return {
        ...prev,
        [section]: data,
      };
    });
  };

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!joinRequestId) {
        setError("Join Request ID is missing");
        setIsInitialized(true);
        return;
      }
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/members/by-join-request/${joinRequestId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          if (data && data.membershipDetails) {
            const details = data.membershipDetails;
            setFormData({
              memberShipPlan: {
                name: details.memberShipPlan?.name || "",
                duration: details.memberShipPlan?.duration || "Monthly",
                price: details.memberShipPlan?.price ?? "",
                startDate:
                  details.memberShipPlan?.startDate?.substring(0, 10) ||
                  new Date().toISOString().substring(0, 10),
                endDate:
                  details.memberShipPlan?.endDate?.substring(0, 10) ||
                  new Date(new Date().setMonth(new Date().getMonth() + 1))
                    .toISOString()
                    .substring(0, 10),
              },
              healthInfo: {
                medicalConditions: details.healthInfo?.medicalConditions || [],
                allergies: details.healthInfo?.allergies || [],
                bloodGroup: details.healthInfo?.bloodGroup || "",
              },
              measurements: {
                weight: details.measurements?.weight ?? "",
                height: details.measurements?.height ?? "",
                chest: details.measurements?.chest ?? "",
                waist: details.measurements?.waist ?? "",
                hips: details.measurements?.hips ?? "",
                biceps: details.measurements?.biceps ?? "",
                thighs: details.measurements?.thighs ?? "",
                bodyFatPercentage: details.measurements?.bodyFatPercentage ?? "",
                bmi: details.measurements?.bmi ?? "",
                date: details.measurements?.date
                  ? new Date(details.measurements.date)
                  : new Date(),
              },
              exercisePlan: {
                Monday: details.exercisePlan?.Monday || { exercises: [], notes: "", duration: 0 },
                Tuesday: details.exercisePlan?.Tuesday || { exercises: [], notes: "", duration: 0 },
                Wednesday: details.exercisePlan?.Wednesday || { exercises: [], notes: "", duration: 0 },
                Thursday: details.exercisePlan?.Thursday || { exercises: [], notes: "", duration: 0 },
                Friday: details.exercisePlan?.Friday || { exercises: [], notes: "", duration: 0 },
                Saturday: details.exercisePlan?.Saturday || { exercises: [], notes: "", duration: 0 },
              },
              dietPlan: details.dietPlan || [],
            });
            setMemberDataExists(true);
          } else {
            setMemberDataExists(false);
          }
        } else if (res.status === 404) {
          setMemberDataExists(false);
        } else {
          const errorData = await res.json();
          setError(`Failed to fetch member data: ${errorData.message}`);
        }
      } catch (err) {
        setError("Network error: Unable to fetch member data");
        setMemberDataExists(false);
      } finally {
        setIsInitialized(true);
      }
    };
    fetchMemberData();
  }, [joinRequestId, token]);

  const handleSubmit = async () => {
    if (!joinRequestId) {
      setError("Join Request ID is missing");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const processedExercisePlan = {};
      Object.entries(formData.exercisePlan).forEach(([day, plan]) => {
        processedExercisePlan[day] = {
          exercises: (plan.exercises || []).map((exercise) => ({
            name: exercise.name,
            muscleGroup: exercise.muscleGroup,
            sets: Number(exercise.sets || 3),
            reps: Number(exercise.reps || 10),
            weight: Number(exercise.weight || 0),
            duration: Number(exercise.duration || 0),
            restBetweenSets: Number(exercise.restBetweenSets || 60),
            notes: exercise.notes || "",
            progression: exercise.progression || [],
          })),
          notes: plan.notes || "",
          duration: Number(plan.duration || 0),
        };
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/members/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            joinRequestId,
            membershipDetails: {
              memberShipPlan: {
                ...formData.memberShipPlan,
                price: parseFloat(formData.memberShipPlan.price) || 0,
              },
              healthInfo: formData.healthInfo,
              measurements: formData.measurements,
              exercisePlan: processedExercisePlan,
              dietPlan: formData.dietPlan,
            },
          }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to save details");

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, label: "Membership", icon: FileText },
    { number: 2, label: "Health Info", icon: Heart },
    { number: 3, label: "Measurements", icon: Ruler },
    { number: 4, label: "Workout Routine", icon: Dumbbell },
    { number: 5, label: "Nutrition & Diet", icon: Utensils },
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <MemberShipPlanForm
            data={formData.memberShipPlan}
            updateData={(data) => updateFormData("memberShipPlan", data)}
          />
        );
      case 2:
        return (
          <HealthInfoForm
            data={formData.healthInfo}
            updateData={(data) => updateFormData("healthInfo", data)}
          />
        );
      case 3:
        return (
          <MeasurementsForm
            data={formData.measurements}
            updateData={(data) => updateFormData("measurements", data)}
          />
        );
      case 4:
        return (
          <ExercisePlanForm
            data={formData.exercisePlan}
            updateData={(data) => updateFormData("exercisePlan", data)}
          />
        );
      case 5:
        return (
          <DietPlanForm
            data={formData.dietPlan}
            updateData={(data) => updateFormData("dietPlan", data)}
          />
        );
      default:
        return null;
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-canvas flex flex-col items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-xs text-muted-ink mt-3 font-mono">Loading member record...</span>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-canvas pb-24">
      {/* Institutional Top Bar */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-1.5 rounded-[4px] border border-border text-muted-ink hover:text-ink hover:bg-surface-elevated transition-colors"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-ink">Member Onboarding & Plan Setup</h1>
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase font-semibold rounded-[4px] bg-primary-soft text-primary-ink border border-primary/20">
                  {memberDataExists ? "Active Record" : "New Enrollment"}
                </span>
              </div>
              <p className="text-xs text-muted-ink">Join Request: <span className="font-mono">{joinRequestId}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono tabular-nums text-muted-ink">
              Step {currentStep} of {steps.length}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        {/* Step Progress Stepper */}
        <div className="bg-surface border border-border rounded-[6px] p-2 mb-6 shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1">
            {steps.map((st) => {
              const Icon = st.icon;
              const isPassed = currentStep > st.number;
              const isCurrent = currentStep === st.number;
              return (
                <button
                  key={st.number}
                  type="button"
                  onClick={() => setCurrentStep(st.number)}
                  className={`flex items-center gap-2 px-3 py-2 text-left rounded-[4px] transition-colors ${
                    isCurrent
                      ? "bg-surface-elevated border border-border text-ink font-semibold"
                      : isPassed
                      ? "text-ink hover:bg-surface-elevated/40"
                      : "text-muted-ink hover:text-ink"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-[4px] flex items-center justify-center font-mono text-xs tabular-nums ${
                      isCurrent
                        ? "bg-primary text-on-primary font-bold"
                        : isPassed
                        ? "bg-success/20 text-success font-semibold"
                        : "bg-canvas border border-border text-muted-ink"
                    }`}
                  >
                    {isPassed ? <Check size={12} strokeWidth={3} /> : st.number}
                  </span>
                  <span className="text-xs truncate">{st.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Inline Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-[6px] border border-danger/30 bg-danger/10 text-danger flex items-center gap-3">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-xs font-medium">{error}</p>
          </div>
        )}

        {/* Step Form Body */}
        <div className="bg-surface border border-border rounded-[6px] p-6 shadow-xs">
          {renderStep()}
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-surface/95 backdrop-blur-sm border-t border-border py-3 shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentStep((s) => s - 1)}
            disabled={currentStep === 1 || loading}
            className="px-4 py-2 text-xs font-semibold rounded-[4px] border border-border bg-surface text-ink hover:bg-surface-elevated disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft size={14} /> Previous
          </button>

          <div className="flex items-center gap-3">
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s + 1)}
                disabled={loading}
                className="btn-primary flex items-center gap-1.5"
              >
                Next Step <ChevronRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex items-center gap-1.5"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Check size={14} /> {memberDataExists ? "Update Member Plan" : "Enroll & Finalize"}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
