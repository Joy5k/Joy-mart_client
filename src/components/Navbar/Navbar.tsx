"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { BiLogOut } from "react-icons/bi";
import { FaBlog, FaEnvelope, FaHome, FaInfoCircle, FaUser, FaShoppingBag, FaTruck } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { RiDashboard3Line } from "react-icons/ri";
import { CiHeart } from "react-icons/ci";
import { FiMenu, FiX } from "react-icons/fi";
import { getToken, removeToken } from "@/src/utils/localStorageManagement";
import { GrLogin } from "react-icons/gr";
import TrackOrderModal from "../OrderTrackModal";
import { verifyToken } from "@/src/utils/jwt";
import { FaRegHeart } from "react-icons/fa";
import { useLoginWithSocialMutation, useLogoutMutation } from "@/src/redux/features/Auth/authApi";
import { SocialSession } from "@/src/utils/socialAuth";
import Loader from "@/src/hooks/loader";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const route=useRouter()
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [token, setToken] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>('user');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const [socialLoginMutation, { isLoading: isSocialLoading }] = useLoginWithSocialMutation();
  const [logoutUser] = useLogoutMutation();

    const handleLogout = async () => {
    try {
      const res = await logoutUser({}).unwrap();
      if (!res.success) {
        throw new Error('Logout failed');
      }
      localStorage.removeItem('authToken');
     
      setIsDropdownOpen(false);
      setIsNavOpen(false);
      removeToken();
      route.replace('/login')
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  
  const handleSocialLogin = async () => {
    try {
      const session = await SocialSession();
      if (!session) {
        return;
      }
      const res = await socialLoginMutation({ data: session }).unwrap();
      console.log(res,'Navbar response')
     if(res.success){
       document.cookie = `authToken=${res.data?.accessToken}`;
      document.cookie = `refreshToken=${res.data?.refreshToken}`;
      setToken(res?.data?.accessToken);
     }
    } catch (error) {
      console.warn('Social login failed');
    } finally {
      setIsCheckingAuth(false);
    }
  };

  useEffect(() => {

  const authToken = getToken();
    const checkAuth = async () => {
      try {
        if (!authToken) {
          await handleSocialLogin();
        } else {
          setToken(authToken);
          const { role } = verifyToken(authToken) as { role: string }; 
          setUserRole(role);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
      } finally {
        setIsInitialLoad(false);
        setIsCheckingAuth(false);
      }
    };

    checkAuth();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      
      if (navRef.current && !navRef.current.contains(event.target as Node) && 
          !(event.target as HTMLElement).closest('#mobile-toggle')) {
        setIsNavOpen(false);
      }
      
      if ((event.target as HTMLElement).closest('[data-modal-trigger]')) {
        return;
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []); 




  return (
    <section className="flex items-center justify-between bg-white shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Mobile Menu Toggle */}
        <button 
          id="mobile-toggle"
          onClick={toggleNav}
          className="md:hidden p-2 text-gray-800 hover:text-[#088178] focus:outline-none z-50"
          aria-label="Toggle menu"
        >
          {isNavOpen ? <FiX className="text-2xl fixed right-10 top-5" /> : <FiMenu className="text-2xl" />}
        </button>

        {/* Logo */}
        <div className="flex-grow flex justify-center md:flex-grow-0">
          <Link href="/">
            <Image 
              src="/img/logo.png" 
              width={70} 
              height={10} 
              alt="Logo" 
              className="bg-transparent" 
            />
          </Link>
        </div>

        <div className="md:hidden w-10"></div>
      </div>

      {/* Navbar Links */}
      <div 
        ref={navRef}
        className={`fixed inset-0 md:relative h-screen md:h-auto w-full md:w-auto bg-[#E3E6F3] md:bg-transparent z-40 transition-all duration-300 ease-in-out
        ${isNavOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0 m-2'}
         overflow-y-auto`}
        style={{ maxHeight: '100vh' }}
      >
        <div className="flex flex-col h-full">
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
                href="/products" 
                className="flex items-center gap-3 py-3 text-[#1a1a1a] hover:text-[#088178] font-semibold transition-colors duration-300"
                onClick={() => setIsNavOpen(false)}
              >
                <FaShop className="text-xl" />
                <span className="text-lg">Products</span>
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
            {!token ? (
              <div className="md:hidden lg:hidden">
                <hr/>
                <li>
                  {isSocialLoading ? (
                    <div className="flex items-center gap-2 py-3">
                      <Loader />
                     
                    </div>
                  ) : (
                    <Link 
                      href="/wishlist" 
                      className="flex items-center gap-2 py-3 text-[#1a1a1a] hover:text-[#088178] font-semibold transition-colors duration-300"
                      onClick={() => setIsNavOpen(false)}
                    >
                      <CiHeart className="text-2xl" />
                      <span className="text-lg">Wishlist</span>
                    </Link>
                  )}
                </li>
                <li>
                  {isSocialLoading ? (
                    <div className="flex items-center gap-3 py-3">
                      <Loader />
                      
                    </div>
                  ) : (
                    <Link 
                      href="/login" 
                      className="flex items-center gap-3 py-3 text-[#1a1a1a] hover:text-[#088178] font-semibold transition-colors duration-300"
                      onClick={() => setIsNavOpen(false)}
                    >
                      <GrLogin className="text-2xl" />
                      <span className="text-lg">Login</span>
                    </Link>
                  )}
                </li>
              </div>
            ) : (
              <div className="md:hidden pt-4 border-t border-gray-300">
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
                    href="/booking" 
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
                  <p 
                 
                    className="flex items-center gap-4 py-3 text-[#1a1a1a] hover:text-[#088178] font-semibold transition-colors duration-300"
                    onClick={() => handleLogout()}
                  >
                    <BiLogOut className="text-lg font-bold" />
                    <span className="text-lg">Logout</span>
                  </p>
                </li>
              </div>
            )}
          </ul>
          
          <div className="flex-grow"></div>
          
          <button 
            onClick={toggleNav}
            className="md:hidden mt-8 p-3 bg-[#088178] text-white font-medium"
          >
            Close Menu
          </button>
        </div>
      </div>

      {/* Profile menu for desktop */}
      {!token ? (
        <div className="flex items-center gap-4 pr-10 justify-center align-middle">
          {isSocialLoading || isCheckingAuth || isInitialLoad ? (  <Loader  />
          ) : (
            <>
              <Link 
                href="/wishlist" 
                className="text-[#1a1a1a] hover:text-[#088178] transition-colors duration-300"
              >
                <FaRegHeart className="text-xl font-extrabold" />
              </Link>
              <Link 
                href="/login" 
                className="hover:text-[#088178] transition-colors duration-300 flex justify-center items-center align-bottom gap-1"
              >
                <GrLogin className="text-2xl" /> 
                <span className="font-bold">Login</span>
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="hidden md:flex items-center gap-4 pr-10">
          <Link 
            href="/wishlist" 
            className="text-[#1a1a1a] hover:text-[#088178] transition-colors duration-300"
          >
            <CiHeart className="text-2xl" />
          </Link>
          
          <Link 
            href="/booking" 
            className="text-[#1a1a1a] hover:text-[#088178] transition-colors duration-300"
          >
            <FaShoppingBag className="text-xl" />
          </Link>
          
          <div ref={dropdownRef} className="relative">
            <button 
              onClick={toggleDropdown}
              className="p-2 text-[#1a1a1a] hover:text-[#088178] focus:outline-none transition-colors duration-300 cursor-pointer"
              data-modal-trigger 
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
                {(userRole === 'admin' || userRole === 'superAdmin' || userRole === 'seller') && (
                  <li>
                    <Link 
                      href="/dashboard" 
                      className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-[#1a1a1a] hover:text-[#088178] transition-colors duration-300"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <RiDashboard3Line />
                      <span className="hidden md:block lg:block">Dashboard</span>
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-[#1a1a1a] hover:text-[#088178] transition-colors duration-300 w-full text-left"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDropdownOpen(false);
                      setIsTrackModalOpen(true);
                    }}
                  >
                    <FaTruck />
                    <span>Track Order</span>
                  </button>
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
          {isTrackModalOpen && (
            <TrackOrderModal 
              isOpen={isTrackModalOpen}
              onClose={() => setIsTrackModalOpen(false)}
            />
          )}
        </div>
      )}
    </section>
  );
};

export default Navbar;