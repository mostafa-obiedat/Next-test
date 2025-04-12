import React, { useEffect } from 'react';

export default function PayPalButton({ amount }) {
  useEffect(() => {
    // تحميل سكربت PayPal إذا لم يكن محملًا مسبقًا
    if (!window.paypal) {
      const script = document.createElement('script');
      script.src = "https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD";
      script.async = true;
      script.onload = () => {
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: amount,
                },
              }],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
              alert('Payment Successful');
              console.log(details);
            });
          },
          onError: (err) => {
            console.error('PayPal Error: ', err);
            alert('Payment failed');
          },
        }).render('#paypal-button-container'); // هنا يتم عرض الزر
      };
      document.body.appendChild(script);
    }
  }, [amount]);

  return <div id="paypal-button-container"></div>;
}
