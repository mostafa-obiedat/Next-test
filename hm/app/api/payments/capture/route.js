import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { orderID, appointmentId } = await request.json();
    
    const authResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
        ).toString('base64')}`,
      },
      body: 'grant_type=client_credentials'
    });

    const authData = await authResponse.json();
    if (!authResponse.ok) throw new Error(authData.error || 'PayPal auth failed');

    const captureResponse = await fetch(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.access_token}`,
        }
      }
    );

    const captureData = await captureResponse.json();
    if (!captureResponse.ok) throw new Error(captureData.message || 'Payment capture failed');

    return NextResponse.json({ 
      success: true,
      details: captureData 
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to capture payment' },
      { status: 500 }
    );
  }
}