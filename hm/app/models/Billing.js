const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  amount: { type: Number, required: true },
  description: { type: String, required: false }, // اجعلها اختيارية
  status: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  paymentMethod: { type: String, enum: ["stripe", "paypal", "cash"], required: false },
  paymentDate: { type: Date, default: Date.now },
  paymentId: { type: String },
  paymentDetails: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Billing || mongoose.model("Billing", billingSchema);
