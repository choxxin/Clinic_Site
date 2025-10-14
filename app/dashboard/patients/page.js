'use client';

import DashboardLayout from '../../../components/DashboardLayout';
import { Users } from 'lucide-react';

export default function PatientsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Users className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patients Management</h1>
          <p className="text-gray-600">This feature is coming soon</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
