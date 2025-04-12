import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Billing from '@/app/models/Billing';

export async function POST(request) {
  await dbConnect();

  try {
    const { patientId, appointmentId, amount, paymentMethod, paymentDetails } = await request.json();

    const newBilling = new Billing({
      patient: patientId,
      appointment: appointmentId,
      totalAmount: amount,
      paymentMethod,
      status: 'paid',
      paymentId: paymentDetails.id,
      paymentDetails
    });

    const savedBilling = await newBilling.save();

    return NextResponse.json(
      { success: true, data: savedBilling },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}