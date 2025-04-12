import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db';
import Appointment from '@/app/models/Appointment';

export async function POST(request) {
  await dbConnect();
  
  try {
    const { appointmentId, paymentStatus, billingId } = await request.json();
    
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { 
        paymentStatus,
        billingId
      },
      { new: true }
    );
    
    if (!updatedAppointment) {
      return NextResponse.json(
        { success: false, message: 'Appointment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, data: updatedAppointment },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}