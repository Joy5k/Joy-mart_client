import { FaBan, FaHome, FaShoppingCart, FaHeadset } from "react-icons/fa";
import Link from "next/link";
import type { Metadata } from "next";


export default function PaymentCancelPage({ searchParams }:any) {
const { transactionId, errorMessage } = searchParams;
  return (
    <div className="w-full min-h-screen bg-white text-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Cancel Container */}
        <div className="bg-gray-50 border border-gray-200 p-8 rounded-xl shadow-sm text-center">
          {/* Cancel Icon */}
          <div className="flex justify-center mb-6">
            <FaBan className="text-6xl text-amber-500" />
          </div>
          
          {/* Main Message */}
          <h1 className="text-3xl font-bold text-amber-600 mb-4">Payment Cancelled</h1>
          <p className="text-lg text-gray-600 mb-6">
            {errorMessage || "You've cancelled the payment process. Your order was not completed."}
          </p>
          
          {/* Transaction Details (if available) */}
          {transactionId && (
            <div className="bg-white border border-amber-200 rounded-lg p-4 mb-8 inline-block">
              <p className="text-sm text-gray-500">Reference Number</p>
              <p className="text-xl font-mono font-bold text-amber-600">{transactionId}</p>
            </div>
          )}
          
          {/* Next Steps */}
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-8 text-left max-w-md mx-auto">
            <h3 className="font-semibold text-amber-600 mb-2">What would you like to do?</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Complete your purchase with a different payment method</li>
              <li>Review your order details before trying again</li>
              <li>Contact us if you need assistance</li>
            </ul>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/" 
              className="flex items-center justify-center px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium text-white transition-colors shadow-sm"
            >
              <FaHome className="mr-2" />
              Return Home
            </Link>
            <Link 
              href="/booking" 
              className="flex items-center justify-center px-6 py-3 bg-white border border-amber-600 text-amber-600 hover:bg-amber-50 rounded-lg font-medium transition-colors shadow-sm"
            >
              <FaShoppingCart className="mr-2" />
              View Cart
            </Link>
          </div>
        </div>
        
        {/* Support Section */}
        <div className="mt-10 bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm">
          <h4 className="text-xl font-semibold mb-4 text-amber-600">Need Assistance?</h4>
          <p className="text-gray-600 mb-4">
            Our team is happy to help with any questions about your order.
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center px-6 py-2 border border-amber-600 text-amber-600 hover:bg-amber-50 rounded-lg font-medium transition-colors"
          >
            <FaHeadset className="mr-2" />
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}