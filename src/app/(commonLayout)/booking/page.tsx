/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSelector } from 'react-redux';
import { RootState } from '@/src/redux/store';
import { FaCreditCard, FaCheckCircle, FaTrash, FaShoppingCart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  useGetAllBookingsQuery, 
  useCreateBookingMutation,
  useDeleteBookingMutation,
  useUpdateBookingMutation 
} from '@/src/redux/features/booking/bookingApi';
import { Booking, Product } from '@/src/types';
import { toast } from 'react-toastify';

const BookingPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('manage');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [quantityMap, setQuantityMap] = useState<Record<string, number>>({});
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: bookingsData, refetch } = useGetAllBookingsQuery({});
  const [createBooking] = useCreateBookingMutation();
  const [deleteBooking] = useDeleteBookingMutation();
  const [updateBooking] = useUpdateBookingMutation();
  
  const bookings: Booking[] = bookingsData?.data || [];
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);

  useEffect(() => {
    setIsClient(true);
    // Initialize quantity map
    const initialQuantities = bookings.reduce((acc, booking) => {
      acc[booking._id] = booking.bookingQuantity;
      return acc;
    }, {} as Record<string, number>);
    setQuantityMap(initialQuantities);
  }, [bookings]);

  const handleCreateBooking = async () => {
    try {
      await Promise.all(
        selectedProducts.map(product => 
          createBooking({
            productId: product._id,
            bookingQuantity: quantityMap[product._id] || 1,
            priceAtBooking: product.price
          }).unwrap()
        )
      );
      setBookingSuccess(true);
      refetch();
      setSelectedProducts([]);
    } catch (error) {
      toast.error('Booking failed. Please try again.');
    }
  };

  const handleDeleteBooking = async (id: string) => {
    
    try {
      await deleteBooking({id}).unwrap();
      toast.success('Booking deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete booking');
    }
  };

  const handleUpdateQuantity = async (bookingId: string, newQuantity: number) => {
    try {
      await updateBooking({
        id: bookingId,
        data: { bookingQuantity: newQuantity }
      }).unwrap();
      toast.success('Quantity updated successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const toggleProductSelection = (product: Product) => {
    setSelectedProducts(prev => {
      if (prev.some(p => p._id === product._id)) {
        return prev.filter(p => p._id !== product._id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleQuantityChange = (id: string, value: number) => {
    setQuantityMap(prev => ({
      ...prev,
      [id]: Math.max(1, value)
    }));
  };

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
            Your booking has been successfully processed.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#088178] text-white px-6 py-3 rounded-lg font-medium"
            onClick={() => {
              setBookingSuccess(false);
              setActiveTab('manage');
            }}
          >
            View Bookings
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
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {activeTab === 'manage' ? 'Manage Your Bookings' : 'Checkout'}
          </h1>
          <p className="text-gray-600">
            {activeTab === 'manage' 
              ? 'View and manage your booked products' 
              : 'Complete your purchase'}
          </p>
        </motion.div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex-1 py-4 px-6 cursor-pointer font-medium ${activeTab === 'manage' ? 'text-[#088178] border-b-2 border-[#088178]' : 'text-gray-500'}`}
            >
              Manage Bookings
            </button>
            <button
              onClick={() => setActiveTab('checkout')}
              className={`flex-1 py-4 px-6 cursor-pointer font-medium ${activeTab === 'checkout' ? 'text-[#088178] border-b-2 border-[#088178]' : 'text-gray-500'}`}
              disabled={selectedProducts.length === 0}
            >
              Checkout ({selectedProducts.length})
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'manage' && (
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Your Booked Products ({bookings.length})
                  </h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                  >
                    {isEditing ? 'Done' : 'Edit'}
                  </button>
                </div>

                {bookings.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-500">You have no booked products yet</p>
                    <button
                      onClick={() => setSelectedProducts(wishlistItems as Product[])}
                      className="mt-4 px-4 py-2 bg-[#088178] text-white rounded-lg text-sm font-medium"
                    >
                      Book from Wishlist
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map(booking => (
                      <motion.div
                        key={booking._id}
                        whileHover={{ y: -2 }}
                        className="border rounded-lg p-4 flex items-start"
                      >
                        <div className="flex-shrink-0 mr-4">
                          <input
                            type="checkbox"
                            checked={selectedProducts.some(p => p._id === booking.productId._id)}
                            onChange={() => toggleProductSelection(booking.productId)}
                            className="h-5 w-5 text-[#088178] rounded mt-2"
                          />
                        </div>
                        <div className="flex-1 flex items-start">
                          <div className="flex-shrink-0 mr-4">
                            <Image
                              src={booking.productId.images[0] || '/img/placeholder-product.png'}
                              width={80}
                              height={80}
                              alt={booking.productId.title}
                              className="rounded-md object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800">{booking.productId.title}</h3>
                            <div className="flex items-center mt-2">
                              <span className="text-sm text-gray-600 mr-4">
                                ${booking.productId.price} each
                              </span>
                              {isEditing ? (
                                <div className="flex items-center">
                                  <button 
                                    className="px-2 py-1 border rounded-l-lg"
                                    onClick={() => handleQuantityChange(
                                      booking._id, 
                                      (quantityMap[booking._id] || booking.bookingQuantity) - 1
                                    )}
                                  >
                                    -
                                  </button>
                                  <span className="px-3 py-1 border-t border-b text-center w-12">
                                    {quantityMap[booking._id] || booking.bookingQuantity}
                                  </span>
                                  <button 
                                    className="px-2 py-1 border rounded-r-lg"
                                    onClick={() => handleQuantityChange(
                                      booking._id, 
                                      (quantityMap[booking._id] || booking.bookingQuantity) + 1
                                    )}
                                  >
                                    +
                                  </button>
                                  <button
                                    onClick={() => handleUpdateQuantity(
                                      booking._id, 
                                      quantityMap[booking._id] || booking.bookingQuantity
                                    )}
                                    className="ml-2 px-3 py-1 bg-[#088178] text-white rounded text-sm"
                                  >
                                    Update
                                  </button>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-500">
                                  Quantity: {booking.bookingQuantity}
                                </span>
                              )}
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <span className={`text-sm font-medium ${
                                booking.orderStatus === 'pending' ? 'text-yellow-600' :
                                booking.orderStatus === 'confirmed' ? 'text-green-600' :
                                'text-red-600'
                              }`}>
                                {booking.orderStatus.toUpperCase()}
                              </span>
                              <span className="font-medium text-[#088178]">
                                ${(booking.productId.price * booking.bookingQuantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                        {isEditing && (
                          <button
                            onClick={() => handleDeleteBooking(booking.productId._id)}
                            className="p-2 text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}

                {selectedProducts.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('checkout')}
                    className="w-full py-3 bg-[#088178] text-white rounded-lg font-medium mt-6"
                  >
                    Proceed to Checkout ({selectedProducts.length})
                  </motion.button>
                )}
              </motion.div>
            )}

            {activeTab === 'checkout' && selectedProducts.length > 0 && (
              <motion.div
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="space-y-8"
              >
                <h2 className="text-xl font-semibold text-gray-800">Checkout</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-6 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-medium">Payment Method</h3>
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
                        {selectedProducts.map(product => (
                          <div key={product._id} className="flex justify-between items-center">
                            <div>
                              <p className="text-gray-600">{product.title}</p>
                              <p className="text-xs text-gray-500">
                                Qty: {quantityMap[product._id] || 1}
                              </p>
                            </div>
                            <span>
                              ${(product.price * (quantityMap[product._id] || 1)).toFixed(2)}
                            </span>
                          </div>
                        ))}
                        
                        <div className="border-t pt-3 mt-3">
                          <div className="flex justify-between font-medium">
                            <span>Total</span>
                            <span className="text-[#088178]">
                              ${
                                selectedProducts.reduce(
                                  (total, product) => 
                                    total + (product.price * (quantityMap[product._id] || 1)),
                                  0
                                ).toFixed(2)
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={() => setActiveTab('manage')}
                        className="flex-1 py-3 border border-gray-300 rounded-lg font-medium"
                      >
                        Back
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCreateBooking}
                        className="flex-1 py-3 bg-[#088178] text-white rounded-lg font-medium flex items-center justify-center"
                      >
                        <FaShoppingCart className="mr-2" />
                        Complete Purchase
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