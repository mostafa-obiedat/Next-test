// import AppointmentDetails from "@/app/components/AppointmentDetails";

// export default async function AppointmentPage({ params }) {
//   const appointment = await getAppointment(params.id);

//   if (!appointment) {
//     return (
//       <div className="text-center py-12">
//         <h1 className="text-2xl font-bold text-gray-800 mb-4">الموعد غير موجود</h1>
//         <a
//           href="/appointments"
//           className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//         >
//           العودة إلى قائمة المواعيد
//         </a>
//       </div>
//     );
//   }

//   return <AppointmentDetails appointment={appointment} />;
// }

// async function getAppointment(id) {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${id}`, {
//       cache: "no-store",
//     });
//     return await res.json();
//   } catch (error) {
//     console.error("Failed to fetch appointment:", error);
//     return null;
//   }
// }

