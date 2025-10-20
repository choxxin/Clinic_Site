'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Calendar, FileText, Clock, CheckCircle, XCircle, Hourglass, Save } from 'lucide-react';

export default function AppointmentDetailModal({ appointment, isOpen, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    appointmentDate: '',
    status: '',
    medicalRequirement: '',
    remarks: '',
    clinicReportUrl: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (appointment) {
      // Format date for input field (YYYY-MM-DD or YYYY-MM-DDTHH:mm for datetime-local)
      let formattedDate = appointment.appointmentDate;
      if (formattedDate.includes('T')) {
        formattedDate = formattedDate.substring(0, 16); // For datetime-local input
      }
      
      setFormData({
        appointmentDate: formattedDate,
        status: appointment.status,
        medicalRequirement: appointment.medicalRequirement || '',
        remarks: appointment.remarks || '',
        clinicReportUrl: appointment.clinicReportUrl || ''
      });
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadSuccess('');
      setError('');
    }
  };

  const handleUploadReport = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');
    setUploadSuccess('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);

      const response = await fetch(
        `http://localhost:8080/api/clinic/appointments/upload-report/${appointment.id}`,
        {
          method: 'POST',
          credentials: 'include',
          body: uploadFormData,
        }
      );

      if (response.ok) {
        const message = await response.text();
        // Extract URL from response message
        const urlMatch = message.match(/https:\/\/[^\s]+/);
        if (urlMatch) {
          const uploadedUrl = urlMatch[0];
          setFormData(prev => ({
            ...prev,
            clinicReportUrl: uploadedUrl
          }));
          setUploadSuccess('Report uploaded successfully!');
          setSelectedFile(null);
        }
      } else {
        setError('Failed to upload report');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Network error while uploading report');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setError('');

    try {
      const updateData = {
        appointmentDate: formData.appointmentDate,
        status: formData.status,
        medicalRequirement: formData.medicalRequirement,
        remarks: formData.remarks,
        clinicReportUrl: formData.clinicReportUrl
      };

      const response = await fetch(
        `http://localhost:8080/api/clinic/appointments/update/${appointment.id}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        }
      );

      if (response.ok) {
        const updatedAppointment = await response.json();
        if (onUpdate) {
          onUpdate(updatedAppointment);
        }
        onClose();
      } else {
        setError('Failed to update appointment');
      }
    } catch (error) {
      console.error('Update error:', error);
      setError('Network error while updating appointment');
    } finally {
      setSaving(false);
    }
  };

  const statusOptions = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-700 bg-yellow-50';
      case 'CONFIRMED': return 'text-indigo-700 bg-indigo-50';
      case 'COMPLETED': return 'text-green-700 bg-green-50';
      case 'CANCELLED': return 'text-red-700 bg-red-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && appointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-100"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl z-10 shadow-lg">
                <div className="flex items-center justify-between">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h2 className="text-3xl font-bold flex items-center">
                      <Calendar className="mr-3 h-8 w-8" />
                      Edit Appointment
                    </h2>
                    <p className="text-blue-100 mt-2 font-medium">ID: {appointment.id} • {appointment.patientName}</p>
                  </motion.div>
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-3 transition-all"
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center shadow-lg"
                    >
                      <XCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span className="font-medium">{error}</span>
                    </motion.div>
                  )}

                  {uploadSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center shadow-lg"
                    >
                      <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span className="font-medium">{uploadSuccess}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Patient Info (Read-only) */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-r from-gray-50 to-blue-50 p-5 rounded-xl border-2 border-gray-200 shadow-inner"
                >
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center text-lg">
                    <svg className="h-6 w-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Patient Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-gray-600 font-medium mb-1">Name</p>
                      <p className="font-bold text-gray-900">{appointment.patientName}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-gray-600 font-medium mb-1">Contact</p>
                      <p className="font-bold text-gray-900">{appointment.patientContactNo}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Appointment Date */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    Appointment Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 font-medium shadow-sm hover:border-blue-400"
                  />
                </motion.div>

                {/* Status */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    Status
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {statusOptions.map((status, index) => (
                      <motion.button
                        key={status}
                        type="button"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.35 + index * 0.05 }}
                        onClick={() => setFormData(prev => ({ ...prev, status }))}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-3 rounded-xl font-bold transition-all shadow-md ${
                          formData.status === status
                            ? 'ring-4 ring-blue-600 shadow-xl ' + getStatusColor(status)
                            : 'border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:shadow-lg'
                        }`}
                      >
                        {status}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Medical Requirement */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-red-600" />
                    Medical Requirement
                  </label>
                  <textarea
                    name="medicalRequirement"
                    value={formData.medicalRequirement}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none text-gray-900 placeholder-gray-400 shadow-sm hover:border-blue-400"
                    placeholder="Enter medical requirement details"
                  />
                </motion.div>

                {/* Remarks */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none text-gray-900 placeholder-gray-400 shadow-sm hover:border-blue-400"
                    placeholder="Add any remarks or notes"
                  />
                </motion.div>

                {/* Report Upload */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                    <Upload className="h-5 w-5 mr-2 text-purple-600" />
                    Upload Clinic Report
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileSelect}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 shadow-sm"
                    />
                    {selectedFile && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-2 border-blue-200 shadow-lg"
                      >
                        <span className="text-sm text-blue-900 font-semibold flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          {selectedFile.name}
                        </span>
                        <motion.button
                          onClick={handleUploadReport}
                          disabled={uploading}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-xl disabled:opacity-50 text-sm font-bold transition-all"
                        >
                          {uploading ? (
                            <span className="flex items-center">
                              <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Uploading...
                            </span>
                          ) : 'Upload'}
                        </motion.button>
                      </motion.div>
                    )}
                    {formData.clinicReportUrl && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-green-50 p-4 rounded-xl border-2 border-green-200 shadow-lg"
                      >
                        <p className="text-sm text-green-900 font-bold mb-2 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Current Report:
                        </p>
                        <a
                          href={formData.clinicReportUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 hover:underline break-all font-medium"
                        >
                          {formData.clinicReportUrl}
                        </a>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-5 rounded-b-3xl border-t-2 border-gray-200 flex justify-end space-x-4 shadow-lg">
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 font-bold transition-all shadow-md hover:shadow-xl"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleSaveChanges}
                  disabled={saving}
                  whileHover={{ scale: saving ? 1 : 1.05, y: saving ? 0 : -2 }}
                  whileTap={{ scale: saving ? 1 : 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-2xl disabled:opacity-50 font-bold transition-all flex items-center shadow-lg"
                >
                  {saving ? (
                    <>
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="rounded-full h-5 w-5 border-b-2 border-white mr-2"
                      ></motion.div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
