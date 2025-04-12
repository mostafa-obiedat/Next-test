// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import PaymentModal from "@/components/PaymentModal";
// import { Loader } from "@/components/Loader";

// export default function AppointmentForm({ appointment, onSubmit, onCancel }) {
//   const router = useRouter();
//   const [debugLog, setDebugLog] = useState([]);

//   const [formData, setFormData] = useState({
//     doctor: "",
//     day: "",
//     appointmentDate: "",
//     reason: "",
//     appointmentType: "clinic",
//   });

//   const [patientName, setPatientName] = useState("");
//   const [patientId, setPatientId] = useState("");
//   const [doctors, setDoctors] = useState([]);
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [doctorAvailability, setDoctorAvailability] = useState(null);
//   const [availableDates, setAvailableDates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [errors, setErrors] = useState({});
//   const [createdAppointment, setCreatedAppointment] = useState(null);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);


//   const addDebugLog = (message, data = null) => {
//     const timestamp = new Date().toISOString();
//     const logEntry = { timestamp, message, data };
//     setDebugLog(prev => [logEntry, ...prev].slice(0, 50));
//     console.log(`[DEBUG] ${message}`, data);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         addDebugLog("Fetching initial data");

//         const patientRes = await axios.get("/api/auth/me", {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: true,
//         });

//         if (patientRes.data.success) {
//           setPatientName(patientRes.data.user.name);
//           setPatientId(patientRes.data.user._id);
//           addDebugLog("Patient data loaded", patientRes.data.user);
//         }

//         const doctorsRes = await axios.get("/api/doctors");
//         setDoctors(doctorsRes.data.doctors);
//         addDebugLog("Doctors list loaded", doctorsRes.data.doctors);

//         if (appointment) {
//           setFormData({
//             doctor: appointment.doctor?._id || "",
//             day: appointment.day || "",
//             appointmentDate: appointment.appointmentDate || "",
//             reason: appointment.reason || "",
//             appointmentType: appointment.appointmentType || "clinic",
//           });
//           setPatientName(appointment.patient?.name || "");
//           setPatientId(appointment.patient?._id || "");
//           setCreatedAppointment(appointment);
//           addDebugLog("Editing existing appointment", appointment);

//           const doctor = doctorsRes.data.doctors.find(
//             (d) => d._id === appointment.doctor?._id
//           );
//           if (doctor) {
//             setSelectedDoctor(doctor);
//             const availabilityRes = await axios.get(
//               `/api/doctors/availability?doctorId=${appointment.doctor._id}`
//             );
//             setDoctorAvailability(availabilityRes.data.data);
//             addDebugLog("Doctor availability loaded", availabilityRes.data);
//           }
//         }
//       } catch (error) {
//         addDebugLog("Initial data fetch failed", {
//           error: error.message,
//           response: error.response?.data
//         });
//         if (error.response?.status === 401) {
//           router.push("/login");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [appointment, router]);

//   const handleDoctorSelect = async (doctorId) => {
//     addDebugLog("Doctor selected", { doctorId });
    
//     if (!doctorId) {
//       addDebugLog("No doctor selected - resetting fields");
//       setSelectedDoctor(null);
//       setDoctorAvailability(null);
//       setFormData(prev => ({ 
//         ...prev, 
//         doctor: "", 
//         day: "", 
//         appointmentDate: "" 
//       }));
//       return;
//     }

//     try {
//       setLoading(true);
//       addDebugLog("Fetching doctor availability");

//       const doctor = doctors.find((d) => d._id === doctorId);
//       if (doctor) {
//         setSelectedDoctor(doctor);
//         addDebugLog("Doctor details set", doctor);
//       }

//       const availabilityRes = await axios.get(
//         `/api/doctors/availability?doctorId=${doctorId}`,
//         { withCredentials: true }
//       );
      
//       addDebugLog("Availability API response", availabilityRes.data);
      
//       if (availabilityRes.data.success) {
//         setDoctorAvailability(availabilityRes.data.data);
//         addDebugLog("Availability set successfully");
//       } else {
//         throw new Error(availabilityRes.data.error || "Failed to load availability");
//       }

//       setFormData(prev => ({
//         ...prev,
//         doctor: doctorId,
//         day: "",
//         appointmentDate: ""
//       }));
//       setAvailableDates([]);
//     } catch (error) {
//       addDebugLog("Failed to fetch availability", {
//         error: error.message,
//         response: error.response?.data
//       });
//       setDoctorAvailability(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     addDebugLog("Field changed", { name, value });
    
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: "" }));
//     }

//     if (name === "day") {
//       const dates = [];
//       const today = new Date();
//       for (let i = 0; i < 30; i++) {
//         const date = new Date();
//         date.setDate(today.getDate() + i);
//         const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
//         if (weekday === value) {
//           dates.push(date.toISOString().split("T")[0]);
//         }
//       }
//       setAvailableDates(dates);
//       setFormData(prev => ({ ...prev, appointmentDate: "" }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.doctor) newErrors.doctor = "Doctor is required";
//     if (!formData.reason) newErrors.reason = "Reason is required";
//     if (!formData.day) newErrors.day = "Day is required";
//     if (!formData.appointmentType) newErrors.appointmentType = "Appointment type is required";
//     if (!formData.appointmentDate) newErrors.appointmentDate = "Appointment date is required";

//     setErrors(newErrors);
//     addDebugLog("Form validation", { isValid: Object.keys(newErrors).length === 0, errors: newErrors });
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     addDebugLog("Form submission started");

