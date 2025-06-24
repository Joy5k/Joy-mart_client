/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSelector } from 'react-redux';
import { RootState } from '@/src/redux/store';
import { FaCalendarAlt, FaClock, FaUser, FaMapMarkerAlt, FaCreditCard, FaCheckCircle, FaBox } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useGetAllBookingsQuery } from '@/src/redux/features/booking/bookingApi';

interface Booking {
  _id: string;
  productId: {
    _id: string;
    title: string;
    price: number;
    stock: number;
    images: string[];
    isActive: boolean;
  };
  bookingQuantity: number;
  userId: {
    _id: string;
    email: string;
    name?: string;
  };
  orderStatus: string;
  createdAt: string;
  updatedAt: string;
  totalPrice: number;
}

const BookingHistoryPage = () => {
  const [isClient, setIsClient] = useState(false);
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const [activeTab, setActiveTab] = useState('details');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const { data, isLoading } = useGetAllBookingsQuery({});
  
  const bookingData: Booking[] = data?.data || [];
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    setIsClient(true);
    if (bookingData.length > 0) {
      setSelectedBooking(bookingData[0]);
    }
  }, [bookingData]);

  if (!isClient || isLoading) {
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
            Your booking for {selectedBooking?.productId.title} has been confirmed.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#088178] text-white px-6 py-3 rounded-lg font-medium cursor-pointer"
            onClick={() => setBookingSuccess(false)}
          >
            View All Bookings
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Bookings</h1>
          <p className="text-gray-600">Manage your current and past bookings</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking List */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg overflow-hidden h-fit">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">All Bookings ({bookingData.length})</h2>
            </div>
            <div className="divide-y">
              {bookingData.map((booking) => (
                <motion.div
                  key={booking._id}
                  whileHover={{ backgroundColor: '#f8fafc' }}
                  className={`p-4 cursor-pointer ${selectedBooking?._id === booking._id ? 'bg-gray-50' : ''}`}
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Image
                        src={booking.productId.images[0] || '/img/placeholder-product.png'}
                        width={60}
                        height={60}
                        alt={booking.productId.title}
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {booking.productId.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.bookingQuantity} × ${booking.productId.price}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(booking.createdAt)} • {formatTime(booking.createdAt)}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{
                        color: booking.orderStatus === 'pending' ? '#d97706' : 
                               booking.orderStatus === 'confirmed' ? '#059669' :
                               booking.orderStatus === 'cancelled' ? '#dc2626' : '#2563eb',
                        backgroundColor: booking.orderStatus === 'pending' ? '#fef3c7' : 
                                        booking.orderStatus === 'confirmed' ? '#d1fae5' :
                                        booking.orderStatus === 'cancelled' ? '#fee2e2' : '#dbeafe'
                      }}
                    >
                      {booking.orderStatus}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Booking Details */}
          {selectedBooking && (
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Booking Details</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800">Product Information</h3>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Image
                          src={selectedBooking.productId.images[0] || '/img/placeholder-product.png'}
                          width={80}
                          height={80}
                          alt={selectedBooking.productId.title}
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{selectedBooking.productId.title}</h4>
                        <p className="text-gray-600">${selectedBooking.productId.price}</p>
                        <p className="text-sm text-gray-500">
                          Stock: {selectedBooking.productId.stock} • 
                          Status: {selectedBooking.productId.isActive ? 'Available' : 'Out of Stock'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <FaBox className="text-[#088178] text-xl" />
                        <div>
                          <p className="text-sm text-gray-500">Quantity</p>
                          <p className="font-medium">{selectedBooking.bookingQuantity}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <FaCreditCard className="text-[#088178] text-xl" />
                        <div>
                          <p className="text-sm text-gray-500">Total Price</p>
                          <p className="font-medium">${selectedBooking.totalPrice}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800">Order Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <FaCalendarAlt className="text-[#088178] text-xl" />
                        <div>
                          <p className="text-sm text-gray-500">Order Date</p>
                          <p className="font-medium">{formatDate(selectedBooking.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <FaClock className="text-[#088178] text-xl" />
                        <div>
                          <p className="text-sm text-gray-500">Order Time</p>
                          <p className="font-medium">{formatTime(selectedBooking.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <FaUser className="text-[#088178] text-xl" />
                        <div>
                          <p className="text-sm text-gray-500">Customer</p>
                          <p className="font-medium">{selectedBooking.userId.name || selectedBooking.userId.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Order Status</h3>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium capitalize">{selectedBooking.orderStatus}</p>
                          <p className="text-sm text-gray-500">Last updated: {formatDate(selectedBooking.updatedAt)}</p>
                        </div>
                        {selectedBooking.orderStatus === 'pending' && (
                          <button 
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium"
                            onClick={() => setActiveTab('confirm')}
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex space-x-4">
                  <button
                    className="flex-1 py-3 border border-gray-300 rounded-lg font-medium"
                  >
                    Download Invoice
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-[#088178] text-white rounded-lg font-medium"
                    onClick={() => setActiveTab('confirm')}
                  >
                    Track Order
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookingHistoryPage;