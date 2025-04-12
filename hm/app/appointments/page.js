'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AppointmentList from '@/app/components/AppointmentList';
import AppointmentForm from '@/app/components/forms/AppointmentForm';
import { toast } from 'react-toastify';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/appointments');
      setAppointments(data.data);
    } catch (error) {
      toast.error('فشل في جلب المواعيد');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCreate = () => {
    setSelectedAppointment(null);
    setShowForm(true);
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedAppointment) {
        await axios.put(`/api/appointments/${selectedAppointment._id}`, formData);
        toast.success('تم تحديث الموعد بنجاح');
      } else {
        console.log('إنشاء موعد بالبيانات:', formData);
        const response = await axios.post('/api/appointments', formData);
        console.log('الاستجابة:', response);
        toast.success('تم إنشاء الموعد بنجاح');
      }
      setShowForm(false);
      fetchAppointments();
    } catch (error) {
      console.error('خطأ كامل:', error);
      console.error('استجابة الخطأ:', error.response);
      toast.error(error.response?.data?.error || 'حدث خطأ ما');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`/api/appointments/status/${id}`, { status });
      toast.success('تم تحديث الحالة بنجاح');
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.error || 'فشل في تحديث الحالة');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/appointments/${id}`);
      toast.success('تم حذف الموعد بنجاح');
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.error || 'فشل في حذف الموعد');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-pink-50" dir="rtl">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">المواعيد</h1>
        <button
          onClick={handleCreate}
          className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-md transition duration-300 shadow-sm"
        >
          إضافة موعد جديد
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-pink p-6 rounded-lg shadow-md border border-gray-200">
          <AppointmentForm
            appointment={selectedAppointment}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <AppointmentList
          appointments={appointments}
          loading={loading}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}