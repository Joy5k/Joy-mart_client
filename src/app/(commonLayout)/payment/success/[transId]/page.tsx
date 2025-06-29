'use client'

import { FaCheckCircle, FaHome, FaShoppingBag } from "react-icons/fa";
import Link from "next/link";
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function SuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const getTransactionId = () => {
      try {
        // First try from route params
        if (params?.transId) {
          return params.transId.toString();
        }
        
        // Then try from query params
        const queryTransId = searchParams?.get('transId');
        if (queryTransId) {
          return queryTransId;
        }
        
        // Fallback to URL parsing if needed
        if (typeof window !== 'undefined') {
          const pathParts = window.location.pathname.split('/');
          const possibleId = pathParts[pathParts.length - 1];
          if (possibleId && possibleId !== 'success') {
            return possibleId;
          }
        }
        
        return null;
      } catch (error) {
        console.error('Error getting transaction ID:', error);
        return null;
      }
    };

    const id = getTransactionId();
    setTransactionId(id);
    setIsLoading(false);
  }, [params, searchParams]);

  if (!isClient || isLoading) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#088178]"></div>
      </div>
    );
  }

  if (!transactionId) {
    return (
      <div className="w-full min-h-screen bg-white text-gray-800 p-6 flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Transaction Error</h1>
          <p className="text-lg text-gray-600 mb-6">
            We couldn't retrieve your transaction details. Please check your email for confirmation or contact support.
          </p>
          <Link href="/contact" className="inline-block px-6 py-3 bg-[#088178] text-white rounded-lg font-medium">
            Contact Support
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white text-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Success Container */}
        <div className="bg-gray-50 border border-gray-200 p-8 rounded-xl shadow-sm text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <FaCheckCircle className="text-6xl text-green-500" />
          </div>
          
          {/* Success Message */}
          <h1 className="text-3xl font-bold text-[#088178] mb-4">Payment Successful!</h1>
          <p className="text-lg text-gray-600 mb-6">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          
          {/* Transaction ID */}
          <div className="bg-white border border-green-200 rounded-lg p-4 mb-8 inline-block">
            <p className="text-sm text-gray-500">Transaction ID</p>
            <p className="text-xl font-mono font-bold text-[#088178]">{transactionId}</p>
          </div>
          
          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 text-left">
            <h3 className="font-semibold text-[#088178] mb-2">What's next?</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>You'll receive an order confirmation email shortly</li>
              <li>Our team will process your order within 24 hours</li>
              <li>Shipping details will be sent to your email once dispatched</li>
            </ul>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/" className="flex items-center justify-center px-6 py-3 hover:bg-[#055b55] bg-[#088178] cursor-pointer rounded-lg font-medium text-white transition-colors shadow-sm">
              <FaHome className="mr-2" />
              Back to Home
            </Link>
            <Link href="/orders" className="flex items-center justify-center px-6 py-3 bg-white border border-[#088178] text-[#088178] hover:bg-gray-50 cursor-pointer rounded-lg font-medium transition-colors shadow-sm">
              <FaShoppingBag className="mr-2" />
              View Orders
            </Link>
          </div>
        </div>
        
        {/* Support Section */}
        <div className="mt-10 bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm">
          <h4 className="text-xl font-semibold mb-4 text-[#088178]">Need Help?</h4>
          <p className="text-gray-600 mb-4">
            If you have any questions about your order, please contact our customer support team.
          </p>
          <Link href="/contact" className="inline-block px-6 py-2 border border-[#088178] text-[#088178] hover:bg-gray-100 rounded-lg font-medium transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;