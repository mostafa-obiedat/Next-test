// import { NextResponse } from 'next/server';
// import dbConnect from '@/app/lib/db';
// import Doctor from '@/app/models/Doctor';

// export async function GET(request, { params }) {
//   try {
//     await dbConnect();
//     const doctor = await Doctor.findById(params.id).select('availability');
    
//     if (!doctor) {
//       return NextResponse.json({ success: false, error: 'Doctor not found' }, { status: 404 });
//     }
    
//     return NextResponse.json({ 
//       success: true, 
//       data: {
//         days: doctor.availability.days,
//         timeSlots: doctor.availability.timeSlots
//       }
//     });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db';
import Doctor from '@/app/models/Doctor';

export async function POST(request) {
  try {
    await dbConnect();
    const { doctorName } = await request.json();

    if (!doctorName) {
      return NextResponse.json(
        { success: false, error: 'Doctor name is required' },
        { status: 400 }
      );
    }

    const doctor = await Doctor.findOne({ name: doctorName })
      .select('availability.days availability.timeSlots');

    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Doctor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      days: doctor.availability?.days || [],
      timeSlots: doctor.availability?.timeSlots || []
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } }

// import { NextResponse } from 'next/server';
// import dbConnect from '@/app/lib/db';
// import Doctor from '@/app/models/Doctor';

// export async function GET(request) {
//   try {
//     await dbConnect();

//     const { searchParams } = new URL(request.url);
//     const doctorId = searchParams.get('doctorId');

//     if (!doctorId) {
//       return NextResponse.json(
//         { success: false, error: 'معرف الطبيب مطلوب' },
//         { status: 400 }
//       );
//     }

//     // جلب بيانات الطبيب مع حقول التوفر فقط
//     const doctor = await Doctor.findById(doctorId)
//       .select('availability days timeSlots');

//     if (!doctor) {
//       return NextResponse.json(
//         { success: false, error: 'الطبيب غير موجود' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       data: {
//         days: doctor.availability?.days || [],
//         timeSlots: doctor.availability?.timeSlots || []
//       }
//     });

//   } catch (error) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }