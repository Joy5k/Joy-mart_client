import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import { BsTwitter, BsLinkedin, BsGithub } from "react-icons/bs";
import Link from "next/link";
import AiAssistant from "./AiAssistant";

function Contact() {
  return (
    <div className="w-full min-h-screen bg-white text-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="pb-4 border-b border-gray-200 mb-8">
          <h3 className="text-3xl font-bold text-[#088178]">Contact Us</h3>
          <p className="text-gray-600 mt-2">Have questions? Reach out to our team.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm">
              <h4 className="text-xl font-semibold mb-6 text-[#088178]">Get in Touch</h4>
              
              <div className="space-y-5">
                {/* Phone */}
                <div className="flex items-start">
                  <div className="p-3 bg-green-100 rounded-full mr-4">
                    <FaPhone className="text-xl text-[#088178]" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700">Phone</h5>
                    <p className="text-gray-600">+880 1601588531</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start">
                  <div className="p-3 bg-green-100 rounded-full mr-4">
                    <FaEnvelope className="text-xl text-[#088178]" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700">Email</h5>
                    <p className="text-gray-600">mmehedihasanjoyv@gmail.com</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start">
                  <div className="p-3 bg-green-100 rounded-full mr-4">
                    <FaMapMarkerAlt className="text-xl text-[#088178]" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700">Address</h5>
                    <p className="text-gray-600">1213 Mohakhali, Dhaka, Bangladesh</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-8">
                <h5 className="font-medium text-gray-700 mb-4">Follow Us</h5>
                <div className="flex space-x-3">
                  <Link href="#" className="p-3 bg-gray-100 hover:bg-green-100 rounded-full transition-colors">
                    <BsTwitter className="text-xl text-[#088178]" />
                  </Link>
                  <Link href="#" className="p-3 bg-gray-100 hover:bg-green-100 rounded-full transition-colors">
                    <BsLinkedin className="text-xl text-[#088178]" />
                  </Link>
                  <Link href="https://github.com/Joy5k" target="_blank" className="p-3 bg-gray-100 hover:bg-green-100 rounded-full transition-colors">
                    <BsGithub className="text-xl text-[#088178]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm">
            <h4 className="text-xl font-semibold mb-6 text-[#088178]">Send Us a Message</h4>
            
            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:[#088178] focus:border-none text-gray-800 placeholder-gray-400"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:[#088178] focus:border-none text-gray-800 placeholder-gray-400"
                    placeholder="Your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:[#088178] focus:border-none text-gray-800 placeholder-gray-400"
                  placeholder="Subject"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea 
                  id="message" 
                  rows={5}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:[#088178] focus:border-none text-gray-800 placeholder-gray-400"
                  placeholder="Your message"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="flex items-center justify-center px-6 py-3 hover:bg-[#055b55] bg-[#088178] cursor-pointer rounded-lg font-medium text-white transition-colors shadow-sm"
              >
                <FaPaperPlane className="mr-2" />
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Map */}
        <div className="mt-10 bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm">
          <h4 className="text-xl font-semibold mb-6 text-[#088178]">Our Location</h4>
          <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3416.0156484219656!2d90.32296538292829!3d22.35840700885999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sbd!4v1750833277004!5m2!1sen!2sbd" 
              width="100%" 
              height="450" 
              style={{border:0}} 
              allowFullScreen 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
              title="Our Location in Barishal, Bangladesh"
            ></iframe>
          </div>
        </div>
      </div>

      <AiAssistant />
    </div>
  );
}

export default Contact;