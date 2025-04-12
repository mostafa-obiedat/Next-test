const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  medicalHistory: [
    {
      condition: { type: String, required: true },
      diagnosedDate: { type: Date, required: true },
      notes: { type: String },
    },
  ],
  prescriptions: [
    {
      medication: { type: String, required: true },
      dosage: { type: String, required: true },
      prescribedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      date: { type: Date, default: Date.now },
      fileUrl: { type: String },
    },
  ],
  testResults: [
    {
      testName: { type: String, required: true },
      result: { type: String, required: true },
      date: { type: Date, default: Date.now },
      fileUrl: { type: String },
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Patient || mongoose.model("Patient", patientSchema);