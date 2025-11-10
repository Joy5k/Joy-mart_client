"use client";

import { FaBox, FaCheckCircle, FaTimes, FaCreditCard, FaShoppingBag } from "react-icons/fa";
import { MdCancel, MdLocalShipping } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { JSX } from "react";
import { useParams } from "next/navigation";
import { useTrackOrderQuery } from "@/src/redux/features/payment/paymentApi";
import Link from "next/link";

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
type PaymentStatus = "pending" | "completed" | "failed";

const OrderTrackingPage = () => {
  const { transId } = useParams();
  const { data, isLoading, isError } = useTrackOrderQuery({ transId: transId as string });
  const order = data?.data;
  // Status configuration
  const statusConfig: Record<OrderStatus, { color: string; icon: JSX.Element; text: string }> = {
    pending: { color: "bg-yellow-500", icon: <MdLocalShipping className="text-lg" />, text: "Pending" },
    confirmed: { color: "bg-blue-500", icon: <FaCheckCircle className="text-lg" />, text: "Confirmed" },
    shipped: { color: "bg-purple-500", icon: <MdLocalShipping className="text-lg" />, text: "Shipped" },
    delivered: { color: "bg-green-500", icon: <FaCheckCircle className="text-lg" />, text: "Delivered" },
    cancelled: { color: "bg-red-500", icon: <MdCancel className="text-lg" />, text: "Cancelled" },
  };

  // Payment status configuration
  const paymentStatusConfig: Record<PaymentStatus, { color: string; icon: JSX.Element; text: string }> = {
    pending: { color: "bg-yellow-500", icon: <GiMoneyStack className="text-lg" />, text: "Pending" },
    completed: { color: "bg-green-500", icon: <GiMoneyStack className="text-lg" />, text: "Completed" },
    failed: { color: "bg-red-500", icon: <FaTimes className="text-lg" />, text: "Failed" },
  };

  // Get timeline steps only when order is available
  const getTimelineSteps = () => {
    if (!order) return [];
    
    return [
      {
        id: 1,
        name: "Order Placed",
        description: "Your order has been received",
        date: order.createdAt,
        status: "completed",
        icon: <FaShoppingBag className="text-lg" />
      },
      {
        id: 2,
        name: "Processing",
        description: "Seller is preparing your order",
        date: order.updatedAt,
        status: order.orderStatus === "cancelled" ? "cancelled" : "completed",
        icon: <FaBox className="text-lg" />
      },
      {
        id: 3,
        name: "Order Status",
        description: `Your order is ${order.orderStatus}`,
        date: order.updatedAt,
        status: order.orderStatus as OrderStatus,
        icon: statusConfig[order.orderStatus as OrderStatus].icon
      }
    ];
  };

  const timelineSteps = getTimelineSteps();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-4 mx-auto mb-4">
            <FaTimes className="text-red-500 text-2xl mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">We couldn't find an order with that ID.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Tracking</h1>
          <p className="text-gray-600">Track the status of your order #{order.orderId}</p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Order #{order.orderId}</h2>
                <p className="text-sm text-gray-500">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[order.orderStatus as OrderStatus].color} text-white flex items-center gap-1`}>
                  {statusConfig[order.orderStatus as OrderStatus].icon}
                  {statusConfig[order.orderStatus as OrderStatus].text}
                </span>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Order Status Timeline</h3>
            <div className="relative">
              {/* Progress Line */}
              <div className={`absolute left-4 top-0 h-full w-0.5 ${order.orderStatus === "cancelled" ? "bg-red-200" : "bg-gray-200"}`}></div>
              
              {/* Timeline Steps */}
              <div className="space-y-8 pl-10">
                {timelineSteps.map((step) => (
                  <div key={step.id} className="relative">
                    <div className={`absolute -left-10 top-0 w-8 h-8 rounded-full flex items-center justify-center 
                      ${step.status === "completed" ? "bg-green-500 text-white" : 
                        step.status === "cancelled" ? "bg-red-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                      {step.icon}
                    </div>
                    <div className={`p-4 rounded-lg ${
                      step.status === "completed" ? "bg-green-50" : 
                      step.status === "cancelled" ? "bg-red-50" : "bg-gray-50"
                    }`}>
                      <h4 className="font-medium text-gray-900">{step.name}</h4>
                      <p className="text-sm text-gray-600 mb-1">{step.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(step.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="p-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Order Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Details</h3>
                <div className="space-y-4">
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
                      paymentStatusConfig[order.paymentStatus as PaymentStatus].color
                    } text-white flex items-center gap-1`}>
                      {paymentStatusConfig[order.paymentStatus as PaymentStatus].icon}
                      {paymentStatusConfig[order.paymentStatus as PaymentStatus].text}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Actions</h3>
                <div className="space-y-3">
                  {order.orderStatus === "cancelled" && (
                    <button className="w-full  cursor-pointer bg-gray-100 text-gray-800 py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                      <FaShoppingBag />
                      Reorder Items
                    </button>
                  )}
                  {order.paymentStatus === "failed" && (
                    <button className="w-full  cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                      <FaCreditCard />
                      Retry Payment
                    </button>
                  )}
                  <button className="w-full  cursor-pointer border border-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                    <Link href="/contact">Contact Support</Link>
                  </button>
                  <button className="w-full cursor-pointer border border-red-300 text-red-600 py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-red-50 transition-colors">
                    <FaTimes />
                    Report Issue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you have any questions about your order, our customer service team is happy to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="bg-blue-600  cursor-pointer text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
              Live Chat
            </button>
            <button className="bg-gray-100  cursor-pointer text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors">
              Email Support
            </button>
            <button className="bg-gray-100  cursor-pointer text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors">
              Call Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;