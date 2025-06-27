import { FaTimesCircle, FaHome, FaCreditCard, FaQuestionCircle } from "react-icons/fa";
import Link from "next/link";

export default function PaymentFailedPage({ searchParams }:any) {
  const { transactionId, errorMessage } = searchParams;

  return (
    <div className="w-full min-h-screen bg-white text-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Failure Container */}
        <div className="bg-gray-50 border border-gray-200 p-8 rounded-xl shadow-sm text-center">
          {/* Failure Icon */}
          <div className="flex justify-center mb-6">
            <FaTimesCircle className="text-6xl text-red-500" />
          </div>
          
          {/* Failure Message */}
          <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
          <p className="text-lg text-gray-600 mb-6">
            {errorMessage || "We couldn't process your payment. Please try again or use a different payment method."}
          </p>
          
          {/* Transaction Details */}
          {transactionId && (
            <div className="bg-white border border-red-200 rounded-lg p-4 mb-8 inline-block">
              <p className="text-sm text-gray-500">Transaction Reference</p>
              <p className="text-xl font-mono font-bold text-red-600">{transactionId}</p>
            </div>
          )}
          
          {/* Troubleshooting Tips */}
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-8 text-left max-w-md mx-auto">
            <h3 className="font-semibold text-red-600 mb-2">Possible solutions:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Check your card details and try again</li>
              <li>Ensure you have sufficient funds</li>
              <li>Try a different payment method</li>
              <li>Contact your bank for authorization</li>
            </ul>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/" className="flex items-center justify-center px-6 py-3 bg-gray-800 hover:bg-gray-700 cursor-pointer rounded-lg font-medium text-white transition-colors shadow-sm">
              <FaHome className="mr-2" />
              Back to Home
            </Link>
            <Link href="/booking" className="flex items-center justify-center px-6 py-3 bg-white border border-red-600 text-red-600 hover:bg-red-50 cursor-pointer rounded-lg font-medium transition-colors shadow-sm">
              <FaCreditCard className="mr-2" />
              Try Payment Again
            </Link>
          </div>
        </div>
        
        {/* Support Section */}
        <div className="mt-10 bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm">
          <h4 className="text-xl font-semibold mb-4 text-red-600">Need Immediate Help?</h4>
          <p className="text-gray-600 mb-4">
            Contact our support team if you continue experiencing issues.
          </p>
          <Link href="/contact" className="inline-flex items-center px-6 py-2 border border-red-600 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors">
            <FaQuestionCircle className="mr-2" />
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}