import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Appointment from '@/app/models/Appointment';

// Helper function to handle params
async function getParams(request) {
  const { id } = await request.params;
  return { id };
}

// Get single appointment
export async function GET(request) {
  try {
    await dbConnect();
    const { id } = await getParams(request);
    
    const appointment = await Appointment.findById(id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization');
      
    if (!appointment) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: appointment });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// Update appointment
export async function PUT(request) {
  try {
    await dbConnect();
    const { id } = await getParams(request);
    const body = await request.json();
    
    const appointment = await Appointment.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).populate('patient doctor');
    
    if (!appointment) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: appointment });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// Delete appointment
export async function DELETE(request) {
  try {
    await dbConnect();
    const { id } = await getParams(request);
    
    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    
    if (!deletedAppointment) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}