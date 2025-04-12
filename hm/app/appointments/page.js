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
      toast.error('Failed to fetch appointments');
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
        toast.success('Appointment updated successfully');
      } else {
        console.log('Creating appointment with data:', formData); // Add this line
        const response = await axios.post('/api/appointments', formData);
        console.log('Response:', response); // Add this line
        toast.success('Appointment created successfully');
      }
      setShowForm(false);
      fetchAppointments();
    } catch (error) {
      console.error('Full error:', error); // Add this line
      console.error('Error response:', error.response); // Add this line
      toast.error(error.response?.data?.error || 'Something went wrong');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`/api/appointments/status/${id}`, { status });
      toast.success('Status updated successfully');
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/appointments/${id}`);
      toast.success('Appointment deleted successfully');
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete appointment');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Create Appointment
        </button>
      </div>

      {showForm && (
        <AppointmentForm
          appointment={selectedAppointment}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      <AppointmentList
        appointments={appointments}
        loading={loading}
        onEdit={handleEdit}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </div>
  );
}
