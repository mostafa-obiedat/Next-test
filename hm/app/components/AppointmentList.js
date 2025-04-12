'use client';
import { useState, useEffect } from 'react';
import { format, isValid } from 'date-fns';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  canceled: 'bg-red-100 text-red-800',
};

export default function AppointmentList({
  appointments = [],
  loading = false,
  onEdit = () => {},
  onStatusChange = () => {},
  onDelete = () => {},
}) {
  const [filter, setFilter] = useState('all');
  const [validAppointments, setValidAppointments] = useState([]);

  useEffect(() => {
    // Filter out appointments with invalid dates
    const validated = appointments.map(app => ({
      ...app,
      hasValidDate: isValid(new Date(app.appointmentDate))
    }));
    setValidAppointments(validated);
  }, [appointments]);

  const filteredAppointments = filter === 'all' 
    ? validAppointments 
    : validAppointments.filter(a => a.status === filter);

  const formatAppointmentDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, 'yyyy-MM-dd HH:mm') : 'تاريخ غير صالح';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'خطأ في التاريخ';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        جاري تحميل المواعيد...
      </div>
    );
  }

  if (filteredAppointments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        لا توجد مواعيد متاحة
      </div>
    );
  }

  return (
    <div className="rtl" dir="rtl">
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          الكل
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1 rounded-md ${filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          قيد الانتظار
        </button>
        <button
          onClick={() => setFilter('confirmed')}
          className={`px-3 py-1 rounded-md ${filter === 'confirmed' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          مؤكد
        </button>
        <button
          onClick={() => setFilter('canceled')}
          className={`px-3 py-1 rounded-md ${filter === 'canceled' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          ملغى
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المريض
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الطبيب
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                التاريخ والوقت
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحالة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAppointments.map((appointment) => (
              <tr key={appointment._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-end">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.patient?.name || 'غير محدد'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.patient?.phone || 'لا يوجد رقم'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-right">
                    <div className="text-sm text-gray-900">
                      {appointment.doctor?.name || 'غير محدد'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.doctor?.specialty || 'لا يوجد تخصص'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 text-right">
                    {formatAppointmentDate(appointment.appointmentDate)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[appointment.status]}`}
                  >
                    {appointment.status === 'pending' && 'قيد الانتظار'}
                    {appointment.status === 'confirmed' && 'مؤكد'}
                    {appointment.status === 'canceled' && 'ملغى'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => onEdit(appointment)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      تعديل
                    </button>
                    <select
                      value={appointment.status}
                      onChange={(e) => onStatusChange(appointment._id, e.target.value)}
                      className="border rounded px-2 py-1 text-xs"
                    >
                      <option value="pending">قيد الانتظار</option>
                      <option value="confirmed">مؤكد</option>
                      <option value="canceled">ملغى</option>
                    </select>
                    <button
                      onClick={() => onDelete(appointment._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}