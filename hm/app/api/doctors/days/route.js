import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db';
import Doctor from '@/app/models/Doctor';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    // التحقق من صحة ID الطبيب
    if (!params.id || !/^[0-9a-fA-F]{24}$/.test(params.id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid doctor ID format' },
        { status: 400 }
      );
    }

    const doctor = await Doctor.findById(params.id).select('availability.days');
    
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Doctor not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      days: doctor.availability?.days || []
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}