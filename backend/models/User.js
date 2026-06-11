import mongoose from "mongoose";
import { FIXED_SERVICE_CITY, SUPPORTED_CITIES } from "../constants/location.js";

const userSchema = new mongoose.Schema(
  {
    name: {
  type: String,
  trim: true,
  required: function () {
    return this.role === "donor";
  }
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
      unique: true,
      sparse: true,
    },

    role: {
      type: String,
      enum: ["donor", "ngo", "admin"],
      default: "donor",
    },

    location: {
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

    
    profileImage: {
      type: String,
      default: "",
    },

    // NGO specific fields
    ngoName: {
      type: String,
      required() {
        return this.role === "ngo";
      },
      trim: true,
    },

    ngoRegistrationNumber: {
      type: String,
      required() {
        return this.role === "ngo";
      },
      trim: true,
    },

    ngoDocument: {
      type: String,
      required() {
        return this.role === "ngo";
      },
    },

    ngoVerificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: function () {
        return this.role === "ngo" ? "pending" : undefined;
      },
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
