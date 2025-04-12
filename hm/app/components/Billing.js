const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const billingSchema = new Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // أو "Patient" حسب نموذجك
    required: true,
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true
  },
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  status: {
    type: String,
    enum: ["pending", "paid", "canceled", "failed"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "paypal"],
    required: true,
  },
  paymentId: String, // معرّف الدفع من PayPal
  paymentDetails: Object, // تفاصيل الدفع الكاملة
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Billing", billingSchema);