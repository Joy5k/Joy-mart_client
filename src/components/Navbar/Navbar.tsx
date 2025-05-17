"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { BiLogOut } from "react-icons/bi";
import { FaBlog, FaEnvelope, FaHome, FaInfoCircle, FaUser, FaShoppingBag } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { RiDashboard3Line } from "react-icons/ri";
import { CiHeart } from "react-icons/ci";
import { FiMenu } from "react-icons/fi";

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown/nav on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (navRef.current && !navRef.current.contains(event.target as Node) && !(event.target as HTMLElement).closest('#mobile')) {
        setIsNavOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section id="header" className="flex items-center justify-between p-4 bg-white shadow-md relative">
      {/* Logo */}
      <Link href="/" className="z-50">
        <Image src="/img/logo.png" width={70} height={10} alt="Logo" className="bg-transparent" />
      </Link>

      {/* Navbar Links */}
      <div 
        ref={navRef}
        className={`md:flex gap-4 items-center ${isNavOpen ? "block" : "hidden"} 
        absolute md:static top-full left-0 w-full md:w-auto bg-white md:bg-transparent z-40 md:z-auto px-4 py-2 md:p-0 shadow-md md:shadow-none`}
      >
        <ul id="navbar" className="flex flex-col md:flex-row md:items-center gap-4">
          <li>
            <Link href="/" className="hover:text-[#088178] flex items-center gap-2 py-2 md:py-0" onClick={() => setIsNavOpen(false)}>
              <FaHome className="text-lg" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link href="/shop" className="hover:text-[#088178] flex items-center gap-2 py-2 md:py-0" onClick={() => setIsNavOpen(false)}>
              <FaShop className="text-lg" />
              <span>Shop</span>
            </Link>
          </li>
          <li>
            <Link href="/blog" className="hover:text-[#088178] flex items-center gap-2 py-2 md:py-0" onClick={() => setIsNavOpen(false)}>
              <FaBlog className="text-lg" />
              <span>Blog</span>
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-[#088178] flex items-center gap-2 py-2 md:py-0" onClick={() => setIsNavOpen(false)}>
              <FaInfoCircle className="text-lg" />
              <span>About</span>
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-[#088178] flex items-center gap-2 py-2 md:py-0" onClick={() => setIsNavOpen(false)}>
              <FaEnvelope className="text-lg" />
              <span>Contact</span>
            </Link>
          </li>
          <li id="lg-bag" className="hidden md:block">
            <Link href="/cart" className="hover:text-[#088178]">
              <FaShoppingBag className="text-xl" />
            </Link>
          </li>
        </ul>
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-4">
        {/* Desktop Wishlist */}
        <div id="wishlist" className="hidden md:flex items-center">
          <Link href="/wishlist">
            <CiHeart className="text-2xl text-[#088178] hover:text-[#0abab5]" />
          </Link>
        </div>

        {/* Profile Dropdown */}
        <div id="profile" ref={dropdownRef} className="relative">
          <button 
            onClick={toggleDropdown}
            className="p-2 text-gray-800 hover:text-[#088178] focus:outline-none cursor-pointer"
          >
            <FaUser className="text-[#088178] hover:text-[#0abab5]" size={20} />
          </button>
          
          {isDropdownOpen && (
            <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              {/* Mobile-only links */}
              <li className="md:hidden">
                <Link 
                  href="/cart" 
                  className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 hover:text-[#088178]"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsNavOpen(false);
                  }}
                >
                  <FaShoppingBag />
                  <span>Cart</span>
                </Link>
              </li>
              <li className="md:hidden">
                <Link 
                  href="/wishlist" 
                  className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 hover:text-[#088178]"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsNavOpen(false);
                  }}
                >
                  <CiHeart />
                  <span>Wishlist</span>
                </Link>
              </li>
              
              {/* Regular dropdown items */}
              <li>
                <Link 
                  href="/profile" 
                  className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 hover:text-[#088178]"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsNavOpen(false);
                  }}
                >
                  <FaUser />
                  <span>Profile</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard" 
                  className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 hover:text-[#088178]"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsNavOpen(false);
                  }}
                >
                  <RiDashboard3Line />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className="border-t border-gray-200">
                <Link 
                  href="/logout" 
                  className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 hover:text-[#088178]"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsNavOpen(false);
                  }}
                >
                  <BiLogOut />
                  <span>Logout</span>
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div id="mobile" className="md:hidden flex items-center">
          <button 
            onClick={toggleNav}
            className="p-2 text-gray-800 hover:text-[#088178] focus:outline-none"
            aria-label="Toggle menu"
          >
            <FiMenu className="text-2xl" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Navbar;