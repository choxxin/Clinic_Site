'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import AppointmentCard from '../../../components/AppointmentCard';
import AppointmentDetailModal from '../../../components/AppointmentDetailModal';
import { Calendar, Clock, CheckCircle, XCircle, Hourglass, List } from 'lucide-react';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]); // Store all appointments
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewByFilter, setViewByFilter] = useState('all'); // New view by filter
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch appointments based on the selected filter
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError('');
      
      try {
        let endpoint = 'http://localhost:8080/api/clinic/appointments/';
        
        switch (activeFilter) {
          case 'pending':
            endpoint += 'pending';
            break;
          case 'confirmed':
            endpoint += 'confirmed';
            break;
          case 'cancelled':
            endpoint += 'cancelled';
            break;
          case 'completed':
            endpoint += 'completed';
            break;
          default:
            endpoint += 'all';
        }

        const response = await fetch(endpoint, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAllAppointments(data); // Store all appointments
          setAppointments(data); // Initially show all
        } else {
          setError('Failed to fetch appointments');
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Network error while fetching appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [activeFilter]);

  // Apply view by filter whenever allAppointments or viewByFilter changes
  useEffect(() => {
    if (allAppointments.length === 0) return;

    const now = new Date();
    let filtered = [...allAppointments];

    switch (viewByFilter) {
      case 'today':
        filtered = allAppointments.filter(apt => {
          const aptDate = new Date(apt.appointmentDate);
          return aptDate.toDateString() === now.toDateString();
        });
        break;
      
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)
        weekEnd.setHours(23, 59, 59, 999);
        
        filtered = allAppointments.filter(apt => {
          const aptDate = new Date(apt.appointmentDate);
          return aptDate >= weekStart && aptDate <= weekEnd;
        });
        break;
      
      case 'month':
        filtered = allAppointments.filter(apt => {
          const aptDate = new Date(apt.appointmentDate);
          return aptDate.getMonth() === now.getMonth() && 
                 aptDate.getFullYear() === now.getFullYear();
        });
        break;
      
      case 'all':
      default:
        filtered = allAppointments;
        break;
    }

    setAppointments(filtered);
  }, [allAppointments, viewByFilter]);

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleAppointmentUpdate = (updatedAppointment) => {
    // Update the appointment in the list
    setAppointments(prevAppointments =>
      prevAppointments.map(apt =>
        apt.id === updatedAppointment.id ? updatedAppointment : apt
      )
    );
  };

  const filterButtons = [
    { id: 'all', label: 'All Appointments', icon: List, color: 'blue' },
    { id: 'pending', label: 'Pending', icon: Hourglass, color: 'yellow' },
    { id: 'confirmed', label: 'Confirmed', icon: CheckCircle, color: 'indigo' },
    { id: 'completed', label: 'Completed', icon: CheckCircle, color: 'green' },
    { id: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'red' },
  ];

  const getColorClasses = (color, isActive) => {
    const colors = {
      blue: isActive ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100',
      yellow: isActive ? 'bg-yellow-600 text-white' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
      indigo: isActive ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
      green: isActive ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100',
      red: isActive ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100',
    };
    return colors[color] || colors.blue;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Calendar className="h-8 w-8 mr-3 text-blue-600" />
                Appointments
              </h1>
              <p className="text-gray-600 mt-1">Manage and view all clinic appointments</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">{appointments.length}</p>
              <p className="text-sm text-gray-500">Total Appointments</p>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter by Status</h3>
            <div className="flex flex-wrap gap-3">
              {filterButtons.map((button) => {
                const Icon = button.icon;
                const isActive = activeFilter === button.id;
                return (
                  <button
                    key={button.id}
                    onClick={() => setActiveFilter(button.id)}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${getColorClasses(
                      button.color,
                      isActive
                    )} ${isActive ? 'shadow-lg scale-105' : 'shadow-sm'}`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {button.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* View By Time Filter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">View By</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setViewByFilter('today')}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  viewByFilter === 'today'
                    ? 'bg-purple-600 text-white shadow-lg scale-105'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100 shadow-sm'
                }`}
              >
                <Clock className="h-5 w-5 mr-2" />
                Today
              </button>
              <button
                onClick={() => setViewByFilter('week')}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  viewByFilter === 'week'
                    ? 'bg-purple-600 text-white shadow-lg scale-105'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100 shadow-sm'
                }`}
              >
                <Calendar className="h-5 w-5 mr-2" />
                This Week
              </button>
              <button
                onClick={() => setViewByFilter('month')}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  viewByFilter === 'month'
                    ? 'bg-purple-600 text-white shadow-lg scale-105'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100 shadow-sm'
                }`}
              >
                <Calendar className="h-5 w-5 mr-2" />
                This Month
              </button>
              <button
                onClick={() => setViewByFilter('all')}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  viewByFilter === 'all'
                    ? 'bg-purple-600 text-white shadow-lg scale-105'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100 shadow-sm'
                }`}
              >
                <List className="h-5 w-5 mr-2" />
                All Time
              </button>
            </div>
          </div>
        </div>

        {/* Appointments Grid */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {filterButtons.find(b => b.id === activeFilter)?.label || 'Appointments'}
            </h2>
            {!loading && (
              <span className="text-sm text-gray-500">
                Showing {appointments.length} {appointments.length === 1 ? 'appointment' : 'appointments'}
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-500">Loading appointments...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <p className="text-red-600 text-lg font-medium">{error}</p>
              <button
                onClick={() => setActiveFilter(activeFilter)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No {activeFilter !== 'all' ? activeFilter : ''} appointments found</p>
              <p className="text-gray-400 text-sm mt-2">
                {activeFilter !== 'all' ? 'Try selecting a different filter' : 'No appointments have been scheduled yet'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appointments.map((appointment) => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment}
                  onClick={handleAppointmentClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Appointment Detail Modal */}
      <AppointmentDetailModal
        appointment={selectedAppointment}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={handleAppointmentUpdate}
      />
    </DashboardLayout>
  );
}
