const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  medication: { type: String, required: true },
  dosage: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Prescription || mongoose.model("Prescription", prescriptionSchema);