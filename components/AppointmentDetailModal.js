'use client';

import { useState, useEffect } from 'react';
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Edit Appointment</h2>
                <p className="text-blue-100 mt-1">ID: {appointment.id} • {appointment.patientName}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {uploadSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {uploadSuccess}
              </div>
            )}

            {/* Patient Info (Read-only) */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Patient Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Name</p>
                  <p className="font-medium">{appointment.patientName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Contact</p>
                  <p className="font-medium">{appointment.patientContactNo}</p>
                </div>
              </div>
            </div>

            {/* Appointment Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-2" />
                Appointment Date & Time
              </label>
              <input
                type="datetime-local"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CheckCircle className="inline h-4 w-4 mr-2" />
                Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status }))}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      formData.status === status
                        ? 'ring-2 ring-blue-600 ' + getStatusColor(status)
                        : 'border border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Medical Requirement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline h-4 w-4 mr-2" />
                Medical Requirement
              </label>
              <textarea
                name="medicalRequirement"
                value={formData.medicalRequirement}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter medical requirement details"
              />
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline h-4 w-4 mr-2" />
                Remarks
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Add any remarks or notes"
              />
            </div>

            {/* Report Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Upload className="inline h-4 w-4 mr-2" />
                Upload Clinic Report
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {selectedFile && (
                  <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                    <span className="text-sm text-blue-900">
                      Selected: {selectedFile.name}
                    </span>
                    <button
                      onClick={handleUploadReport}
                      disabled={uploading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
                    >
                      {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                )}
                {formData.clinicReportUrl && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-900 font-medium mb-1">Current Report:</p>
                    <a
                      href={formData.clinicReportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline break-all"
                    >
                      {formData.clinicReportUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
