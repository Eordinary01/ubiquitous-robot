"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  AlertCircle,
  Loader,
  ClipboardList,
  Heart,
  Ruler,
  Dumbbell,
} from "lucide-react";
import {
  ExercisePlanForm,
  HealthInfoForm,
  MeasurementsForm,
  MemberShipPlanForm,
} from "@/components/MembershipPlanForm";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const MultiStepMemberForm = () => {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [memberDataExists, setMemberDataExists] = useState(false);
  const [viewMode, setViewMode] = useState(true);

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
      Sunday: { exercises: [], notes: "", duration: 0 },
    },
  });

  

  // const steps = [
  //   {
  //     id: 1,
  //     name: "Membership Plan",
  //     icon: <ClipboardList className="h-5 w-5" />,
  //   },
  //   { id: 2, name: "Health Info", icon: <Heart className="h-5 w-5" /> },
  //   { id: 3, name: "Measurements", icon: <Ruler className="h-5 w-5" /> },
  //   { id: 4, name: "Exercise Plan", icon: <Dumbbell className="h-5 w-5" /> },
  // ];

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
                price: details.memberShipPlan?.price || "",
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
                weight: details.measurements?.weight || "",
                height: details.measurements?.height || "",
                chest: details.measurements?.chest || "",
                waist: details.measurements?.waist || "",
                hips: details.measurements?.hips || "",
                biceps: details.measurements?.biceps || "",
                thighs: details.measurements?.thighs || "",
                bodyFatPercentage:
                  details.measurements?.bodyFatPercentage || "",
                bmi: details.measurements?.bmi || "",
                date: details.measurements?.date
                  ? new Date(details.measurements.date)
                  : new Date(),
              },
              exercisePlan: {
                Monday: details.exercisePlan?.Monday || {
                  exercises: [],
                  notes: "",
                  duration: 0,
                },
                Tuesday: details.exercisePlan?.Tuesday || {
                  exercises: [],
                  notes: "",
                  duration: 0,
                },
                Wednesday: details.exercisePlan?.Wednesday || {
                  exercises: [],
                  notes: "",
                  duration: 0,
                },
                Thursday: details.exercisePlan?.Thursday || {
                  exercises: [],
                  notes: "",
                  duration: 0,
                },
                Friday: details.exercisePlan?.Friday || {
                  exercises: [],
                  notes: "",
                  duration: 0,
                },
                Saturday: details.exercisePlan?.Saturday || {
                  exercises: [],
                  notes: "",
                  duration: 0,
                },
                Sunday: details.exercisePlan?.Sunday || {
                  exercises: [],
                  notes: "",
                  duration: 0,
                },
              },
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
          exercises: plan.exercises.map((exercise) => ({
            name: exercise.name,
            muscleGroup: exercise.muscleGroup,
            sets: Number(exercise.sets),
            reps: Number(exercise.reps),
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members/add`, {
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
              price: parseFloat(formData.memberShipPlan.price),
            },
            healthInfo: formData.healthInfo,
            measurements: formData.measurements,
            exercisePlan: processedExercisePlan,
          },
        }),
      });

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
      default:
        return null;
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="ml-4 text-gray-600">Loading form...</p>
      </div>
    );
  }

  if (!memberDataExists && viewMode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <p className="text-xl font-semibold text-gray-600 mb-4">
          No details added yet.
        </p>
        <Button
          className="bg-indigo-600 text-white"
          onClick={() => setViewMode(false)}
        >
          Add Details
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-indigo-900">
              Member Registration
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Step {currentStep} of 4
            </CardDescription>
          </CardHeader>
          <Separator />

          {error && (
            <div className="px-6 pt-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          <CardContent>{renderStep()}</CardContent>

          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((s) => s - 1)}
              disabled={currentStep === 1 || loading}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={() => setCurrentStep((s) => s + 1)}
                disabled={loading}
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Complete Registration
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default MultiStepMemberForm;
