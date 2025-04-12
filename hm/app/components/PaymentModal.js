// 'use client';
// import { useState } from 'react';
// import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
// import axios from 'axios';
// import PaymentStatus from './PaymentStatus';

// export default function PaymentGateway({ appointment }) {
//   const [paymentCompleted, setPaymentCompleted] = useState(false);
//   const [error, setError] = useState(null);

//   const createOrder = async () => {
//     try {
//       const response = await axios.post('/api/payments/create', {
//         appointmentId: appointment._id
//       });
//       return response.data.data.id;
//     } catch (err) {
//       setError('Failed to create payment order');
//       throw err;
//     }
//   };

//   const onApprove = async (data) => {
//     try {
//       await axios.post('/api/payments/capture', {
//         orderID: data.orderID,
//         appointmentId: appointment._id
//       });
//       setPaymentCompleted(true);
//     } catch (err) {
//       setError('Payment processing failed. Please try again.');
//     }
//   };

//   return (
//     <div className="border rounded-lg p-6 bg-white shadow-sm">
//       <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
      
//       {appointment.paymentStatus === 'paid' ? (
//         <div className="text-center py-4">
//           <PaymentStatus status="paid" />
//           <p className="mt-2 text-sm text-gray-600">
//             Payment of {appointment.amount} {appointment.currency} completed
//           </p>
//         </div>
//       ) : paymentCompleted ? (
//         <div className="text-center py-4">
//           <PaymentStatus status="paid" />
//           <p className="mt-2 text-sm text-green-600">
//             Payment successful! Your appointment is confirmed.
//           </p>
//         </div>
//       ) : (
//         <>
//           <div className="mb-4">
//             <p className="text-gray-700 mb-1">
//               Total Amount: <span className="font-semibold">{appointment.amount} {appointment.currency}</span>
//             </p>
//             <p className="text-sm text-gray-500">
//               (~{(appointment.amount * 1.41).toFixed(2)} USD)
//             </p>
//           </div>

//           {error && (
//             <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
//               {error}
//             </div>
//           )}

//           <PayPalScriptProvider 
//             options={{ 
//               "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
//               currency: "USD",
//               "disable-funding": "credit,card"
//             }}
//           >
//             <PayPalButtons 
//               createOrder={createOrder}
//               onApprove={onApprove}
//               onError={(err) => setError('Payment processing error')}
//               style={{ 
//                 layout: 'vertical',
//                 color: 'blue',
//                 shape: 'rect',
//                 label: 'paypal'
//               }}
//             />
//           </PayPalScriptProvider>

//           <p className="text-xs text-gray-500 mt-4">
//             Secure payment processed by PayPal. Your financial information is never shared with us.
//           </p>
//         </>
//       )}
//     </div>
//   );
// }

'use client';
import { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Swal from 'sweetalert2';

export default function PaymentModal({ appointment, onClose, onPaymentSuccess }) {
  const [sdkReady, setSdkReady] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!window.paypal) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`;
      script.async = true;
      script.onload = () => setSdkReady(true);
      script.onerror = () => setError('Failed to load PayPal SDK');
      document.body.appendChild(script);
    } else {
      setSdkReady(true);
    }
  }, []);

  const createOrder = async () => {
    try {
      const response = await api.post('/payments/create', {
        appointmentId: appointment._id,
        amount: appointment.amount,
        currency: 'USD'
      });
      return response.data.id;
    } catch (err) {
      console.error('Create order error:', err.response?.data || err.message);
      setError('Failed to create payment order');
      throw err;
    }
  };

  const onApprove = async (data) => {
    try {
      setIsProcessing(true);
      setError(null);

      if (!data?.orderID) {
        throw new Error('Missing PayPal order ID');
      }

      // 1. Capture payment
      const captureResponse = await api.post('/payments/capture', {
        orderID: data.orderID,
        appointmentId: appointment._id,
        amount: appointment.amount,
        currency: 'USD'
      });

      // 2. Save billing
      const billingResponse = await api.post('/billing', {
        patientId: appointment.patient,
        appointmentId: appointment._id,
        amount: appointment.amount,
        currency: 'USD',
        paymentMethod: 'paypal',
        paymentDetails: {
          orderID: data.orderID,
          ...(captureResponse.data.details || captureResponse.data)
        }
      });

      // 3. Update appointment
      try {
        await api.patch(`/appointments/${appointment._id}`, {
          paymentStatus: 'paid',
          billingId: billingResponse.data.data?._id || billingResponse.data._id,
          paymentId: data.orderID
        });
      } catch (patchError) {
        console.log('Trying POST as fallback...');
        await api.post('/appointments/update-status', {
          appointmentId: appointment._id,
          paymentStatus: 'paid',
          billingId: billingResponse.data.data?._id || billingResponse.data._id,
          paymentId: data.orderID
        });
      }

      onPaymentSuccess({
        orderID: data.orderID,
        appointmentId: appointment._id,
        billingId: billingResponse.data.data?._id || billingResponse.data._id
      });

      Swal.fire({
        title: 'Payment has been completed successfully.!',
        text: `Payment Number : ${data.orderID}`,
        icon: 'success',
        confirmButtonText: 'OK'
      });

      onClose();

    } catch (error) {
      console.error('Payment processing error:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      setError(error.response?.data?.message || error.message || 'Payment failed');
      
      Swal.fire({
        title: 'Error in payment',
        text: error.response?.data?.message || error.message || 'Payment failed',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Complete payment</h3>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {sdkReady ? (
          <PayPalScriptProvider 
            options={{ 
              "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
              currency: "USD"
            }}
          >
            <PayPalButtons
              createOrder={createOrder}
              onApprove={onApprove}
              onError={(err) => {
                console.error('PayPal Error:', err);
                setError(err.message || 'Payment initialization failed');
              }}
              disabled={isProcessing}
              style={{ layout: 'vertical' }}
            />
          </PayPalScriptProvider>
        ) : (
          <p>Loading payment options...</p>
        )}
        
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          {isProcessing ? 'Processing ...' : 'Cancel'}
        </button>
      </div>
    </div>
  );
}