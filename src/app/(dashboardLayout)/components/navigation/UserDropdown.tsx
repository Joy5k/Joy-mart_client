'use client';

import { setUser } from '@/src/redux/features/Auth/authSlice';
import { useAppDispatch } from '@/src/redux/hooks';
import { removeToken } from '@/src/utils/localStorageManagement';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiChevronDown, FiUser, FiLogOut } from 'react-icons/fi';

export default function UserDropdown() {
    const navigate=useRouter()
    const dispatch=useAppDispatch()
  const [isOpen, setIsOpen] = useState(false);
  const handleLogout=()=>{
    dispatch(setUser({
      token: '',
    }))
    removeToken()
    //delete auth token from cookie
          document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    navigate.push('/login')
  }
  return (
    <div className="relative ml-3">
      <div>
        <button
          type="button"
          className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#088178] focus:ring-offset-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">Open user menu</span>
          <img
            className="h-8 w-8 rounded-full"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
          <span className="ml-2 hidden text-sm font-medium text-gray-700 md:block">
            John Doe
          </span>
          <FiChevronDown className="ml-1 h-4 w-4 text-gray-500" />
        </button>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu-button"
          >
            <Link
              href="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <FiUser className="mr-2 h-4 w-4" />
              Your Profile
            </Link>
            <button
            className='w-full text-left'
            onClick={handleLogout}>
              <Link
            
              href="#"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <FiLogOut className="mr-2 h-4 w-4" />
              Sign out
            </Link>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}