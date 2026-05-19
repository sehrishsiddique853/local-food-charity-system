import mongoose from "mongoose";

const ngoVerificationSchema = new mongoose.Schema(
  {
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    rejectionReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "NgoVerification",
  ngoVerificationSchema
);