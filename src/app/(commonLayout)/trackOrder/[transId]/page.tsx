"use client";

import { JSX, useState, useEffect } from "react";
import { 
  FaSearch, 
  FaBoxOpen, 
  FaCheckCircle, 
  FaTimesCircle,
  FaCreditCard,
  FaTruck
} from "react-icons/fa";
import { MdCancel, MdPendingActions } from "react-icons/md";
import { GiReceiveMoney } from "react-icons/gi";
import { useTrackOrderQuery } from "@/src/redux/features/payment/paymentApi";
import { useParams } from "next/navigation";

const TrackOrderPage = () => {
  const { transId } = useParams();
  const [localOrderId, setLocalOrderId] = useState("");

  // Status configuration
  const statusConfig: Record<string, { color: string; icon: JSX.Element }> = {
    pending: { color: "bg-yellow-500", icon: <MdPendingActions /> },
    confirmed: { color: "bg-blue-500", icon: <FaCheckCircle /> },
    shipped: { color: "bg-purple-500", icon: <FaTruck /> },
    delivered: { color: "bg-green-500", icon: <FaCheckCircle /> },
    cancelled: { color: "bg-red-500", icon: <MdCancel /> },
  };

  // Payment status configuration
  const paymentStatusConfig: Record<string, { color: string; icon: JSX.Element }> = {
    pending: { color: "bg-yellow-500", icon: <MdPendingActions /> },
    completed: { color: "bg-green-500", icon: <GiReceiveMoney /> },
    failed: { color: "bg-red-500", icon: <FaTimesCircle /> },
  };

  const { data, isLoading, isError } = useTrackOrderQuery({ transId: transId as string });
  const order = data?.data || null;
  useEffect(() => {
    if (transId) {
      setLocalOrderId(transId as string);
    }
  }, [transId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  const getStatusConfig = (status: string) => {
    if (!status) return { color: "bg-gray-500", icon: <MdPendingActions /> };
    const lowerStatus = status.toLowerCase();
    return statusConfig[lowerStatus] || { color: "bg-gray-500", icon: <MdPendingActions /> };
  };

  const getPaymentStatusConfig = (status: string) => {
    if (!status) return { color: "bg-gray-500", icon: <MdPendingActions /> };
    const lowerStatus = status.toLowerCase();
    return paymentStatusConfig[lowerStatus] || { color: "bg-gray-500", icon: <MdPendingActions /> };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your Order ID and registered email</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
                Order ID
              </label>
              <input
                type="text"
                id="orderId"
                value={localOrderId}
                onChange={(e) => setLocalOrderId(e.target.value)}
                placeholder="e.g. JMART_TXN1751184575268859"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#088178] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#088178] focus:border-transparent"
                required
              />
            </div>
          </div>
          {isError && <p className="text-red-500 text-sm mb-4">Error loading order details</p>}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-[#088178] hover:bg-[#077168]'} text-white py-3 px-4 rounded-md transition-colors duration-300 flex items-center justify-center gap-2`}
          >
            {isLoading ? 'Searching...' : (
              <>
                <FaSearch />
                Track Order
              </>
            )}
          </button>
        </form>

        {/* Results Section */}
        {order && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Order Header */}
            <div className="border-b border-gray-200 pb-4 mb-6">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-[#1a1a1a] mb-1">
                    Order #{order.orderId}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusConfig(order.orderStatus).color} text-white flex items-center gap-1`}>
                    {getStatusConfig(order.orderStatus).icon}
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-[#1a1a1a] mb-4">Order Status</h3>
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
                
                {/* Timeline Steps */}
                <div className="space-y-6 pl-10">
                  {/* Order Placed */}
                  <div className="relative">
                    <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-[#088178] text-white flex items-center justify-center">
                      <FaCheckCircle />
                    </div>
                    <div className="p-3 rounded-lg bg-green-50">
                      <h4 className="font-medium">Order Placed</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Processing */}
                  <div className="relative">
                    <div className={`absolute -left-10 top-0 w-8 h-8 rounded-full flex items-center justify-center 
                      ${['confirmed', 'shipped', 'delivered'].includes(order.orderStatus?.toLowerCase() || '') ? 'bg-[#088178] text-white' : 'bg-gray-200 text-gray-600'}`}>
                      {['confirmed', 'shipped', 'delivered'].includes(order.orderStatus?.toLowerCase() || '') ? <FaCheckCircle /> : 2}
                    </div>
                    <div className={`p-3 rounded-lg ${['confirmed', 'shipped', 'delivered'].includes(order.orderStatus?.toLowerCase() || '') ? 'bg-green-50' : 'bg-gray-50'}`}>
                      <h4 className="font-medium">Processing</h4>
                      {order.updatedAt && order.orderStatus !== 'pending' && (
                        <p className="text-sm text-gray-600">
                          {new Date(order.updatedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Current Status */}
                  <div className="relative">
                    <div className={`absolute -left-10 top-0 w-8 h-8 rounded-full flex items-center justify-center 
                      ${getStatusConfig(order.orderStatus).color} text-white`}>
                      {getStatusConfig(order.orderStatus).icon}
                    </div>
                    <div className={`p-3 rounded-lg ${
                      order.orderStatus === 'cancelled' ? 'bg-red-50' : 
                      ['shipped', 'delivered'].includes(order.orderStatus?.toLowerCase() || '') ? 'bg-green-50' : 'bg-gray-50'
                    }`}>
                      <h4 className="font-medium capitalize">{order.orderStatus}</h4>
                      {order.updatedAt && (
                        <p className="text-sm text-gray-600">
                          {new Date(order.updatedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-[#1a1a1a] mb-3">Order Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product ID:</span>
                    <span className="font-medium">{order.productId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium">{order.bookingQuantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium capitalize">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      getPaymentStatusConfig(order.paymentStatus).color
                    } text-white flex items-center gap-1`}>
                      {getPaymentStatusConfig(order.paymentStatus).icon}
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-[#1a1a1a] mb-3">Actions</h3>
                <div className="space-y-3">
                  {order.orderStatus === 'cancelled' && (
                    <button className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-md flex items-center justify-center gap-2">
                      <FaBoxOpen />
                      Reorder
                    </button>
                  )}
                  {order.paymentStatus === 'pending' && order.orderStatus !== 'cancelled' && (
                    <button className="w-full bg-[#088178] text-white py-2 px-4 rounded-md hover:bg-[#077168] transition-colors duration-300 flex items-center justify-center gap-2">
                      <FaCreditCard />
                      Complete Payment
                    </button>
                  )}
                  {order.orderStatus !== 'cancelled' && (
                    <button className="w-full bg-red-50 text-red-600 py-2 px-4 rounded-md hover:bg-red-100 transition-colors duration-300 flex items-center justify-center gap-2">
                      <MdCancel />
                      Cancel Order
                    </button>
                  )}
                  <button className="w-full border border-[#088178] text-[#088178] py-2 px-4 rounded-md hover:bg-[#088178]/10 transition-colors duration-300">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;