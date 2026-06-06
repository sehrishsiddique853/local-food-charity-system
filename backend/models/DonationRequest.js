import mongoose from "mongoose";

const donationRequestSchema = new mongoose.Schema(
  {
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      required: true,
    },

    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    requestStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "collected"],
      default: "pending",
    },

    adminMessage: {
      type: String,
    },

    pickupTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

donationRequestSchema.index(
  { donation: 1, ngo: 1, requestStatus: 1 },
  {
    unique: true,
    partialFilterExpression: {
      requestStatus: { $in: ["pending", "approved"] },
    },
  }
);

export default mongoose.model(
  "DonationRequest",
  donationRequestSchema
);
