'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function VerificationPage() {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState('');
  const [storedCode, setStoredCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    // Retrieve stored data from sessionStorage
    const loginEmail = sessionStorage.getItem('loginEmail');
    const loginPassword = sessionStorage.getItem('loginPassword');
    const storedVerificationCode = sessionStorage.getItem('verificationCode');

    if (!loginEmail || !loginPassword || !storedVerificationCode) {
      // If no stored data, redirect back to login
      router.push('/clinic/auth/login');
      return;
    }

    setEmail(loginEmail);
    setPassword(loginPassword);
    setStoredCode(storedVerificationCode);
  }, [router]);

  /**
   * Handles verification code input changes.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setVerificationCode(value);
      setError('');
    }
  };

  /**
   * Verifies the entered code and proceeds with login if correct.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if entered code matches stored code
      if (verificationCode === storedCode) {
        // Code matches, proceed with actual login
        const response = await fetch('http://localhost:8080/api/clinic/auth/login', {
          method: 'POST',
          credentials: 'include', // Critical for sending/receiving cookies
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password
          }),
        });

        if (response.ok) {
          // Clear sessionStorage
          sessionStorage.removeItem('loginEmail');
          sessionStorage.removeItem('loginPassword');
          sessionStorage.removeItem('verificationCode');
          
          // Login successful, redirect to dashboard using Next.js router
          router.push('/clinic/dashboard');
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Login failed. Please try again.');
        }
      } else {
        setError('Invalid verification code. Please check your email and try again.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resends the verification code.
   */
  const handleResend = async () => {
    setResendLoading(true);
    setError('');

    try {
      const emailjs = (await import('@emailjs/browser')).default;
      
      // Generate new verification code
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Create a temporary form to send the email
      const tempForm = document.createElement('form');
      
      const emailInput = document.createElement('input');
      emailInput.type = 'hidden';
      emailInput.name = 'email';
      emailInput.value = email;
      tempForm.appendChild(emailInput);
      
      // Add OTP with multiple variable names for compatibility
      const otpInput = document.createElement('input');
      otpInput.type = 'hidden';
      otpInput.name = 'otp';
      otpInput.value = newCode;
      tempForm.appendChild(otpInput);
      
      const codeInput = document.createElement('input');
      codeInput.type = 'hidden';
      codeInput.name = 'verification_code';
      codeInput.value = newCode;
      tempForm.appendChild(codeInput);
      
      const messageInput = document.createElement('input');
      messageInput.type = 'hidden';
      messageInput.name = 'message';
      messageInput.value = newCode;
      tempForm.appendChild(messageInput);

      const emailResponse = await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        tempForm,
        {
          publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
        }
      );

      if (emailResponse.status === 200) {
        sessionStorage.setItem('verificationCode', newCode);
        setStoredCode(newCode);
        setVerificationCode('');
        alert('Verification code has been resent to your email.');
      }
    } catch (error) {
      setError('Failed to resend verification code. Please try again.');
      console.error('Resend error:', error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 relative z-10"
      >
        {/* Logo and Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center"
        >
          <motion.div 
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="mx-auto h-20 w-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/50"
          >
            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </motion.div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
            Verify Your Email
          </h2>
          <p className="mt-3 text-base text-gray-600 font-medium">
            We've sent a 6-digit code to <span className="font-semibold text-blue-600">{email}</span>
          </p>
        </motion.div>

        {/* Verification Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/80 backdrop-blur-xl py-10 px-8 shadow-2xl rounded-3xl border border-white/20 relative"
        >
          <form className="space-y-6" onSubmit={handleVerify}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm"
              >
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </motion.div>
            )}
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-2">
                Verification Code
              </label>
              <div className="relative group">
                <input
                  id="code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  maxLength={6}
                  value={verificationCode}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-center text-2xl font-bold tracking-widest hover:border-blue-300 text-gray-900 placeholder-gray-400 bg-gray-50/50 focus:bg-white"
                  placeholder="000000"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 text-center">
                Enter the 6-digit code sent to your email
              </p>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading || verificationCode.length !== 6}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </div>
              ) : (
                <span className="flex items-center">
                  <span>Verify & Sign In</span>
                  <svg className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </motion.button>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center space-y-3"
            >
              <p className="text-sm text-gray-600">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors hover:underline disabled:opacity-50"
                >
                  {resendLoading ? 'Sending...' : 'Resend'}
                </button>
              </p>
              <p className="text-sm text-gray-600">
                <Link href="/clinic/auth/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors hover:underline">
                  Back to Login
                </Link>
              </p>
            </motion.div>
          </form>
        </motion.div>

        {/* Info Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-5 shadow-lg backdrop-blur-sm"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-bold text-blue-900">Security Notice</h3>
              <p className="mt-2 text-sm text-blue-800">
                This verification code will expire in 10 minutes for your security. 
                Please check your spam folder if you don't see the email.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
