'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiLock, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useResetPasswordMutation } from '@/src/redux/features/Auth/authApi';
import { verifyToken } from '@/src/utils/jwt';
import { toast } from 'react-toastify';

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error,setError]=useState('')

  const [resetPassword,{isLoading,isSuccess:success}]=useResetPasswordMutation()

  if(!token){
    toast.error("Invalid or expired token")
    router.push('/forgot-password')
  }
  const {email}=verifyToken(token!) 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }



    if (!userId || !token) {
      setError('Invalid reset link');
      return;
    }

    const data={
        userId,
        token,
        email,
        newPassword: password
      }
    try {
      const response = await resetPassword({data}).unwrap();

      if (response.success) {
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (err:any) {
      setError(err?.message || 'Something went wrong');
    } finally {
    }
  };

  if (!userId || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-center text-red-600 mb-4">Invalid Link</h2>
          <p className="text-center text-gray-600">
            The password reset link is invalid or has expired.
          </p>
          <button
            onClick={() => router.push('/forgot-password')}
            className="mt-6 w-full bg-[#088178] text-white py-2 px-4 rounded-md hover:bg-[#077168] transition"
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FiCheck className="text-green-600 text-2xl" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Updated!</h2>
          <p className="text-gray-600 mb-6">
            Your password has been successfully reset. Redirecting to login...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-lg shadow-md max-w-md w-full"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
          <p className="text-gray-600 mb-6">
            Enter your new password below
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#088178] focus:border-[#088178]"
                placeholder="At least 8 characters"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#088178] focus:border-[#088178]"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#088178] hover:bg-[#077168] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#088178] disabled:opacity-70"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resetting...
              </span>
            ) : (
              'Reset Password'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;