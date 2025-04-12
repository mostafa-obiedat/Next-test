'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { format, isBefore, parseISO } from 'date-fns';
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
    appointmentDate: '', // تمت إضافة حقل التاريخ
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
  // جلب البيانات الأولية
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // جلب بيانات المريض
        const patientRes = await axios.get('/api/auth/me', {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });
        
        if (patientRes.data.success) {
          setPatientName(patientRes.data.user.name);
          setPatientId(patientRes.data.user._id);
        }

        // جلب جميع الأطباء
       // جلب جميع الأطباء
const doctorsRes = await axios.get('/api/doctors');
if (doctorsRes.data.success) {
  // Check both possible response structures
  setDoctors(doctorsRes.data.doctors || doctorsRes.data.data || []);
}

        // إذا كان تعديل موعد موجود
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
          
          // جلب توفر الطبيب إذا كان هناك موعد موجود
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

  // جلب توفر الطبيب حسب الاسم
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
      
      // جلب التوفر عند تغيير اسم الطبيب
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

  const generateAppointmentDateTime = (date, timeSlot) => {
    try {
      if (!date || !timeSlot) {
        throw new Error('التاريخ ووقت الموعد مطلوبان');
      }

      // تحليل التاريخ
      const [year, month, day] = date.split('-');
      
      // تحليل الوقت
      const [startTime] = timeSlot.split(' - ');
      const [time, period] = startTime.split(' ');
      let [hours, minutes = '00'] = time.split(':');
      
      hours = parseInt(hours);
      minutes = parseInt(minutes);

      // تحويل إلى نظام 24 ساعة
      if (period === 'مساءً' && hours < 12) hours += 12;
      if (period === 'صباحًا' && hours === 12) hours = 0;
      
      // إنشاء كائن التاريخ
      const appointmentDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
      
      // التحقق من أن التاريخ ليس في الماضي
      if (isBefore(appointmentDate, new Date())) {
        throw new Error('لا يمكن حجز موعد في تاريخ قديم');
      }

      return appointmentDate;
    } catch (error) {
      console.error('خطأ في توليد التاريخ:', error);
      throw new Error(`فشل في إنشاء تاريخ الموعد: ${error.message}`);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
  
    try {
      setLoading(true);
      
      // تحويل الوقت من 02:00 م - 03:00 م إلى تنسيق 24 ساعة
      const convertTimeTo24Hour = (time12h) => {
        const [time, period] = time12h.split(' ');
        let [hours, minutes] = time.split(':');
        
        hours = parseInt(hours);
        if (period === 'م' && hours < 12) hours += 12;
        if (period === 'ص' && hours === 12) hours = 0;
        
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
      };
  
      const [startTime, endTime] = formData.timeSlot.split(' - ');
      const start24 = convertTimeTo24Hour(startTime);
      const end24 = convertTimeTo24Hour(endTime);
  
      // إنشاء تاريخ ISO مع الوقت الصحيح
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
  
      console.log('بيانات الإرسال النهائية:', appointmentData);
  
      const response = await axios.post('/api/appointments', appointmentData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      setCreatedAppointment(response.data.data);
      toast.success('تم حجز الموعد بنجاح');
  
    } catch (error) {
      console.error('تفاصيل الخطأ:', {
        message: error.message,
        response: error.response?.data
      });
      
      const errorMessage = error.response?.data?.error || 
                         error.message || 
                         'حدث خطأ أثناء حجز الموعد';
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      // استخدم POST بدلاً من PUT إذا كان الخادم لا يدعم PUT
      await axios.post(`/api/appointments/update-status`, {
        appointmentId: createdAppointment._id,
        paymentStatus: "paid",
        paymentId: paymentData.orderID,
        paymentDetails: paymentData
      }, {
        withCredentials: true
      });
  
      router.push("/");
    } catch (error) {
      console.error("Failed to update appointment:", error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b border-pink-50 pb-3">
          {appointment ? 'تعديل الموعد' : 'حجز موعد جديد'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
              {isFetchingAvailability && (
                <p className="mt-1 text-sm text-pink-500">جاري تحميل البيانات...</p>
              )}
            </div>

            {/* نوع الموعد */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                نوع الموعد *
              </label>
              <select
                name="appointmentType"
                value={formData.appointmentType}
                onChange={handleChange}
                className={`w-full border ${errors.appointmentType ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                required
              >
                <option value="clinic">زيارة العيادة</option>
                <option value="video">استشارة فيديو</option>
              </select>
              {errors.appointmentType && (
                <p className="mt-1 text-sm text-red-600">{errors.appointmentType}</p>
              )}
            </div>

            {/* تاريخ الموعد */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                تاريخ الموعد *
              </label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full border ${errors.appointmentDate ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                required
              />
              {errors.appointmentDate && (
                <p className="mt-1 text-sm text-red-600">{errors.appointmentDate}</p>
              )}
            </div>

            {/* اليوم */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                اليوم *
              </label>
              <select
                name="day"
                value={formData.day}
                onChange={handleChange}
                className={`w-full border ${errors.day ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
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
              {errors.day && (
                <p className="mt-1 text-sm text-red-600">{errors.day}</p>
              )}
              {!isFetchingAvailability && !doctorAvailability.days.length && formData.doctorName && (
                <p className="mt-1 text-sm text-pink-500">لا توجد أيام متاحة لهذا الطبيب</p>
              )}
            </div>

            {/* الوقت */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                الوقت *
              </label>
              <select
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleChange}
                className={`w-full border ${errors.timeSlot ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
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
              {errors.timeSlot && (
                <p className="mt-1 text-sm text-red-600">{errors.timeSlot}</p>
              )}
              {!isFetchingAvailability && formData.day && !doctorAvailability.timeSlots.length && (
                <p className="mt-1 text-sm text-pink-500">لا توجد أوقات متاحة لليوم المحدد</p>
              )}
            </div>

            {/* السبب */}
            <div className="md:col-span-2">
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

          <div className="flex justify-between items-center pt-6 border-t border-pink-50">
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-500 transition-colors disabled:opacity-50 shadow-sm"
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
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}