// components/sidebar/MobileSidebar.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FiHome, FiPieChart, FiSettings, FiUsers, FiFileText, FiX, FiMenu } from 'react-icons/fi';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AiOutlineProduct } from 'react-icons/ai';
import { MdCategory } from "react-icons/md";

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: FiHome },
  { name: 'Analytics', href: '/dashboard/analytics', icon: FiPieChart },
  { name: 'Users', href: '/dashboard/users', icon: FiUsers },
  { name: 'Reports', href: '/dashboard/reports', icon: FiFileText },
    { name: 'Products', href: '/dashboard/products', icon: AiOutlineProduct },
    {name:'Category',href:'/dashboard/category',icon:MdCategory},
  { name: 'Settings', href: '/dashboard/settings', icon: FiSettings },
];

export function MobileSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <motion.div 
        className="lg:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <button
          type="button"
          className="fixed left-4 top-4 z-50 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#088178]"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <FiMenu className="h-6 w-6" aria-hidden="true" />
        </button>
      </motion.div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />

            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white"
            >
              <div className="flex flex-shrink-0 items-center justify-between px-6 pt-5">
                <h1 className="text-xl font-bold text-[#088178]">Dashboard</h1>
                <button
                  type="button"
                  className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#088178]"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <FiX className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-5 h-0 flex-1 overflow-y-auto">
                <nav className="space-y-1 px-2">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center rounded-md px-2 py-2 text-base font-medium ${
                          isActive
                            ? 'bg-[#c8faf7] text-[#088178]'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon
                          className={`mr-4 h-6 w-6 flex-shrink-0 ${
                            isActive ? 'text-[#088178]' : 'text-gray-400 group-hover:text-gray-500'
                          }`}
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}