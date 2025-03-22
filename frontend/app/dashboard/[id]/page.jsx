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
  Dumbbell
} from "lucide-react";
import {
  ExercisePlanForm,
  HealthInfoForm,
  MeasurementsForm,
  MemberShipPlanForm,
} from "@/components/MembershipPlanForm";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const joinRequestId = params?.id;

  // Step configuration for visual elements
  const steps = [
    { id: 1, name: "Membership Plan", icon: <ClipboardList className="h-5 w-5" /> },
    { id: 2, name: "Health Info", icon: <Heart className="h-5 w-5" /> },
    { id: 3, name: "Measurements", icon: <Ruler className="h-5 w-5" /> },
    { id: 4, name: "Exercise Plan", icon: <Dumbbell className="h-5 w-5" /> },
  ];

  // Updated state to match backend schema with exercisePlan as an object
  const [formData, setFormData] = useState({
    memberShipPlan: {
      name: "",
      duration: "Monthly",
      price: "",
    },
    healthInfo: {
      medicalConditions: [],
      allergies: [],
      bloodGroup: "",
    },
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
      Sunday: { exercises: [], notes: "", duration: 0 }
    }
  });

  useEffect(() => {
    if (!joinRequestId) {
      setError("Join Request ID is missing");
      return;
    }
    setIsInitialized(true);
  }, [joinRequestId]);

  const updateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
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

  const handleSubmit = async () => {
    if (!joinRequestId) {
      setError("Join Request ID is missing");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Process exercise plan data to ensure proper number formatting
      const processedExercisePlan = {};
      Object.entries(formData.exercisePlan).forEach(([day, dayPlan]) => {
        processedExercisePlan[day] = {
          exercises: dayPlan.exercises.map(exercise => ({
            name: exercise.name,
            muscleGroup: exercise.muscleGroup,
            sets: Number(exercise.sets),
            reps: Number(exercise.reps),
            weight: Number(exercise.weight || 0),
            duration: Number(exercise.duration || 0),
            restBetweenSets: Number(exercise.restBetweenSets || 60),
            notes: exercise.notes || "",
            progression: []
          })),
          notes: dayPlan.notes || "",
          duration: Number(dayPlan.duration || 0)
        };
      });

      const response = await fetch("http://localhost:8010/members/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          joinRequestId,
          membershipDetails: {
            ...formData.memberShipPlan,
            price: parseFloat(formData.memberShipPlan.price),
            healthInfo: formData.healthInfo,
            measurements: formData.measurements,
            exercisePlan: processedExercisePlan
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update member details");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading registration form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="shadow-lg border-indigo-100">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-indigo-900">Member Registration</CardTitle>
                <CardDescription className="text-gray-500 mt-1">
                  Complete the form to register a new member
                </CardDescription>
              </div>
              <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full font-medium text-sm">
                Step {currentStep} of 4
              </div>
            </div>
          </CardHeader>
          
          <Separator className="mb-6" />
          
          {/* Step indicator */}
          <div className="px-6">
            <div className="mb-2">
              <Progress value={currentStep * 25} className="h-2" />
            </div>
            
            <div className="grid grid-cols-4 gap-2 mb-6">
              {steps.map((step) => (
                <div 
                  key={step.id}
                  className={`flex flex-col items-center p-2 ${
                    step.id === currentStep 
                      ? "text-indigo-700" 
                      : step.id < currentStep 
                        ? "text-indigo-500" 
                        : "text-gray-400"
                  }`}
                >
                  <div className={`rounded-full w-8 h-8 flex items-center justify-center mb-1 ${
                    step.id === currentStep 
                      ? "bg-indigo-100 border-2 border-indigo-500" 
                      : step.id < currentStep 
                        ? "bg-indigo-50 border border-indigo-300" 
                        : "bg-gray-100"
                  }`}>
                    {step.icon}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{step.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {error && (
            <div className="px-6 mb-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          <CardContent>
            {renderStep()}
          </CardContent>

          <CardFooter className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 1 || loading}
              className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {loading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
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