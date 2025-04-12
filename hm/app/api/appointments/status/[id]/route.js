import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Appointment from '@/app/models/Appointment';

// Update appointment status
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { status } = await request.json();
    
    if (!['pending', 'confirmed', 'canceled'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    const appointment = await Appointment.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    ).populate('patient doctor');
    
    if (!appointment) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: appointment });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}