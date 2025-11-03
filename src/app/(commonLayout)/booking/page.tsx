/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSelector } from 'react-redux';
import { RootState } from '@/src/redux/store';
import { FaCheckCircle, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { 
  useGetAllBookingsQuery, 
  useDeleteBookingMutation
} from '@/src/redux/features/booking/bookingApi';
import { Booking, Product } from '@/src/types';
import { toast } from 'react-toastify';
import { useInitiatePaymentMutation } from '@/src/redux/features/payment/paymentApi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Checkout from '@/src/components/checkout/Checkout';

const BookingPage = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('manage');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [showNoSelectionWarning, setShowNoSelectionWarning] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '01600000000',
    address: '',
    city: 'Dhaka',
    state: 'Dhaka',
    postcode: '1000',
    country: 'Bangladesh'
  });

  const { data: bookingsData, refetch } = useGetAllBookingsQuery({});
  const [deleteBooking] = useDeleteBookingMutation();
  const [initiatePayment, { isLoading:isProcessingPayment }] = useInitiatePaymentMutation();
  const bookings: Booking[] = bookingsData?.data || [];

  const [quantityMap, setQuantityMap] = useState<Record<string, number>>(() => {
    const initialQuantities: Record<string, number> = {};
    bookingsData?.data?.forEach((booking: any) => {
      initialQuantities[booking._id] = booking.bookingQuantity;
    });
    return initialQuantities;
  });
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (bookingsData?.data) {
      setQuantityMap(prev => {
        const newQuantities = {...prev};
        bookingsData.data.forEach((booking: any) => {
          if (!(booking._id in newQuantities)) {
            newQuantities[booking._id] = booking.bookingQuantity;
          }
        });
        return newQuantities;
      });
    }
  }, [bookingsData?.data]);

  const handleDeleteBooking = async (id: string) => {
    try {
      await deleteBooking({id}).unwrap();
      toast.success('Booking deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete booking');
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
    setShowNoSelectionWarning(false);
  };

  const handleQuantityChange = useCallback((id: string, value: number) => {
    setQuantityMap(prev => ({
      ...prev,
      [id]: Math.max(1, value)
    }));
  }, []);

  const handleProceedToCheckout = () => {
    if (selectedProducts.length === 0) {
      setShowNoSelectionWarning(true);
    } else {
      setActiveTab('checkout');
    }
  };

  const handlePayment = async () => {
    try {
      if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
        toast.error('Please fill in all required customer information');
        return;
      }

      const total_amount = selectedProducts.reduce(
        (total, product) => 
          total + (product.price * (quantityMap[product._id] || 1)),
        0
      );

      const bookingIds = bookings
        .filter(booking => selectedProducts.some(p => p._id === booking.productId._id))
        .map(booking => booking._id);

      const paymentData = {
        bookingIds,
        total_amount,
        currency: 'BDT',
        customer: customerInfo,
        paymentMethod: paymentMethod,
        productIds: selectedProducts.map(p => p._id),
        quantities: selectedProducts.map(p => quantityMap[p._id] || 1)
      };
      if (paymentMethod === 'cod') {
        const response = await initiatePayment(paymentData).unwrap();
        if (response?.success) {
          toast.success('Order placed successfully with COD');
          setBookingSuccess(true);
        }
        return;
      }

      // Online payment flow
      const response = await initiatePayment(paymentData).unwrap();
      if (response?.data?.paymentUrl) {
        router.push(response.data?.paymentUrl);
      }

    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error?.data?.message || 'Payment failed');
    }
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
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Order Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            {paymentMethod === 'cod' 
              ? 'Your cash on delivary order has been placed successfully.' 
              : 'Your payment was successful.'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#088178] text-white rounded-lg font-medium"
            onClick={() => {
              setBookingSuccess(false);
              setActiveTab('manage');
              setSelectedProducts([]);
            }}
          >
        <Link href="/bookings">
         <p className="bg-[#088178] text-white px-6 py-3 rounded-lg font-medium">View Your Bookings</p>
       </Link>
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
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            {activeTab === 'manage' ? 'Manage Your Bookings' : 'Checkout'}
          </h3>
          <p className="text-gray-600">
            {activeTab === 'manage' 
              ? 'View and manage your booked products' 
              : 'Complete your purchase'}
          </p>
        </motion.div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex-1 py-4 px-6 cursor-pointer font-medium ${activeTab === 'manage' ? 'text-[#088178] border-b-2 border-[#088178]' : 'text-gray-500'}`}
            >
               Bookings
            </button>
            <button
              onClick={handleProceedToCheckout}
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
                  <h3 className="text-xl font-semibold text-gray-800">
                    Your Booked Products ({bookings.length})
                  </h3>
                </div>

                {showNoSelectionWarning && selectedProducts.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-yellow-50 border-l-4 border-yellow-400 p-4"
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Please select at least one product to proceed to checkout.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {bookings.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-500">You have no booked products yet</p>
                    <Link href='/wishlist'>
                    <button
                      onClick={() => setSelectedProducts(wishlistItems as Product[])}
                      className="mt-4 px-4 py-2 bg-[#088178] text-white rounded-lg text-sm font-medium cursor-pointer"
                    >
                      Book from Wishlist
                    </button>
                    </Link>
                  </div>
                ) : (
                <div className="space-y-4">
  {bookings.map(booking => (
    <motion.div
      key={booking._id}
      whileHover={{ y: -2 }}
      className="border rounded-lg p-4 flex flex-col sm:flex-row items-start gap-4"
    >
      {/* Checkbox - Top on mobile, left on desktop */}
      <div className="flex items-center sm:flex-shrink-0 sm:mr-4">
        <input
          type="checkbox"
          checked={selectedProducts.some(p => p._id === booking.productId._id)}
          onChange={() => toggleProductSelection(booking.productId)}
          className="h-5 w-5 text-[#088178] rounded"
        />
      </div>

      {/* Product Image and Info - Stacked on mobile, row on desktop */}
      <div className="flex-1 flex flex-col sm:flex-row items-start gap-4 w-full">
        {/* Product Image */}
        <div className="w-full sm:w-auto sm:flex-shrink-0">
          <Image
            src={booking.productId.images[0] || '/img/placeholder-product.png'}
            width={80}
            height={100}
            alt={booking.productId.title}
            className="rounded-md object-cover w-full sm:w-20 h-20"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 w-full">
          <Link href={`/productDetails/${booking.productId._id}`} className="block">
            <h3 className="font-medium text-gray-800 hover:text-[#088178] line-clamp-2">
              {booking.productId.title}
            </h3>
          </Link>
          
          {/* Price and Quantity Controls */}
          <div className="mt-2 flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4">
            <span className="text-sm text-gray-600">
              ${booking.productId.price} each
            </span>
            
            <div className="flex items-center">
              <button 
                className="px-2 py-1 border rounded-l-lg hover:bg-gray-50"
                onClick={() => handleQuantityChange(
                  booking._id, 
                  (quantityMap[booking._id] || booking.bookingQuantity) - 1
                )}
                disabled={(quantityMap[booking._id] || booking.bookingQuantity) <= 1}
              >
                -
              </button>
              <span className="px-3 py-1 border-t border-b text-center w-12">
                {quantityMap[booking._id] || booking.bookingQuantity}
              </span>
              <button 
                className="px-2 py-1 border rounded-r-lg hover:bg-gray-50"
                onClick={() => handleQuantityChange(
                  booking._id, 
                  (quantityMap[booking._id] || booking.bookingQuantity) + 1
                )}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Button - Bottom right on mobile, top right on desktop */}
      <div className="self-end sm:self-start ml-auto sm:ml-0">
        <button
          onClick={() => handleDeleteBooking(booking._id)}
          className="p-2 text-red-500 hover:text-red-700 cursor-pointer"
          aria-label="Delete booking"
        >
          <FaTrash />
        </button>
      </div>
    </motion.div>
  ))}
</div>
                )}

                {bookings.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleProceedToCheckout}
                    className={`w-full md:py-3 lg:py-3 ${selectedProducts.length ? "bg-[#088178] cursor-pointer" :"bg-gray-400 cursor-not-allowed"} text-white rounded-lg font-medium mt-6`}
                    disabled={selectedProducts.length===0}
                  >
                    Proceed to Checkout ({selectedProducts.length})
                  </motion.button>
                )}
              </motion.div>
            )}

   {activeTab === 'checkout' && selectedProducts.length > 0 && (
        <Checkout 
        customerInfo={customerInfo}
        setCustomerInfo={setCustomerInfo}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        isProcessingPayment={isProcessingPayment}
        handlePayment={handlePayment}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedProducts={selectedProducts}
        quantityMap={quantityMap}
      />
           
      )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingPage;