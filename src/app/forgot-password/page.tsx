'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Note: Changed from 'next/router'
import { FiMail, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useForgetPasswordMutation } from '@/src/redux/features/Auth/authApi';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [forgetPassword]=useForgetPasswordMutation()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await forgetPassword( { email }).unwrap()
      
      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.data.message || 'Failed to send reset link');
      }
    } catch (err:any) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {success ? 'Check Your Email' : 'Forgot Password'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {success 
              ? `We've sent a password reset link to ${email}`
              : "Enter your email to receive a reset link"}
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-md bg-red-50 text-red-800 text-sm">
            {error}
          </div>
        )}

        {!success ? (
          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#088178] focus:border-[#088178]"
                  />
                </div>
              </div>

              <div>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#088178] hover:bg-[#077168] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#088178] disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <FiArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        ) : (
          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <button
              onClick={() => router.push('/login')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#088178] hover:bg-[#077168] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#088178]"
            >
              Back to Login
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;