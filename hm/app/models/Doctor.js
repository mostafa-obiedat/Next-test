// models/Doctor.js
import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String },
  availability: {
    days: [String],
    timeSlots: [String]
  }
  // أضف حقول أخرى حسب الحاجة
});

export default mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);