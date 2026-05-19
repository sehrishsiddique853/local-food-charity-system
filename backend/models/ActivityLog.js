import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    action: {
      type: String,
      required: true,
    },

    targetType: {
      type: String,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    details: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "ActivityLog",
  activityLogSchema
);