'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { usePushNotification } from '@/src/hooks/sendNotification';

const SendNotificationByAdmin = () => {
  const { sendPush } = usePushNotification();
  const [formData, setFormData] = useState({
    title: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    if (!formData.title || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSending(true);

    try {
      const notification = {
        title: formData.title,
        body: formData.message,
        data: {
          sentAt: new Date().toISOString()
        }
      };

      const success = await sendPush(notification);
      
      if (success) {
        toast.success('Notification sent successfully to all users!');
        setFormData({
          title: '',
          message: ''
        });
      } else {
        toast.error('Failed to send notification');
      }
    } catch (error) {
      toast.error('An error occurred while sending the notification');
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-[#f0f9f8] to-[#e0f2f1] py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-[#088178] p-6">
            <h2 className="text-2xl font-bold text-white">Send Push Notification</h2>
            <p className="mt-1 text-[#c8f3ef]">Send messages to all users</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="space-y-2"
            >
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Notification Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] transition-all"
                placeholder="Important Update"
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="space-y-2"
            >
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] transition-all"
                placeholder="We have exciting news for you..."
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="pt-4"
            >
              <button
                type="submit"
                disabled={isSending}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSending ? 'bg-gray-400' : 'bg-[#088178] hover:bg-[#07746d]'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#088178] transition-colors`}
              >
                {isSending ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send to All Users'
                )}
              </button>
              
            </motion.div>
          </form>
        </motion.div>

        {/* Enhanced Preview Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-[#f7f7f7] p-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">Live Preview</h3>
            <p className="text-sm text-gray-500">How it will appear to users</p>
          </div>
          <div className="p-6">
            <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-[#e0f7f5] flex items-center justify-center">
                      <svg className="h-6 w-6 text-[#088178]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {formData.title || 'Notification Title'}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {formData.message || 'Your message will appear here'}
                    </p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs text-[#088178] font-medium">Now</span>
                      <span className="text-xs text-gray-400">Your App Name</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile notification preview */}
            <div className="mt-6 max-w-xs mx-auto relative">
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#088178] rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">1</span>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{formData.title || 'App Notification'}</p>
                    <p className="text-sm opacity-80 mt-1">{formData.message || 'New message content'}</p>
                  </div>
                  <span className="text-xs opacity-60">now</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SendNotificationByAdmin;