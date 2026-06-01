import mongoose from "mongoose";
import { FIXED_SERVICE_CITY, SUPPORTED_CITIES } from "../constants/location.js";

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    foodTitle: {
      type: String,
      required: true,
    },

    foodType: {
      type: String,
      enum: ["cooked", "packed", "raw", "bakery", "beverages"],
    },

   quantity: {
  value: {
    type: Number,
    required: true,
  },

  unit: {
    type: String,
    enum: ["plates", "kg", "boxes", "packets", "bottles", "trays"],
    required: true,
  },
},

    description: {
      type: String,
    },

    pickupAddress: {
      city: {
        type: String,
        enum: SUPPORTED_CITIES,
        default: FIXED_SERVICE_CITY,
        immutable: true,
        required: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
    },


    expiryDate: {
      type: Date,
      required: true,
    },

    images: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: [
        "available",
        "requested",
        "booked",
        "collected",
        "completed",
        "expired",
        "cancelled",
      ],
      default: "available",
    },

    bookedByNgo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Donation", donationSchema);
