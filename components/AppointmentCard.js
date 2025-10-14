import React from 'react';
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
    <div 
      onClick={() => onClick && onClick(appointment)}
      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:border-blue-300"
    >
      
      {/* Header and Status */}
      <div className="flex justify-between items-start border-b pb-4 mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {appointment.patientName}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            ID: {appointment.patientId} • Contact: {appointment.patientContactNo}
          </p>
        </div>
        <div className={`px-3 py-1 text-xs font-bold rounded-full flex items-center space-x-1 ${tagClass}`}>
          <StatusIcon className={`w-3 h-3 ${iconClass}`} />
          <span className="uppercase">{appointment.status}</span>
        </div>
      </div>

      {/* Core Details */}
      <div className="space-y-3">
        {/* Date & Time */}
        <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center text-blue-700 font-semibold">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Date:</span>
          </div>
          <span className="text-gray-800 font-mono">{date}</span>
        </div>

        {appointment.appointmentDate.includes('T') && (
          <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center text-blue-700 font-semibold">
              <Clock className="w-4 h-4 mr-2" />
              <span>Time:</span>
            </div>
            <span className="text-gray-800 font-mono">{time}</span>
          </div>
        )}

        {/* Medical Requirement */}
        <div className="p-3 border border-gray-200 rounded-lg">
          <div className="flex items-center text-gray-700 font-semibold mb-1">
            <Stethoscope className="w-4 h-4 mr-2 text-red-500" />
            <span>Medical Requirement:</span>
          </div>
          <p className="ml-6 text-sm text-gray-600">
            {appointment.medicalRequirement || 'No specific requirement noted.'}
          </p>
        </div>

        {/* Remarks if available */}
        {appointment.remarks && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center text-gray-700 font-semibold mb-1">
              <Info className="w-4 h-4 mr-2 text-blue-500" />
              <span>Remarks:</span>
            </div>
            <p className="ml-6 text-sm text-gray-600">{appointment.remarks}</p>
          </div>
        )}
      </div>
      
      {/* Clinic Contact Info (Footer) */}
      <div className="mt-4 pt-4 border-t border-dashed border-gray-300">
        <h4 className="text-base font-bold text-pink-600 flex items-center">
          <Hospital className="w-4 h-4 mr-2" />
          {appointment.clinic.name}
        </h4>
        <p className="flex items-center text-gray-600 mt-1 text-sm">
          <Phone className="w-3 h-3 mr-2 text-green-500 flex-shrink-0" /> 
          {appointment.clinic.contactNo}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {appointment.clinic.address}
        </p>
      </div>
    </div>
  );
};

export default AppointmentCard;