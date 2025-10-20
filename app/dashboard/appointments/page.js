'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 mb-6 border border-white/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                <Calendar className="h-10 w-10 mr-3 text-blue-600" />
                Appointments
              </h1>
              <p className="text-gray-600 mt-2 font-medium">Manage and view all clinic appointments</p>
            </div>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-right"
            >
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{appointments.length}</p>
              <p className="text-sm text-gray-500 font-medium">Total Appointments</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 mb-6 border border-white/20"
        >
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
              <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter by Status
            </h3>
            <div className="flex flex-wrap gap-3">
              {filterButtons.map((button, index) => {
                const Icon = button.icon;
                const isActive = activeFilter === button.id;
                return (
                  <motion.button
                    key={button.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    onClick={() => setActiveFilter(button.id)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${getColorClasses(
                      button.color,
                      isActive
                    )} ${isActive ? 'shadow-2xl scale-105' : 'shadow-md hover:shadow-xl'}`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {button.label}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* View By Time Filter */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-purple-600" />
              View By
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                { id: 'today', label: 'Today', icon: Clock },
                { id: 'week', label: 'This Week', icon: Calendar },
                { id: 'month', label: 'This Month', icon: Calendar },
                { id: 'all', label: 'All Time', icon: List }
              ].map((filter, index) => {
                const Icon = filter.icon;
                const isActive = viewByFilter === filter.id;
                return (
                  <motion.button
                    key={filter.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    onClick={() => setViewByFilter(filter.id)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl scale-105'
                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100 shadow-md hover:shadow-xl'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {filter.label}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Appointments Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {filterButtons.find(b => b.id === activeFilter)?.label || 'Appointments'}
            </h2>
            {!loading && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full font-medium"
              >
                {appointments.length} {appointments.length === 1 ? 'appointment' : 'appointments'}
              </motion.span>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="rounded-full h-16 w-16 border-b-4 border-t-4 border-blue-600"
              ></motion.div>
              <p className="text-gray-500 mt-4 font-medium text-lg">Loading appointments...</p>
            </div>
          ) : error ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <XCircle className="h-20 w-20 text-red-400 mx-auto mb-4" />
              </motion.div>
              <p className="text-red-600 text-lg font-semibold mb-2">{error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(activeFilter)}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold"
              >
                Retry
              </motion.button>
            </motion.div>
          ) : appointments.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ y: [-10, 0, -10] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Calendar className="h-20 w-20 text-gray-300 mx-auto mb-4" />
              </motion.div>
              <p className="text-gray-500 text-xl font-semibold">No {activeFilter !== 'all' ? activeFilter : ''} appointments found</p>
              <p className="text-gray-400 text-sm mt-2">
                {activeFilter !== 'all' ? 'Try selecting a different filter' : 'No appointments have been scheduled yet'}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appointments.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <AppointmentCard 
                    appointment={appointment}
                    onClick={handleAppointmentClick}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
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
