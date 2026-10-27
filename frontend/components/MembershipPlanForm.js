// frontend/components/MembershipPlanForm.js
"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Dumbbell,
  Utensils,
  Sparkles,
  ChevronDown,
  Layers,
  Flame,
  Check,
} from "lucide-react";
import exerciseCategories from "@/constants/ExerciseCategories";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// ==========================================
// 1. MEMBERSHIP PLAN FORM
// ==========================================
export const MemberShipPlanForm = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div className="border border-border bg-surface-elevated/40 p-4 rounded-[6px]">
        <h3 className="text-sm font-semibold text-ink">Membership &amp; Billing Terms</h3>
        <p className="text-xs text-muted-ink mt-0.5">
          Define duration, dates, and recurring fee structure for this member in Indian Rupees (₹).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="plan-name" className="text-xs font-semibold uppercase tracking-wider text-muted-ink">
            Plan Name
          </Label>
          <Input
            id="plan-name"
            value={data?.name || ""}
            onChange={(e) => updateData({ ...data, name: e.target.value })}
            placeholder="e.g. Standard Strength Tier"
            className="h-10 rounded-[4px] border-border bg-surface text-ink text-sm focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="plan-duration" className="text-xs font-semibold uppercase tracking-wider text-muted-ink">
            Billing Frequency
          </Label>
          <select
            id="plan-duration"
            value={data?.duration || "Monthly"}
            onChange={(e) => updateData({ ...data, duration: e.target.value })}
            className="w-full h-10 px-3 rounded-[4px] border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="Monthly">Monthly (30 Days)</option>
            <option value="Quarterly">Quarterly (90 Days)</option>
            <option value="Annual">Annual (365 Days)</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="plan-price" className="text-xs font-semibold uppercase tracking-wider text-muted-ink">
            Membership Fee (₹ INR)
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-muted-ink font-mono text-sm">₹</span>
            <Input
              id="plan-price"
              type="number"
              value={data?.price ?? ""}
              onChange={(e) => updateData({ ...data, price: e.target.value })}
              placeholder="1500"
              className="h-10 pl-8 font-mono tabular-nums rounded-[4px] border-border bg-surface text-ink text-sm focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="plan-start" className="text-xs font-semibold uppercase tracking-wider text-muted-ink">
            Effective Start Date
          </Label>
          <Input
            id="plan-start"
            type="date"
            value={data?.startDate ? data.startDate.substring(0, 10) : ""}
            onChange={(e) => updateData({ ...data, startDate: e.target.value })}
            className="h-10 font-mono tabular-nums rounded-[4px] border-border bg-surface text-ink text-sm focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>

      {data?.endDate && (
        <div className="p-3 bg-canvas border border-border rounded-[4px] flex items-center justify-between text-xs">
          <span className="text-muted-ink font-medium">Automatic Expiration / Renewal Date:</span>
          <span className="font-mono font-semibold tabular-nums text-ink">{data.endDate.substring(0, 10)}</span>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. HEALTH INFO FORM
// ==========================================
export const HealthInfoForm = ({ data, updateData }) => {
  const handleArrayInput = (field, value) => {
    updateData({
      ...data,
      [field]: value.split(",").map((item) => item.trim()).filter(Boolean),
    });
  };

  const removeArrayItem = (field, indexToRemove) => {
    const updated = (data[field] || []).filter((_, idx) => idx !== indexToRemove);
    updateData({ ...data, [field]: updated });
  };

  return (
    <div className="space-y-6">
      <div className="border border-border bg-surface-elevated/40 p-4 rounded-[6px]">
        <h3 className="text-sm font-semibold text-ink">Medical &amp; Emergency Baseline</h3>
        <p className="text-xs text-muted-ink mt-0.5">
          Crucial safety information logged for trainer supervision and duty-of-care compliance.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="medical-conditions" className="text-xs font-semibold uppercase tracking-wider text-muted-ink">
              Medical Conditions &amp; Prior Injuries
            </Label>
            <span className="text-[11px] text-muted-ink">Comma separated</span>
          </div>
          <Input
            id="medical-conditions"
            value={data.medicalConditions?.join(", ") || ""}
            onChange={(e) => handleArrayInput("medicalConditions", e.target.value)}
            placeholder="e.g. Hypertension, Lumbar Disc Herniation L4-L5"
            className="h-10 rounded-[4px] border-border bg-surface text-ink text-sm focus-visible:ring-1 focus-visible:ring-primary"
          />
          {data.medicalConditions && data.medicalConditions.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {data.medicalConditions.map((condition, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border border-border bg-surface rounded-[4px] text-ink"
                >
                  {condition}
                  <button
                    type="button"
                    onClick={() => removeArrayItem("medicalConditions", i)}
                    className="text-muted-ink hover:text-danger ml-1"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="allergies" className="text-xs font-semibold uppercase tracking-wider text-muted-ink">
              Known Allergies
            </Label>
            <span className="text-[11px] text-muted-ink">Comma separated</span>
          </div>
          <Input
            id="allergies"
            value={data.allergies?.join(", ") || ""}
            onChange={(e) => handleArrayInput("allergies", e.target.value)}
            placeholder="e.g. Whey Concentrate, Peanuts, Latex"
            className="h-10 rounded-[4px] border-border bg-surface text-ink text-sm focus-visible:ring-1 focus-visible:ring-primary"
          />
          {data.allergies && data.allergies.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {data.allergies.map((allergy, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border border-danger/30 bg-danger/10 rounded-[4px] text-danger"
                >
                  {allergy}
                  <button
                    type="button"
                    onClick={() => removeArrayItem("allergies", i)}
                    className="text-danger hover:opacity-75 ml-1"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="blood-group" className="text-xs font-semibold uppercase tracking-wider text-muted-ink">
            Blood Group
          </Label>
          <select
            id="blood-group"
            value={data.bloodGroup || ""}
            onChange={(e) => updateData({ ...data, bloodGroup: e.target.value })}
            className="w-full md:w-64 h-10 px-3 rounded-[4px] border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono"
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. MEASUREMENTS FORM
// ==========================================
export const MeasurementsForm = ({ data, updateData }) => {
  const handleNumberInput = (field, value) => {
    const num = value === "" ? "" : parseFloat(value);
    const updated = {
      ...data,
      [field]: num,
    };

    const weight = field === "weight" ? num : parseFloat(data.weight);
    const height = field === "height" ? num : parseFloat(data.height);
    if (weight > 0 && height > 0) {
      const heightInMeters = height / 100;
      const bmiVal = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      updated.bmi = parseFloat(bmiVal);
    }

    updateData(updated);
  };

  const getBmiBadge = (bmi) => {
    if (!bmi) return null;
    let label = "Normal";
    let colorClass = "bg-success/10 text-success border-success/30";
    if (bmi < 18.5) {
      label = "Underweight";
      colorClass = "bg-warning/10 text-warning border-warning/30";
    } else if (bmi >= 25 && bmi < 30) {
      label = "Overweight";
      colorClass = "bg-warning/10 text-warning border-warning/30";
    } else if (bmi >= 30) {
      label = "Obese";
      colorClass = "bg-danger/10 text-danger border-danger/30";
    }
    return (
      <span className={`px-2 py-0.5 text-xs font-mono font-semibold rounded-[4px] border ${colorClass}`}>
        BMI {bmi} ({label})
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="border border-border bg-surface-elevated/40 p-4 rounded-[6px] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-ink">Anthropometric Measurements</h3>
          <p className="text-xs text-muted-ink mt-0.5">Track body composition metrics with standard metric units.</p>
        </div>
        {getBmiBadge(data.bmi)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="weight" className="text-xs font-semibold uppercase tracking-wider text-muted-ink">
            Weight (kg)
          </Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            value={data.weight ?? ""}
            onChange={(e) => handleNumberInput("weight", e.target.value)}
            placeholder="78.5"
            className="h-10 font-mono tabular-nums rounded-[4px] border-border bg-surface text-ink text-sm focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="height" className="text-xs font-semibold uppercase tracking-wider text-muted-ink">
            Height (cm)
          </Label>
          <Input
            id="height"
            type="number"
            step="0.5"
            value={data.height ?? ""}
            onChange={(e) => handleNumberInput("height", e.target.value)}
            placeholder="178"
            className="h-10 font-mono tabular-nums rounded-[4px] border-border bg-surface text-ink text-sm focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>

      <div className="border border-border rounded-[6px] p-5 bg-surface space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-ink">Circumference &amp; Composition (cm / %)</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="chest" className="text-xs text-muted-ink">Chest (cm)</Label>
            <Input
              id="chest"
              type="number"
              value={data.chest ?? ""}
              onChange={(e) => handleNumberInput("chest", e.target.value)}
              placeholder="102"
              className="h-9 font-mono tabular-nums rounded-[4px] border-border bg-canvas text-ink text-xs focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="waist" className="text-xs text-muted-ink">Waist (cm)</Label>
            <Input
              id="waist"
              type="number"
              value={data.waist ?? ""}
              onChange={(e) => handleNumberInput("waist", e.target.value)}
              placeholder="84"
              className="h-9 font-mono tabular-nums rounded-[4px] border-border bg-canvas text-ink text-xs focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="hips" className="text-xs text-muted-ink">Hips (cm)</Label>
            <Input
              id="hips"
              type="number"
              value={data.hips ?? ""}
              onChange={(e) => handleNumberInput("hips", e.target.value)}
              placeholder="98"
              className="h-9 font-mono tabular-nums rounded-[4px] border-border bg-canvas text-ink text-xs focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="biceps" className="text-xs text-muted-ink">Biceps (cm)</Label>
            <Input
              id="biceps"
              type="number"
              value={data.biceps ?? ""}
              onChange={(e) => handleNumberInput("biceps", e.target.value)}
              placeholder="38"
              className="h-9 font-mono tabular-nums rounded-[4px] border-border bg-canvas text-ink text-xs focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="thighs" className="text-xs text-muted-ink">Thighs (cm)</Label>
            <Input
              id="thighs"
              type="number"
              value={data.thighs ?? ""}
              onChange={(e) => handleNumberInput("thighs", e.target.value)}
              placeholder="58"
              className="h-9 font-mono tabular-nums rounded-[4px] border-border bg-canvas text-ink text-xs focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="body-fat" className="text-xs text-muted-ink">Body Fat (%)</Label>
            <Input
              id="body-fat"
              type="number"
              step="0.1"
              value={data.bodyFatPercentage ?? ""}
              onChange={(e) => handleNumberInput("bodyFatPercentage", e.target.value)}
              placeholder="15.2"
              className="h-9 font-mono tabular-nums rounded-[4px] border-border bg-canvas text-ink text-xs focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// PRESET WORKOUT ROUTINE TEMPLATES (16 INDUSTRY-STANDARD SPLITS)
// ==========================================
const WORKOUT_PRESETS = {
  ppl: {
    label: "Push-Pull-Legs (PPL) Split",
    icon: "⚡",
    category: "Hypertrophy",
    tag: "Hypertrophy & Strength (6-Day)",
    description: "6-day periodic push/pull/legs frequency dividing movement planes for maximum muscle recovery.",
    plan: {
      Monday: {
        duration: 60,
        notes: "Push A: Focus on progressive overload on compound pressing movements.",
        exercises: [
          { name: "Bench Press", muscleGroup: "CHEST", sets: 4, reps: 8, weight: 70, duration: 0, restBetweenSets: 90, notes: "Warm up with empty bar first." },
          { name: "Incline Bench Press", muscleGroup: "CHEST", sets: 3, reps: 10, weight: 55, duration: 0, restBetweenSets: 75, notes: "Controlled eccentric." },
          { name: "Overhead Press", muscleGroup: "SHOULDERS", sets: 3, reps: 8, weight: 40, duration: 0, restBetweenSets: 90, notes: "Brace core firmly." },
          { name: "Lateral Raises", muscleGroup: "SHOULDERS", sets: 3, reps: 15, weight: 10, duration: 0, restBetweenSets: 60, notes: "Lead with elbows." },
          { name: "Tricep Pushdowns", muscleGroup: "TRICEPS", sets: 3, reps: 12, weight: 25, duration: 0, restBetweenSets: 60, notes: "Full contraction at bottom." },
        ],
      },
      Tuesday: {
        duration: 60,
        notes: "Pull A: Lat width, horizontal thickness, and bicep volume.",
        exercises: [
          { name: "Deadlifts", muscleGroup: "BACK", sets: 3, reps: 5, weight: 100, duration: 0, restBetweenSets: 120, notes: "Maintain neutral spine." },
          { name: "Lat Pulldowns", muscleGroup: "BACK", sets: 4, reps: 10, weight: 50, duration: 0, restBetweenSets: 75, notes: "Drive elbows to ribs." },
          { name: "Barbell Rows", muscleGroup: "BACK", sets: 3, reps: 8, weight: 60, duration: 0, restBetweenSets: 90, notes: "Torso at 45 degree angle." },
          { name: "Face Pulls", muscleGroup: "BACK", sets: 3, reps: 15, weight: 20, duration: 0, restBetweenSets: 60, notes: "Focus on rear delts." },
          { name: "Barbell Curls", muscleGroup: "BICEPS", sets: 3, reps: 10, weight: 25, duration: 0, restBetweenSets: 60, notes: "No swinging." },
          { name: "Hammer Curls", muscleGroup: "BICEPS", sets: 3, reps: 12, weight: 12, duration: 0, restBetweenSets: 60, notes: "Target brachialis." },
        ],
      },
      Wednesday: {
        duration: 55,
        notes: "Legs & Abs A: Quad dominant and core stability.",
        exercises: [
          { name: "Squats", muscleGroup: "LEGS", sets: 4, reps: 8, weight: 80, duration: 0, restBetweenSets: 120, notes: "Break parallel." },
          { name: "Leg Press", muscleGroup: "LEGS", sets: 3, reps: 12, weight: 140, duration: 0, restBetweenSets: 90, notes: "Feet shoulder-width." },
          { name: "Leg Curls", muscleGroup: "LEGS", sets: 3, reps: 12, weight: 40, duration: 0, restBetweenSets: 60, notes: "Hamstring squeeze." },
          { name: "Calf Raises", muscleGroup: "LEGS", sets: 4, reps: 15, weight: 50, duration: 0, restBetweenSets: 45, notes: "Hold peak 2 seconds." },
          { name: "Planks", muscleGroup: "ABS", sets: 3, reps: 60, weight: 0, duration: 60, restBetweenSets: 45, notes: "Hold rigid posture." },
        ],
      },
      Thursday: {
        duration: 60,
        notes: "Push B: Dumbbell isolation and tricep focus.",
        exercises: [
          { name: "Dumbbell Press", muscleGroup: "CHEST", sets: 4, reps: 10, weight: 26, duration: 0, restBetweenSets: 75, notes: "Deep stretch at bottom." },
          { name: "Cable Flyes", muscleGroup: "CHEST", sets: 3, reps: 12, weight: 15, duration: 0, restBetweenSets: 60, notes: "Chest squeeze." },
          { name: "Arnold Press", muscleGroup: "SHOULDERS", sets: 3, reps: 10, weight: 16, duration: 0, restBetweenSets: 75, notes: "Smooth rotational tempo." },
          { name: "Tricep Dips", muscleGroup: "TRICEPS", sets: 3, reps: 10, weight: 0, duration: 0, restBetweenSets: 60, notes: "Keep elbows tucked." },
          { name: "Skull Crushers", muscleGroup: "TRICEPS", sets: 3, reps: 12, weight: 20, duration: 0, restBetweenSets: 60, notes: "Lower slowly to forehead." },
        ],
      },
      Friday: {
        duration: 60,
        notes: "Pull B: Vertical pulling and unilateral rowing.",
        exercises: [
          { name: "Pull-Ups", muscleGroup: "BACK", sets: 4, reps: 8, weight: 0, duration: 0, restBetweenSets: 90, notes: "Full range of motion." },
          { name: "T-Bar Rows", muscleGroup: "BACK", sets: 3, reps: 10, weight: 45, duration: 0, restBetweenSets: 75, notes: "Squeeze mid-back." },
          { name: "Dumbbell Rows", muscleGroup: "BACK", sets: 3, reps: 12, weight: 24, duration: 0, restBetweenSets: 60, notes: "Unilateral control." },
          { name: "Dumbbell Curls", muscleGroup: "BICEPS", sets: 3, reps: 10, weight: 14, duration: 0, restBetweenSets: 60, notes: "Supinate at top." },
          { name: "Preacher Curls", muscleGroup: "BICEPS", sets: 3, reps: 12, weight: 20, duration: 0, restBetweenSets: 60, notes: "Isolate biceps." },
        ],
      },
      Saturday: {
        duration: 55,
        notes: "Legs & Abs B: Posterior chain and hip drive.",
        exercises: [
          { name: "Lunges", muscleGroup: "LEGS", sets: 3, reps: 12, weight: 16, duration: 0, restBetweenSets: 60, notes: "Alternating legs." },
          { name: "Hip Thrusts", muscleGroup: "LEGS", sets: 4, reps: 10, weight: 70, duration: 0, restBetweenSets: 90, notes: "Full glute lockout." },
          { name: "Leg Extensions", muscleGroup: "LEGS", sets: 3, reps: 15, weight: 45, duration: 0, restBetweenSets: 60, notes: "Quad pump finisher." },
          { name: "Hanging Leg Raises", muscleGroup: "ABS", sets: 3, reps: 12, weight: 0, duration: 0, restBetweenSets: 45, notes: "Controlled leg lift." },
          { name: "Russian Twists", muscleGroup: "ABS", sets: 3, reps: 20, weight: 5, duration: 0, restBetweenSets: 45, notes: "Oblique engagement." },
        ],
      },
    },
  },

  arnoldSplit: {
    label: "Arnold Golden Era Split",
    icon: "👑",
    category: "Hypertrophy",
    tag: "Antagonistic Muscle Pairing (6-Day)",
    description: "Classic bodybuilding routine pairing antagonist muscle groups (Chest/Back, Shoulders/Arms) for maximum blood flow and density.",
    plan: {
      Monday: {
        duration: 65,
        notes: "Chest & Back A: Antagonistic push/pull supersets for maximum torso pump.",
        exercises: [
          { name: "Bench Press", muscleGroup: "CHEST", sets: 4, reps: 8, weight: 75, duration: 0, restBetweenSets: 90, notes: "Full stretch at bottom." },
          { name: "Pull-Ups", muscleGroup: "BACK", sets: 4, reps: 8, weight: 0, duration: 0, restBetweenSets: 90, notes: "Wide grip flare." },
          { name: "Incline Bench Press", muscleGroup: "CHEST", sets: 3, reps: 10, weight: 60, duration: 0, restBetweenSets: 75, notes: "Upper chest focus." },
          { name: "Barbell Rows", muscleGroup: "BACK", sets: 3, reps: 10, weight: 65, duration: 0, restBetweenSets: 75, notes: "Squeeze lats tight." },
          { name: "Dumbbell Flyes", muscleGroup: "CHEST", sets: 3, reps: 12, weight: 16, duration: 0, restBetweenSets: 60, notes: "Deep pectoral stretch." },
        ],
      },
      Tuesday: {
        duration: 60,
        notes: "Shoulders & Arms A: Overhead pressing and direct arm demolition.",
        exercises: [
          { name: "Overhead Press", muscleGroup: "SHOULDERS", sets: 4, reps: 8, weight: 45, duration: 0, restBetweenSets: 90, notes: "Strict vertical press." },
          { name: "Lateral Raises", muscleGroup: "SHOULDERS", sets: 4, reps: 15, weight: 10, duration: 0, restBetweenSets: 45, notes: "Strict side delt isolation." },
          { name: "Barbell Curls", muscleGroup: "BICEPS", sets: 4, reps: 10, weight: 30, duration: 0, restBetweenSets: 60, notes: "Strict bicep peak." },
          { name: "Skull Crushers", muscleGroup: "TRICEPS", sets: 4, reps: 10, weight: 25, duration: 0, restBetweenSets: 60, notes: "Lower behind head." },
          { name: "Close-Grip Bench Press", muscleGroup: "TRICEPS", sets: 3, reps: 8, weight: 60, duration: 0, restBetweenSets: 75, notes: "Heavy tricep lockout." },
        ],
      },
      Wednesday: {
        duration: 60,
        notes: "Legs & Abs A: Quad depth and abdominal development.",
        exercises: [
          { name: "Squats", muscleGroup: "LEGS", sets: 4, reps: 8, weight: 85, duration: 0, restBetweenSets: 120, notes: "Hit full depth." },
          { name: "Leg Press", muscleGroup: "LEGS", sets: 3, reps: 12, weight: 150, duration: 0, restBetweenSets: 90, notes: "Feet shoulder-width." },
          { name: "Leg Curls", muscleGroup: "LEGS", sets: 3, reps: 12, weight: 40, duration: 0, restBetweenSets: 60, notes: "Hamstring contraction." },
          { name: "Calf Raises", muscleGroup: "LEGS", sets: 4, reps: 15, weight: 50, duration: 0, restBetweenSets: 45, notes: "2-sec pause at peak." },
          { name: "Hanging Leg Raises", muscleGroup: "ABS", sets: 3, reps: 12, weight: 0, duration: 0, restBetweenSets: 45, notes: "Direct core control." },
        ],
      },
      Thursday: {
        duration: 65,
        notes: "Chest & Back B: Volume dumbbell press and thick vertical lat pulling.",
        exercises: [
          { name: "Dumbbell Press", muscleGroup: "CHEST", sets: 4, reps: 10, weight: 28, duration: 0, restBetweenSets: 75, notes: "Deep pectoral contraction." },
          { name: "Lat Pulldowns", muscleGroup: "BACK", sets: 4, reps: 10, weight: 55, duration: 0, restBetweenSets: 75, notes: "Squeeze scapulae down." },
          { name: "Cable Flyes", muscleGroup: "CHEST", sets: 3, reps: 12, weight: 15, duration: 0, restBetweenSets: 60, notes: "Continuous tension." },
          { name: "T-Bar Rows", muscleGroup: "BACK", sets: 3, reps: 10, weight: 50, duration: 0, restBetweenSets: 75, notes: "Mid-back thickness." },
          { name: "Back Extensions", muscleGroup: "BACK", sets: 3, reps: 15, weight: 10, duration: 0, restBetweenSets: 60, notes: "Lower back support." },
        ],
      },
      Friday: {
        duration: 60,
        notes: "Shoulders & Arms B: 3-head deltoids, hammer curls & dips.",
        exercises: [
          { name: "Arnold Press", muscleGroup: "SHOULDERS", sets: 4, reps: 10, weight: 16, duration: 0, restBetweenSets: 75, notes: "Smooth rotation." },
          { name: "Rear Delt Flyes", muscleGroup: "SHOULDERS", sets: 4, reps: 15, weight: 8, duration: 0, restBetweenSets: 45, notes: "Rear deltoid squeeze." },
          { name: "Preacher Curls", muscleGroup: "BICEPS", sets: 3, reps: 12, weight: 22, duration: 0, restBetweenSets: 60, notes: "Isolated bicep pump." },
          { name: "Hammer Curls", muscleGroup: "BICEPS", sets: 3, reps: 12, weight: 14, duration: 0, restBetweenSets: 60, notes: "Forearms & brachialis." },
          { name: "Tricep Pushdowns", muscleGroup: "TRICEPS", sets: 3, reps: 12, weight: 28, duration: 0, restBetweenSets: 60, notes: "Full lockout." },
          { name: "Tricep Dips", muscleGroup: "TRICEPS", sets: 3, reps: 10, weight: 0, duration: 0, restBetweenSets: 60, notes: "Controlled negative." },
        ],
      },
      Saturday: {
        duration: 55,
        notes: "Legs & Abs B: Posterior chain, lunges & oblique stability.",
        exercises: [
          { name: "Deadlifts", muscleGroup: "BACK", sets: 3, reps: 6, weight: 100, duration: 0, restBetweenSets: 120, notes: "Posterior chain drive." },
          { name: "Lunges", muscleGroup: "LEGS", sets: 3, reps: 12, weight: 16, duration: 0, restBetweenSets: 60, notes: "Walking dumbbell lunges." },
          { name: "Leg Extensions", muscleGroup: "LEGS", sets: 3, reps: 15, weight: 45, duration: 0, restBetweenSets: 60, notes: "Quad pump finisher." },
          { name: "Hip Thrusts", muscleGroup: "LEGS", sets: 3, reps: 10, weight: 70, duration: 0, restBetweenSets: 90, notes: "Glute lockout." },
          { name: "Russian Twists", muscleGroup: "ABS", sets: 3, reps: 20, weight: 5, duration: 0, restBetweenSets: 45, notes: "Oblique strength." },
        ],
      },
    },
  },

  broSplit: {
    label: "Classic Bro-Split (1 Muscle/Day)",
    icon: "💪",
    category: "Hypertrophy",
    tag: "High Volume Isolation (6-Day)",
    description: "Traditional high-volume single-muscle isolation split followed by advanced gym goers.",
    plan: {
      Monday: {
        duration: 55,
        notes: "Chest Day: Heavy compound press and cable isolation.",
        exercises: [
          { name: "Bench Press", muscleGroup: "CHEST", sets: 4, reps: 8, weight: 75, duration: 0, restBetweenSets: 90, notes: "Arch back, retract scapulae." },
          { name: "Incline Bench Press", muscleGroup: "CHEST", sets: 3, reps: 10, weight: 60, duration: 0, restBetweenSets: 75, notes: "Upper chest focus." },
          { name: "Dumbbell Flyes", muscleGroup: "CHEST", sets: 3, reps: 12, weight: 14, duration: 0, restBetweenSets: 60, notes: "Feel pectoral stretch." },
          { name: "Push-Ups", muscleGroup: "CHEST", sets: 3, reps: 15, weight: 0, duration: 0, restBetweenSets: 45, notes: "Finisher burn set." },
        ],
      },
      Tuesday: {
        duration: 60,
        notes: "Back Day: Full vertical and horizontal lats and traps.",
        exercises: [
          { name: "Pull-Ups", muscleGroup: "BACK", sets: 4, reps: 8, weight: 0, duration: 0, restBetweenSets: 90, notes: "Chin above bar." },
          { name: "Barbell Rows", muscleGroup: "BACK", sets: 4, reps: 8, weight: 65, duration: 0, restBetweenSets: 90, notes: "Strict form." },
          { name: "Lat Pulldowns", muscleGroup: "BACK", sets: 3, reps: 12, weight: 55, duration: 0, restBetweenSets: 60, notes: "Slow release." },
          { name: "Back Extensions", muscleGroup: "BACK", sets: 3, reps: 15, weight: 10, duration: 0, restBetweenSets: 60, notes: "Lower back support." },
        ],
      },
      Wednesday: {
        duration: 50,
        notes: "Shoulders & Core Day: 3-head deltoid development.",
        exercises: [
          { name: "Overhead Press", muscleGroup: "SHOULDERS", sets: 4, reps: 8, weight: 45, duration: 0, restBetweenSets: 90, notes: "Keep glutes engaged." },
          { name: "Lateral Raises", muscleGroup: "SHOULDERS", sets: 4, reps: 15, weight: 10, duration: 0, restBetweenSets: 45, notes: "Side delts." },
          { name: "Rear Delt Flyes", muscleGroup: "SHOULDERS", sets: 3, reps: 15, weight: 8, duration: 0, restBetweenSets: 45, notes: "Posterior delts." },
          { name: "Shrugs", muscleGroup: "SHOULDERS", sets: 3, reps: 12, weight: 30, duration: 0, restBetweenSets: 60, notes: "Upper traps." },
          { name: "Crunches", muscleGroup: "ABS", sets: 3, reps: 20, weight: 0, duration: 0, restBetweenSets: 45, notes: "Ab contraction." },
        ],
      },
      Thursday: {
        duration: 60,
        notes: "Legs Day: Quad, hamstring, and calf demolition.",
        exercises: [
          { name: "Squats", muscleGroup: "LEGS", sets: 4, reps: 8, weight: 85, duration: 0, restBetweenSets: 120, notes: "Solid foundation." },
          { name: "Leg Press", muscleGroup: "LEGS", sets: 3, reps: 12, weight: 150, duration: 0, restBetweenSets: 90, notes: "Full depth." },
          { name: "Leg Curls", muscleGroup: "LEGS", sets: 3, reps: 12, weight: 40, duration: 0, restBetweenSets: 60, notes: "Hamstrings." },
          { name: "Leg Extensions", muscleGroup: "LEGS", sets: 3, reps: 15, weight: 45, duration: 0, restBetweenSets: 60, notes: "Quads burn." },
          { name: "Calf Raises", muscleGroup: "LEGS", sets: 4, reps: 15, weight: 60, duration: 0, restBetweenSets: 45, notes: "Peak extension." },
        ],
      },
      Friday: {
        duration: 50,
        notes: "Arms Day (Biceps & Triceps Supersets): Extreme arm pump.",
        exercises: [
          { name: "Barbell Curls", muscleGroup: "BICEPS", sets: 4, reps: 10, weight: 30, duration: 0, restBetweenSets: 60, notes: "Strict bicep work." },
          { name: "Close-Grip Bench Press", muscleGroup: "TRICEPS", sets: 4, reps: 8, weight: 60, duration: 0, restBetweenSets: 75, notes: "Tricep press." },
          { name: "Hammer Curls", muscleGroup: "BICEPS", sets: 3, reps: 12, weight: 14, duration: 0, restBetweenSets: 60, notes: "Brachialis." },
          { name: "Tricep Pushdowns", muscleGroup: "TRICEPS", sets: 3, reps: 12, weight: 28, duration: 0, restBetweenSets: 60, notes: "Lock out." },
          { name: "Preacher Curls", muscleGroup: "BICEPS", sets: 3, reps: 12, weight: 20, duration: 0, restBetweenSets: 60, notes: "Peak isolation." },
        ],
      },
      Saturday: {
        duration: 45,
        notes: "Conditioning & Core: Functional endurance and active recovery.",
        exercises: [
          { name: "Planks", muscleGroup: "ABS", sets: 3, reps: 60, weight: 0, duration: 60, restBetweenSets: 45, notes: "Total core tension." },
          { name: "Mountain Climbers", muscleGroup: "ABS", sets: 3, reps: 30, weight: 0, duration: 30, restBetweenSets: 45, notes: "High heart rate." },
          { name: "Russian Twists", muscleGroup: "ABS", sets: 3, reps: 20, weight: 5, duration: 0, restBetweenSets: 45, notes: "Oblique strength." },
          { name: "Push-Ups", muscleGroup: "CHEST", sets: 3, reps: 20, weight: 0, duration: 0, restBetweenSets: 45, notes: "Conditioning." },
        ],
      },
    },
  },

  synergySplit: {
    label: "Classic Synergy Split",
    icon: "🎯",
    category: "Hypertrophy",
    tag: "Chest/Tri • Back/Bi • Legs/Shoulders",
    description: "The gold-standard commercial gym split pairing prime movers with secondary synergists for intense compound sessions.",
    plan: {
      Monday: {
        duration: 60,
        notes: "Chest & Triceps A: Heavy barbell pressing and tricep exhaustion.",
        exercises: [
          { name: "Bench Press", muscleGroup: "CHEST", sets: 4, reps: 8, weight: 75, duration: 0, restBetweenSets: 90, notes: "Retract scapulae." },
          { name: "Incline Bench Press", muscleGroup: "CHEST", sets: 3, reps: 10, weight: 60, duration: 0, restBetweenSets: 75, notes: "Upper pectoral focus." },
          { name: "Cable Flyes", muscleGroup: "CHEST", sets: 3, reps: 12, weight: 15, duration: 0, restBetweenSets: 60, notes: "Constant tension." },
          { name: "Tricep Pushdowns", muscleGroup: "TRICEPS", sets: 3, reps: 12, weight: 25, duration: 0, restBetweenSets: 60, notes: "Full lockout." },
          { name: "Skull Crushers", muscleGroup: "TRICEPS", sets: 3, reps: 10, weight: 22, duration: 0, restBetweenSets: 60, notes: "Lower slowly to forehead." },
        ],
      },
      Tuesday: {
        duration: 60,
        notes: "Back & Biceps A: Vertical pulling, lat thickness and bicep overload.",
        exercises: [
          { name: "Pull-Ups", muscleGroup: "BACK", sets: 4, reps: 8, weight: 0, duration: 0, restBetweenSets: 90, notes: "Full stretch at bottom." },
          { name: "Lat Pulldowns", muscleGroup: "BACK", sets: 4, reps: 10, weight: 55, duration: 0, restBetweenSets: 75, notes: "Drive elbows down." },
          { name: "Barbell Rows", muscleGroup: "BACK", sets: 3, reps: 8, weight: 65, duration: 0, restBetweenSets: 90, notes: "Torso 45-degree angle." },
          { name: "Barbell Curls", muscleGroup: "BICEPS", sets: 3, reps: 10, weight: 28, duration: 0, restBetweenSets: 60, notes: "Strict form." },
          { name: "Hammer Curls", muscleGroup: "BICEPS", sets: 3, reps: 12, weight: 14, duration: 0, restBetweenSets: 60, notes: "Forearm & brachialis." },
        ],
      },
      Wednesday: {
        duration: 60,
        notes: "Legs & Shoulders A: Heavy squats and overhead military press.",
        exercises: [
          { name: "Squats", muscleGroup: "LEGS", sets: 4, reps: 8, weight: 85, duration: 0, restBetweenSets: 120, notes: "Deep power squats." },
          { name: "Leg Press", muscleGroup: "LEGS", sets: 3, reps: 12, weight: 150, duration: 0, restBetweenSets: 90, notes: "Controlled negative." },
          { name: "Overhead Press", muscleGroup: "SHOULDERS", sets: 4, reps: 8, weight: 45, duration: 0, restBetweenSets: 90, notes: "Brace glutes and abs." },
          { name: "Lateral Raises", muscleGroup: "SHOULDERS", sets: 4, reps: 15, weight: 10, duration: 0, restBetweenSets: 45, notes: "Medial deltoid burn." },
          { name: "Calf Raises", muscleGroup: "LEGS", sets: 4, reps: 15, weight: 50, duration: 0, restBetweenSets: 45, notes: "Full stretch at base." },
        ],
      },
      Thursday: {
        duration: 60,
        notes: "Chest & Triceps B: Dumbbell precision pressing and bodyweight dips.",
        exercises: [
          { name: "Dumbbell Press", muscleGroup: "CHEST", sets: 4, reps: 10, weight: 28, duration: 0, restBetweenSets: 75, notes: "Deep pectoral stretch." },
          { name: "Dumbbell Flyes", muscleGroup: "CHEST", sets: 3, reps: 12, weight: 14, duration: 0, restBetweenSets: 60, notes: "Controlled flyes." },
          { name: "Chest Dips", muscleGroup: "CHEST", sets: 3, reps: 10, weight: 0, duration: 0, restBetweenSets: 60, notes: "Lean slightly forward." },
          { name: "Close-Grip Bench Press", muscleGroup: "TRICEPS", sets: 3, reps: 8, weight: 55, duration: 0, restBetweenSets: 75, notes: "Heavy tricep push." },
          { name: "Tricep Dips", muscleGroup: "TRICEPS", sets: 3, reps: 12, weight: 0, duration: 0, restBetweenSets: 60, notes: "Lock out elbows." },
        ],
      },
      Friday: {
        duration: 60,
        notes: "Back & Biceps B: Deadlifts, unilateral rowing and preacher curls.",
        exercises: [
          { name: "Deadlifts", muscleGroup: "BACK", sets: 3, reps: 6, weight: 100, duration: 0, restBetweenSets: 120, notes: "Maintain neutral spine." },
          { name: "T-Bar Rows", muscleGroup: "BACK", sets: 3, reps: 10, weight: 50, duration: 0, restBetweenSets: 75, notes: "Squeeze rhomboids." },
          { name: "Dumbbell Rows", muscleGroup: "BACK", sets: 3, reps: 12, weight: 24, duration: 0, restBetweenSets: 60, notes: "Full lat stretch." },
          { name: "Preacher Curls", muscleGroup: "BICEPS", sets: 3, reps: 12, weight: 22, duration: 0, restBetweenSets: 60, notes: "Isolate short head." },
          { name: "Dumbbell Curls", muscleGroup: "BICEPS", sets: 3, reps: 12, weight: 12, duration: 0, restBetweenSets: 60, notes: "Supinate at apex." },
        ],
      },
      Saturday: {
        duration: 55,
        notes: "Legs & Shoulders B: Lunges, hamstring isolation, Arnold press & core.",
        exercises: [
          { name: "Lunges", muscleGroup: "LEGS", sets: 3, reps: 12, weight: 16, duration: 0, restBetweenSets: 60, notes: "Walking dumbbell lunges." },
          { name: "Leg Curls", muscleGroup: "LEGS", sets: 4, reps: 12, weight: 42, duration: 0, restBetweenSets: 60, notes: "Hamstrings contraction." },
          { name: "Arnold Press", muscleGroup: "SHOULDERS", sets: 3, reps: 10, weight: 16, duration: 0, restBetweenSets: 75, notes: "Rotate outward at top." },
          { name: "Rear Delt Flyes", muscleGroup: "SHOULDERS", sets: 3, reps: 15, weight: 8, duration: 0, restBetweenSets: 45, notes: "Posterior delts." },
          { name: "Hanging Leg Raises", muscleGroup: "ABS", sets: 3, reps: 12, weight: 0, duration: 0, restBetweenSets: 45, notes: "Lower abdominal tuck." },
        ],
      },
    },
  },

  phatSplit: {
    label: "PHAT (Power Hypertrophy Adaptive)",
    icon: "⚡",
    category: "Hypertrophy",
    tag: "Power & Speed Hypertrophy (5+1 Day)",
    description: "Layne Norton's world-renowned system: 2 days of heavy compound power followed by 3 days of high-velocity hypertrophy.",
    plan: {
      Monday: {
        duration: 65,
        notes: "Upper Body Power: Maximum strength foundation on upper compound lifts.",
        exercises: [
          { name: "Bench Press", muscleGroup: "CHEST", sets: 4, reps: 5, weight: 80, duration: 0, restBetweenSets: 120, notes: "Explosive concentric." },
          { name: "Barbell Rows", muscleGroup: "BACK", sets: 4, reps: 5, weight: 70, duration: 0, restBetweenSets: 120, notes: "Strict back drive." },
          { name: "Overhead Press", muscleGroup: "SHOULDERS", sets: 3, reps: 6, weight: 45, duration: 0, restBetweenSets: 90, notes: "Full overhead lock." },
          { name: "Pull-Ups", muscleGroup: "BACK", sets: 3, reps: 8, weight: 0, duration: 0, restBetweenSets: 90, notes: "Controlled reps." },
          { name: "Barbell Curls", muscleGroup: "BICEPS", sets: 3, reps: 8, weight: 30, duration: 0, restBetweenSets: 75, notes: "Heavy bicep power." },
          { name: "Close-Grip Bench Press", muscleGroup: "TRICEPS", sets: 3, reps: 8, weight: 60, duration: 0, restBetweenSets: 75, notes: "Tricep lockout." },
        ],
      },
      Tuesday: {
        duration: 65,
        notes: "Lower Body Power: Heavy squats, deadlifts and posterior chain overload.",
        exercises: [
          { name: "Squats", muscleGroup: "LEGS", sets: 4, reps: 5, weight: 95, duration: 0, restBetweenSets: 150, notes: "Full depth power." },
          { name: "Deadlifts", muscleGroup: "BACK", sets: 3, reps: 5, weight: 115, duration: 0, restBetweenSets: 150, notes: "Lockout glutes." },
          { name: "Leg Press", muscleGroup: "LEGS", sets: 3, reps: 8, weight: 160, duration: 0, restBetweenSets: 90, notes: "Controlled descent." },
          { name: "Calf Raises", muscleGroup: "LEGS", sets: 4, reps: 10, weight: 65, duration: 0, restBetweenSets: 60, notes: "Heavy calf stretch." },
          { name: "Planks", muscleGroup: "ABS", sets: 3, reps: 60, weight: 0, duration: 60, restBetweenSets: 45, notes: "Core brace." },
        ],
      },
      Wednesday: {
        duration: 40,
        notes: "Core & Active Recovery: Core stability, pelvic alignment and light mobility.",
        exercises: [
          { name: "Hanging Leg Raises", muscleGroup: "ABS", sets: 3, reps: 15, weight: 0, duration: 0, restBetweenSets: 45, notes: "Lower ab tuck." },
          { name: "Russian Twists", muscleGroup: "ABS", sets: 3, reps: 20, weight: 5, duration: 0, restBetweenSets: 45, notes: "Oblique control." },
          { name: "Mountain Climbers", muscleGroup: "ABS", sets: 3, reps: 30, weight: 0, duration: 30, restBetweenSets: 45, notes: "Active heart rate." },
        ],
      },
      Thursday: {
        duration: 60,
        notes: "Back & Shoulders Hypertrophy: High volume lat width, rhomboid density and 3D delts.",
        exercises: [
          { name: "Lat Pulldowns", muscleGroup: "BACK", sets: 4, reps: 12, weight: 55, duration: 0, restBetweenSets: 60, notes: "Stretch lats fully." },
          { name: "T-Bar Rows", muscleGroup: "BACK", sets: 4, reps: 10, weight: 50, duration: 0, restBetweenSets: 75, notes: "Mid-back pump." },
          { name: "Dumbbell Rows", muscleGroup: "BACK", sets: 3, reps: 12, weight: 24, duration: 0, restBetweenSets: 60, notes: "Unilateral focus." },
          { name: "Lateral Raises", muscleGroup: "SHOULDERS", sets: 4, reps: 15, weight: 10, duration: 0, restBetweenSets: 45, notes: "Medial delts burn." },
          { name: "Rear Delt Flyes", muscleGroup: "SHOULDERS", sets: 3, reps: 15, weight: 8, duration: 0, restBetweenSets: 45, notes: "Posterior delts." },
          { name: "Shrugs", muscleGroup: "SHOULDERS", sets: 3, reps: 15, weight: 32, duration: 0, restBetweenSets: 60, notes: "Traps contraction." },
        ],
      },
      Friday: {
        duration: 60,
        notes: "Lower Body Hypertrophy: Speed squats, lunges and glute/hamstring shaping.",
        exercises: [
          { name: "Squats", muscleGroup: "LEGS", sets: 4, reps: 10, weight: 75, duration: 0, restBetweenSets: 90, notes: "Speed and tension." },
          { name: "Lunges", muscleGroup: "LEGS", sets: 3, reps: 12, weight: 16, duration: 0, restBetweenSets: 60, notes: "Walking lunges." },
          { name: "Leg Extensions", muscleGroup: "LEGS", sets: 4, reps: 15, weight: 45, duration: 0, restBetweenSets: 45, notes: "Quad pump." },
          { name: "Leg Curls", muscleGroup: "LEGS", sets: 4, reps: 12, weight: 40, duration: 0, restBetweenSets: 45, notes: "Hamstrings." },
          { name: "Hip Thrusts", muscleGroup: "LEGS", sets: 3, reps: 12, weight: 70, duration: 0, restBetweenSets: 75, notes: "Glute squeeze." },
          { name: "Calf Raises", muscleGroup: "LEGS", sets: 4, reps: 15, weight: 55, duration: 0, restBetweenSets: 45, notes: "Full range." },
        ],
      },
      Saturday: {
        duration: 60,
        notes: "Chest & Arms Hypertrophy: Antagonistic pectoral and arm volume supersets.",
        exercises: [
          { name: "Incline Bench Press", muscleGroup: "CHEST", sets: 4, reps: 10, weight: 60, duration: 0, restBetweenSets: 75, notes: "Upper chest focus." },
          { name: "Dumbbell Press", muscleGroup: "CHEST", sets: 3, reps: 12, weight: 26, duration: 0, restBetweenSets: 60, notes: "Deep stretch." },
          { name: "Cable Flyes", muscleGroup: "CHEST", sets: 3, reps: 15, weight: 15, duration: 0, restBetweenSets: 45, notes: "Pectoral burn." },
          { name: "Preacher Curls", muscleGroup: "BICEPS", sets: 3, reps: 12, weight: 22, duration: 0, restBetweenSets: 60, notes: "Strict bicep peak." },
          { name: "Hammer Curls", muscleGroup: "BICEPS", sets: 3, reps: 12, weight: 14, duration: 0, restBetweenSets: 60, notes: "Brachialis." },
          { name: "Skull Crushers", muscleGroup: "TRICEPS", sets: 3, reps: 12, weight: 22, duration: 0, restBetweenSets: 60, notes: "Tricep long head." },
          { name: "Tricep Pushdowns", muscleGroup: "TRICEPS", sets: 3, reps: 15, weight: 25, duration: 0, restBetweenSets: 45, notes: "Full lockout." },
        ],
      },
    },
  },

  torsoLimbs: {
    label: "Torso & Limbs Split",
    icon: "📐",
    category: "Hypertrophy",
    tag: "Golden Era Torso / Extremities",
    description: "Classic split separating the central torso (Chest & Back) from the peripheral extremities (Legs & Arms).",
    plan: {
      Monday: {
        duration: 65,
        notes: "Torso Heavy: Heavy antagonistic chest & back pairing.",
        exercises: [
          { name: "Bench Press", muscleGroup: "CHEST", sets: 4, reps: 8, weight: 75, duration: 0, restBetweenSets: 90, notes: "Power press." },
          { name: "Pull-Ups", muscleGroup: "BACK", sets: 4, reps: 8, weight: 0, duration: 0, restBetweenSets: 90, notes: "Wide grip." },
          { name: "Incline Bench Press", muscleGroup: "CHEST", sets: 3, reps: 10, weight: 60, duration: 0, restBetweenSets: 75, notes: "Upper chest." },
          { name: "Barbell Rows", muscleGroup: "BACK", sets: 3, reps: 10, weight: 65, duration: 0, restBetweenSets: 75, notes: "Torso row." },
          { name: "Dumbbell Flyes", muscleGroup: "CHEST", sets: 3, reps: 12, weight: 16, duration: 0, restBetweenSets: 60, notes: "Chest stretch." },
        ],
      },
      Tuesday: {
        duration: 60,
        notes: "Limbs Heavy: Squats, heavy leg press and direct arm loading.",
        exercises: [
          { name: "Squats", muscleGroup: "LEGS", sets: 4, reps: 8, weight: 85, duration: 0, restBetweenSets: 120, notes: "Deep squats." },
          { name: "Leg Press", muscleGroup: "LEGS", sets: 3, reps: 10, weight: 160, duration: 0, restBetweenSets: 90, notes: "Heavy leg press." },
          { name: "Barbell Curls", muscleGroup: "BICEPS", sets: 4, reps: 10, weight: 30, duration: 0, restBetweenSets: 60, notes: "Strict curls." },
          { name: "Skull Crushers", muscleGroup: "TRICEPS", sets: 4, reps: 10, weight: 25, duration: 0, restBetweenSets: 60, notes: "Triceps." },
          { name: "Calf Raises", muscleGroup: "LEGS", sets: 4, reps: 15, weight: 55, duration: 0, restBetweenSets: 45, notes: "Calves." },
        ],
      },
      Wednesday: {
        duration: 50,
        notes: "Shoulders, Traps & Core: Full 3D deltoid development and abdominal bracing.",
        exercises: [
          { name: "Overhead Press", muscleGroup: "SHOULDERS", sets: 4, reps: 8, weight: 45, duration: 0, restBetweenSets: 90, notes: "Overhead drive." },
          { name: "Lateral Raises", muscleGroup: "SHOULDERS", sets: 4, reps: 15, weight: 10, duration: 0, restBetweenSets: 45, notes: "Side delts." },
          { name: "Rear Delt Flyes", muscleGroup: "SHOULDERS", sets: 3, reps: 15, weight: 8, duration: 0, restBetweenSets: 45, notes: "Posterior delts." },
          { name: "Shrugs", muscleGroup: "SHOULDERS", sets: 3, reps: 12, weight: 32, duration: 0, restBetweenSets: 60, notes: "Traps." },
          { name: "Planks", muscleGroup: "ABS", sets: 3, reps: 60, weight: 0, duration: 60, restBetweenSets: 45, notes: "Core stability." },
        ],
      },
      Thursday: {
        duration: 65,
        notes: "Torso Volume: Dumbbells, cables and posterior chain thickness.",
        exercises: [
          { name: "Dumbbell Press", muscleGroup: "CHEST", sets: 4, reps: 10, weight: 28, duration: 0, restBetweenSets: 75, notes: "Deep press." },
          { name: "Lat Pulldowns", muscleGroup: "BACK", sets: 4, reps: 12, weight: 55, duration: 0, restBetweenSets: 60, notes: "Lat flare." },
          { name: "Cable Flyes", muscleGroup: "CHEST", sets: 3, reps: 15, weight: 15, duration: 0, restBetweenSets: 45, notes: "Tension flyes." },
          { name: "T-Bar Rows", muscleGroup: "BACK", sets: 3, reps: 10, weight: 50, duration: 0, restBetweenSets: 75, notes: "Rhomboids." },
          { name: "Back Extensions", muscleGroup: "BACK", sets: 3, reps: 15, weight: 10, duration: 0, restBetweenSets: 60, notes: "Erectors." },
        ],
      },
      Friday: {
        duration: 60,
        notes: "Limbs Volume: Lunges, leg curls, leg extensions and arm pump.",
        exercises: [
          { name: "Lunges", muscleGroup: "LEGS", sets: 3, reps: 12, weight: 16, duration: 0, restBetweenSets: 60, notes: "Walking lunges." },
          { name: "Leg Curls", muscleGroup: "LEGS", sets: 4, reps: 12, weight: 42, duration: 0, restBetweenSets: 45, notes: "Hamstrings." },
          { name: "Leg Extensions", muscleGroup: "LEGS", sets: 4, reps: 15, weight: 45, duration: 0, restBetweenSets: 45, notes: "Quads." },
          { name: "Hammer Curls", muscleGroup: "BICEPS", sets: 3, reps: 12, weight: 14, duration: 0, restBetweenSets: 60, notes: "Brachialis." },
          { name: "Tricep Pushdowns", muscleGroup: "TRICEPS", sets: 3, reps: 15, weight: 25, duration: 0, restBetweenSets: 45, notes: "Tricep burnout." },
        ],
      },
      Saturday: {
        duration: 55,
        notes: "Shoulders, Arms & Abs Pump: Rotational pressing and arm peak finish.",
        exercises: [
          { name: "Arnold Press", muscleGroup: "SHOULDERS", sets: 4, reps: 10, weight: 16, duration: 0, restBetweenSets: 60, notes: "Delts rotation." },
          { name: "Preacher Curls", muscleGroup: "BICEPS", sets: 3, reps: 12, weight: 22, duration: 0, restBetweenSets: 60, notes: "Bicep peak." },
          { name: "Tricep Dips", muscleGroup: "TRICEPS", sets: 3, reps: 10, weight: 0, duration: 0, restBetweenSets: 60, notes: "Bodyweight dips." },
          { name: "Hanging Leg Raises", muscleGroup: "ABS", sets: 3, reps: 12, weight: 0, duration: 0, restBetweenSets: 45, notes: "Lower abs." },
          { name: "Russian Twists", muscleGroup: "ABS", sets: 3, reps: 20, weight: 5, duration: 0, restBetweenSets: 45, notes: "Obliques." },
        ],
      },
    },
  },

  upperLower: {
    label: "Upper / Lower Strength Split",
    icon: "🏋️",
    category: "Strength",
    tag: "Athletic Power & Hypertrophy (4+2 Day)",
    description: "Athletic 4-day power & hypertrophy split with 2 days of core conditioning.",
    plan: {
      Monday: {
        duration: 60,
        notes: "Upper Power: Heavy primary compound presses and rows.",
        exercises: [
          { name: "Bench Press", muscleGroup: "CHEST", sets: 4, reps: 5, weight: 80, duration: 0, restBetweenSets: 120, notes: "Strength focus." },
          { name: "Barbell Rows", muscleGroup: "BACK", sets: 4, reps: 6, weight: 70, duration: 0, restBetweenSets: 90, notes: "Solid back drive." },
          { name: "Overhead Press", muscleGroup: "SHOULDERS", sets: 3, reps: 6, weight: 45, duration: 0, restBetweenSets: 90, notes: "Strict press." },
          { name: "Pull-Ups", muscleGroup: "BACK", sets: 3, reps: 8, weight: 0, duration: 0, restBetweenSets: 75, notes: "Lats." },
        ],
      },
      Tuesday: {
        duration: 60,
        notes: "Lower Power: Heavy squats and deadlifts.",
        exercises: [
          { name: "Squats", muscleGroup: "LEGS", sets: 4, reps: 6, weight: 90, duration: 0, restBetweenSets: 120, notes: "Deep power squats." },
          { name: "Deadlifts", muscleGroup: "BACK", sets: 3, reps: 5, weight: 110, duration: 0, restBetweenSets: 150, notes: "Posterior chain." },
          { name: "Leg Press", muscleGroup: "LEGS", sets: 3, reps: 10, weight: 160, duration: 0, restBetweenSets: 90, notes: "Volume." },
          { name: "Calf Raises", muscleGroup: "LEGS", sets: 4, reps: 12, weight: 60, duration: 0, restBetweenSets: 45, notes: "Calves." },
        ],
      },
      Wednesday: {
        duration: 40,
        notes: "Core & Active Recovery: Core stability and mobility.",
        exercises: [
          { name: "Hanging Leg Raises", muscleGroup: "ABS", sets: 3, reps: 12, weight: 0, duration: 0, restBetweenSets: 45, notes: "Lower abs." },
          { name: "Russian Twists", muscleGroup: "ABS", sets: 3, reps: 20, weight: 5, duration: 0, restBetweenSets: 45, notes: "Rotational stability." },
          { name: "Planks", muscleGroup: "ABS", sets: 3, reps: 60, weight: 0, duration: 60, restBetweenSets: 45, notes: "Core." },
        ],
      },
      Thursday: {
        duration: 60,
        notes: "Upper Hypertrophy: Moderate load, higher volume, isolation pump.",
        exercises: [
          { name: "Incline Bench Press", muscleGroup: "CHEST", sets: 3, reps: 10, weight: 60, duration: 0, restBetweenSets: 75, notes: "Pecs." },
          { name: "Lat Pulldowns", muscleGroup: "BACK", sets: 3, reps: 12, weight: 55, duration: 0, restBetweenSets: 60, notes: "Lats stretch." },
          { name: "Dumbbell Press", muscleGroup: "CHEST", sets: 3, reps: 12, weight: 24, duration: 0, restBetweenSets: 60, notes: "Chest volume." },
          { name: "Lateral Raises", muscleGroup: "SHOULDERS", sets: 4, reps: 15, weight: 10, duration: 0, restBetweenSets: 45, notes: "Shoulder cap." },
          { name: "Barbell Curls", muscleGroup: "BICEPS", sets: 3, reps: 12, weight: 25, duration: 0, restBetweenSets: 60, notes: "Arms." },
        ],
      },
      Friday: {
        duration: 55,
        notes: "Lower Hypertrophy: High-rep leg training.",
        exercises: [
          { name: "Lunges", muscleGroup: "LEGS", sets: 3, reps: 12, weight: 16, duration: 0, restBetweenSets: 60, notes: "Quads and glutes." },
          { name: "Leg Curls", muscleGroup: "LEGS", sets: 4, reps: 12, weight: 45, duration: 0, restBetweenSets: 60, notes: "Hamstrings." },
          { name: "Leg Extensions", muscleGroup: "LEGS", sets: 4, reps: 15, weight: 45, duration: 0, restBetweenSets: 60, notes: "Quad pump." },
          { name: "Glute Bridges", muscleGroup: "LEGS", sets: 3, reps: 15, weight: 20, duration: 0, restBetweenSets: 60, notes: "Glutes." },
        ],
      },
      Saturday: {
        duration: 45,
        notes: "Full Body Conditioning & Core Circuit.",
        exercises: [
          { name: "Push-Ups", muscleGroup: "CHEST", sets: 3, reps: 20, weight: 0, duration: 0, restBetweenSets: 45, notes: "Endurance." },
          { name: "Pull-Ups", muscleGroup: "BACK", sets: 3, reps: 8, weight: 0, duration: 0, restBetweenSets: 60, notes: "Back." },
          { name: "Crunches", muscleGroup: "ABS", sets: 3, reps: 25, weight: 0, duration: 0, restBetweenSets: 45, notes: "Abs." },
        ],
      },
    },
  },

  phulSplit: {
    label: "PHUL (Power Hypertrophy Upper Lower)",
    icon: "🛡️",
    category: "Strength",
    tag: "4-Day Powerbuilding Architecture",
    description: "4-day powerbuilding framework combining maximal strength progression with targeted hypertrophy volume.",
    plan: {
      Monday: {
        duration: 65,
        notes: "Upper Power: Heavy compound press, row and arm overload.",
        exercises: [
          { name: "Bench Press", muscleGroup: "CHEST", sets: 4, reps: 5, weight: 80, duration: 0, restBetweenSets: 120, notes: "Heavy bench." },
          { name: "Incline Bench Press", muscleGroup: "CHEST", sets: 3, reps: 6, weight: 65, duration: 0, restBetweenSets: 90, notes: "Upper chest power." },
          { name: "Barbell Rows", muscleGroup: "BACK", sets: 4, reps: 5, weight: 70, duration: 0, restBetweenSets: 120, notes: "Strict back drive." },
          { name: "Overhead Press", muscleGroup: "SHOULDERS", sets: 3, reps: 6, weight: 45, duration: 0, restBetweenSets: 90, notes: "Shoulder strength." },
          { name: "Barbell Curls", muscleGroup: "BICEPS", sets: 3, reps: 8, weight: 30, duration: 0, restBetweenSets: 75, notes: "Bicep power." },
          { name: "Skull Crushers", muscleGroup: "TRICEPS", sets: 3, reps: 8, weight: 25, duration: 0, restBetweenSets: 75, notes: "Tricep power." },
        ],
      },
      Tuesday: {
        duration: 65,
        notes: "Lower Power: Heavy squats, deadlifts and lower body output.",
        exercises: [
          { name: "Squats", muscleGroup: "LEGS", sets: 4, reps: 5, weight: 95, duration: 0, restBetweenSets: 150, notes: "Full depth power." },
          { name: "Deadlifts", muscleGroup: "BACK", sets: 3, reps: 5, weight: 115, duration: 0, restBetweenSets: 150, notes: "Posterior power." },
          { name: "Leg Press", muscleGroup: "LEGS", sets: 3, reps: 8, weight: 160, duration: 0, restBetweenSets: 90, notes: "Heavy leg press." },
          { name: "Calf Raises", muscleGroup: "LEGS", sets: 4, reps: 10, weight: 65, duration: 0, restBetweenSets: 60, notes: "Calves." },
          { name: "Planks", muscleGroup: "ABS", sets: 3, reps: 60, weight: 0, duration: 60, restBetweenSets: 45, notes: "Core." },
        ],
      },
      Wednesday: {
        duration: 40,
        notes: "Core & Active Mobility: Midsection anti-rotation and decompression.",
        exercises: [
          { name: "Planks", muscleGroup: "ABS", sets: 3, reps: 60, weight: 0, duration: 60, restBetweenSets: 45, notes: "Plank hold." },
          { name: "Hanging Leg Raises", muscleGroup: "ABS", sets: 3, reps: 12, weight: 0, duration: 0, restBetweenSets: 45, notes: "Lower abs." },
          { name: "Russian Twists", muscleGroup: "ABS", sets: 3, reps: 20, weight: 5, duration: 0, restBetweenSets: 45, notes: "Obliques." },
          { name: "Ab Rollouts", muscleGroup: "ABS", sets: 3, reps: 12, weight: 0, duration: 0, restBetweenSets: 45, notes: "Anti-extension." },
        ],
      },
      Thursday: {
        duration: 60,
        notes: "Upper Hypertrophy: Moderate loads, continuous tension and metabolic volume.",
        exercises: [
          { name: "Dumbbell Press", muscleGroup: "CHEST", sets: 4, reps: 10, weight: 26, duration: 0, restBetweenSets: 75, notes: "Chest stretch." },
          { name: "Cable Flyes", muscleGroup: "CHEST", sets: 3, reps: 12, weight: 15, duration: 0, restBetweenSets: 60, notes: "Continuous tension." },
          { name: "Lat Pulldowns", muscleGroup: "BACK", sets: 4, reps: 12, weight: 55, duration: 0, restBetweenSets: 60, notes: "Wide grip." },
          { name: "Dumbbell Rows", muscleGroup: "BACK", sets: 3, reps: 12, weight: 24, duration: 0, restBetweenSets: 60, notes: "Unilateral control." },
          { name: "Lateral Raises", muscleGroup: "SHOULDERS", sets: 4, reps: 15, weight: 10, duration: 0, restBetweenSets: 45, notes: "Medial delts." },
          { name: "Tricep Pushdowns", muscleGroup: "TRICEPS", sets: 3, reps: 12, weight: 25, duration: 0, restBetweenSets: 60, notes: "Triceps." },
        ],
      },
      Friday: {
        duration: 60,
        notes: "Lower Hypertrophy: High-rep quad, glute and hamstring burn.",
        exercises: [
          { name: "Leg Press", muscleGroup: "LEGS", sets: 4, reps: 12, weight: 140, duration: 0, restBetweenSets: 75, notes: "Controlled depth." },
          { name: "Lunges", muscleGroup: "LEGS", sets: 3, reps: 12, weight: 16, duration: 0, restBetweenSets: 60, notes: "Walking lunges." },
          { name: "Leg Extensions", muscleGroup: "LEGS", sets: 4, reps: 15, weight: 45, duration: 0, restBetweenSets: 45, notes: "Quad pump." },
          { name: "Leg Curls", muscleGroup: "LEGS", sets: 4, reps: 12, weight: 40, duration: 0, restBetweenSets: 45, notes: "Hamstring squeeze." },
          { name: "Hip Thrusts", muscleGroup: "LEGS", sets: 3, reps: 12, weight: 70, duration: 0, restBetweenSets: 75, notes: "Glute lockout." },
          { name: "Calf Raises", muscleGroup: "LEGS", sets: 4, reps: 15, weight: 55, duration: 0, restBetweenSets: 45, notes: "Calves." },
        ],
      },
      Saturday: {
        duration: 45,
        notes: "Calisthenics & Arm Volume: Functional bodyweight and direct arm accessories.",
        exercises: [
          { name: "Pull-Ups", muscleGroup: "BACK", sets: 3, reps: 8, weight: 0, duration: 0, restBetweenSets: 60, notes: "Lats." },
          { name: "Push-Ups", muscleGroup: "CHEST", sets: 3, reps: 20, weight: 0, duration: 0, restBetweenSets: 45, notes: "Pectorals." },
          { name: "Hammer Curls", muscleGroup: "BICEPS", sets: 3, reps: 12, weight: 14, duration: 0, restBetweenSets: 60, notes: "Brachialis." },
          { name: "Tricep Dips", muscleGroup: "TRICEPS", sets: 3, reps: 12, weight: 0, duration: 0, restBetweenSets: 60, notes: "Triceps." },
          { name: "Bicycle Crunches", muscleGroup: "ABS", sets: 3, reps: 25, weight: 0, duration: 0, restBetweenSets: 45, notes: "Core." },
        ],
      },
    },
  },

  strength5x5: {
    label: "5x5 Heavy Strength & Powerlifting",
    icon: "💥",
    category: "Strength",
    tag: "Heavy Strength & Progressive Overload",
    description: "Classic powerlifting 5x5 compound framework built around heavy squat, bench, deadlift, and overhead press.",
    plan: {
      Monday: {
        duration: 65,
        notes: "Heavy Squat & Bench Foundation (5 sets of 5 reps).",
        exercises: [
          { name: "Squats", muscleGroup: "LEGS", sets: 5, reps: 5, weight: 95, duration: 0, restBetweenSets: 150, notes: "Heavy 5x5 working sets." },
          { name: "Bench Press", muscleGroup: "CHEST", sets: 5, reps: 5, weight: 80, duration: 0, restBetweenSets: 120, notes: "Strict pause on chest." },
          { name: "Barbell Rows", muscleGroup: "BACK", sets: 5, reps: 5, weight: 70, duration: 0, restBetweenSets: 90, notes: "Explosive row." },
          { name: "Planks", muscleGroup: "ABS", sets: 3, reps: 60, weight: 0, duration: 60, restBetweenSets: 45, notes: "Anti-extension core." },
        ],
      },
      Tuesday: {
        duration: 40,
        notes: "Core, Lower Back & Posterior Stability.",
        exercises: [
          { name: "Back Extensions", muscleGroup: "BACK", sets: 3, reps: 15, weight: 10, duration: 0, restBetweenSets: 60, notes: "Posterior chain health." },
          { name: "Hanging Leg Raises", muscleGroup: "ABS", sets: 3, reps: 12, weight: 0, duration: 0, restBetweenSets: 45, notes: "Hip flexors & abs." },
          { name: "Russian Twists", muscleGroup: "ABS", sets: 3, reps: 20, weight: 5, duration: 0, restBetweenSets: 45, notes: "Core rotation." },
        ],
      },
      Wednesday: {
        duration: 65,
        notes: "Heavy Deadlift & Overhead Press (5 sets of 5 reps).",
        exercises: [
          { name: "Deadlifts", muscleGroup: "BACK", sets: 5, reps: 5, weight: 120, duration: 0, restBetweenSets: 150, notes: "Heavy posterior pull." },
          { name: "Overhead Press", muscleGroup: "SHOULDERS", sets: 5, reps: 5, weight: 50, duration: 0, restBetweenSets: 120, notes: "Strict overhead power." },
          { name: "Pull-Ups", muscleGroup: "BACK", sets: 4, reps: 8, weight: 0, duration: 0, restBetweenSets: 90, notes: "Weighted or bodyweight." },
        ],
      },
      Thursday: {
        duration: 40,
        notes: "Active Recovery, Calisthenics & Joint Mobility.",
        exercises: [
          { name: "Push-Ups", muscleGroup: "CHEST", sets: 3, reps: 20, weight: 0, duration: 0, restBetweenSets: 45, notes: "Chest mobility." },
          { name: "Planks", muscleGroup: "ABS", sets: 3, reps: 60, weight: 0, duration: 60, restBetweenSets: 45, notes: "Braced core." },
          { name: "Mountain Climbers", muscleGroup: "ABS", sets: 3, reps: 30, weight: 0, duration: 30, restBetweenSets: 45, notes: "Dynamic core." },
        ],
      },
      Friday: {
        duration: 60,
        notes: "Squat Volume & Incline Assistance.",
        exercises: [
          { name: "Squats", muscleGroup: "LEGS", sets: 3, reps: 8, weight: 85, duration: 0, restBetweenSets: 90, notes: "Volume hypertrophy." },
          { name: "Incline Bench Press", muscleGroup: "CHEST", sets: 4, reps: 8, weight: 65, duration: 0, restBetweenSets: 90, notes: "Upper chest assistance." },
          { name: "Dumbbell Rows", muscleGroup: "BACK", sets: 3, reps: 10, weight: 28, duration: 0, restBetweenSets: 75, notes: "Unilateral pulling." },
          { name: "Close-Grip Bench Press", muscleGroup: "TRICEPS", sets: 3, reps: 8, weight: 60, duration: 0, restBetweenSets: 75, notes: "Tricep press power." },
        ],
      },
      Saturday: {
        duration: 45,
        notes: "Arms & Core Accessory Day.",
        exercises: [
          { name: "Barbell Curls", muscleGroup: "BICEPS", sets: 4, reps: 10, weight: 30, duration: 0, restBetweenSets: 60, notes: "Bicep strength." },
          { name: "Skull Crushers", muscleGroup: "TRICEPS", sets: 4, reps: 10, weight: 25, duration: 0, restBetweenSets: 60, notes: "Tricep extension." },
          { name: "Crunches", muscleGroup: "ABS", sets: 3, reps: 25, weight: 0, duration: 0, restBetweenSets: 45, notes: "Ab squeeze." },
          { name: "Ab Rollouts", muscleGroup: "ABS", sets: 3, reps: 12, weight: 0, duration: 0, restBetweenSets: 45, notes: "Eccentric core." },
        ],
      },
    },
  },

  fullBody: {
    label: "Full Body 3x Strength & Conditioning",
    icon: "🔥",
    category: "Athletic & HIIT",
    tag: "High Frequency Compound (3+3 Day)",
    description: "Full body compound movements 3 days/week with active core and calisthenics on alternating days.",
    plan: {
      Monday: {
        duration: 60,
        notes: "Full Body Compound A: Heavy squat and pressing foundation.",
        exercises: [
          { name: "Squats", muscleGroup: "LEGS", sets: 4, reps: 8, weight: 85, duration: 0, restBetweenSets: 120, notes: "Power squat depth." },
          { name: "Bench Press", muscleGroup: "CHEST", sets: 4, reps: 8, weight: 75, duration: 0, restBetweenSets: 90, notes: "Barbell press." },
          { name: "Barbell Rows", muscleGroup: "BACK", sets: 3, reps: 8, weight: 65, duration: 0, restBetweenSets: 90, notes: "Bent-over row." },
          { name: "Overhead Press", muscleGroup: "SHOULDERS", sets: 3, reps: 8, weight: 40, duration: 0, restBetweenSets: 75, notes: "Strict overhead." },
          { name: "Planks", muscleGroup: "ABS", sets: 3, reps: 60, weight: 0, duration: 60, restBetweenSets: 45, notes: "Core tension." },
        ],
      },
      Tuesday: {
        duration: 45,
        notes: "Core & Calisthenics: Functional endurance and core stability.",
        exercises: [
          { name: "Push-Ups", muscleGroup: "CHEST", sets: 4, reps: 20, weight: 0, duration: 0, restBetweenSets: 45, notes: "Pectoral endurance." },
          { name: "Pull-Ups", muscleGroup: "BACK", sets: 3, reps: 8, weight: 0, duration: 0, restBetweenSets: 60, notes: "Lats." },
          { name: "Russian Twists", muscleGroup: "ABS", sets: 3, reps: 20, weight: 5, duration: 0, restBetweenSets: 45, notes: "Oblique rotation." },
          { name: "Mountain Climbers", muscleGroup: "ABS", sets: 3, reps: 30, weight: 0, duration: 30, restBetweenSets: 45, notes: "Cardio burst." },
        ],
      },
      Wednesday: {
        duration: 60,
        notes: "Full Body Compound B: Deadlift posterior chain and incline press.",
        exercises: [
          { name: "Deadlifts", muscleGroup: "BACK", sets: 3, reps: 6, weight: 105, duration: 0, restBetweenSets: 120, notes: "Lockout glutes." },
          { name: "Incline Bench Press", muscleGroup: "CHEST", sets: 4, reps: 10, weight: 55, duration: 0, restBetweenSets: 75, notes: "Upper chest." },
          { name: "Lat Pulldowns", muscleGroup: "BACK", sets: 3, reps: 10, weight: 50, duration: 0, restBetweenSets: 60, notes: "Wide grip." },
          { name: "Leg Press", muscleGroup: "LEGS", sets: 3, reps: 12, weight: 150, duration: 0, restBetweenSets: 90, notes: "Deep quad press." },
          { name: "Lateral Raises", muscleGroup: "SHOULDERS", sets: 3, reps: 15, weight: 10, duration: 0, restBetweenSets: 45, notes: "Side delts." },
        ],
      },
      Thursday: {
        duration: 45,
        notes: "Mobility, Lower Back & Core Conditioning.",
        exercises: [
          { name: "Back Extensions", muscleGroup: "BACK", sets: 3, reps: 15, weight: 10, duration: 0, restBetweenSets: 60, notes: "Erector spinae." },
          { name: "Hanging Leg Raises", muscleGroup: "ABS", sets: 3, reps: 12, weight: 0, duration: 0, restBetweenSets: 45, notes: "Lower abs." },
          { name: "Crunches", muscleGroup: "ABS", sets: 3, reps: 25, weight: 0, duration: 0, restBetweenSets: 45, notes: "Ab squeeze." },
          { name: "Planks", muscleGroup: "ABS", sets: 3, reps: 60, weight: 0, duration: 60, restBetweenSets: 45, notes: "Core brace." },
        ],
      },
      Friday: {
        duration: 60,
        notes: "Full Body Compound C: Squat volume, dumbbell pressing and arms.",
        exercises: [
          { name: "Squats", muscleGroup: "LEGS", sets: 3, reps: 10, weight: 80, duration: 0, restBetweenSets: 90, notes: "Controlled tempo." },
          { name: "Dumbbell Press", muscleGroup: "CHEST", sets: 4, reps: 10, weight: 26, duration: 0, restBetweenSets: 75, notes: "Chest stretch." },
          { name: "T-Bar Rows", muscleGroup: "BACK", sets: 3, reps: 10, weight: 45, duration: 0, restBetweenSets: 75, notes: "Back thickness." },
          { name: "Barbell Curls", muscleGroup: "BICEPS", sets: 3, reps: 12, weight: 25, duration: 0, restBetweenSets: 60, notes: "Bicep pump." },
          { name: "Tricep Pushdowns", muscleGroup: "TRICEPS", sets: 3, reps: 12, weight: 25, duration: 0, restBetweenSets: 60, notes: "Tricep lockout." },
        ],
      },
      Saturday: {
        duration: 45,
        notes: "Athletic Conditioning & Calisthenics Finisher.",
        exercises: [
          { name: "Lunges", muscleGroup: "LEGS", sets: 3, reps: 15, weight: 14, duration: 0, restBetweenSets: 45, notes: "Leg burn." },
          { name: "Push-Ups", muscleGroup: "CHEST", sets: 3, reps: 20, weight: 0, duration: 0, restBetweenSets: 45, notes: "Endurance." },
          { name: "Pull-Ups", muscleGroup: "BACK", sets: 3, reps: 8, weight: 0, duration: 0, restBetweenSets: 60, notes: "Lats." },
          { name: "Russian Twists", muscleGroup: "ABS", sets: 3, reps: 20, weight: 5, duration: 0, restBetweenSets: 45, notes: "Obliques." },
        ],
      },
    },
  },

  fatLossHiit: {
    label: "Fat Loss & Metabolic HIIT Split",
    icon: "⚡",
    category: "Athletic & HIIT",
    tag: "High Heart Rate & Calorie Burn (6-Day)",
    description: "Metabolic resistance conditioning, compound supersets, and cardiovascular core circuits for rapid fat loss and conditioning.",
    plan: {
      Monday: {
        duration: 50,
        notes: "Lower Body Metabolic Burn: High-density compound leg volume.",
        exercises: [
          { name: "Squats", muscleGroup: "LEGS", sets: 4, reps: 12, weight: 65, duration: 0, restBetweenSets: 60, notes: "Continuous pacing." },
          { name: "Lunges", muscleGroup: "LEGS", sets: 3, reps: 15, weight: 12, duration: 0, restBetweenSets: 45, notes: "Short rest." },
          { name: "Leg Press", muscleGroup: "LEGS", sets: 3, reps: 15, weight: 120, duration: 0, restBetweenSets: 60, notes: "High reps." },
          { name: "Mountain Climbers", muscleGroup: "ABS", sets: 4, reps: 30, weight: 0, duration: 30, restBetweenSets: 30, notes: "HIIT heart rate spike." },
        ],
      },
      Tuesday: {
        duration: 50,
        notes: "Upper Body Density Circuit: Antagonistic chest & back supersets.",
        exercises: [
          { name: "Push-Ups", muscleGroup: "CHEST", sets: 4, reps: 20, weight: 0, duration: 0, restBetweenSets: 45, notes: "Chest pump." },
          { name: "Lat Pulldowns", muscleGroup: "BACK", sets: 4, reps: 12, weight: 45, duration: 0, restBetweenSets: 45, notes: "Back burn." },
          { name: "Dumbbell Press", muscleGroup: "CHEST", sets: 3, reps: 12, weight: 22, duration: 0, restBetweenSets: 45, notes: "Pectorals." },
          { name: "Russian Twists", muscleGroup: "ABS", sets: 3, reps: 25, weight: 5, duration: 0, restBetweenSets: 30, notes: "Oblique rotation." },
        ],
      },
      Wednesday: {
        duration: 45,
        notes: "Core Engine & Metabolic Burn: Total abdominal and core endurance.",
        exercises: [
          { name: "Hanging Leg Raises", muscleGroup: "ABS", sets: 3, reps: 15, weight: 0, duration: 0, restBetweenSets: 30, notes: "Lower abs." },
          { name: "Bicycle Crunches", muscleGroup: "ABS", sets: 4, reps: 25, weight: 0, duration: 0, restBetweenSets: 30, notes: "Continuous motion." },
          { name: "Planks", muscleGroup: "ABS", sets: 4, reps: 60, weight: 0, duration: 60, restBetweenSets: 30, notes: "Rigid core." },
          { name: "Mountain Climbers", muscleGroup: "ABS", sets: 4, reps: 40, weight: 0, duration: 40, restBetweenSets: 30, notes: "Maximum heart rate." },
        ],
      },
      Thursday: {
        duration: 50,
        notes: "Full-Body Functional Power: Multi-joint calorie burner.",
        exercises: [
          { name: "Deadlifts", muscleGroup: "BACK", sets: 4, reps: 8, weight: 85, duration: 0, restBetweenSets: 75, notes: "Posterior chain." },
          { name: "Overhead Press", muscleGroup: "SHOULDERS", sets: 3, reps: 10, weight: 35, duration: 0, restBetweenSets: 60, notes: "Shoulder drive." },
          { name: "Pull-Ups", muscleGroup: "BACK", sets: 3, reps: 8, weight: 0, duration: 0, restBetweenSets: 60, notes: "Back volume." },
          { name: "Push-Ups", muscleGroup: "CHEST", sets: 3, reps: 20, weight: 0, duration: 0, restBetweenSets: 45, notes: "Chest burnout." },
        ],
      },
      Friday: {
        duration: 50,
        notes: "Quad & Glute Hypertrophy Pump: High volume blood flow.",
        exercises: [
          { name: "Leg Extensions", muscleGroup: "LEGS", sets: 4, reps: 15, weight: 40, duration: 0, restBetweenSets: 45, notes: "Quad pump." },
          { name: "Leg Curls", muscleGroup: "LEGS", sets: 4, reps: 15, weight: 38, duration: 0, restBetweenSets: 45, notes: "Hamstrings." },
          { name: "Hip Thrusts", muscleGroup: "LEGS", sets: 3, reps: 12, weight: 60, duration: 0, restBetweenSets: 60, notes: "Glute lockout." },
          { name: "Calf Raises", muscleGroup: "LEGS", sets: 4, reps: 20, weight: 45, duration: 0, restBetweenSets: 30, notes: "High rep calves." },
        ],
      },
      Saturday: {
        duration: 45,
        notes: "Core & Metabolic Finisher Circuit.",
        exercises: [
          { name: "Planks", muscleGroup: "ABS", sets: 3, reps: 60, weight: 0, duration: 60, restBetweenSets: 30, notes: "Core brace." },
          { name: "Russian Twists", muscleGroup: "ABS", sets: 3, reps: 25, weight: 5, duration: 0, restBetweenSets: 30, notes: "Oblique burn." },
          { name: "Push-Ups", muscleGroup: "CHEST", sets: 3, reps: 20, weight: 0, duration: 0, restBetweenSets: 30, notes: "Chest finisher." },
          { name: "Crunches", muscleGroup: "ABS", sets: 3, reps: 30, weight: 0, duration: 0, restBetweenSets: 30, notes: "Ab finisher." },
        ],
      },
    },
  },

  pushPullAthletic: {
    label: "Push / Pull 4-Day Athletic Split",
    icon: "🏃",
    category: "Athletic & HIIT",
    tag: "Movement Plane Progression (4+2 Day)",
    description: "Dividing total-body movements into push planes (chest, quads, delts, triceps) and pull planes (back, hamstrings, biceps).",
    plan: {
      Monday: {
        duration: 60,
        notes: "Push A: Squats, heavy barbell bench and vertical shoulder pressing.",
        exercises: [
          { name: "Squats", muscleGroup: "LEGS", sets: 4, reps: 8, weight: 85, duration: 0, restBetweenSets: 120, notes: "Full depth squats." },
          { name: "Bench Press", muscleGroup: "CHEST", sets: 4, reps: 8, weight: 75, duration: 0, restBetweenSets: 90, notes: "Solid bench." },
          { name: "Overhead Press", muscleGroup: "SHOULDERS", sets: 3, reps: 8, weight: 45, duration: 0, restBetweenSets: 90, notes: "Overhead drive." },
          { name: "Lateral Raises", muscleGroup: "SHOULDERS", sets: 3, reps: 15, weight: 10, duration: 0, restBetweenSets: 45, notes: "Side delts." },
          { name: "Tricep Pushdowns", muscleGroup: "TRICEPS", sets: 3, reps: 12, weight: 25, duration: 0, restBetweenSets: 60, notes: "Lockout." },
        ],
      },
      Tuesday: {
        duration: 60,
        notes: "Pull A: Deadlifts, vertical lat pulls and heavy bicep curls.",
        exercises: [
          { name: "Deadlifts", muscleGroup: "BACK", sets: 3, reps: 6, weight: 105, duration: 0, restBetweenSets: 120, notes: "Neutral spine." },
          { name: "Pull-Ups", muscleGroup: "BACK", sets: 4, reps: 8, weight: 0, duration: 0, restBetweenSets: 90, notes: "Full ROM." },
          { name: "Barbell Rows", muscleGroup: "BACK", sets: 3, reps: 8, weight: 65, duration: 0, restBetweenSets: 90, notes: "Torso 45-degree angle." },
          { name: "Face Pulls", muscleGroup: "BACK", sets: 3, reps: 15, weight: 20, duration: 0, restBetweenSets: 60, notes: "Rear delts." },
          { name: "Barbell Curls", muscleGroup: "BICEPS", sets: 3, reps: 10, weight: 28, duration: 0, restBetweenSets: 60, notes: "Strict curls." },
        ],
      },
      Wednesday: {
        duration: 40,
        notes: "Core Stability & HIIT: Abdominal circuits and functional conditioning.",
        exercises: [
          { name: "Planks", muscleGroup: "ABS", sets: 3, reps: 60, weight: 0, duration: 60, restBetweenSets: 45, notes: "Core brace." },
          { name: "Russian Twists", muscleGroup: "ABS", sets: 3, reps: 20, weight: 5, duration: 0, restBetweenSets: 45, notes: "Oblique rotation." },
          { name: "Mountain Climbers", muscleGroup: "ABS", sets: 3, reps: 30, weight: 0, duration: 30, restBetweenSets: 45, notes: "Cardio burst." },
          { name: "Bicycle Crunches", muscleGroup: "ABS", sets: 3, reps: 20, weight: 0, duration: 0, restBetweenSets: 45, notes: "Ab squeeze." },
        ],
      },
      Thursday: {
        duration: 60,
        notes: "Push B: Leg press, incline dumbbell pressing, Arnold press and dips.",
        exercises: [
          { name: "Leg Press", muscleGroup: "LEGS", sets: 4, reps: 10, weight: 150, duration: 0, restBetweenSets: 90, notes: "Leg volume." },
          { name: "Incline Bench Press", muscleGroup: "CHEST", sets: 4, reps: 10, weight: 60, duration: 0, restBetweenSets: 75, notes: "Upper pecs." },
          { name: "Dumbbell Press", muscleGroup: "CHEST", sets: 3, reps: 12, weight: 26, duration: 0, restBetweenSets: 60, notes: "Chest stretch." },
          { name: "Arnold Press", muscleGroup: "SHOULDERS", sets: 3, reps: 10, weight: 16, duration: 0, restBetweenSets: 75, notes: "Smooth rotation." },
          { name: "Tricep Dips", muscleGroup: "TRICEPS", sets: 3, reps: 10, weight: 0, duration: 0, restBetweenSets: 60, notes: "Bodyweight dips." },
        ],
      },
      Friday: {
        duration: 60,
        notes: "Pull B: Hamstring focus, lat pulldowns, T-Bar rows and hammer curls.",
        exercises: [
          { name: "Leg Curls", muscleGroup: "LEGS", sets: 4, reps: 12, weight: 42, duration: 0, restBetweenSets: 60, notes: "Hamstrings." },
          { name: "Lat Pulldowns", muscleGroup: "BACK", sets: 4, reps: 10, weight: 55, duration: 0, restBetweenSets: 60, notes: "Lat stretch." },
          { name: "T-Bar Rows", muscleGroup: "BACK", sets: 3, reps: 10, weight: 50, duration: 0, restBetweenSets: 75, notes: "Mid-back." },
          { name: "Hammer Curls", muscleGroup: "BICEPS", sets: 3, reps: 12, weight: 14, duration: 0, restBetweenSets: 60, notes: "Brachialis." },
          { name: "Back Extensions", muscleGroup: "BACK", sets: 3, reps: 15, weight: 10, duration: 0, restBetweenSets: 60, notes: "Lower back support." },
        ],
      },
      Saturday: {
        duration: 45,
        notes: "Calisthenics & Core: Bodyweight pull-ups, push-ups and hanging core.",
        exercises: [
          { name: "Push-Ups", muscleGroup: "CHEST", sets: 4, reps: 20, weight: 0, duration: 0, restBetweenSets: 45, notes: "Chest endurance." },
          { name: "Pull-Ups", muscleGroup: "BACK", sets: 3, reps: 8, weight: 0, duration: 0, restBetweenSets: 60, notes: "Lat endurance." },
          { name: "Hanging Leg Raises", muscleGroup: "ABS", sets: 3, reps: 12, weight: 0, duration: 0, restBetweenSets: 45, notes: "Lower abs." },
          { name: "Ab Rollouts", muscleGroup: "ABS", sets: 3, reps: 12, weight: 0, duration: 0, restBetweenSets: 45, notes: "Anti-extension." },
        ],
      },
    },
  },

  gluteSpecialization: {
    label: "Glute & Lower Body Specialization",
    icon: "🍑",
    category: "Specialized",
    tag: "Glute Hypertrophy & Toned Silhouette (6-Day)",
    description: "High-frequency glute & posterior chain specialization paired with upper-body postural tone and waist conditioning.",
    plan: {
      Monday: {
        duration: 55,
        notes: "Glute & Quad Dominance: Hip thrusts, squats and quad drive.",
        exercises: [
          { name: "Hip Thrusts", muscleGroup: "LEGS", sets: 4, reps: 12, weight: 70, duration: 0, restBetweenSets: 90, notes: "2-second pause at top lockout." },
          { name: "Squats", muscleGroup: "LEGS", sets: 3, reps: 10, weight: 65, duration: 0, restBetweenSets: 90, notes: "Controlled depth." },
          { name: "Leg Press", muscleGroup: "LEGS", sets: 3, reps: 12, weight: 130, duration: 0, restBetweenSets: 75, notes: "High foot placement." },
          { name: "Lunges", muscleGroup: "LEGS", sets: 3, reps: 12, weight: 14, duration: 0, restBetweenSets: 60, notes: "Forward deficit lunges." },
          { name: "Glute Bridges", muscleGroup: "LEGS", sets: 3, reps: 15, weight: 20, duration: 0, restBetweenSets: 45, notes: "Glute burn finisher." },
        ],
      },
      Tuesday: {
        duration: 50,
        notes: "Upper Body Tone & Posture: Back width, shoulders and chest firmness.",
        exercises: [
          { name: "Lat Pulldowns", muscleGroup: "BACK", sets: 4, reps: 12, weight: 45, duration: 0, restBetweenSets: 60, notes: "V-taper lat width." },
          { name: "Overhead Press", muscleGroup: "SHOULDERS", sets: 3, reps: 10, weight: 30, duration: 0, restBetweenSets: 60, notes: "Shoulder cap posture." },
          { name: "Dumbbell Rows", muscleGroup: "BACK", sets: 3, reps: 12, weight: 18, duration: 0, restBetweenSets: 60, notes: "Upper back tightness." },
          { name: "Push-Ups", muscleGroup: "CHEST", sets: 3, reps: 15, weight: 0, duration: 0, restBetweenSets: 45, notes: "Pectoral tone." },
          { name: "Lateral Raises", muscleGroup: "SHOULDERS", sets: 3, reps: 15, weight: 8, duration: 0, restBetweenSets: 45, notes: "Side delts." },
        ],
      },
      Wednesday: {
        duration: 55,
        notes: "Glute & Hamstring Focus: Hip hinge power, deadlifts and hamstring curls.",
        exercises: [
          { name: "Hip Thrusts", muscleGroup: "LEGS", sets: 4, reps: 10, weight: 75, duration: 0, restBetweenSets: 90, notes: "Heavy hip thrusts." },
          { name: "Deadlifts", muscleGroup: "LEGS", sets: 3, reps: 8, weight: 70, duration: 0, restBetweenSets: 90, notes: "Romanian hip hinge feel." },
          { name: "Leg Curls", muscleGroup: "LEGS", sets: 4, reps: 12, weight: 38, duration: 0, restBetweenSets: 60, notes: "Hamstrings contraction." },
          { name: "Glute Bridges", muscleGroup: "LEGS", sets: 3, reps: 15, weight: 25, duration: 0, restBetweenSets: 45, notes: "Continuous glute tension." },
          { name: "Calf Raises", muscleGroup: "LEGS", sets: 4, reps: 15, weight: 45, duration: 0, restBetweenSets: 45, notes: "Calves." },
        ],
      },
      Thursday: {
        duration: 45,
        notes: "Waist, Core & Conditioning: Anti-extension core and high calorie burn.",
        exercises: [
          { name: "Planks", muscleGroup: "ABS", sets: 3, reps: 60, weight: 0, duration: 60, restBetweenSets: 45, notes: "Tight vacuum core." },
          { name: "Bicycle Crunches", muscleGroup: "ABS", sets: 4, reps: 25, weight: 0, duration: 0, restBetweenSets: 30, notes: "Oblique conditioning." },
          { name: "Russian Twists", muscleGroup: "ABS", sets: 3, reps: 20, weight: 5, duration: 0, restBetweenSets: 45, notes: "Waist taper." },
          { name: "Mountain Climbers", muscleGroup: "ABS", sets: 4, reps: 30, weight: 0, duration: 30, restBetweenSets: 30, notes: "Cardio burn." },
        ],
      },
      Friday: {
        duration: 55,
        notes: "Glute Pump & Leg Shaping: High volume metabolic leg development.",
        exercises: [
          { name: "Hip Thrusts", muscleGroup: "LEGS", sets: 4, reps: 15, weight: 65, duration: 0, restBetweenSets: 60, notes: "High volume pump." },
          { name: "Leg Extensions", muscleGroup: "LEGS", sets: 4, reps: 15, weight: 40, duration: 0, restBetweenSets: 45, notes: "Quad definition." },
          { name: "Lunges", muscleGroup: "LEGS", sets: 3, reps: 15, weight: 12, duration: 0, restBetweenSets: 45, notes: "Walking lunges." },
          { name: "Calf Raises", muscleGroup: "LEGS", sets: 4, reps: 20, weight: 45, duration: 0, restBetweenSets: 30, notes: "Calf pump." },
          { name: "Planks", muscleGroup: "ABS", sets: 3, reps: 60, weight: 0, duration: 60, restBetweenSets: 45, notes: "Core." },
        ],
      },
      Saturday: {
        duration: 50,
        notes: "Delts, Arms & Waist Sculpt: 3D deltoid capping and arm firmness.",
        exercises: [
          { name: "Arnold Press", muscleGroup: "SHOULDERS", sets: 3, reps: 12, weight: 14, duration: 0, restBetweenSets: 60, notes: "Shoulder cap." },
          { name: "Cable Flyes", muscleGroup: "CHEST", sets: 3, reps: 15, weight: 12, duration: 0, restBetweenSets: 45, notes: "Chest firmness." },
          { name: "Dumbbell Curls", muscleGroup: "BICEPS", sets: 3, reps: 12, weight: 10, duration: 0, restBetweenSets: 45, notes: "Toned biceps." },
          { name: "Tricep Pushdowns", muscleGroup: "TRICEPS", sets: 3, reps: 15, weight: 20, duration: 0, restBetweenSets: 45, notes: "Back of arm tone." },
          { name: "Hanging Leg Raises", muscleGroup: "ABS", sets: 3, reps: 15, weight: 0, duration: 0, restBetweenSets: 45, notes: "Lower abs." },
        ],
      },
    },
  },

  calisthenicsSplit: {
    label: "Calisthenics & Bodyweight Dominance",
    icon: "🤸",
    category: "Specialized",
    tag: "Relative Strength & Calisthenics",
    description: "Pure bodyweight gymnastic strength and functional endurance using pull-ups, push-ups, dips, and core compression.",
    plan: {
      Monday: {
        duration: 50,
        notes: "Upper Calisthenics Power: Vertical pulling, horizontal pushing and bodyweight dips.",
        exercises: [
          { name: "Pull-Ups", muscleGroup: "BACK", sets: 4, reps: 8, weight: 0, duration: 0, restBetweenSets: 90, notes: "Strict deadhang pull-ups." },
          { name: "Push-Ups", muscleGroup: "CHEST", sets: 4, reps: 20, weight: 0, duration: 0, restBetweenSets: 60, notes: "Full range chest to floor." },
          { name: "Chest Dips", muscleGroup: "CHEST", sets: 3, reps: 10, weight: 0, duration: 0, restBetweenSets: 60, notes: "Parallel bars dips." },
          { name: "Tricep Dips", muscleGroup: "TRICEPS", sets: 3, reps: 12, weight: 0, duration: 0, restBetweenSets: 60, notes: "Bench or bar tricep dips." },
          { name: "Planks", muscleGroup: "ABS", sets: 3, reps: 60, weight: 0, duration: 60, restBetweenSets: 45, notes: "Hollow body plank." },
        ],
      },
      Tuesday: {
        duration: 50,
        notes: "Lower Calisthenics & Hip Drive: Explosive bodyweight squats, lunges and glute bridges.",
        exercises: [
          { name: "Squats", muscleGroup: "LEGS", sets: 4, reps: 20, weight: 0, duration: 0, restBetweenSets: 60, notes: "Deep bodyweight squats." },
          { name: "Lunges", muscleGroup: "LEGS", sets: 4, reps: 15, weight: 0, duration: 0, restBetweenSets: 45, notes: "Walking bodyweight lunges." },
          { name: "Glute Bridges", muscleGroup: "LEGS", sets: 3, reps: 20, weight: 0, duration: 0, restBetweenSets: 45, notes: "Single or double leg." },
          { name: "Calf Raises", muscleGroup: "LEGS", sets: 4, reps: 25, weight: 0, duration: 0, restBetweenSets: 30, notes: "Single leg calf raises." },
          { name: "Mountain Climbers", muscleGroup: "ABS", sets: 4, reps: 30, weight: 0, duration: 30, restBetweenSets: 30, notes: "Speed tempo." },
        ],
      },
      Wednesday: {
        duration: 45,
        notes: "Core Compression & Abdominals: Hanging toes to bar and anti-extension.",
        exercises: [
          { name: "Hanging Leg Raises", muscleGroup: "ABS", sets: 4, reps: 12, weight: 0, duration: 0, restBetweenSets: 45, notes: "Strict toes to bar." },
          { name: "Ab Rollouts", muscleGroup: "ABS", sets: 3, reps: 12, weight: 0, duration: 0, restBetweenSets: 45, notes: "Full extension rollout." },
          { name: "Bicycle Crunches", muscleGroup: "ABS", sets: 4, reps: 25, weight: 0, duration: 0, restBetweenSets: 30, notes: "Cross-body twist." },
          { name: "Russian Twists", muscleGroup: "ABS", sets: 3, reps: 25, weight: 0, duration: 0, restBetweenSets: 30, notes: "Rotational compression." },
        ],
      },
      Thursday: {
        duration: 50,
        notes: "Upper Volume & Tempo: Diamond push-ups, chin-ups and posterior chain support.",
        exercises: [
          { name: "Pull-Ups", muscleGroup: "BACK", sets: 4, reps: 8, weight: 0, duration: 0, restBetweenSets: 75, notes: "Underhand chin-ups." },
          { name: "Diamond Push-Ups", muscleGroup: "TRICEPS", sets: 3, reps: 15, weight: 0, duration: 0, restBetweenSets: 60, notes: "Tricep diamond grip." },
          { name: "Push-Ups", muscleGroup: "CHEST", sets: 3, reps: 20, weight: 0, duration: 0, restBetweenSets: 45, notes: "Tempo push-ups." },
          { name: "Chest Dips", muscleGroup: "CHEST", sets: 3, reps: 10, weight: 0, duration: 0, restBetweenSets: 60, notes: "Lean forward." },
          { name: "Back Extensions", muscleGroup: "BACK", sets: 3, reps: 15, weight: 0, duration: 0, restBetweenSets: 45, notes: "Posterior spine." },
        ],
      },
      Friday: {
        duration: 50,
        notes: "Unilateral Lower & Calves: Pistol squats preparation, lunges and stability.",
        exercises: [
          { name: "Lunges", muscleGroup: "LEGS", sets: 4, reps: 15, weight: 0, duration: 0, restBetweenSets: 45, notes: "Reverse lunges." },
          { name: "Squats", muscleGroup: "LEGS", sets: 4, reps: 25, weight: 0, duration: 0, restBetweenSets: 60, notes: "Pause squats." },
          { name: "Glute Bridges", muscleGroup: "LEGS", sets: 3, reps: 20, weight: 0, duration: 0, restBetweenSets: 45, notes: "Single leg bridges." },
          { name: "Calf Raises", muscleGroup: "LEGS", sets: 4, reps: 25, weight: 0, duration: 0, restBetweenSets: 30, notes: "Calves burn." },
          { name: "Planks", muscleGroup: "ABS", sets: 3, reps: 60, weight: 0, duration: 60, restBetweenSets: 45, notes: "Side or prone plank." },
        ],
      },
      Saturday: {
        duration: 45,
        notes: "Calisthenics Endurance Test: Complete bodyweight circuit burnout.",
        exercises: [
          { name: "Pull-Ups", muscleGroup: "BACK", sets: 4, reps: 8, weight: 0, duration: 0, restBetweenSets: 60, notes: "Bodyweight pulls." },
          { name: "Push-Ups", muscleGroup: "CHEST", sets: 4, reps: 25, weight: 0, duration: 0, restBetweenSets: 45, notes: "Pectoral burnout." },
          { name: "Tricep Dips", muscleGroup: "TRICEPS", sets: 3, reps: 15, weight: 0, duration: 0, restBetweenSets: 45, notes: "Tricep lockout." },
          { name: "Mountain Climbers", muscleGroup: "ABS", sets: 4, reps: 40, weight: 0, duration: 40, restBetweenSets: 30, notes: "Cardio push." },
          { name: "Hanging Leg Raises", muscleGroup: "ABS", sets: 3, reps: 15, weight: 0, duration: 0, restBetweenSets: 45, notes: "Core finisher." },
        ],
      },
    },
  },

  beginnerLinear: {
    label: "Beginner Linear Foundation (3-Day)",
    icon: "🔰",
    category: "Beginner & Posture",
    tag: "Day-1 Starter Linear Progression",
    description: "Simple, highly effective progressive overload split for beginners learning fundamental movement mechanics.",
    plan: {
      Monday: {
        duration: 45,
        notes: "Full Body Starter A: Foundational barbell and machine mechanics.",
        exercises: [
          { name: "Squats", muscleGroup: "LEGS", sets: 3, reps: 8, weight: 40, duration: 0, restBetweenSets: 90, notes: "Master depth and balance." },
          { name: "Bench Press", muscleGroup: "CHEST", sets: 3, reps: 8, weight: 40, duration: 0, restBetweenSets: 90, notes: "Controlled bar descent." },
          { name: "Lat Pulldowns", muscleGroup: "BACK", sets: 3, reps: 10, weight: 35, duration: 0, restBetweenSets: 75, notes: "Pull to upper chest." },
          { name: "Planks", muscleGroup: "ABS", sets: 3, reps: 30, weight: 0, duration: 30, restBetweenSets: 45, notes: "30-second rigid hold." },
        ],
      },
      Tuesday: {
        duration: 35,
        notes: "Active Mobility & Core: Light cardio, hip openers and gentle abdominal work.",
        exercises: [
          { name: "Mountain Climbers", muscleGroup: "ABS", sets: 3, reps: 20, weight: 0, duration: 20, restBetweenSets: 45, notes: "Light pacing." },
          { name: "Crunches", muscleGroup: "ABS", sets: 3, reps: 15, weight: 0, duration: 0, restBetweenSets: 45, notes: "Focus on ab squeeze." },
          { name: "Russian Twists", muscleGroup: "ABS", sets: 3, reps: 15, weight: 0, duration: 0, restBetweenSets: 45, notes: "Gentle rotation." },
        ],
      },
      Wednesday: {
        duration: 45,
        notes: "Full Body Starter B: Deadlift hinge and overhead press mechanics.",
        exercises: [
          { name: "Deadlifts", muscleGroup: "BACK", sets: 3, reps: 6, weight: 50, duration: 0, restBetweenSets: 120, notes: "Maintain flat neutral spine." },
          { name: "Overhead Press", muscleGroup: "SHOULDERS", sets: 3, reps: 8, weight: 25, duration: 0, restBetweenSets: 90, notes: "Vertical bar path." },
          { name: "Barbell Rows", muscleGroup: "BACK", sets: 3, reps: 8, weight: 35, duration: 0, restBetweenSets: 75, notes: "Elbows to ceiling." },
          { name: "Push-Ups", muscleGroup: "CHEST", sets: 3, reps: 10, weight: 0, duration: 0, restBetweenSets: 60, notes: "Knees or toes form." },
        ],
      },
      Thursday: {
        duration: 30,
        notes: "Light Cardio & Core: Midsection endurance and flexibility.",
        exercises: [
          { name: "Planks", muscleGroup: "ABS", sets: 3, reps: 40, weight: 0, duration: 40, restBetweenSets: 45, notes: "Engage glutes." },
          { name: "Bicycle Crunches", muscleGroup: "ABS", sets: 3, reps: 15, weight: 0, duration: 0, restBetweenSets: 45, notes: "Controlled tempo." },
        ],
      },
      Friday: {
        duration: 45,
        notes: "Full Body Starter C: Leg press machine, dumbbell press and arm curl.",
        exercises: [
          { name: "Leg Press", muscleGroup: "LEGS", sets: 3, reps: 10, weight: 90, duration: 0, restBetweenSets: 90, notes: "Keep knees tracking toes." },
          { name: "Dumbbell Press", muscleGroup: "CHEST", sets: 3, reps: 10, weight: 14, duration: 0, restBetweenSets: 75, notes: "Comfortable shoulder range." },
          { name: "Dumbbell Rows", muscleGroup: "BACK", sets: 3, reps: 10, weight: 14, duration: 0, restBetweenSets: 60, notes: "One arm on bench." },
          { name: "Barbell Curls", muscleGroup: "BICEPS", sets: 3, reps: 10, weight: 15, duration: 0, restBetweenSets: 60, notes: "Controlled bicep curl." },
        ],
      },
      Saturday: {
        duration: 35,
        notes: "Calves, Core & Posture: Lower leg stability and erector strength.",
        exercises: [
          { name: "Calf Raises", muscleGroup: "LEGS", sets: 3, reps: 15, weight: 30, duration: 0, restBetweenSets: 45, notes: "Pause at top." },
          { name: "Back Extensions", muscleGroup: "BACK", sets: 3, reps: 12, weight: 0, duration: 0, restBetweenSets: 45, notes: "Bodyweight back extension." },
          { name: "Hanging Leg Raises", muscleGroup: "ABS", sets: 3, reps: 10, weight: 0, duration: 0, restBetweenSets: 45, notes: "Knee tucks to chest." },
        ],
      },
    },
  },

  posturalCorrection: {
    label: "Desk Worker Posture & Core Fix",
    icon: "🧘",
    category: "Beginner & Posture",
    tag: "Posture Alignment & Core Fix (6-Day)",
    description: "Corrects forward-head slouch, rounded shoulders, anterior pelvic tilt, and dormant glutes common in desk workers.",
    plan: {
      Monday: {
        duration: 50,
        notes: "Posterior Chain & Upper Back: Retract scapulae, build erectors and brace core.",
        exercises: [
          { name: "Deadlifts", muscleGroup: "BACK", sets: 3, reps: 6, weight: 80, duration: 0, restBetweenSets: 120, notes: "Strengthen entire spine." },
          { name: "Face Pulls", muscleGroup: "BACK", sets: 4, reps: 15, weight: 20, duration: 0, restBetweenSets: 60, notes: "Pull to forehead, externally rotate." },
          { name: "Barbell Rows", muscleGroup: "BACK", sets: 3, reps: 10, weight: 55, duration: 0, restBetweenSets: 75, notes: "Squeeze shoulder blades." },
          { name: "Back Extensions", muscleGroup: "BACK", sets: 3, reps: 15, weight: 10, duration: 0, restBetweenSets: 60, notes: "Hold top extension 2s." },
          { name: "Planks", muscleGroup: "ABS", sets: 3, reps: 60, weight: 0, duration: 60, restBetweenSets: 45, notes: "Posterior pelvic tilt plank." },
        ],
      },
      Tuesday: {
        duration: 45,
        notes: "Hip Activation & Core: Wake up sleepy glutes and decompress lumbar curve.",
        exercises: [
          { name: "Glute Bridges", muscleGroup: "LEGS", sets: 4, reps: 15, weight: 20, duration: 0, restBetweenSets: 60, notes: "Max glute activation." },
          { name: "Hip Thrusts", muscleGroup: "LEGS", sets: 3, reps: 12, weight: 55, duration: 0, restBetweenSets: 75, notes: "Full hip extension." },
          { name: "Hanging Leg Raises", muscleGroup: "ABS", sets: 3, reps: 12, weight: 0, duration: 0, restBetweenSets: 45, notes: "Decompress spine on hang." },
          { name: "Russian Twists", muscleGroup: "ABS", sets: 3, reps: 20, weight: 5, duration: 0, restBetweenSets: 45, notes: "Gentle torso rotation." },
        ],
      },
      Wednesday: {
        duration: 50,
        notes: "Scapular Retraction & Push Posture: Pectoral stretch and upper back stability.",
        exercises: [
          { name: "Push-Ups", muscleGroup: "CHEST", sets: 3, reps: 15, weight: 0, duration: 0, restBetweenSets: 60, notes: "Full scapular protraction/retraction." },
          { name: "Incline Bench Press", muscleGroup: "CHEST", sets: 3, reps: 10, weight: 50, duration: 0, restBetweenSets: 75, notes: "Upper chest angle." },
          { name: "Dumbbell Rows", muscleGroup: "BACK", sets: 3, reps: 12, weight: 20, duration: 0, restBetweenSets: 60, notes: "Strict unilateral row." },
          { name: "Face Pulls", muscleGroup: "BACK", sets: 4, reps: 15, weight: 20, duration: 0, restBetweenSets: 45, notes: "Rear delt posture." },
        ],
      },
      Thursday: {
        duration: 40,
        notes: "Core Anti-Extension & Mobility: Prevent anterior pelvic tilt and lower back fatigue.",
        exercises: [
          { name: "Planks", muscleGroup: "ABS", sets: 4, reps: 60, weight: 0, duration: 60, restBetweenSets: 45, notes: "Neutral pelvis." },
          { name: "Bicycle Crunches", muscleGroup: "ABS", sets: 3, reps: 20, weight: 0, duration: 0, restBetweenSets: 45, notes: "Controlled contraction." },
          { name: "Mountain Climbers", muscleGroup: "ABS", sets: 3, reps: 30, weight: 0, duration: 30, restBetweenSets: 30, notes: "Hip mobility." },
        ],
      },
      Friday: {
        duration: 50,
        notes: "Glute Power & Lower Chain: Squat biomechanics and posterior power.",
        exercises: [
          { name: "Squats", muscleGroup: "LEGS", sets: 3, reps: 8, weight: 70, duration: 0, restBetweenSets: 90, notes: "Drive knees out." },
          { name: "Hip Thrusts", muscleGroup: "LEGS", sets: 4, reps: 12, weight: 65, duration: 0, restBetweenSets: 75, notes: "Glute lock." },
          { name: "Leg Curls", muscleGroup: "LEGS", sets: 3, reps: 12, weight: 38, duration: 0, restBetweenSets: 60, notes: "Hamstrings." },
          { name: "Calf Raises", muscleGroup: "LEGS", sets: 4, reps: 15, weight: 45, duration: 0, restBetweenSets: 45, notes: "Full stretch at bottom." },
        ],
      },
      Saturday: {
        duration: 45,
        notes: "Upper Spine & Shoulder Integrity: Rear delts, back width and abdominal rollouts.",
        exercises: [
          { name: "Pull-Ups", muscleGroup: "BACK", sets: 3, reps: 8, weight: 0, duration: 0, restBetweenSets: 75, notes: "Spinal decompression." },
          { name: "Lateral Raises", muscleGroup: "SHOULDERS", sets: 4, reps: 15, weight: 8, duration: 0, restBetweenSets: 45, notes: "Light lateral delts." },
          { name: "Rear Delt Flyes", muscleGroup: "SHOULDERS", sets: 4, reps: 15, weight: 8, duration: 0, restBetweenSets: 45, notes: "Open chest posture." },
          { name: "Ab Rollouts", muscleGroup: "ABS", sets: 3, reps: 12, weight: 0, duration: 0, restBetweenSets: 45, notes: "Deep core stability." },
        ],
      },
    },
  },
};

const PRESET_CATEGORIES = [
  "All",
  "Hypertrophy",
  "Strength",
  "Athletic & HIIT",
  "Specialized",
  "Beginner & Posture",
];

// ==========================================
// 4. EXERCISE PLAN FORM WITH 1-CLICK PRESETS
// ==========================================
export const ExercisePlanForm = ({ data, updateData }) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const muscleGroups = Object.keys(exerciseCategories);
  const [activeDay, setActiveDay] = useState("Monday");
  const [activePresetKey, setActivePresetKey] = useState("ppl");
  const [presetCategoryFilter, setPresetCategoryFilter] = useState("All");

  const applyPreset = (presetKey) => {
    setActivePresetKey(presetKey);
    if (presetKey === "custom") {
      const blankPlan = {};
      days.forEach((day) => {
        blankPlan[day] = { exercises: [], notes: "", duration: 0 };
      });
      updateData(blankPlan);
      return;
    }

    const selectedPreset = WORKOUT_PRESETS[presetKey];
    if (selectedPreset && selectedPreset.plan) {
      updateData(JSON.parse(JSON.stringify(selectedPreset.plan)));
    }
  };

  const addExercise = (day) => {
    const currentDayPlan = data[day] || { exercises: [], notes: "", duration: 0 };
    const defaultGroup = muscleGroups[0] || "CHEST";
    const availableExercises = exerciseCategories[defaultGroup] || [];

    const updatedData = {
      ...data,
      [day]: {
        ...currentDayPlan,
        exercises: [
          ...currentDayPlan.exercises,
          {
            name: availableExercises[0] || "",
            muscleGroup: defaultGroup,
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

  const removeExercise = (day, exerciseIndex) => {
    const currentDayPlan = data[day];
    const updatedExercises = [...currentDayPlan.exercises];
    updatedExercises.splice(exerciseIndex, 1);

    updateData({
      ...data,
      [day]: {
        ...currentDayPlan,
        exercises: updatedExercises,
      },
    });
  };

  const updateExercise = (day, exerciseIndex, field, value) => {
    const currentDayPlan = data[day];
    const updatedExercises = [...currentDayPlan.exercises];

    if (field === "muscleGroup") {
      const exercisesForNewGroup = exerciseCategories[value] || [];
      updatedExercises[exerciseIndex] = {
        ...updatedExercises[exerciseIndex],
        muscleGroup: value,
        name: exercisesForNewGroup[0] || "",
      };
    } else {
      updatedExercises[exerciseIndex] = {
        ...updatedExercises[exerciseIndex],
        [field]: value,
      };
    }

    updateData({
      ...data,
      [day]: {
        ...currentDayPlan,
        exercises: updatedExercises,
      },
    });
  };

  const updateDayDetails = (day, field, value) => {
    const currentDayPlan = data[day] || { exercises: [], notes: "", duration: 0 };
    updateData({
      ...data,
      [day]: {
        ...currentDayPlan,
        [field]: value,
      },
    });
  };

  const selectedDayPlan = data[activeDay] || { exercises: [], notes: "", duration: 0 };

  const filteredPresets = Object.entries(WORKOUT_PRESETS).filter(([key, preset]) => {
    if (presetCategoryFilter === "All") return true;
    return preset.category === presetCategoryFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header and 1-Click Preset Bar */}
      <div className="border border-border bg-surface-elevated/40 p-4 rounded-[6px] flex flex-col gap-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
              <Dumbbell size={16} className="text-primary" />
              <span>Structured 6-Day Periodization Routine ({Object.keys(WORKOUT_PRESETS).length} Industry Splits)</span>
            </h3>
            <p className="text-xs text-muted-ink mt-0.5">
              Select an established split preset below to auto-populate target exercises, sets, reps &amp; load.
            </p>
          </div>

          {/* Quick Dropdown Fallback */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-semibold text-muted-ink whitespace-nowrap">Dropdown:</span>
            <select
              value={activePresetKey}
              onChange={(e) => applyPreset(e.target.value)}
              className="h-8 px-2.5 text-xs font-medium rounded-[4px] border border-border bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-primary font-sans cursor-pointer max-w-[280px]"
            >
              <optgroup label="Hypertrophy & Bodybuilding">
                <option value="ppl">⚡ Push-Pull-Legs (PPL) Split</option>
                <option value="arnoldSplit">👑 Arnold Golden Era Split</option>
                <option value="broSplit">💪 Classic Bro-Split (1 Muscle/Day)</option>
                <option value="synergySplit">🎯 Synergy (Chest/Tri, Back/Bi, Legs/Delts)</option>
                <option value="phatSplit">⚡ PHAT (Power & Hypertrophy Adaptive)</option>
                <option value="torsoLimbs">📐 Torso &amp; Limbs Split</option>
              </optgroup>
              <optgroup label="Strength & Powerbuilding">
                <option value="upperLower">🏋️ Upper / Lower Strength</option>
                <option value="phulSplit">🛡️ PHUL (Power Hypertrophy Upper Lower)</option>
                <option value="strength5x5">💥 5x5 Heavy Strength &amp; Powerlifting</option>
              </optgroup>
              <optgroup label="Athletic & High Frequency">
                <option value="fullBody">🔥 Full Body 3x Strength &amp; Conditioning</option>
                <option value="fatLossHiit">⚡ Fat Loss &amp; Metabolic HIIT</option>
                <option value="pushPullAthletic">🏃 Push / Pull 4-Day Athletic Split</option>
              </optgroup>
              <optgroup label="Specialized Programming">
                <option value="gluteSpecialization">🍑 Glute &amp; Lower Body Specialization</option>
                <option value="calisthenicsSplit">🤸 Calisthenics &amp; Bodyweight Dominance</option>
              </optgroup>
              <optgroup label="Beginner & Posture">
                <option value="beginnerLinear">🔰 Beginner Linear Foundation (3-Day)</option>
                <option value="posturalCorrection">🧘 Desk Worker Posture &amp; Core Fix</option>
              </optgroup>
              <option value="custom">📝 Clear to Custom (Blank)</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="pt-2 border-t border-border flex flex-wrap gap-1.5 items-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-ink mr-1">
            Category:
          </span>
          {PRESET_CATEGORIES.map((category) => {
            const count =
              category === "All"
                ? Object.keys(WORKOUT_PRESETS).length
                : Object.values(WORKOUT_PRESETS).filter((p) => p.category === category).length;
            const isSelected = presetCategoryFilter === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setPresetCategoryFilter(category)}
                className={`h-6 px-2 text-[11px] font-semibold rounded-[4px] transition-colors border ${
                  isSelected
                    ? "bg-primary text-on-primary border-primary shadow-xs"
                    : "bg-surface text-muted-ink hover:text-ink border-border hover:bg-surface-elevated"
                }`}
              >
                {category} ({count})
              </button>
            );
          })}
        </div>

        {/* 1-Click Preset Chip Buttons */}
        <div className="pt-2 border-t border-border flex flex-wrap gap-1.5 items-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-ink mr-1">
            Quick Splits:
          </span>
          {filteredPresets.map(([key, preset]) => {
            const isActive = activePresetKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => applyPreset(key)}
                className={`h-7 px-2.5 text-xs font-semibold rounded-[4px] border transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-primary text-on-primary border-primary shadow-xs"
                    : "bg-surface hover:bg-surface-elevated border-border text-ink hover:border-primary/40"
                }`}
                title={preset.description}
              >
                <span>{preset.icon}</span>
                <span>{preset.label}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => applyPreset("custom")}
            className={`h-7 px-2.5 text-xs font-semibold rounded-[4px] border transition-all flex items-center gap-1.5 ${
              activePresetKey === "custom"
                ? "bg-primary text-on-primary border-primary shadow-xs"
                : "bg-surface hover:bg-surface-elevated border-border text-muted-ink hover:text-ink"
            }`}
          >
            <span>📝</span>
            <span>Custom (Blank)</span>
          </button>
        </div>

        {/* Active Split Info Banner */}
        {WORKOUT_PRESETS[activePresetKey] && (
          <div className="p-3 bg-surface border border-border rounded-[4px] flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base">{WORKOUT_PRESETS[activePresetKey].icon}</span>
              <span className="font-semibold text-ink text-sm">{WORKOUT_PRESETS[activePresetKey].label}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-primary-soft text-primary-ink border border-primary/20">
                {WORKOUT_PRESETS[activePresetKey].category}
              </span>
              <span className="text-muted-ink hidden sm:inline">•</span>
              <span className="text-muted-ink">{WORKOUT_PRESETS[activePresetKey].description}</span>
            </div>
            <span className="font-mono text-[11px] font-bold text-primary shrink-0 self-start md:self-auto bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
              {WORKOUT_PRESETS[activePresetKey].tag}
            </span>
          </div>
        )}
      </div>

      {/* Day Selector Segmented Tabs */}
      <div className="flex overflow-x-auto gap-1 p-1 bg-surface-elevated border border-border rounded-[6px]">
        {days.map((day) => {
          const count = data[day]?.exercises?.length || 0;
          const isSelected = activeDay === day;
          return (
            <button
              key={day}
              type="button"
              onClick={() => setActiveDay(day)}
              className={`flex-1 min-w-[90px] py-2 px-3 text-xs font-semibold rounded-[4px] transition-colors flex items-center justify-center gap-1.5 ${
                isSelected
                  ? "bg-surface text-ink border border-border shadow-xs"
                  : "text-muted-ink hover:text-ink hover:bg-surface/50"
              }`}
            >
              <span>{day.substring(0, 3)}</span>
              {count > 0 && (
                <span className="font-mono text-[10px] tabular-nums px-1.5 py-0.2 rounded-full bg-canvas border border-border text-muted-ink">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day View */}
      <div className="border border-border rounded-[6px] bg-surface p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
          <div>
            <h4 className="text-sm font-bold text-ink">{activeDay} Prescription</h4>
            <p className="text-xs text-muted-ink">Configure exercises or allocate this day for active recovery.</p>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor={`${activeDay}-duration`} className="text-xs text-muted-ink">
              Est. Duration:
            </Label>
            <div className="flex items-center gap-1">
              <Input
                id={`${activeDay}-duration`}
                type="number"
                value={selectedDayPlan.duration ?? 0}
                onChange={(e) => updateDayDetails(activeDay, "duration", parseInt(e.target.value) || 0)}
                className="w-16 h-8 font-mono tabular-nums text-xs rounded-[4px] border-border bg-canvas text-ink"
              />
              <span className="text-xs text-muted-ink">min</span>
            </div>
          </div>
        </div>

        {selectedDayPlan.exercises.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-border rounded-[6px] bg-canvas">
            <p className="text-xs text-muted-ink mb-3">No exercises assigned for {activeDay} (Rest / Recovery day)</p>
            <button
              type="button"
              onClick={() => addExercise(activeDay)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-border rounded-[4px] bg-surface text-ink hover:bg-surface-elevated"
            >
              <Plus size={14} /> Add First Exercise
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedDayPlan.exercises.map((exercise, idx) => (
              <div
                key={idx}
                className="p-4 border border-border rounded-[6px] bg-surface-elevated/20 hover:border-border-strong transition-colors relative"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-xs font-mono font-semibold text-muted-ink tabular-nums">#{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeExercise(activeDay, idx)}
                    className="text-xs text-muted-ink hover:text-danger p-1 rounded hover:bg-danger/10"
                    title="Remove Exercise"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-ink font-semibold">Muscle Group</Label>
                    <select
                      value={exercise.muscleGroup || muscleGroups[0]}
                      onChange={(e) => updateExercise(activeDay, idx, "muscleGroup", e.target.value)}
                      className="w-full h-9 px-3 rounded-[4px] border border-border bg-surface text-ink text-xs focus:outline-none focus:ring-1 focus:ring-primary uppercase"
                    >
                      {muscleGroups.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-ink font-semibold">Exercise Movement</Label>
                    <select
                      value={exercise.name}
                      onChange={(e) => updateExercise(activeDay, idx, "name", e.target.value)}
                      className="w-full h-9 px-3 rounded-[4px] border border-border bg-surface text-ink text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {(exerciseCategories[exercise.muscleGroup] || []).map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-ink">Sets</Label>
                    <Input
                      type="number"
                      value={exercise.sets ?? 3}
                      onChange={(e) => updateExercise(activeDay, idx, "sets", parseInt(e.target.value) || 0)}
                      className="h-8 font-mono tabular-nums text-xs rounded-[4px] border-border bg-surface text-ink"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-ink">Reps</Label>
                    <Input
                      type="number"
                      value={exercise.reps ?? 10}
                      onChange={(e) => updateExercise(activeDay, idx, "reps", parseInt(e.target.value) || 0)}
                      className="h-8 font-mono tabular-nums text-xs rounded-[4px] border-border bg-surface text-ink"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-ink">Load (kg)</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={exercise.weight ?? 0}
                      onChange={(e) => updateExercise(activeDay, idx, "weight", parseFloat(e.target.value) || 0)}
                      className="h-8 font-mono tabular-nums text-xs rounded-[4px] border-border bg-surface text-ink"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-ink">Rest (sec)</Label>
                    <Input
                      type="number"
                      value={exercise.restBetweenSets ?? 60}
                      onChange={(e) => updateExercise(activeDay, idx, "restBetweenSets", parseInt(e.target.value) || 0)}
                      className="h-8 font-mono tabular-nums text-xs rounded-[4px] border-border bg-surface text-ink"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Input
                    value={exercise.notes || ""}
                    onChange={(e) => updateExercise(activeDay, idx, "notes", e.target.value)}
                    placeholder="Coach instructions (e.g. Pause 2s at bottom, RPE 8)"
                    className="h-8 text-xs rounded-[4px] border-border bg-surface text-ink"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addExercise(activeDay)}
              className="w-full py-2.5 text-xs font-semibold border border-dashed border-border rounded-[4px] text-muted-ink hover:text-ink hover:border-border-strong flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus size={14} /> Add Another Exercise
            </button>
          </div>
        )}

        <div className="pt-3 border-t border-border space-y-1.5">
          <Label className="text-xs text-muted-ink font-semibold">Day Notes &amp; Warm-Up Protocols</Label>
          <Textarea
            value={selectedDayPlan.notes || ""}
            onChange={(e) => updateDayDetails(activeDay, "notes", e.target.value)}
            placeholder="e.g. Foam roll thoracic spine 5 mins, 2 warm-up sets with empty bar..."
            rows={2}
            className="text-xs rounded-[4px] border-border bg-surface text-ink"
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// PRESET DIET PLANS
// ==========================================
const DIET_PRESETS = {
  bulking: {
    label: "High-Protein Muscle Building (3,000 kcal)",
    totalCalories: 3000,
    totalProteins: 200,
    totalCarbs: 350,
    totalFats: 80,
    meals: [
      {
        type: "Breakfast",
        time: "08:00 AM",
        items: [
          { name: "Oatmeal with whey protein, banana & peanut butter", quantity: "1 large bowl", calories: 650, proteins: 45, carbs: 80, fats: 18 },
          { name: "Whole Eggs scrambled with toast", quantity: "3 eggs + 2 slices", calories: 380, proteins: 24, carbs: 28, fats: 16 },
        ],
      },
      {
        type: "Lunch",
        time: "01:30 PM",
        items: [
          { name: "Grilled Chicken Breast with Steamed Rice", quantity: "200g chicken + 1.5 cup rice", calories: 750, proteins: 60, carbs: 85, fats: 14 },
          { name: "Mixed Green Salad with Olive Oil", quantity: "1 bowl", calories: 120, proteins: 3, carbs: 8, fats: 9 },
        ],
      },
      {
        type: "Snack",
        time: "05:00 PM",
        items: [
          { name: "Greek Yogurt with Mixed Berries & Honey", quantity: "250g", calories: 320, proteins: 25, carbs: 38, fats: 6 },
          { name: "Almonds & Walnuts", quantity: "30g", calories: 180, proteins: 6, carbs: 5, fats: 15 },
        ],
      },
      {
        type: "Dinner",
        time: "08:30 PM",
        items: [
          { name: "Salmon Fillet with Sweet Potato & Broccoli", quantity: "180g salmon + 200g potato", calories: 600, proteins: 42, carbs: 46, fats: 18 },
        ],
      },
    ],
  },

  cutting: {
    label: "Lean Cut & Fat Loss (1,800 kcal)",
    totalCalories: 1800,
    totalProteins: 175,
    totalCarbs: 140,
    totalFats: 48,
    meals: [
      {
        type: "Breakfast",
        time: "08:30 AM",
        items: [
          { name: "Egg White Omelet with Spinach & 1 slice toast", quantity: "5 whites + 1 whole", calories: 340, proteins: 36, carbs: 22, fats: 8 },
        ],
      },
      {
        type: "Lunch",
        time: "01:00 PM",
        items: [
          { name: "Grilled Chicken Breast with Quinoa & Steamed Veggies", quantity: "180g chicken + 80g quinoa", calories: 520, proteins: 54, carbs: 45, fats: 12 },
        ],
      },
      {
        type: "Snack",
        time: "04:30 PM",
        items: [
          { name: "Whey Isolate Shake with Water & 1 Apple", quantity: "1 scoop + 1 apple", calories: 220, proteins: 27, carbs: 24, fats: 2 },
        ],
      },
      {
        type: "Dinner",
        time: "08:00 PM",
        items: [
          { name: "Baked White Fish (Tilapia/Cod) with Asparagus", quantity: "200g fish + large salad", calories: 420, proteins: 50, carbs: 15, fats: 14 },
        ],
      },
      {
        type: "Snack",
        time: "10:00 PM",
        items: [
          { name: "Casein Protein or Low-fat Cottage Cheese", quantity: "150g", calories: 140, proteins: 22, carbs: 5, fats: 3 },
        ],
      },
    ],
  },

  maintenance: {
    label: "Athletic Recomp & Maintenance (2,400 kcal)",
    totalCalories: 2400,
    totalProteins: 165,
    totalCarbs: 260,
    totalFats: 65,
    meals: [
      {
        type: "Breakfast",
        time: "08:00 AM",
        items: [
          { name: "Oatmeal with Protein Powder & Sliced Banana", quantity: "1 bowl", calories: 480, proteins: 35, carbs: 65, fats: 10 },
        ],
      },
      {
        type: "Lunch",
        time: "01:00 PM",
        items: [
          { name: "Chicken or Paneer Bowl with Brown Rice & Dal", quantity: "1 full plate", calories: 720, proteins: 50, carbs: 85, fats: 18 },
        ],
      },
      {
        type: "Snack",
        time: "05:00 PM",
        items: [
          { name: "Sprouted Moong Salad & Boiled Eggs", quantity: "1 bowl + 2 eggs", calories: 350, proteins: 22, carbs: 32, fats: 12 },
        ],
      },
      {
        type: "Dinner",
        time: "08:30 PM",
        items: [
          { name: "Grilled Fish / Tofu with Chapati & Stir-fry", quantity: "2 chapatis + protein", calories: 650, proteins: 45, carbs: 62, fats: 18 },
        ],
      },
    ],
  },

  vegetarian: {
    label: "High-Protein Vegetarian Protocol (2,200 kcal)",
    totalCalories: 2200,
    totalProteins: 150,
    totalCarbs: 240,
    totalFats: 65,
    meals: [
      {
        type: "Breakfast",
        time: "08:30 AM",
        items: [
          { name: "Paneer Bhurji with Multigrain Toast & Whey", quantity: "150g paneer + 2 slices", calories: 550, proteins: 42, carbs: 35, fats: 22 },
        ],
      },
      {
        type: "Lunch",
        time: "01:30 PM",
        items: [
          { name: "Soy Chunks & Chickpea Curry with Rice", quantity: "1 large bowl + 1.5 cup rice", calories: 680, proteins: 48, carbs: 85, fats: 14 },
        ],
      },
      {
        type: "Snack",
        time: "05:00 PM",
        items: [
          { name: "Greek Yogurt / Curd with Chia Seeds & Almonds", quantity: "200g", calories: 320, proteins: 20, carbs: 22, fats: 15 },
        ],
      },
      {
        type: "Dinner",
        time: "08:30 PM",
        items: [
          { name: "Lentil Dal with Tofu Stir-Fry & 2 Rotis", quantity: "200g tofu + 2 rotis", calories: 550, proteins: 38, carbs: 62, fats: 14 },
        ],
      },
    ],
  },
};

// ==========================================
// 5. INTERACTIVE NUTRITION & DIET PLAN FORM
// ==========================================
export const DietPlanForm = ({ data, updateData }) => {
  // Normalize data into an active diet plan day
  const defaultInitial = [
    {
      day: "All Days",
      meals: DIET_PRESETS.maintenance.meals,
      totalCalories: DIET_PRESETS.maintenance.totalCalories,
      totalProteins: DIET_PRESETS.maintenance.totalProteins,
      totalCarbs: DIET_PRESETS.maintenance.totalCarbs,
      totalFats: DIET_PRESETS.maintenance.totalFats,
    },
  ];

  const currentPlan = Array.isArray(data) && data.length > 0 ? data[0] : defaultInitial[0];

  // Helper to re-calculate macros
  const recalculateAndSave = (meals) => {
    let totCal = 0;
    let totProt = 0;
    let totCarbs = 0;
    let totFats = 0;

    meals.forEach((m) => {
      (m.items || []).forEach((it) => {
        totCal += Number(it.calories || 0);
        totProt += Number(it.proteins || 0);
        totCarbs += Number(it.carbs || 0);
        totFats += Number(it.fats || 0);
      });
    });

    const updated = [
      {
        day: currentPlan?.day || "All Days",
        meals,
        totalCalories: totCal,
        totalProteins: totProt,
        totalCarbs: totCarbs,
        totalFats: totFats,
      },
    ];
    updateData(updated);
  };

  const importPreset = (presetKey) => {
    const preset = DIET_PRESETS[presetKey];
    if (preset) {
      const updated = [
        {
          day: "All Days",
          meals: JSON.parse(JSON.stringify(preset.meals)),
          totalCalories: preset.totalCalories,
          totalProteins: preset.totalProteins,
          totalCarbs: preset.totalCarbs,
          totalFats: preset.totalFats,
        },
      ];
      updateData(updated);
    }
  };

  const addMeal = () => {
    const newMeal = {
      type: "Snack",
      time: "04:00 PM",
      items: [
        {
          name: "Fresh Fruit or Whey Shake",
          quantity: "1 serving",
          calories: 150,
          proteins: 20,
          carbs: 15,
          fats: 2,
        },
      ],
    };
    const updatedMeals = [...(currentPlan?.meals || []), newMeal];
    recalculateAndSave(updatedMeals);
  };

  const removeMeal = (mealIdx) => {
    const updatedMeals = (currentPlan?.meals || []).filter((_, idx) => idx !== mealIdx);
    recalculateAndSave(updatedMeals);
  };

  const updateMealHeader = (mealIdx, field, value) => {
    const updatedMeals = [...(currentPlan?.meals || [])];
    updatedMeals[mealIdx] = {
      ...updatedMeals[mealIdx],
      [field]: value,
    };
    recalculateAndSave(updatedMeals);
  };

  const addItemToMeal = (mealIdx) => {
    const updatedMeals = [...(currentPlan?.meals || [])];
    const currentItems = updatedMeals[mealIdx]?.items || [];
    updatedMeals[mealIdx] = {
      ...updatedMeals[mealIdx],
      items: [
        ...currentItems,
        {
          name: "New Food Item",
          quantity: "100g",
          calories: 100,
          proteins: 10,
          carbs: 10,
          fats: 2,
        },
      ],
    };
    recalculateAndSave(updatedMeals);
  };

  const removeItemFromMeal = (mealIdx, itemIdx) => {
    const updatedMeals = [...(currentPlan?.meals || [])];
    const updatedItems = (updatedMeals[mealIdx]?.items || []).filter((_, idx) => idx !== itemIdx);
    updatedMeals[mealIdx] = {
      ...updatedMeals[mealIdx],
      items: updatedItems,
    };
    recalculateAndSave(updatedMeals);
  };

  const updateMealItem = (mealIdx, itemIdx, field, value) => {
    const updatedMeals = [...(currentPlan?.meals || [])];
    const items = [...(updatedMeals[mealIdx]?.items || [])];
    items[itemIdx] = {
      ...items[itemIdx],
      [field]: field === "name" || field === "quantity" ? value : parseFloat(value) || 0,
    };
    updatedMeals[mealIdx] = {
      ...updatedMeals[mealIdx],
      items,
    };
    recalculateAndSave(updatedMeals);
  };

  return (
    <div className="space-y-6">
      {/* Header and Preset Import */}
      <div className="border border-border bg-surface-elevated/40 p-4 rounded-[6px] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
            <Utensils size={16} className="text-primary" />
            <span>Prescribed Nutrition &amp; Daily Macro Targets</span>
          </h3>
          <p className="text-xs text-muted-ink mt-0.5">
            Configure daily meals, quantities, and macronutrient targets or import an established protocol.
          </p>
        </div>

        {/* 1-Click Diet Preset Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-ink whitespace-nowrap">Load Protocol:</span>
          <select
            onChange={(e) => {
              if (e.target.value) {
                importPreset(e.target.value);
                e.target.value = "";
              }
            }}
            defaultValue=""
            className="h-8 px-2.5 text-xs font-medium rounded-[4px] border border-border bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-primary font-sans cursor-pointer"
          >
            <option value="" disabled>Choose Diet Protocol...</option>
            <option value="bulking">🥩 Muscle Building Bulking (3,000 kcal)</option>
            <option value="cutting">🔥 Lean Cut / Fat Loss (1,800 kcal)</option>
            <option value="maintenance">⚡ Athletic Maintenance (2,400 kcal)</option>
            <option value="vegetarian">🌱 High-Protein Vegetarian (2,200 kcal)</option>
          </select>
        </div>
      </div>

      {/* Daily Macro Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="border border-border bg-surface p-3.5 rounded-[6px] shadow-xs">
          <span className="text-[11px] uppercase tracking-wider text-muted-ink font-semibold">Calories</span>
          <p className="text-xl font-bold font-mono tabular-nums text-ink mt-1">
            {currentPlan?.totalCalories || 0} <span className="text-xs font-normal text-muted-ink">kcal</span>
          </p>
        </div>
        <div className="border border-border bg-surface p-3.5 rounded-[6px] shadow-xs">
          <span className="text-[11px] uppercase tracking-wider text-muted-ink font-semibold">Protein</span>
          <p className="text-xl font-bold font-mono tabular-nums text-primary-ink mt-1">
            {currentPlan?.totalProteins || 0} <span className="text-xs font-normal text-muted-ink">g</span>
          </p>
        </div>
        <div className="border border-border bg-surface p-3.5 rounded-[6px] shadow-xs">
          <span className="text-[11px] uppercase tracking-wider text-muted-ink font-semibold">Carbs</span>
          <p className="text-xl font-bold font-mono tabular-nums text-ink mt-1">
            {currentPlan?.totalCarbs || 0} <span className="text-xs font-normal text-muted-ink">g</span>
          </p>
        </div>
        <div className="border border-border bg-surface p-3.5 rounded-[6px] shadow-xs">
          <span className="text-[11px] uppercase tracking-wider text-muted-ink font-semibold">Fats</span>
          <p className="text-xl font-bold font-mono tabular-nums text-ink mt-1">
            {currentPlan?.totalFats || 0} <span className="text-xs font-normal text-muted-ink">g</span>
          </p>
        </div>
      </div>

      {/* Editable Meals List */}
      <div className="space-y-4">
        {(currentPlan?.meals || []).map((meal, mealIdx) => (
          <div
            key={mealIdx}
            className="border border-border rounded-[6px] bg-surface p-4 space-y-3 shadow-xs"
          >
            {/* Meal Header */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                <select
                  value={meal.type || "Meal"}
                  onChange={(e) => updateMealHeader(mealIdx, "type", e.target.value)}
                  className="h-8 px-2 text-xs font-bold rounded-[4px] border border-border bg-surface text-ink"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
                <Input
                  value={meal.time || ""}
                  onChange={(e) => updateMealHeader(mealIdx, "time", e.target.value)}
                  placeholder="e.g. 08:30 AM"
                  className="h-8 w-28 text-xs font-mono tabular-nums rounded-[4px] border-border bg-surface text-ink"
                />
              </div>

              <button
                type="button"
                onClick={() => removeMeal(mealIdx)}
                className="text-muted-ink hover:text-danger p-1 rounded hover:bg-danger/10 text-xs"
                title="Remove Meal"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Food Items */}
            <div className="space-y-2">
              {(meal.items || []).map((it, itemIdx) => (
                <div
                  key={itemIdx}
                  className="grid grid-cols-12 gap-2 items-center p-2 rounded-[4px] bg-canvas border border-border text-xs"
                >
                  <div className="col-span-4">
                    <Input
                      value={it.name || ""}
                      onChange={(e) => updateMealItem(mealIdx, itemIdx, "name", e.target.value)}
                      placeholder="Food name"
                      className="h-7 text-xs rounded-[4px] border-border bg-surface text-ink"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      value={it.quantity || ""}
                      onChange={(e) => updateMealItem(mealIdx, itemIdx, "quantity", e.target.value)}
                      placeholder="Qty (e.g. 150g)"
                      className="h-7 text-xs rounded-[4px] border-border bg-surface text-ink"
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      type="number"
                      value={it.calories ?? 0}
                      onChange={(e) => updateMealItem(mealIdx, itemIdx, "calories", e.target.value)}
                      placeholder="kcal"
                      title="Calories"
                      className="h-7 text-xs font-mono tabular-nums rounded-[4px] border-border bg-surface text-ink px-1 text-center"
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      type="number"
                      value={it.proteins ?? 0}
                      onChange={(e) => updateMealItem(mealIdx, itemIdx, "proteins", e.target.value)}
                      placeholder="P (g)"
                      title="Protein (g)"
                      className="h-7 text-xs font-mono tabular-nums rounded-[4px] border-border bg-surface text-ink px-1 text-center"
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      type="number"
                      value={it.carbs ?? 0}
                      onChange={(e) => updateMealItem(mealIdx, itemIdx, "carbs", e.target.value)}
                      placeholder="C (g)"
                      title="Carbs (g)"
                      className="h-7 text-xs font-mono tabular-nums rounded-[4px] border-border bg-surface text-ink px-1 text-center"
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      type="number"
                      value={it.fats ?? 0}
                      onChange={(e) => updateMealItem(mealIdx, itemIdx, "fats", e.target.value)}
                      placeholder="F (g)"
                      title="Fats (g)"
                      className="h-7 text-xs font-mono tabular-nums rounded-[4px] border-border bg-surface text-ink px-1 text-center"
                    />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeItemFromMeal(mealIdx, itemIdx)}
                      className="text-muted-ink hover:text-danger p-1 text-xs"
                      title="Remove Item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addItemToMeal(mealIdx)}
                className="w-full py-1.5 text-[11px] font-semibold border border-dashed border-border rounded-[4px] text-muted-ink hover:text-ink hover:border-border-strong flex items-center justify-center gap-1 transition-colors"
              >
                <Plus size={12} /> Add Food Item
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addMeal}
          className="w-full py-2.5 text-xs font-semibold border border-dashed border-border rounded-[4px] text-muted-ink hover:text-ink hover:border-border-strong flex items-center justify-center gap-1.5 transition-colors bg-surface-elevated/20"
        >
          <Plus size={14} /> Add Another Meal Section
        </button>
      </div>
    </div>
  );
};
