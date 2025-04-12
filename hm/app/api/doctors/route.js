import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db';
import Doctor from '@/app/models/Doctor';

export async function GET() {
  try {
    await dbConnect();
    
    const doctors = await Doctor.find({}).select('name specialty');
    
    return NextResponse.json({ 
      success: true, 
      data: doctors 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// import { NextResponse } from 'next/server';
// import dbConnect from '@/app/lib/db';
// import Doctor from '@/app/models/Doctor';

// export async function GET(request) {
//   try {
//     await dbConnect();
    
//     // جلب جميع الأطباء مع الحقول الأساسية
//     const doctors = await Doctor.find()
//       .select('name specialty availability')
//       .lean();

//     return NextResponse.json({
//       success: true,
//       count: doctors.length,
//       doctors
//     });
    
//   } catch (error) {
//     console.error('Error fetching doctors:', error);
//     return NextResponse.json(
//       { success: false, message: 'Failed to fetch doctors', error: error.message },
//       { status: 500 }
//     );
//   }
// }