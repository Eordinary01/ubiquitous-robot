// MembershipPlanForm.js
import { Plus, Trash2, Info } from "lucide-react";
import exerciseCategories from "@/constants/ExerciseCategories";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "./ui/separator";

export const MemberShipPlanForm = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="plan-name">Plan Name</Label>
        <Input
          id="plan-name"
          value={data?.name || ""} // Ensure always a string
          onChange={(e) => updateData({ ...data, name: e.target.value })}
          placeholder="Enter plan name"
          className="focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="plan-duration">Duration</Label>
        <Select
          value={data?.duration}
          onValueChange={(value) => updateData({ ...data, duration: value })}
        >
          <SelectTrigger id="plan-duration" className="w-full">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Monthly">Monthly</SelectItem>
            <SelectItem value="Quarterly">Quarterly</SelectItem>
            <SelectItem value="Annual">Annual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="plan-price">Price</Label>
        <Input
          id="plan-price"
          type="number"
          value={data?.price}
          onChange={(e) => updateData({ ...data, price: e.target.value })}
          placeholder="Enter price"
          className="focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
};

// HealthInfoForm.js
export const HealthInfoForm = ({ data, updateData }) => {
  const handleArrayInput = (field, value) => {
    updateData({
      ...data,
      [field]: value.split(",").map((item) => item.trim()),
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="medical-conditions">Medical Conditions</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Enter conditions separated by commas</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="medical-conditions"
          value={data.medicalConditions?.join(", ") || ""} // Ensure always a string
          onChange={(e) =>
            handleArrayInput("medicalConditions", e.target.value)
          }
          placeholder="Enter medical conditions (comma-separated)"
          className="focus:ring-indigo-500 focus:border-indigo-500"
        />
        {data.medicalConditions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {data.medicalConditions
              .filter((c) => c)
              .map((condition, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                >
                  {condition}
                </Badge>
              ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="allergies">Allergies</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Enter allergies separated by commas</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="allergies"
          value={data.allergies.join(", ")}
          onChange={(e) => handleArrayInput("allergies", e.target.value)}
          placeholder="Enter allergies (comma-separated)"
          className="focus:ring-indigo-500 focus:border-indigo-500"
        />
        {data.allergies.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {data.allergies
              .filter((a) => a)
              .map((allergy, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="bg-red-50 text-red-700 hover:bg-red-100"
                >
                  {allergy}
                </Badge>
              ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="blood-group">Blood Group</Label>
        <Select
          value={data.bloodGroup || ""}
          onValueChange={(value) => updateData({ ...data, bloodGroup: value })}
        >
          <SelectTrigger id="blood-group" className="w-full">
            <SelectValue placeholder="Select blood group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A+">A+</SelectItem>
            <SelectItem value="A-">A-</SelectItem>
            <SelectItem value="B+">B+</SelectItem>
            <SelectItem value="B-">B-</SelectItem>
            <SelectItem value="AB+">AB+</SelectItem>
            <SelectItem value="AB-">AB-</SelectItem>
            <SelectItem value="O+">O+</SelectItem>
            <SelectItem value="O-">O-</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

// MeasurementsForm.js
export const MeasurementsForm = ({ data, updateData }) => {
  const handleNumberInput = (field, value) => {
    updateData({
      ...data,
      [field]: value === "" ? "" : parseFloat(value || 0),
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={data.weight}
            onChange={(e) => handleNumberInput("weight", e.target.value)}
            placeholder="Enter weight"
            className="focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            value={data.height}
            onChange={(e) => handleNumberInput("height", e.target.value)}
            placeholder="Enter height"
            className="focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <Card className="border-indigo-100">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chest">Chest (cm)</Label>
              <Input
                id="chest"
                type="number"
                value={data.chest}
                onChange={(e) => handleNumberInput("chest", e.target.value)}
                placeholder="Chest"
                className="focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="waist">Waist (cm)</Label>
              <Input
                id="waist"
                type="number"
                value={data.waist}
                onChange={(e) => handleNumberInput("waist", e.target.value)}
                placeholder="Waist"
                className="focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hips">Hips (cm)</Label>
              <Input
                id="hips"
                type="number"
                value={data.hips}
                onChange={(e) => handleNumberInput("hips", e.target.value)}
                placeholder="Hips"
                className="focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="biceps">Biceps (cm)</Label>
              <Input
                id="biceps"
                type="number"
                value={data.biceps}
                onChange={(e) => handleNumberInput("biceps", e.target.value)}
                placeholder="Biceps"
                className="focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thighs">Thighs (cm)</Label>
              <Input
                id="thighs"
                type="number"
                value={data.thighs}
                onChange={(e) => handleNumberInput("thighs", e.target.value)}
                placeholder="Thighs"
                className="focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body-fat">Body Fat (%)</Label>
              <Input
                id="body-fat"
                type="number"
                value={data.bodyFatPercentage}
                onChange={(e) =>
                  handleNumberInput("bodyFatPercentage", e.target.value)
                }
                placeholder="Body fat %"
                className="focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ExercisePlanForm.js
export const ExercisePlanForm = ({ data, updateData }) => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    // "Sunday",
  ];

  // Get muscle groups from the exercise categories
  const muscleGroups = Object.keys(exerciseCategories);

  const addExercise = (day) => {
    const updatedData = {
      ...data,
      [day]: {
        ...data[day],
        exercises: [
          ...data[day].exercises,
          {
            name: "",
            muscleGroup: muscleGroups[0], // Use first muscle group as default
            sets: 3,
            reps: 10,
            weight: 0,
            duration: 0,
            restBetweenSets: 60,
            notes: "",
          },
        ],
      },
    };
    updateData(updatedData);
  };

  const getExercisesForMuscleGroup = (muscleGroup) => {
    return exerciseCategories[muscleGroup] || [];
  };

  const removeExercise = (day, exerciseIndex) => {
    const updatedExercises = [...data[day].exercises];
    updatedExercises.splice(exerciseIndex, 1);

    const updatedData = {
      ...data,
      [day]: {
        ...data[day],
        exercises: updatedExercises,
      },
    };
    updateData(updatedData);
  };

  const updateExercise = (day, exerciseIndex, field, value) => {
    const updatedExercises = [...data[day].exercises];

    // If updating muscle group, also reset the exercise name
    if (field === "muscleGroup") {
      updatedExercises[exerciseIndex] = {
        ...updatedExercises[exerciseIndex],
        muscleGroup: value,
        name: "", // Reset name when muscle group changes
      };
    } else {
      updatedExercises[exerciseIndex] = {
        ...updatedExercises[exerciseIndex],
        [field]: value,
      };
    }

    const updatedData = {
      ...data,
      [day]: {
        ...data[day],
        exercises: updatedExercises,
      },
    };
    updateData(updatedData);
  };

  const updateDayDetails = (day, field, value) => {
    const updatedData = {
      ...data,
      [day]: {
        ...data[day],
        [field]: value,
      },
    };
    updateData(updatedData);
  };

  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible className="w-full">
        {days.map((day) => (
          <AccordionItem
            key={day}
            value={day}
            className="border-b border-indigo-100"
          >
            <AccordionTrigger className="py-4 hover:no-underline hover:text-indigo-700">
              <div className="flex justify-between items-center w-full pr-4">
                <span className="font-medium">{day}</span>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-indigo-50 text-indigo-700 mr-2"
                  >
                    {data[day].exercises.length} exercises
                  </Badge>
                  <Badge variant="outline" className="bg-gray-50">
                    {data[day].duration} min
                  </Badge>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 py-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor={`${day}-duration`} className="font-medium">
                    Duration (minutes)
                  </Label>
                  <Input
                    id={`${day}-duration`}
                    type="number"
                    value={data[day].duration}
                    onChange={(e) =>
                      updateDayDetails(
                        day,
                        "duration",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-24 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-6 mt-4">
                  {data[day].exercises.map((exercise, exerciseIndex) => (
                    <Card
                      key={exerciseIndex}
                      className="relative border-l-4 border-l-indigo-400 overflow-visible"
                    >
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Muscle Group</Label>
                              <Select
                                value={exercise.muscleGroup}
                                onValueChange={(value) =>
                                  updateExercise(
                                    day,
                                    exerciseIndex,
                                    "muscleGroup",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select muscle group" />
                                </SelectTrigger>
                                <SelectContent>
                                  {muscleGroups.map((group) => (
                                    <SelectItem key={group} value={group}>
                                      {group}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Exercise</Label>
                              <Select
                                value={exercise.name}
                                onValueChange={(value) =>
                                  updateExercise(
                                    day,
                                    exerciseIndex,
                                    "name",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select exercise" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getExercisesForMuscleGroup(
                                    exercise.muscleGroup
                                  ).map((exerciseName) => (
                                    <SelectItem
                                      key={exerciseName}
                                      value={exerciseName}
                                    >
                                      {exerciseName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <Label
                                htmlFor={`${day}-ex-${exerciseIndex}-sets`}
                              >
                                Sets
                              </Label>
                              <Input
                                id={`${day}-ex-${exerciseIndex}-sets`}
                                type="number"
                                value={exercise.sets}
                                onChange={(e) =>
                                  updateExercise(
                                    day,
                                    exerciseIndex,
                                    "sets",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor={`${day}-ex-${exerciseIndex}-reps`}
                              >
                                Reps
                              </Label>
                              <Input
                                id={`${day}-ex-${exerciseIndex}-reps`}
                                type="number"
                                value={exercise.reps}
                                onChange={(e) =>
                                  updateExercise(
                                    day,
                                    exerciseIndex,
                                    "reps",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor={`${day}-ex-${exerciseIndex}-weight`}
                              >
                                Weight (kg)
                              </Label>
                              <Input
                                id={`${day}-ex-${exerciseIndex}-weight`}
                                type="number"
                                value={exercise.weight}
                                onChange={(e) =>
                                  updateExercise(
                                    day,
                                    exerciseIndex,
                                    "weight",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor={`${day}-ex-${exerciseIndex}-rest`}
                              >
                                Rest (sec)
                              </Label>
                              <Input
                                id={`${day}-ex-${exerciseIndex}-rest`}
                                type="number"
                                value={exercise.restBetweenSets}
                                onChange={(e) =>
                                  updateExercise(
                                    day,
                                    exerciseIndex,
                                    "restBetweenSets",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`${day}-ex-${exerciseIndex}-notes`}>
                              Notes
                            </Label>
                            <Textarea
                              id={`${day}-ex-${exerciseIndex}-notes`}
                              value={exercise.notes}
                              onChange={(e) =>
                                updateExercise(
                                  day,
                                  exerciseIndex,
                                  "notes",
                                  e.target.value
                                )
                              }
                              placeholder="Exercise notes"
                              className="focus:ring-indigo-500 focus:border-indigo-500"
                              rows={2}
                            />
                          </div>

                          <div className="absolute -right-2 -top-2">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removeExercise(day, exerciseIndex)}
                              className="h-8 w-8 rounded-full"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addExercise(day)}
                    className="w-full border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <Plus size={18} className="mr-2" /> Add Exercise
                  </Button>
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor={`${day}-notes`}>Day Notes</Label>
                  <Textarea
                    id={`${day}-notes`}
                    value={data[day].notes}
                    onChange={(e) =>
                      updateDayDetails(day, "notes", e.target.value)
                    }
                    placeholder="Additional notes for this day's workout"
                    className="focus:ring-indigo-500 focus:border-indigo-500"
                    rows={3}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