//     if (!validateForm()) {
//       addDebugLog("Form validation failed");
//       return;
//     }

//     try {
//       setLoading(true);
//       addDebugLog("Processing appointment data");

//       const appointmentDateTime = new Date(formData.appointmentDate);

//       const appointmentData = {
//         doctor: formData.doctor,
//         appointmentDate: appointmentDateTime,
//         appointmentType: formData.appointmentType,
//         day: formData.day,
//         reason: formData.reason,
//         amount: 15,
//         currency: "JOD",
//         patient: patientId,
//         patientName,
//         paymentStatus: "pending",
//       };

//       addDebugLog("Appointment data to submit", appointmentData);

//       const response = await axios.post("/api/appointments", appointmentData, {
//         withCredentials: true,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       addDebugLog("Appointment created successfully", response.data);
//       setCreatedAppointment(response.data.data);
//       setShowPaymentModal(true);
//     } catch (error) {
//       addDebugLog("Appointment creation failed", {
//         error: error.message,
//         response: error.response?.data,
//         request: error.config
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePaymentSuccess = async (paymentData) => {
//     try {
//       // استخدم POST بدلاً من PUT إذا كان الخادم لا يدعم PUT
//       await axios.post(`/api/appointments/update-status`, {
//         appointmentId: createdAppointment._id,
//         paymentStatus: "paid",
//         paymentId: paymentData.orderID,
//         paymentDetails: paymentData
//       }, {
//         withCredentials: true
//       });
  
//       router.push("/");
//     } catch (error) {
//       console.error("Failed to update appointment:", error);
//     }
//   };

//   if (loading) return <Loader />;

//   return (
//     <div className="space-y-6 max-w-6xl mx-auto">
//       <div className="bg-white p-6 rounded-lg shadow-lg">
//         <h2 className="text-2xl font-semibold mb-6 text-gray-800">
//           {appointment ? "Edit Appointment" : "Book New Appointment"}
//         </h2>

//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Patient Name
//               </label>
//               <input
//                 type="text"
//                 value={patientName}
//                 readOnly
//                 className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-50"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Select Doctor *
//               </label>
//               <select
//                 name="doctor"
//                 value={formData.doctor}
//                 onChange={(e) => handleDoctorSelect(e.target.value)}
//                 className="w-full border rounded-md px-4 py-2"
//               >
//                 <option value="">Select Doctor</option>
//                 {doctors.map((doc) => (
//                   <option key={doc._id} value={doc._id}>
//                     Dr. {doc.user.name} ({doc.specialty || "General"})
//                   </option>
//                 ))}
//               </select>
//               {errors.doctor && (
//                 <p className="text-sm text-red-600">{errors.doctor}</p>
//               )}
//             </div>

//             {selectedDoctor && (
//               <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg">
//                 <h3 className="font-medium text-blue-800">Selected Doctor:</h3>
//                 <p className="text-blue-700">
//                   د. {selectedDoctor.user.name} -{" "}
//                   {selectedDoctor.specialty || "General"}
//                 </p>
//               </div>
//             )}

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Appointment Type *
//               </label>
//               <select
//                 name="appointmentType"
//                 value={formData.appointmentType}
//                 onChange={handleChange}
//                 className="w-full border rounded-md px-4 py-2"
//               >
//                 <option value="clinic">Clinic Visit</option>
//                 <option value="video">Video Consultation</option>
//               </select>
//               {errors.appointmentType && (
//                 <p className="text-sm text-red-600">{errors.appointmentType}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Day *
//               </label>
//               <select
//                 name="day"
//                 value={formData.day}
//                 onChange={handleChange}
//                 className="w-full border rounded-md px-4 py-2"
//                 disabled={!doctorAvailability}
//               >
//                 <option value="">Select Day</option>
//                 {doctorAvailability?.days?.map((day, i) => (
//                   <option key={i} value={day}>
//                     {day}
//                   </option>
//                 ))}
//               </select>
//               {errors.day && (
//                 <p className="text-sm text-red-600">{errors.day}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Appointment Date *
//               </label>
//               <select
//                 name="appointmentDate"
//                 value={formData.appointmentDate}
//                 onChange={handleChange}
//                 className="w-full border rounded-md px-4 py-2"
//                 disabled={!availableDates.length}
//               >
//                 <option value="">Select Date</option>
//                 {availableDates.map((date, i) => (
//                   <option key={i} value={date}>
//                     {new Date(date).toLocaleDateString()}
//                   </option>
//                 ))}
//               </select>
//               {errors.appointmentDate && (
//                 <p className="text-sm text-red-600">{errors.appointmentDate}</p>
//               )}
//             </div>

//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Reason *
//               </label>
//               <textarea
//                 name="reason"
//                 value={formData.reason}
//                 onChange={handleChange}
//                 rows={4}
//                 className="w-full border rounded-md px-4 py-2"
//               />
//               {errors.reason && (
//                 <p className="text-sm text-red-600">{errors.reason}</p>
//               )}
//             </div>
//           </div>

//           <div className="flex justify-between items-center pt-4 border-t">
//             <button
//               type="button"
//               onClick={onCancel}
//               className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//               disabled={loading}
//             >
//               {appointment ? "Update Appointment" : "Confirm Booking"}
//             </button>
//           </div>
//         </form>
//      </div>

//      {showPaymentModal && createdAppointment && (
//         <PaymentModal
//           appointment={createdAppointment}
//           onClose={() => setShowPaymentModal(false)}
//           onPaymentSuccess={handlePaymentSuccess}
//         />
//       )}
//     </div>
//   );
// }