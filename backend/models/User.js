import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    role: {
      type: String,
      enum: ["donor", "ngo", "admin"],
      default: "donor",
    },

    location: {
      type: String,
    },

    
    profileImage: {
      type: String,
      default: "",
    },

    // NGO specific fields
    ngoName: {
      type: String,
    },

    ngoRegistrationNumber: {
      type: String,
    },

    ngoDocument: {
      type: String,
    },

    ngoVerificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);