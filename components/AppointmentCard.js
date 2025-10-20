import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Hospital, Stethoscope, XCircle, CheckCircle, Hourglass, Info, Phone } from 'lucide-react';

/**
 * Gets the Tailwind classes (color, icon) for a given appointment status.
 * @param {string} status
 */
const getStatusProps = (status) => {
  switch (status) {
    case 'CONFIRMED':
      return { tagClass: 'bg-indigo-100 text-indigo-700', icon: CheckCircle, iconClass: 'text-indigo-500' };
    case 'PENDING':
      return { tagClass: 'bg-yellow-100 text-yellow-700', icon: Hourglass, iconClass: 'text-yellow-500' };
    case 'CANCELLED':
      return { tagClass: 'bg-red-100 text-red-700', icon: XCircle, iconClass: 'text-red-500' };
    case 'COMPLETED':
      return { tagClass: 'bg-green-100 text-green-700', icon: CheckCircle, iconClass: 'text-green-500' };
    default:
      return { tagClass: 'bg-gray-100 text-gray-700', icon: Info, iconClass: 'text-gray-500' };
  }
};

/**
 * Formats a raw date string into a user-friendly format (Date and Time).
 * @param {string} dateString
 */
const formatAppointmentDateTime = (dateString) => {
  try {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return { date: formattedDate, time: formattedTime };
  } catch (error) {
    return { date: 'N/A', time: 'N/A' };
  }
};

/**
 * AppointmentCard component to display appointment details.
 * @param {Object} appointment - The appointment object
 * @param {Function} onClick - Optional click handler
 */
const AppointmentCard = ({ appointment, onClick }) => {
  const { tagClass, icon: StatusIcon, iconClass } = getStatusProps(appointment.status);
  const { date, time } = formatAppointmentDateTime(appointment.appointmentDate);

  return (
    <motion.div 
      onClick={() => onClick && onClick(appointment)}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl border-2 border-gray-100 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 cursor-pointer group"
    >
      
      {/* Header and Status */}
      <div className="flex justify-between items-start border-b-2 border-gray-100 pb-4 mb-4">
        <div>
          <motion.h3 
            className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors"
          >
            {appointment.patientName}
          </motion.h3>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            ID: {appointment.patientId} • {appointment.patientContactNo}
          </p>
        </div>
        <motion.div 
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          className={`px-3 py-2 text-xs font-bold rounded-xl flex items-center space-x-1.5 ${tagClass} shadow-lg`}
        >
          <StatusIcon className={`w-4 h-4 ${iconClass}`} />
          <span className="uppercase">{appointment.status}</span>
        </motion.div>
      </div>

      {/* Core Details */}
      <div className="space-y-3">
        {/* Date & Time */}
        <motion.div 
          whileHover={{ x: 5 }}
          className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl border border-blue-100 group-hover:shadow-md transition-all"
        >
          <div className="flex items-center text-blue-700 font-semibold">
            <Calendar className="w-5 h-5 mr-2" />
            <span>Date:</span>
          </div>
          <span className="text-gray-800 font-mono font-bold">{date}</span>
        </motion.div>

        {appointment.appointmentDate.includes('T') && (
          <motion.div 
            whileHover={{ x: 5 }}
            className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-xl border border-blue-100 group-hover:shadow-md transition-all"
          >
            <div className="flex items-center text-blue-700 font-semibold">
              <Clock className="w-5 h-5 mr-2" />
              <span>Time:</span>
            </div>
            <span className="text-gray-800 font-mono font-bold">{time}</span>
          </motion.div>
        )}

        {/* Medical Requirement */}
        <motion.div 
          whileHover={{ x: 5 }}
          className="p-4 border-2 border-gray-100 rounded-xl group-hover:border-red-200 group-hover:shadow-md transition-all bg-gradient-to-br from-white to-gray-50"
        >
          <div className="flex items-center text-gray-800 font-bold mb-2">
            <Stethoscope className="w-5 h-5 mr-2 text-red-500" />
            <span>Medical Requirement:</span>
          </div>
          <p className="ml-7 text-sm text-gray-600 leading-relaxed">
            {appointment.medicalRequirement || 'No specific requirement noted.'}
          </p>
        </motion.div>

        {/* Remarks if available */}
        {appointment.remarks && (
          <motion.div 
            whileHover={{ x: 5 }}
            className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 group-hover:shadow-md transition-all"
          >
            <div className="flex items-center text-gray-800 font-bold mb-2">
              <Info className="w-5 h-5 mr-2 text-blue-500" />
              <span>Remarks:</span>
            </div>
            <p className="ml-7 text-sm text-gray-600 leading-relaxed">{appointment.remarks}</p>
          </motion.div>
        )}
      </div>
      
      {/* Clinic Contact Info (Footer) */}
      <motion.div 
        whileHover={{ y: -2 }}
        className="mt-5 pt-5 border-t-2 border-dashed border-gray-200 bg-gradient-to-r from-pink-50 to-purple-50 -m-6 mt-4 p-6 rounded-b-2xl group-hover:shadow-inner transition-all"
      >
        <h4 className="text-base font-bold text-pink-600 flex items-center mb-2">
          <Hospital className="w-5 h-5 mr-2" />
          {appointment.clinic.name}
        </h4>
        <p className="flex items-center text-gray-700 text-sm font-medium">
          <Phone className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" /> 
          {appointment.clinic.contactNo}
        </p>
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
          {appointment.clinic.address}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default AppointmentCard;