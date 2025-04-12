const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  fileUrl: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Report || mongoose.model("Report", reportSchema);