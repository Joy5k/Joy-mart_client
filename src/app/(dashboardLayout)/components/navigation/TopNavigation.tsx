'use client';

import { motion } from 'framer-motion';
import { FiBell } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import UserDropdown from './UserDropdown';

export function TopNavigation() {
  const pathname = usePathname();
  const title = pathname.split('/').pop() || 'Dashboard';
  
  return (
    <motion.div 
      className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="flex flex-1 justify-between px-4">
        <div className="flex flex-1 items-center">
          <h1 className="text-2xl font-semibold text-gray-900 capitalize">
            {title}
          </h1>
        </div>
        <div className="ml-4 flex items-center md:ml-6">
          <button
            type="button"
            className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#088178] focus:ring-offset-2"
          >
            <span className="sr-only">View notifications</span>
            <FiBell className="h-6 w-6" aria-hidden="true" />
          </button>
          
          <UserDropdown />
        </div>
      </div>
    </motion.div>
  );
}