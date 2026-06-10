import mongoose from "mongoose";

const emailOtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["donor", "ngo"],
      required: true,
    },
    purpose: {
      type: String,
      enum: ["registration"],
      default: "registration",
      required: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
  }
);

emailOtpSchema.index({ email: 1, purpose: 1, role: 1 });

export default mongoose.model("EmailOtp", emailOtpSchema);
