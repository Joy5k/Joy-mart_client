'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiPieChart, FiSettings, FiUsers, FiFileText } from 'react-icons/fi';
import { AiOutlineProduct } from "react-icons/ai";
import { MdCategory } from 'react-icons/md';
import { TiMessages } from "react-icons/ti";
import { getUserRole } from '@/src/utils/localStorageManagement';


// Define the type for navigation items
interface NavItem {
  name: string;
  href: string;
  icon: any;
  roles: ('seller' | 'admin' | 'superAdmin')[];
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: FiHome, roles: ['seller', 'admin', 'superAdmin'] },
  { name: 'Analytics', href: '/dashboard/analytics', icon: FiPieChart, roles: ['admin', 'superAdmin','seller'] },
  { name: 'Users', href: '/dashboard/users', icon: FiUsers, roles: ['admin', 'superAdmin'] },
  { name: 'Products', href: '/dashboard/products', icon: AiOutlineProduct, roles: ['seller', 'admin', 'superAdmin'] },
  { name: 'Category', href: '/dashboard/category', icon: MdCategory, roles: ['admin', 'superAdmin'] },
  { name: "Messages", href: '/dashboard/sendNotificationByAdmin', icon: TiMessages, roles: ['admin', 'superAdmin'] },
  { name: 'Reports', href: '/dashboard/reports', icon: FiFileText, roles: ['admin', 'superAdmin'] },
  { name: 'Settings', href: '/dashboard/settings', icon: FiSettings, roles: ['admin', 'superAdmin'] },
];

export function DesktopSidebar() {
  const pathname = usePathname();
  const role=getUserRole()
  
  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => item.roles.includes(role as 'seller' | 'admin' | 'superAdmin'));

  return (
    <motion.div 
      className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-white lg:pb-4 lg:pt-5"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="flex flex-shrink-0 items-center px-6">
        <Link href="/" className="text-xl font-bold text-[#088178]">Go Home</Link>
      </div>
      <div className="mt-5 flex h-0 flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-2">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-[#c8faf7] text-[#088178]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
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
  );
}