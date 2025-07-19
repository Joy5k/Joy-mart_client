'use client'



import { ReactEventHandler, useState } from 'react';
import { motion } from 'framer-motion';
import { FaShoppingBag } from 'react-icons/fa';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { IOrder } from '@/src/types';

const TransId = ({ sampleOrder, setActiveTab}:{sampleOrder:IOrder,setActiveTab:React.Dispatch<React.SetStateAction<string>>}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigator.clipboard.writeText(sampleOrder.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <motion.div 
      key={sampleOrder.createdAt}
      whileHover={{ x: 5 }}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer"
      onClick={() => setActiveTab('orders')}
    >
      {/* Top Row */}
      <div className="flex w-full items-start gap-4">
        {/* Order Icon */}
        <div className="bg-[#088178] bg-opacity-10 p-3 rounded-lg">
          <FaShoppingBag className="text-[#088178] text-xl" />
        </div>

        {/* Order Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-gray-900 break-all">
              Order #{sampleOrder.orderId}
            </h4>
            <motion.button
              onClick={handleCopy}
              className="p-1 text-gray-400 hover:text-[#088178] focus:outline-none"
              aria-label={copied ? "Copied!" : "Copy order ID"}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                key={copied ? "copied" : "copy"}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {copied ? (
                  <div className="flex items-center gap-1 text-xs text-green-500">
                    <FiCheck className="h-4 w-4" />
                    <span>Copied!</span>
                  </div>
                ) : (
                  <FiCopy className="h-4 w-4" />
                )}
              </motion.div>
            </motion.button>
          </div>
          <p className="text-sm text-gray-500">
            {new Date(sampleOrder.createdAt).toLocaleDateString()} • {sampleOrder.orderStatus}
          </p>
        </div>

        {/* Desktop Price */}
        <div className="text-right hidden sm:block ml-auto shrink-0">
          <p className="font-bold text-gray-900">
            {sampleOrder.paymentDetails.currency} {sampleOrder.totalAmount.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">
            {sampleOrder.productIds.length} items
          </p>
        </div>
      </div>

      {/* Mobile Price */}
      <div className="w-full sm:hidden pt-2 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {sampleOrder.productIds.length} items
          </span>
          <p className="font-bold text-gray-900">
            {sampleOrder.paymentDetails.currency} {sampleOrder.totalAmount.toFixed(2)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TransId