import mongoose from "mongoose";

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
      type: String,
      required: true,
    },


    expiryTime: {
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