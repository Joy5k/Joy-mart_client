/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSelector } from 'react-redux';
import { RootState } from '@/src/redux/store';
import { FaCalendarAlt, FaClock, FaUser, FaMapMarkerAlt, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const BookingPage = () => {
  const [isClient, setIsClient] = useState(false);
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const [activeTab, setActiveTab] = useState('details');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Demo booking data (will be replaced with real data later)
  const demoBookingData = {
    date: new Date(Date.now() + 86400000 * 3).toLocaleDateString(),
    time: '14:30',
    service: 'Premium Service',
    duration: '90 mins',
    price: '$120',
    location: 'Main Street Salon',
    specialist: 'Emma Johnson'
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#088178]"></div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your appointment with {demoBookingData.specialist} on {demoBookingData.date} at {demoBookingData.time} is confirmed.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#088178] text-white px-6 py-3 rounded-lg font-medium cursor-pointer"
          >
            View Appointment Details
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Appointment</h1>
          <p className="text-gray-600">Select from your wishlist or book a new service</p>
        </motion.div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-4 px-6 cursor-pointer font-medium ${activeTab === 'details' ? 'text-[#088178] border-b-2 border-[#088178]' : 'text-gray-500'}`}
            >
              Booking Details
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`flex-1 py-4 px-6  cursor-pointer font-medium ${activeTab === 'payment' ? 'text-[#088178] border-b-2 border-[#088178]' : 'text-gray-500'}`}
            >
              Payment
            </button>
            <button
              onClick={() => setActiveTab('confirm')}
              className={`flex-1 py-4 px-6  cursor-pointer font-medium ${activeTab === 'confirm' ? 'text-[#088178] border-b-2 border-[#088178]' : 'text-gray-500'}`}
            >
              Confirmation
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'details' && (
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">From Your Wishlist</h2>
                  {wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {wishlistItems.slice(0, 2).map((item, index) => (
                        <motion.div
                          key={`wishlist-${index}`}
                          whileHover={{ y: -5 }}
                          className="border rounded-lg p-4 flex items-center"
                        >
                          <div className="flex-shrink-0 mr-4">
                            <Image
                              src={(item as any).image || '/img/placeholder-product.png'}
                              width={60}
                              height={60}
                              alt={item.name}
                              className="rounded-md object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">{item.name}</h3>
                            <p className="text-sm text-gray-500">${item.price}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <p className="text-gray-500">Your wishlist is empty</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">Appointment Details</h2>
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <FaCalendarAlt className="text-[#088178] text-xl" />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">{demoBookingData.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <FaClock className="text-[#088178] text-xl" />
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium">{demoBookingData.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <FaUser className="text-[#088178] text-xl" />
                      <div>
                        <p className="text-sm text-gray-500">Specialist</p>
                        <p className="font-medium">{demoBookingData.specialist}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">Service Details</h2>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium mb-2">{demoBookingData.service}</h3>
                      <p className="text-sm text-gray-600 mb-3">{demoBookingData.duration} session</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#088178]">{demoBookingData.price}</span>
                        <button className="text-sm text-[#088178] font-medium cursor-pointer">Change</button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <FaMapMarkerAlt className="text-[#088178] text-xl" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{demoBookingData.location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('payment')}
                  className="w-full py-3 bg-[#088178] text-white rounded-lg font-medium mt-6 cursor-pointer"
                >
                  Continue to Payment
                </motion.button>
              </motion.div>
            )}

            {activeTab === 'payment' && (
              <motion.div
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="space-y-8"
              >
                <h2 className="text-xl font-semibold text-gray-800">Payment Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-6 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-medium">Credit/Debit Card</h3>
                        <FaCreditCard className="text-[#088178] text-xl" />
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Card Number</label>
                          <input 
                            type="text" 
                            placeholder="1234 5678 9012 3456" 
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Expiry Date</label>
                            <input 
                              type="text" 
                              placeholder="MM/YY" 
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">CVV</label>
                            <input 
                              type="text" 
                              placeholder="123" 
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Name on Card</label>
                          <input 
                            type="text" 
                            placeholder="John Doe" 
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-6 bg-gray-50 rounded-lg">
                      <h3 className="font-medium mb-4">Order Summary</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Service</span>
                          <span>{demoBookingData.service}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration</span>
                          <span>{demoBookingData.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date & Time</span>
                          <span>{demoBookingData.date} at {demoBookingData.time}</span>
                        </div>
                        <div className="border-t pt-3 mt-3">
                          <div className="flex justify-between font-medium">
                            <span>Total</span>
                            <span className="text-[#088178]">{demoBookingData.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={() => setActiveTab('details')}
                        className="flex-1 py-3 border border-gray-300 rounded-lg font-medium cursor-pointer"
                      >
                        Back
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setBookingSuccess(true)}
                        className="flex-1 py-3 bg-[#088178] text-white rounded-lg font-medium cursor-pointer"
                      >
                        Confirm Booking
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingPage;