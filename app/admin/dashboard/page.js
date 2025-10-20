'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Building2, CheckCircle, XCircle, Power, LogOut, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [clinics, setClinics] = useState([]);
  const [allClinics, setAllClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  // Check if admin is logged in
  useEffect(() => {
    const adminEmail = localStorage.getItem('admin_email');
    if (!adminEmail) {
      window.location.href = '/admin/login';
    }
  }, []);

  // Fetch all clinics
  useEffect(() => {
    const fetchClinics = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch('http://localhost:8084/api/admin/action/clinics', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAllClinics(data);
          setClinics(data);
        } else {
          setError('Failed to fetch clinics');
        }
      } catch (error) {
        console.error('Error fetching clinics:', error);
        setError('Network error while fetching clinics');
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, []);

  // Apply filter whenever allClinics or activeFilter changes
  useEffect(() => {
    if (allClinics.length === 0) return;

    let filtered = [...allClinics];

    switch (activeFilter) {
      case 'active':
        filtered = allClinics.filter(clinic => clinic.isActive === true);
        break;
      case 'inactive':
        filtered = allClinics.filter(clinic => clinic.isActive === false);
        break;
      case 'all':
      default:
        filtered = allClinics;
        break;
    }

    setClinics(filtered);
  }, [allClinics, activeFilter]);

  const handleActivateDeactivate = async (clinicId, currentStatus) => {
    const adminEmail = localStorage.getItem('admin_email');
    const adminPassword = localStorage.getItem('admin_password');

    if (!adminEmail || !adminPassword) {
      alert('Admin credentials not found. Please login again.');
      window.location.href = '/admin/login';
      return;
    }

    setActionLoading(clinicId);

    try {
      const response = await fetch(`http://localhost:8084/api/admin/action/activate/${clinicId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword,
        }),
      });

      if (response.ok) {
        // Update the clinic status in the state
        const updatedClinics = allClinics.map(clinic =>
          clinic.id === clinicId
            ? { ...clinic, isActive: !currentStatus }
            : clinic
        );
        setAllClinics(updatedClinics);
        
        // Show success message
        alert(`Clinic ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update clinic status');
      }
    } catch (error) {
      console.error('Error updating clinic status:', error);
      alert('Network error. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_email');
    localStorage.removeItem('admin_password');
    window.location.href = '/admin/login';
  };

  const filterButtons = [
    { id: 'all', label: 'All Clinics', count: allClinics.length, color: 'blue' },
    { id: 'active', label: 'Active', count: allClinics.filter(c => c.isActive).length, color: 'green' },
    { id: 'inactive', label: 'Inactive', count: allClinics.filter(c => !c.isActive).length, color: 'red' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-10 w-10 mr-4" />
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-red-100 mt-1">Clinic Management Portal</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-white text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {filterButtons.map((filter) => (
            <div
              key={filter.id}
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                filter.color === 'blue' ? 'border-blue-500' :
                filter.color === 'green' ? 'border-green-500' : 'border-red-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{filter.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{filter.count}</p>
                </div>
                <div className={`p-3 rounded-full ${
                  filter.color === 'blue' ? 'bg-blue-100' :
                  filter.color === 'green' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {filter.id === 'active' ? (
                    <CheckCircle className={`h-8 w-8 ${
                      filter.color === 'green' ? 'text-green-600' : 'text-blue-600'
                    }`} />
                  ) : filter.id === 'inactive' ? (
                    <XCircle className="h-8 w-8 text-red-600" />
                  ) : (
                    <Building2 className="h-8 w-8 text-blue-600" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Buttons */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter Clinics</h3>
          <div className="flex flex-wrap gap-3">
            {filterButtons.map((button) => (
              <button
                key={button.id}
                onClick={() => setActiveFilter(button.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeFilter === button.id
                    ? button.color === 'blue'
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : button.color === 'green'
                      ? 'bg-green-600 text-white shadow-lg scale-105'
                      : 'bg-red-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm'
                }`}
              >
                {button.label} ({button.count})
              </button>
            ))}
          </div>
        </div>

        {/* Clinics Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              {activeFilter === 'all' ? 'All Clinics' :
               activeFilter === 'active' ? 'Active Clinics' : 'Inactive Clinics'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Showing {clinics.length} {clinics.length === 1 ? 'clinic' : 'clinics'}
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
              <p className="text-gray-500">Loading clinics...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <p className="text-red-600 text-lg font-medium">{error}</p>
            </div>
          ) : clinics.length === 0 ? (
            <div className="text-center py-16">
              <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No clinics found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clinic Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clinics.map((clinic) => (
                    <tr key={clinic.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{clinic.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-sm font-medium text-gray-900">
                            {clinic.clinicName || clinic.name || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {clinic.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {clinic.phone || clinic.contactNo|| 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            clinic.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {clinic.isActive ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 mr-1" />
                              Inactive
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleActivateDeactivate(clinic.id, clinic.isActive)}
                          disabled={actionLoading === clinic.id}
                          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                            clinic.isActive
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {actionLoading === clinic.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <Power className="h-4 w-4 mr-2" />
                              {clinic.isActive ? 'Deactivate' : 'Activate'}
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
