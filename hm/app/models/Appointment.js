// const mongoose = require("mongoose");

// const appointmentSchema = new mongoose.Schema({
//   patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   date: { type: Date, required: true },
//   status: {
//     type: String,
//     enum: ["pending", "approved", "cancelled", "completed"],
//     default: "pending",
//   },
//   notes: { type: String },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);

// const mongoose = require("mongoose");
// const appointmentSchema = new mongoose.Schema({
//   patientId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "User", 
//     required: true 
//   },
//   doctorId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "User", 
//     required: true 
//   },
//   date: { 
//     type: Date, 
//     required: true 
//   },
//   endTime: {  // ⭐ جديد: وقت انتهاء الموعد
//     type: Date,
//     required: true
//   },
//   serviceId: {  // ⭐ جديد: الخدمة المطلوبة (تصفيف شعر، حقن، إلخ)
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Service",
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ["pending", "confirmed", "cancelled", "completed", "no_show"],
//     default: "pending",
//   },
//   notes: { 
//     type: String,
//     maxlength: 500  // ⭐ حد أقصى للملاحظات
//   },
//   paymentStatus: {  // ⭐ جديد: حالة الدفع
//     type: String,
//     enum: ["pending", "partial", "paid", "refunded"],
//     default: "pending"
//   },
//   reminders: [{  // ⭐ جديد: التذكيرات المرسلة
//     type: {
//       method: { type: String, enum: ["email", "sms"] },
//       sentAt: Date,
//       received: Boolean
//     }
//   }],
//   createdAt: { 
//     type: Date, 
//     default: Date.now 
//   },
//   updatedAt: { 
//     type: Date, 
//     default: Date.now 
//   }
// }, {
//   toJSON: { virtuals: true },  // ⭐ لإضافة حقول افتراضية
//   toObject: { virtuals: true }
// });

// // ⭐ افتراضيًا: فرز المواعيد حسب التاريخ
// appointmentSchema.index({ date: 1 });

// // ⭐ حساب مدة الموعد (حقل افتراضي)
// appointmentSchema.virtual('duration').get(function() {
//   return (this.endTime - this.date) / (1000 * 60); // الدقائق
// });

// // ⭐ تحديث updatedAt تلقائيًا
// appointmentSchema.pre('save', function(next) {
//   this.updatedAt = new Date();
//   next();
// });

// export default mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);


// import mongoose from 'mongoose';

// const appointmentSchema = new mongoose.Schema({
//   doctorName: {
//     type: String,
//     required: [true, 'اسم الطبيب مطلوب']
//   },
//   doctor: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Doctor'
//   },
//   patient: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Patient',
//     required: true
//   },
//   patientName: {
//     type: String,
//     required: true
//   },
//   appointmentDate: {
//     type: Date,
//     required: [true, 'تاريخ الموعد مطلوب']
//   },
//   day: {
//     type: String,
//     enum: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
//     required: true
//   },
//   timeSlot: {
//     type: String,
//     required: true
//   },
//   appointmentType: {
//     type: String,
//     enum: ['clinic', 'video'],
//     default: 'clinic'
//   },
//   reason: {
//     type: String,
//     required: [true, 'سبب الحجز مطلوب']
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'confirmed', 'completed', 'canceled'],
//     default: 'pending'
//   },
//   amount: {
//     type: Number,
//     required: true
//   },
//   currency: {
//     type: String,
//     default: 'JOD'
//   },
//   paymentStatus: {
//     type: String,
//     enum: ['pending', 'paid', 'failed'],
//     default: 'pending'
//   }
// }, { timestamps: true });

// // Middleware للتحقق من توفر الطبيب
// appointmentSchema.pre('save', async function(next) {
//   try {
//     const doctor = await mongoose.model('Doctor').findOne({ 
//       name: this.doctorName 
//     });
    
//     if (!doctor) {
//       throw new Error('الطبيب غير موجود');
//     }
    
//     this.doctor = doctor._id;
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// export default mongoose.models.Appointment || 
//        mongoose.model('Appointment', appointmentSchema);




import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  doctorName: {
    type: String,
    required: [true, 'اسم الطبيب مطلوب']
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  patientName: {
    type: String,
    
  },
  appointmentDate: {
    type: Date,
    required: [true, 'تاريخ الموعد مطلوب'],
    index: true
  },
  day: {
    type: String,
    enum: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    required: true
  },
  timeSlot: {
    type: String,
    required: [true, 'وقت الموعد مطلوب']
  },
  appointmentType: {
    type: String,
    enum: ['clinic', 'video'],
    default: 'clinic'
  },
  reason: {
    type: String,
    required: [true, 'سبب الحجز مطلوب']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'canceled'],
    default: 'pending'
  },
  amount: {
    type: Number,
    default: 15
  },
  currency: {
    type: String,
    default: 'JOD'
  }
}, { 
  timestamps: true,
  indexes: [
    { fields: { doctorName: 1, appointmentDate: 1, timeSlot: 1 }, unique: true }
  ]
});
// appointmentSchema.index(
//   { doctorName: 1, appointmentDate: 1, timeSlot: 1 },
//   { unique: true }
// );

// Middleware للتحقق من الطبيب
appointmentSchema.pre('save', async function(next) {
  try {
    const doctor = await mongoose.model('Doctor').findOne({ 
      name: this.doctorName 
    });
    
    if (doctor) {
      this.doctor = doctor._id;
    }
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.models.Appointment || 
       mongoose.model('Appointment', appointmentSchema);