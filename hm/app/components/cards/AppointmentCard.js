// "use client";

// import { useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";

// export default function AppointmentCard({ appointment }) {
//   const router = useRouter();
//   const date = new Date(appointment.date);

//   const handleCancel = async () => {
//     if (!confirm("هل أنت متأكد من إلغاء هذا الموعد؟")) return;

//     try {
//       const res = await fetch(`/api/appointments/${appointment._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ status: "cancelled" }),
//       });

//       if (!res.ok) throw new Error("Failed to cancel appointment");

//       toast.success("تم إلغاء الموعد بنجاح");
//       router.refresh();
//     } catch (error) {
//       toast.error("حدث خطأ أثناء إلغاء الموعد");
//       console.error("Cancellation error:", error);
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
//       <div className="p-6">
//         <div className="flex justify-between items-start mb-4">
//           <h3 className="text-lg font-semibold text-gray-800">
//             {date.toLocaleDateString("ar-SA", {
//               weekday: "long",
//               year: "numeric",
//               month: "long",
//               day: "numeric",
//             })}
//           </h3>
//           <span
//             className={`px-2 py-1 text-xs rounded-full ${
//               appointment.status === "pending"
//                 ? "bg-yellow-100 text-yellow-800"
//                 : appointment.status === "approved"
//                 ? "bg-green-100 text-green-800"
//                 : appointment.status === "cancelled"
//                 ? "bg-red-100 text-red-800"
//                 : "bg-blue-100 text-blue-800"
//             }`}
//           >
//             {appointment.status === "pending"
//               ? "قيد الانتظار"
//               : appointment.status === "approved"
//               ? "مؤكد"
//               : appointment.status === "cancelled"
//               ? "ملغى"
//               : "مكتمل"}
//           </span>
//         </div>

//         <p className="text-gray-600 mb-2">
//           <span className="font-medium">الوقت:</span>{" "}
//           {date.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
//         </p>

//         <p className="text-gray-600 mb-2">
//           <span className="font-medium">الطبيب:</span> د. {appointment.doctorId?.name}
//         </p>

//         {appointment.notes && (
//           <p className="text-gray-600 mb-4">
//             <span className="font-medium">ملاحظات:</span> {appointment.notes}
//           </p>
//         )}

//         <div className="flex space-x-2">
//           <a
//             href={`/appointments/${appointment._id}`}
//             className="flex-1 text-center py-2 px-4 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
//           >
//             التفاصيل
//           </a>
//           {appointment.status === "pending" && (
//             <button
//               onClick={handleCancel}
//               className="flex-1 py-2 px-4 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
//             >
//               إلغاء
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }