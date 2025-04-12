import paypal from '@paypal/checkout-server-sdk';

// Configure PayPal SDK
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (process.env.PAYPAL_ENVIRONMENT === 'production') {
    return new paypal.core.LiveEnvironment(clientId, clientSecret);
  }
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

export function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

export async function createPayPalOrder(appointmentId, amount) {
  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      reference_id: appointmentId,
      amount: {
        currency_code: 'USD',
        value: amount.toString()
      }
    }]
  });
  return request;
}