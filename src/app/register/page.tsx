/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaFacebook, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';
import Image from 'next/image';
import { useRegisterMutation } from '@/src/redux/features/Auth/authApi';
import { setToken } from '@/src/utils/localStorageManagement';
import { IFormData } from '@/src/types';

const RegisterPage = () => {

 const [formData, setFormData] = useState<IFormData>({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
});
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const [registerMutation] = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const res = await registerMutation(formData).unwrap();
      localStorage.setItem('token', res.data.accessToken);
        console.log(res)
      if(res.success){
        setToken(res.data.accessToken);
        console.log(res)
        // router.push('/');
      }
    } catch (err:any) {
        console.log(err.data.errorSources[0].message)
      setError(err?.data?.errorSources[0]?.message||err.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = (provider: string) => {
    console.log(`Registering with ${provider}`);
  };

  return (
    <section className=" px-10 py-10 md:py-20 lg:py-20 flex items-center justify-center min-h-screen bg-[#E3E6F3]">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#088178] to-[#0abab5] p-6 text-center">
          <div className="flex justify-center mb-4">
            <Image 
              src="/img/logo.png" 
              width={70} 
              height={70} 
              alt="Logo" 
              className="rounded-full border-2 border-white"
            />
          </div>
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <p className="text-[#cce7d0] mt-1">Join our community</p>
        </div>

        <div className="p-6 sm:p-8">
          {/* Social Register Buttons */}
          <div className="flex justify-between gap-4 mb-6">
            <button
              onClick={() => handleSocialRegister('google')}
              className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FaGoogle className="text-red-500" />
              <span className="text-sm">Google</span>
            </button>

            <button
              onClick={() => handleSocialRegister('facebook')}
              className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-[#1877F2] text-white rounded-md py-2 px-4 hover:bg-[#166FE5] transition-colors"
            >
              <FaFacebook />
              <span className="text-sm">Facebook</span>
            </button>
          </div>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 mb-2">First Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none transition"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="lastName" className="block text-gray-700 mb-2">Last Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none transition"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none transition"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none transition"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none transition"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-[#088178] hover:bg-[#0abab5] cursor-pointer text-white font-medium rounded-md transition-colors shadow-md ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-[#088178] hover:text-[#0abab5] font-medium">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;