"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { BiLogOut } from "react-icons/bi";
import { FaBlog, FaEnvelope, FaHome, FaInfoCircle, FaUser, FaShoppingBag } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { RiDashboard3Line } from "react-icons/ri";
import { CiHeart } from "react-icons/ci";
import { FiMenu, FiX } from "react-icons/fi";
import { getToken, removeToken } from "@/src/utils/localStorageManagement";
import { GrLogin } from "react-icons/gr";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [token,setToken]=useState<string>("")
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  
  const navigate=useRouter()




  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown/nav when clicking outside
  useEffect(() => {
  const authToken=getToken()
  if(authToken){
    setToken(authToken)
  }


    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (navRef.current && !navRef.current.contains(event.target as Node) && 
          !(event.target as HTMLElement).closest('#mobile-toggle')) {
        setIsNavOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

const handleLogout=()=>{
  removeToken()
  setIsDropdownOpen(false)
  setIsNavOpen(false)
  navigate.push('/login')
}


  return (
    <section className="flex items-center justify-between bg-white shadow-md sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="">
        <Image src="/img/logo.png" width={70} height={10} alt="Logo" className="bg-transparent " />
      </Link>

      {/* Mobile Menu Toggle */}
      <button 
        id="mobile-toggle"
        onClick={toggleNav}
        className="md:hidden p-2 text-gray-800 hover:text-[#088178] focus:outline-none z-50"
        aria-label="Toggle menu"
      >
        {isNavOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
      </button>

      {/* Navbar Links - Scrollable on mobile */}
      <div 
        ref={navRef}
        className={`fixed inset-0 md:relative h-screen md:h-auto w-full md:w-auto bg-[#E3E6F3] md:bg-transparent z-40 transition-all duration-300 ease-in-out
        ${isNavOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
         overflow-y-auto`}
        style={{ maxHeight: '100vh' }}
      >
        <div className="flex flex-col h-full ">
          <ul className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 pl-4 mt-5">
            {/* Main Navigation Links */}
            <li>
              <Link 
                href="/" 
                className="flex items-center gap-3 py-3 text-[#1a1a1a] hover:text-[#088178] font-semibold transition-colors duration-300"
                onClick={() => setIsNavOpen(false)}
              >
                <FaHome className="text-xl" />
                <span className="text-lg">Home</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/shop" 
                className="flex items-center gap-3 py-3 text-[#1a1a1a] hover:text-[#088178] font-semibold transition-colors duration-300"
                onClick={() => setIsNavOpen(false)}
              >
                <FaShop className="text-xl" />
                <span className="text-lg">Shop</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/blog" 
                className="flex items-center gap-3 py-3 text-[#1a1a1a] hover:text-[#088178] font-semibold transition-colors duration-300"
                onClick={() => setIsNavOpen(false)}
              >
                <FaBlog className="text-xl" />
                <span className="text-lg">Blog</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/about" 
                className="flex items-center gap-3 py-3 text-[#1a1a1a] hover:text-[#088178] font-semibold transition-colors duration-300"
                onClick={() => setIsNavOpen(false)}
              >
                <FaInfoCircle className="text-xl" />
                <span className="text-lg">About</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/contact" 
                className="flex items-center gap-3 py-3 text-[#1a1a1a] hover:text-[#088178] font-semibold transition-colors duration-300"
                onClick={() => setIsNavOpen(false)}
              >
                <FaEnvelope className="text-xl" />
                <span className="text-lg">Contact</span>
              </Link>
            </li>

            {/* Mobile-only profile links */}
            <div className="md:hidden pt-4 border-t border-gray-300 ">
              <li>
                <Link 
                  href="/profile" 
                  className="flex items-center gap-3 py-3 text-[#1a1a1a] hover:text-[#088178] font-semibold transition-colors duration-300"
                  onClick={() => setIsNavOpen(false)}
                >
                  <FaUser className="text-xl" />
                  <span className="text-lg">Profile</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/wishlist" 
                  className="flex items-center gap-2 py-3 text-[#1a1a1a] hover:text-[#088178] font-semibold transition-colors duration-300"
                  onClick={() => setIsNavOpen(false)}
                >
                  <CiHeart className="text-2xl" />
                  <span className="text-lg">Wishlist</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/cart" 
                  className="flex items-center gap-3 py-3 text-[#1a1a1a] hover:text-[#088178] font-semibold transition-colors duration-300"
                  onClick={() => setIsNavOpen(false)}
                >
                  <FaShoppingBag className="text-xl" />
                  <span className="text-lg">Cart</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-4 py-3 text-[#1a1a1a] hover:text-[#088178] font-semibold transition-colors duration-300"
                  onClick={() => setIsNavOpen(false)}
                >
                  <RiDashboard3Line />
                  <span className="text-lg">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/logout" 
                  className="flex items-center gap-4 py-3 text-[#1a1a1a] hover:text-[#088178] font-semibold transition-colors duration-300"
                  onClick={() => setIsNavOpen(false)}
                >
                  <BiLogOut className="text-lg font-bold" />
                  <span className="text-lg">Logout</span>
                </Link>
              </li>
            </div>
          </ul>
          
          {/* Spacer to push content up */}
          <div className="flex-grow"></div>
          
          {/* Optional: Add a close button at the bottom for easier access */}
          <button 
            onClick={toggleNav}
            className="md:hidden mt-8 p-3 bg-[#088178] text-white  font-medium"
          >
            Close Menu
          </button>
        </div>
      </div>

      { !token ? <Link href="/login" className="text-[#1a1a1a] text-[#088178] transition-colors duration-300 mt-3 mx-5 flex justify-center items-center align-bottom gap-1">
          <GrLogin  className="text-2xl"/> <span className="font-bold">Login</span>
        </Link>:
         
      <div className="hidden md:flex items-center gap-4 pr-10">
        {/* Wishlist */}
        <Link href="/wishlist" className="text-[#1a1a1a] hover:text-[#088178] transition-colors duration-300">
          <CiHeart className="text-2xl" />
        </Link>
        
        {/* Cart */}
        <Link href="/cart" className="text-[#1a1a1a] hover:text-[#088178] transition-colors duration-300">
          <FaShoppingBag className="text-xl" />
        </Link>
        
        {/* Profile Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button 
            onClick={toggleDropdown}
            className="p-2 text-[#1a1a1a] hover:text-[#088178] focus:outline-none transition-colors duration-300 cursor-pointer"
          >
            <FaUser className="text-xl" />
          </button>
          
          {isDropdownOpen && (
            <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <li>
                <Link 
                  href="/profile" 
                  className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-[#1a1a1a] hover:text-[#088178] transition-colors duration-300"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FaUser />
                  <span>Profile</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard" 
                  className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-[#1a1a1a] hover:text-[#088178] transition-colors duration-300"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <RiDashboard3Line />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className="border-t border-gray-200">
                <Link 
                  href="/login" 
                  className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-[#1a1a1a] hover:text-[#088178] transition-colors duration-300"
                  onClick={() => handleLogout()}
                >
                  <BiLogOut />
                  <span>Logout</span>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>}
    </section>
  );
};

export default Navbar;