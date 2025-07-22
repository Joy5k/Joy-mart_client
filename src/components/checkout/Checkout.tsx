"use client"

import { FaMoneyBillWave, FaShoppingCart } from "react-icons/fa";
import { motion } from 'framer-motion';

const Checkout = ({
  customerInfo,
  setCustomerInfo,
  paymentMethod,
  setPaymentMethod,
  isProcessingPayment,
  handlePayment,
  setActiveTab,
  selectedProducts,
  quantityMap
}:any) => {
  return (
    <div>
      <motion.div
        initial={{ x: 10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="space-y-8"
      >
        <h2 className="text-xl font-semibold text-gray-800">Checkout</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Customer Info and Payment Method */}
          <div className="space-y-4">
            <div className="md:p-6  lg:p-6 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-4">Customer Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Full Name*</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email*</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Phone Number*</label>
                  <input 
                    type="tel" 
                    placeholder="01XXXXXXXXX" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Address*</label>
                  <textarea 
                    placeholder="Your address" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">City</label>
                    <input 
                      type="text" 
                      placeholder="City" 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Postal Code</label>
                    <input 
                      type="text" 
                      placeholder="Postal Code" 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                      value={customerInfo.postcode}
                      onChange={(e) => setCustomerInfo({...customerInfo, postcode: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className=" md:p-6 lg:p-6 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-4">Payment Method</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="online-payment"
                    name="paymentMethod"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="h-4 w-4 text-[#088178] focus:ring-[#088178]"
                  />
                  <label htmlFor="online-payment" className="ml-3 block text-sm font-medium text-gray-700">
                    Pay Online (SSLCommerz)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cod-payment"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="h-4 w-4 text-[#088178] focus:ring-[#088178]"
                  />
                  <label htmlFor="cod-payment" className="ml-3 block text-sm font-medium text-gray-700">
                    Cash on Delivery (COD)
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-4">
            <div className="md:p-6 lg:p-6 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                {selectedProducts.map((product:any) => (
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
                          (total: number, product: any) => 
                            total + (product.price * (quantityMap[product._id] || 1)),
                          0
                        ).toFixed(2)
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex md:space-x-4 md:flex-row lg:flex-row justify-between gap-2 flex-col-reverse">
              <button
                onClick={() => setActiveTab('manage')}
                className="flex-1 py-3 border border-gray-300 rounded-lg font-medium w-full"
              >
                Back
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePayment}
                className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center ${
                  isProcessingPayment || !paymentMethod || !customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-[#088178] text-white hover:bg-[#077168]'
                }`}
                disabled={isProcessingPayment || !paymentMethod || !customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address}
              >
                {isProcessingPayment ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  <>
                    {paymentMethod === 'cod' ? (
                      <>
                        <FaMoneyBillWave className="mr-2" />
                        Place Order
                      </>
                    ) : (
                      <>
                        <FaShoppingCart className="mr-2" />
                        Pay with SSLCommerz
                      </>
                    )}
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;


