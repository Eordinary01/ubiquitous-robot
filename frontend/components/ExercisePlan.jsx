'use client'
import { useState } from "react";

const ExercisePlan = () => {
  const [exercisePlan, setExercisePlan] = useState({
    workoutName: "",
    date: "",
    duration: "",
    notes: "",
    exercises: [],
  });

  const exerciseCategories = {
    CHEST: ["Bench Press", "Incline Bench Press", "Push-Ups"],
    BACK: ["Pull-Ups", "Lat Pulldowns", "Deadlifts"],
    SHOULDERS: ["Overhead Press", "Lateral Raises", "Arnold Press"],
    BICEPS: ["Barbell Curls", "Hammer Curls", "Cable Curls"],
    TRICEPS: ["Skull Crushers", "Tricep Dips", "Rope Pushdowns"],
    LEGS: ["Squats", "Leg Press", "Lunges"],
    ABS: ["Crunches", "Leg Raises", "Planks"],
    CARDIO: ["Running", "Cycling", "Jump Rope"],
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExercisePlan((prev) => ({ ...prev, [name]: value }));
  };

  const addExercise = () => {
    setExercisePlan((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        { category: "", name: "", sets: "", reps: "", weight: "" },
      ],
    }));
  };

  const updateExercise = (index, field, value) => {
    const newExercises = [...exercisePlan.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setExercisePlan((prev) => ({ ...prev, exercises: newExercises }));
  };

  const removeExercise = (index) => {
    setExercisePlan((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6 text-indigo-900">
      <h2 className="text-xl font-semibold">Exercise Plan</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.keys(exercisePlan)
          .filter((key) => key !== "exercises")
          .map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1 capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </label>
              <input
                name={key}
                type="text"
                value={exercisePlan[key]}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder={`Enter ${key}`}
              />
            </div>
          ))}
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Exercises</h3>
        <button
          onClick={addExercise}
          className="bg-indigo-600 text-white px-4 py-2 rounded mb-4"
        >
          Add Exercise
        </button>

        {exercisePlan.exercises.map((exercise, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-4 gap-4">
              <select
                value={exercise.category}
                onChange={(e) => updateExercise(index, "category", e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Category</option>
                {Object.keys(exerciseCategories).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={exercise.name}
                onChange={(e) => updateExercise(index, "name", e.target.value)}
                className="w-full p-2 border rounded"
                disabled={!exercise.category}
              >
                <option value="">Select Exercise</option>
                {exercise.category &&
                  exerciseCategories[exercise.category].map((exerciseName) => (
                    <option key={exerciseName} value={exerciseName}>
                      {exerciseName}
                    </option>
                  ))}
              </select>

              <input
                type="number"
                value={exercise.sets}
                onChange={(e) => updateExercise(index, "sets", Number(e.target.value))}
                className="w-full p-2 border rounded"
                placeholder="Sets"
              />

              <input
                type="number"
                value={exercise.reps}
                onChange={(e) => updateExercise(index, "reps", Number(e.target.value))}
                className="w-full p-2 border rounded"
                placeholder="Reps"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExercisePlan;
