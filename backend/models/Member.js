const mongoose = require("mongoose");
const excerciseCategories = require("./ExcerciseCategories");

const allExercises = Object.values(excerciseCategories).flat();
// const measurementSchema = new mongoose.Schema({
//   date: {
//     type: Date,
//     default: Date.now,
//   },
//   weight: {
//     type: Number,
//   },
//   height: {
//     type: Number,
//   },

//   chest: {
//     type: Number,
//   },
//   waist: {
//     type: Number,
//   },
//   hips: {
//     type: Number,
//   },
//   biceps: {
//     type: Number,
//   },

//   thighs: {
//     type: Number,
//   },
//   bodyFatPercentage: {
//     type: Number,
//   },
//   bmi: {
//     type: Number,
//   },
// });

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: allExercises,
    required: true,
  },
  muscleGroup: {
    type: String,
    enum: Object.keys(excerciseCategories),
    // required: true,
  },
  sets: {
    type: Number,
    required: true,
    min: 1,
  },
  reps: {
    type: Number,
    required: true,
    min: 1,
  },
  weight: {
    type: Number,
    min: 0,
  },
  duration: {
    type: Number,
    min: 0,
  },
  restBetweenSets: {
    type: Number,
    default: 60,
  },
  notes: String,
  progression: [
    {
      date: Date,
      weight: Number,
      reps: Number,
      notes: String,
    },
  ],
});

// Updated to be an object with day keys
const workoutPlanSchema = new mongoose.Schema({
  Monday: {
    exercises: [exerciseSchema],
    notes: String,
    duration: Number,
  },
  Tuesday: {
    exercises: [exerciseSchema],
    notes: String,
    duration: Number,
  },
  Wednesday: {
    exercises: [exerciseSchema],
    notes: String,
    duration: Number,
  },
  Thursday: {
    exercises: [exerciseSchema],
    notes: String,
    duration: Number,
  },
  Friday: {
    exercises: [exerciseSchema],
    notes: String,
    duration: Number,
  },
  Saturday: {
    exercises: [exerciseSchema],
    notes: String,
    duration: Number,
  },
  
});

const mealSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
  },
  time: String,
  items: [
    {
      name: String,
      quantity: String,
      calories: Number,
      proteins: Number,
      carbs: Number,
      fats: Number,
    },
  ],
});

const dietPlanSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  meals: [mealSchema],
  totalCalories: Number,
  totalProteins: Number,
  totalCarbs: Number,
  totalFats: Number,
});

const memberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      required: true,
    },
    memberShipPlan: {
      name: String,
      duration: {
        type: String,
        enum: ["Monthly", "Quarterly", "Annual"],
        required: true,
      },
      startDate: {
        type: Date,
        required: true,
        default: Date.now,
      },
      endDate: {
        type: Date,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "pending",
    },
    healthInfo: {
      medicalConditions: [String],
      allergies: [String],
      bloodGroup: String,
    },
    measurements: {
      date: {
        type: Date,
        default: Date.now,
      },
      weight: Number,
      height: Number,
      chest: Number,
      waist: Number,
      hips: Number,
      biceps: Number,
      thighs: Number,
      bodyFatPercentage: Number,
      bmi: Number,
    },
    exercisePlan: workoutPlanSchema,
    dietPlan: [dietPlanSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Member", memberSchema);
