import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    localId: { type: String, index: true },
    fullName: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true, default: "" },
    whatsappNumber: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    spaceType: { type: String, required: true },
    primaryGoal: { type: String, required: true },
    scale: { type: String, required: true },
    blueprintName: { type: String, default: "" },
    estimatedHarvest: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now },
    emailSentAt: { type: Date },
  },
  { timestamps: true },
);

leadSchema.index({ localId: 1 }, { unique: true, sparse: true });

export default mongoose.model("Lead", leadSchema);
