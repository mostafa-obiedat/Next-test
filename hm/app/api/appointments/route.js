import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import Appointment from "@/app/models/Appointment";
import Doctor from "@/app/models/Doctor";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    await dbConnect();
    
    // 1. التحقق من اتصال قاعدة البيانات
    if (mongoose.connection.readyState !== 1) {
      throw new Error("لا يوجد اتصال بقاعدة البيانات");
    }

    const body = await request.json();
    console.log("بيانات الواردة:", body);

    // 2. التحقق من التوكن
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;    

    if (!token) {
      return NextResponse.json(
        { success: false, error: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      );
    }

    // 3. فك تشفير التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "patient") {
      return NextResponse.json(
        { success: false, error: "فقط المرضى يمكنهم حجز المواعيد" },
        { status: 403 }
      );
    }

    // 4. التحقق من الحقول المطلوبة
    const requiredFields = ['doctorName', 'appointmentDate', 'day', 'timeSlot', 'reason'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `الحقول المطلوبة ناقصة: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // 5. تحويل التاريخ إلى كائن Date
    const appointmentDate = new Date(body.appointmentDate);
    if (isNaN(appointmentDate.getTime())) {
      return NextResponse.json(
        { success: false, error: "تنسيق التاريخ غير صحيح" },
        { status: 400 }
      );
    }

    // 6. التحقق من عدم وجود موعد متكرر
    const existingAppointment = await Appointment.findOne({
      doctorName: body.doctorName,
      appointmentDate,
      timeSlot: body.timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return NextResponse.json(
        { success: false, error: "هذا الموعد محجوز مسبقاً" },
        { status: 400 }
      );
    }

    

    // 7. إنشاء الموعد
    const appointment = await Appointment.create({
      doctorName: body.doctorName,
      appointmentDate,
      day: body.day,
      timeSlot: body.timeSlot,
      appointmentType: body.appointmentType,
      reason: body.reason,
      amount: body.amount || 15,
      currency: body.currency || 'JOD',
      patient: decoded.userId,
      patientName: decoded.name,
      status: 'pending'
    });

    // 8. تحديث حقل الطبيب إذا كان موجوداً
    try {
      const doctor = await Doctor.findOne({ name: body.doctorName });
      if (doctor) {
        appointment.doctor = doctor._id;
        await appointment.save();
      }
    } catch (doctorError) {
      console.error("خطأ في تحديث بيانات الطبيب:", doctorError);
    }

    return NextResponse.json(
      {
        success: true,
        data: appointment,
        message: "تم حجز الموعد بنجاح"
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("تفاصيل الخطأ في الخادم:", {
      message: error.message,
      stack: error.stack
    });

    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ غير متوقع في الخادم",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
// import { NextResponse } from 'next/server';
// import dbConnect from '@/app/lib/db';
// import Appointment from '@/app/models/Appointment';

// export async function POST(request) {
//   await dbConnect();
  
//   try {
//     const { appointmentId, paymentStatus, billingId } = await request.json();
    
//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       appointmentId,
//       { 
//         paymentStatus,
//         billingId
//       },
//       { new: true }
//     );
    
//     if (!updatedAppointment) {
//       return NextResponse.json(
//         { success: false, message: 'Appointment not found' },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json(
//       { success: true, data: updatedAppointment },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 400 }
//     );
//   }
// }