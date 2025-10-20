'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import AppointmentCard from '../../components/AppointmentCard';
import AppointmentDetailModal from '../../components/AppointmentDetailModal';

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch appointments on component mount
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/clinic/appointments/all', {
          method: 'GET',
          credentials: 'include', // Include HttpOnly cookies
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
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
  }, []);

  // Filter upcoming appointments (appointments that are in the future and not cancelled/completed)
  const getUpcomingAppointments = () => {
    const now = new Date();
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      return appointmentDate >= now && 
             appointment.status !== 'CANCELLED' && 
             appointment.status !== 'COMPLETED';
    }).sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
  };

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

  const upcomingAppointments = getUpcomingAppointments();

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
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-2 font-medium">Welcome to your clinic management system</p>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Side - Dashboard Overview */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-blue-800">Total Appointments</h3>
                    <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-4xl font-bold text-blue-600">{appointments.length}</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-green-800">Upcoming</h3>
                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-4xl font-bold text-green-600">{upcomingAppointments.length}</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-yellow-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-yellow-800">Pending</h3>
                    <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-4xl font-bold text-yellow-600">
                    {appointments.filter(apt => apt.status === 'PENDING').length}
                  </p>
                </motion.div>
              </div>

              {/* Features Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="h-6 w-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Available Features
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  {['Patient Management', 'Appointment Scheduling', 'Medical Records', 'Reports & Analytics'].map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.05, x: 5 }}
                      className="flex items-center p-3 rounded-lg hover:bg-white transition-all cursor-pointer"
                    >
                      <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Side - Upcoming Appointments */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="h-6 w-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Upcoming Appointments
              </h2>
              
              {loading ? (
                <div className="flex flex-col justify-center items-center py-8">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="rounded-full h-12 w-12 border-b-4 border-blue-600"
                  ></motion.div>
                  <p className="text-gray-500 mt-4 font-medium">Loading...</p>
                </div>
              ) : error ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-red-600 text-center py-4 bg-red-50 rounded-xl"
                >
                  <p className="font-medium">{error}</p>
                </motion.div>
              ) : upcomingAppointments.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-gray-500 text-center py-8"
                >
                  <motion.svg 
                    initial={{ y: -10 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    className="h-16 w-16 mx-auto mb-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </motion.svg>
                  <p className="font-medium">No upcoming appointments</p>
                </motion.div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {upcomingAppointments.map((appointment, index) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
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

            {/* All Appointments Section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 mt-6 border border-white/20"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="h-6 w-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                All Appointments
              </h2>
              
              {loading ? (
                <div className="flex flex-col justify-center items-center py-8">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="rounded-full h-12 w-12 border-b-4 border-indigo-600"
                  ></motion.div>
                  <p className="text-gray-500 mt-4 font-medium">Loading...</p>
                </div>
              ) : appointments.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-gray-500 text-center py-8"
                >
                  <p className="font-medium">No appointments found</p>
                </motion.div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {appointments.map((appointment, index) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
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