'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { format, isBefore } from 'date-fns';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useRouter } from 'next/navigation';
import PaymentModal from '../PaymentModal';
import { Loader } from '../Loader';

export default function AppointmentForm({ appointment, onSubmit, onCancel }) {
  const { doctorId } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    doctorName: '',
    day: '',
    timeSlot: '',
    appointmentDate: '',
    reason: '',
    appointmentType: 'clinic',
  });

  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [doctorAvailability, setDoctorAvailability] = useState({ days: [], timeSlots: [] });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [createdAppointment, setCreatedAppointment] = useState(null);
  const [isFetchingAvailability, setIsFetchingAvailability] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        const patientRes = await axios.get('/api/auth/me', {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });

        if (patientRes.data.success) {
          setPatientName(patientRes.data.user.name);
          setPatientId(patientRes.data.user._id);
        }

        const doctorsRes = await axios.get('/api/doctors');
        if (doctorsRes.data.success) {
          setDoctors(doctorsRes.data.doctors || doctorsRes.data.data || []);
        }

        if (appointment) {
          setFormData({
            doctorName: appointment.doctor?.name || '',
            day: appointment.day || '',
            timeSlot: appointment.timeSlot || '',
            appointmentDate: format(new Date(appointment.appointmentDate), "yyyy-MM-dd"),
            reason: appointment.reason || '',
            appointmentType: appointment.appointmentType || 'clinic'
          });
          setPatientName(appointment.patient?.name || '');
          setPatientId(appointment.patient?._id || '');
          setCreatedAppointment(appointment);

          if (appointment.doctor?.name) {
            fetchDoctorAvailability(appointment.doctor.name);
          }
        }
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        if (error.response?.status === 401) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [appointment, doctorId, router]);

  const fetchDoctorAvailability = async (doctorName) => {
    try {
      setIsFetchingAvailability(true);
      const response = await axios.post('/api/doctors/availability', { doctorName });
      if (response.data.success) {
        setDoctorAvailability({
          days: response.data.days || [],
          timeSlots: response.data.timeSlots || []
        });
      } else {
        setDoctorAvailability({ days: [], timeSlots: [] });
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      setDoctorAvailability({ days: [], timeSlots: [] });
    } finally {
      setIsFetchingAvailability(false);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === 'doctorName') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        day: '',
        timeSlot: ''
      }));
      if (value.length > 3) {
        await fetchDoctorAvailability(value);
      } else {
        setDoctorAvailability({ days: [], timeSlots: [] });
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.doctorName.trim()) newErrors.doctorName = 'يجب اختيار الطبيب';
    if (!formData.appointmentDate) newErrors.appointmentDate = 'يجب تحديد تاريخ الموعد';
    if (!formData.day) newErrors.day = 'يجب اختيار اليوم';
    if (!formData.timeSlot) newErrors.timeSlot = 'يجب اختيار الوقت';
    if (!formData.reason.trim()) newErrors.reason = 'يجب إدخال سبب الحجز';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const convertTimeTo24Hour = (time12h) => {
    const [time, period] = time12h.split(' ');
    let [hours, minutes = '00'] = time.split(':');
    hours = parseInt(hours);
    if (period === 'م' && hours < 12) hours += 12;
    if (period === 'ص' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      const [startTime, endTime] = formData.timeSlot.split(' - ');
      const start24 = convertTimeTo24Hour(startTime);
      const appointmentDate = new Date(formData.appointmentDate);
      const [hours, minutes] = start24.split(':');
      appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const appointmentData = {
        doctorName: formData.doctorName.trim(),
        appointmentDate: appointmentDate.toISOString(),
        day: formData.day,
        timeSlot: formData.timeSlot,
        appointmentType: formData.appointmentType,
        reason: formData.reason.trim(),
        patient: patientId,
        patientName: patientName.trim(),
        amount: 15,
        currency: 'JOD'
      };

      const response = await axios.post('/api/appointments', appointmentData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setCreatedAppointment(response.data.data);
      setShowPaymentModal(true); // ✅ فتح نافذة الدفع
    } catch (error) {
      console.error('تفاصيل الخطأ:', error);
      const errorMessage = error.response?.data?.error || error.message || 'حدث خطأ أثناء حجز الموعد';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      await axios.post(`/api/appointments/update-status`, {
        appointmentId: createdAppointment._id,
        paymentStatus: "paid",
        paymentId: paymentData.orderID,
        paymentDetails: paymentData
      }, {
        withCredentials: true
      });

      toast.success("تم الدفع بنجاح");
      router.push("/"); // ✅ التنقل بعد الدفع فقط
    } catch (error) {
      console.error("فشل تحديث حالة الموعد:", error);
      toast.error("فشل في تحديث حالة الدفع");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 max-w-3xl mx-auto text-black" dir="rtl">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {appointment ? 'تعديل الموعد' : 'حجز موعد جديد'}
          </h2>
          <div className="w-16 h-1 bg-pink-500 rounded-full"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* بيانات المريض والطبيب */}
          <div className="bg-pink-50 p-6 rounded-lg mb-6">
            <h3 className="text-gray-800 font-semibold mb-4 flex items-center">
              <span className="inline-block w-8 h-8 rounded-full bg-pink-600 text-white text-center mr-2 flex items-center justify-center">1</span>
              معلومات المريض والطبيب
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* معلومات المريض */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  اسم المريض
                </label>
                <input
                  type="text"
                  value={patientName}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  readOnly
                />
              </div>

              {/* اسم الطبيب */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  اسم الطبيب *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="doctorName"
                    value={formData.doctorName}
                    onChange={handleChange}
                    list="doctorsList"
                    className={`w-full border ${errors.doctorName ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                    placeholder="اكتب اسم الطبيب"
                    required
                  />
                  {isFetchingAvailability && (
                    <span className="absolute left-3 top-3 text-pink-500">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                  )}
                </div>
                <datalist id="doctorsList">
                  {doctors.map(doctor => (
                    <option key={doctor._id} value={doctor.name}>
                      {doctor.specialty ? `(${doctor.specialty})` : ''}
                    </option>
                  ))}
                </datalist>
                {errors.doctorName && (
                  <p className="mt-1 text-sm text-red-600">{errors.doctorName}</p>
                )}
                {!isFetchingAvailability && !doctorAvailability.days.length && formData.doctorName && (
                  <p className="mt-1 text-sm text-pink-500">لا توجد أيام متاحة لهذا الطبيب</p>
                )}
              </div>
            </div>
          </div>

          {/* تفاصيل الموعد */}
          <div className="bg-pink-50 p-6 rounded-lg mb-6">
            <h3 className="text-gray-800 font-semibold mb-4 flex items-center">
              <span className="inline-block w-8 h-8 rounded-full bg-pink-600 text-white text-center mr-2 flex items-center justify-center">2</span>
              تفاصيل الموعد
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* نوع الموعد */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  نوع الموعد *
                </label>
                <div className="flex space-x-4 space-x-reverse">
                  <div 
                    className={`flex-1 p-4 rounded-lg border-2 cursor-pointer flex flex-col items-center justify-center ${
                      formData.appointmentType === 'clinic' 
                        ? 'border-pink-500 bg-white shadow-sm' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                    onClick={() => handleChange({ target: { name: 'appointmentType', value: 'clinic' } })}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mb-2 ${formData.appointmentType === 'clinic' ? 'text-pink-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className={`text-sm font-medium ${formData.appointmentType === 'clinic' ? 'text-gray-800' : 'text-gray-500'}`}>زيارة العيادة</span>
                  </div>
                  
                  <div 
                    className={`flex-1 p-4 rounded-lg border-2 cursor-pointer flex flex-col items-center justify-center ${
                      formData.appointmentType === 'video' 
                        ? 'border-pink-500 bg-white shadow-sm' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                    onClick={() => handleChange({ target: { name: 'appointmentType', value: 'video' } })}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mb-2 ${formData.appointmentType === 'video' ? 'text-pink-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className={`text-sm font-medium ${formData.appointmentType === 'video' ? 'text-gray-800' : 'text-gray-500'}`}>استشارة فيديو</span>
                  </div>
                </div>
                {errors.appointmentType && (
                  <p className="mt-1 text-sm text-red-600">{errors.appointmentType}</p>
                )}
              </div>

              {/* تاريخ الموعد */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  تاريخ الموعد *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full border ${errors.appointmentDate ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                    required
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                {errors.appointmentDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.appointmentDate}</p>
                )}
              </div>

              {/* اليوم */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  اليوم *
                </label>
                <div className="relative">
                  <select
                    name="day"
                    value={formData.day}
                    onChange={handleChange}
                    className={`w-full border ${errors.day ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none`}
                    required
                    disabled={!doctorAvailability.days.length}
                  >
                    <option value="">اختر اليوم</option>
                    {doctorAvailability.days.map((day, index) => (
                      <option key={index} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {errors.day && (
                  <p className="mt-1 text-sm text-red-600">{errors.day}</p>
                )}
              </div>

              {/* الوقت */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  الوقت *
                </label>
                <div className="relative">
                  <select
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleChange}
                    className={`w-full border ${errors.timeSlot ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none`}
                    required
                    disabled={!formData.day || !doctorAvailability.timeSlots.length}
                  >
                    <option value="">اختر الوقت</option>
                    {doctorAvailability.timeSlots.map((slot, index) => (
                      <option key={index} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                {errors.timeSlot && (
                  <p className="mt-1 text-sm text-red-600">{errors.timeSlot}</p>
                )}
                {!isFetchingAvailability && formData.day && !doctorAvailability.timeSlots.length && (
                  <p className="mt-1 text-sm text-pink-500">لا توجد أوقات متاحة لليوم المحدد</p>
                )}
              </div>
            </div>
          </div>

          {/* سبب الزيارة */}
          <div className="bg-pink-50 p-6 rounded-lg mb-6">
            <h3 className="text-gray-800 font-semibold mb-4 flex items-center">
              <span className="inline-block w-8 h-8 rounded-full bg-pink-600 text-white text-center mr-2 flex items-center justify-center">3</span>
              سبب الزيارة
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                سبب الحجز *
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className={`w-full border ${errors.reason ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                rows={4}
                placeholder="الرجاء وصف سبب الحجز"
                required
              />
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-300"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-500 transition-colors duration-300 shadow-md disabled:opacity-50 transform hover:-translate-y-0.5"
              disabled={loading}
            >
              {appointment ? 'تحديث الموعد' : 'تأكيد الحجز'}
            </button>
          </div>
        </form>
      </div>

      {showPaymentModal && createdAppointment && (
        <PaymentModal
          appointment={createdAppointment}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentModal(false)}
        />      
      )}
    </div>
  );
}