const mongoose = require("mongoose");

const GymSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      street: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
      zipCode: {
        type: String,
        required: true,
        trim: true,
      },
    },
    contact: {
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
    },

    amenities: [
      {
        type: String,
        enum: [
          "Cardio Equipment",
          "Weight Training",
          "Group Classes",
          "Swimming Pool",
          "Sauna",
          "Locker Rooms",
          "Personal Training",
        ],
      },
    ],
    operatingHours: {
      openTime: {
        type: String,
        required: true,
      },
      closeTime: {
        type: String,
        required: true,
      },
      daysOpen: [
        {
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
      ],
    },
    memberShipPlans: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        duration: {
          type: String,
          enum: ["Monthly", "Quarterly", "Annual"],
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Gym", GymSchema);
