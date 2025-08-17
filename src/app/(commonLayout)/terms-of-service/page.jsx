'use client';

import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/src/utils/motion";

const TermsOfService = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={staggerContainer(0.1, 0.2)}
        className="relative h-[40vh] flex items-center justify-center bg-[#088178] text-white"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <motion.div
          variants={fadeIn('up', 'spring', 0.5, 1)}
          className="text-center z-10 px-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>
      </motion.section>

      {/* Content Section */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={staggerContainer(0.1, 0.2)}
        className="py-16 px-6 sm:px-10 md:px-20 lg:px-40 bg-white"
      >
        <motion.div
          variants={fadeIn('up', 'spring', 0.5, 1)}
          className="max-w-4xl mx-auto prose prose-lg text-gray-700"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">1. Acceptance of Terms</h2>
          <p className="mb-6">
            By accessing or using Joy-mart ("the Service"), you agree to be bound by these Terms of Service. 
            If you disagree with any part, you may not access the Service.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">2. Facebook Login</h2>
          <p className="mb-6">
            When using Facebook Login, you authorize us to access certain Facebook account information, 
            including your public profile, email address, and friends list (if applicable). 
            We only collect information necessary for the Service's functionality.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">3. User Responsibilities</h2>
          <p className="mb-6">
            You are responsible for maintaining the confidentiality of your account credentials. 
            Any activities under your account are your responsibility.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">4. Service Modifications</h2>
          <p className="mb-6">
            We reserve the right to modify or discontinue the Service without notice. 
            We shall not be liable for any modification, suspension, or discontinuance.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">5. Limitation of Liability</h2>
          <p className="mb-6">
            Joy-mart shall not be liable for any indirect, incidental, special or consequential damages 
            resulting from the use or inability to use the Service.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">6. Governing Law</h2>
          <p className="mb-6">
            These Terms shall be governed by the laws of Bangladesh without regard to its conflict of law provisions.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">7. Changes to Terms</h2>
          <p className="mb-6">
            We reserve the right to update these Terms at any time. Continued use after changes constitutes acceptance.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">8. Contact Information</h2>
          <p>
            For questions about these Terms, contact us at <a href="mailto:mmehedihasanj@gmail.com" className="text-[#088178] hover:underline">mmehedihasanj@gmail.com</a>.
          </p>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default TermsOfService;