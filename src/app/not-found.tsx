"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaHome, FaExclamationTriangle, FaEnvelope, FaQuestionCircle, FaRocket } from "react-icons/fa";
import {  useState } from "react";

const NotFoundPage = () => {
  const router = useRouter();
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);




  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setContactEmail("");
    setContactMessage("");
    
    // Hide success message after 3 seconds
    setTimeout(() => setSubmitSuccess(false), 3000);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white overflow-hidden relative">
      {/* Floating elements */}
      <motion.div
        animate={{
       
          rotate: Math.sin(Date.now() / 1000) * 5,
        }}
        transition={{ type: "spring", damping: 10 }}
        className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-[#088178] opacity-20 blur-xl"
      />
      <motion.div
      
        transition={{ type: "spring", damping: 10 }}
        className="absolute bottom-1/3 right-1/3 w-24 h-24 rounded-full bg-[#0abab5] opacity-20 blur-xl"
      />
      <motion.div
       
        transition={{ type: "spring", damping: 10 }}
        className="absolute top-2/3 right-1/4 w-20 h-20 rounded-full bg-[#7c3aed] opacity-20 blur-xl"
      />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <FaExclamationTriangle className="text-6xl text-yellow-400" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="text-6xl md:text-8xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#0abab5] to-[#088178]"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-2xl md:text-3xl font-semibold text-center mb-8"
        >
          Houston, We Have a Problem!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-lg text-center max-w-2xl mx-auto mb-12 text-gray-300"
        >
          The page you&apos;re looking for has been lost in space. But don&apos;t worry,
          we&apos;ve got plenty of ways to get you back on track.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#088178] rounded-lg font-medium"
          >
            <FaHome /> Return to Home Base
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 rounded-lg font-medium"
          >
            <FaRocket /> Back to Previous Orbit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowContactForm(!showContactForm)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 rounded-lg font-medium"
          >
            <FaEnvelope /> {showContactForm ? "Hide Help" : "Request Help"}
          </motion.button>
        </motion.div>

        {/* Contact Form */}
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-lg mx-auto bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 mb-12 border border-gray-700"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaQuestionCircle className="text-[#0abab5]" /> Need Assistance?
            </h3>
            
            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-green-900 bg-opacity-50 p-4 rounded-lg mb-4"
              >
                Message received! Our team will contact you soon.
              </motion.div>
            ) : (
              <form onSubmit={handleContactSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block mb-2 text-sm font-medium">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#088178]"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="block mb-2 text-sm font-medium">
                    What were you trying to find?
                  </label>
                  <textarea
                    id="message"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#088178]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#088178] rounded-lg font-medium flex items-center gap-2"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </motion.div>
        )}


      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="text-center text-sm text-gray-400 pb-6"
      >
        © {new Date().getFullYear()} Your Company. All rights reserved.
        <br />
        Lost in space? Email us at help@yourcompany.com
      </motion.footer>
    </div>
  );
};

export default NotFoundPage;