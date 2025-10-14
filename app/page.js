'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in by checking localStorage flag
    // and then verify with server if needed
    const checkAuthStatus = async () => {
      const userLoggedIn = localStorage.getItem('user_logged_in');
      
      if (userLoggedIn) {
        try {
          // Verify with server using HttpOnly cookie
          const response = await fetch('http://localhost:8080/api/clinic/auth/verify', {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            // User is authenticated, redirect to dashboard
            router.push('/dashboard');
          } else {
            // Clear invalid state
            localStorage.removeItem('user_logged_in');
            localStorage.removeItem('clinic_token');
          }
        } catch (error) {
          console.error('Auth verification failed:', error);
          // Clear invalid state
          localStorage.removeItem('user_logged_in');
          localStorage.removeItem('clinic_token');
        }
      }
    };

    checkAuthStatus();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo and Header */}
        <div className="mb-8">
          <div className="mx-auto h-24 w-24 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mb-6">
            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v6" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Clinic Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline your clinic operations with our comprehensive management platform. 
            Manage patients, appointments, and medical records all in one place.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient Management</h3>
            <p className="text-gray-600 text-sm">Efficiently manage patient records, medical history, and treatment plans.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Appointment Scheduling</h3>
            <p className="text-gray-600 text-sm">Schedule and manage appointments with automated reminders and notifications.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reports & Analytics</h3>
            <p className="text-gray-600 text-sm">Generate comprehensive reports and analytics to track clinic performance.</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/auth/login"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Sign In to Your Account
          </Link>
          <Link
            href="/auth/register"
            className="bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-8 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all duration-200"
          >
            Create New Account
          </Link>
        </div>

        {/* Demo Info */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="flex items-center justify-center mb-3">
            <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <h4 className="text-sm font-medium text-yellow-800">Demo Credentials</h4>
          </div>
          <div className="text-sm text-yellow-700 space-y-1">
            <p><strong>Email:</strong> clinic1@gmail.com</p>
            <p><strong>Password:</strong> clinic</p>
          </div>
        </div>
      </div>
    </div>
  );
}
