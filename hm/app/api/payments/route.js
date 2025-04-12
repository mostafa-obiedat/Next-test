// // هذا مجرد مثال للهيكل العام لإرسال طلب إلى Sendbox من السيرفر
// import axios from 'axios';

// export default async function handler(req, res) {
//   if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

//   const { amount, appointmentId } = req.body;

//   try {
//     const response = await axios.post('https://api.sendbox.co/payment-link', {
//       amount,
//       currency: 'JOD',
//       description: `حجز موعد رقم ${appointmentId}`,
//       redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/appointments/confirmation`
//     }, {
//       headers: {
//         Authorization: `Bearer ${process.env.SENDBOX_API_KEY}`
//       }
//     });

//     res.status(200).json({ success: true, url: response.data.payment_url });
//   } catch (err) {
//     console.error('Sendbox Payment Error:', err.response?.data || err.message);
//     res.status(500).json({ error: 'فشل إنشاء رابط الدفع' });
//   }
// }
