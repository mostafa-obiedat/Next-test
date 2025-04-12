// import AppointmentForm from "@/app/components/forms/AppointmentForm";

// export default async function BookAppointmentPage() {
//   const doctors = await getDoctors();

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">حجز موعد جديد</h1>
//       <AppointmentForm doctors={doctors} />
//     </div>
//   );
// }

// async function getDoctors() {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctors`, {
//       cache: "no-store",
//     });
//     return await res.json();
//   } catch (error) {
//     console.error("Failed to fetch doctors:", error);
//     return [];
//   }
// }