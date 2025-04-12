import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db';
import Billing from '@/app/models/Billing';
const mongoose = require("mongoose");

export async function POST(request) {
  await dbConnect();

  try {
    const { patientId, appointmentId, amount, paymentMethod, paymentDetails } = await request.json();

    const newBilling = new Billing({
      patientId: new mongoose.Types.ObjectId(patientId),
      appointmentId: new mongoose.Types.ObjectId(appointmentId),
      amount,
      paymentMethod,
      status: 'paid',
      paymentId: paymentDetails.id,
      paymentDetails,
      paymentDate: new Date()
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