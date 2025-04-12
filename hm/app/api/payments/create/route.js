import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { appointmentId, amount } = await request.json();
    
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

    const orderResponse = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.access_token}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: amount.toString()
          },
          description: `Appointment #${appointmentId}`
        }]
      })
    });

    const orderData = await orderResponse.json();
    if (!orderResponse.ok) throw new Error(orderData.message || 'PayPal order creation failed');

    return NextResponse.json({ id: orderData.id });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create payment' },
      { status: 500 }
    );
  }
}