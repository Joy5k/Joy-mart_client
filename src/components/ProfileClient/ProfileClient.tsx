/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaUser, FaShoppingBag, FaHeart, FaMapMarkerAlt, FaCog, FaSignOutAlt, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { removeToken } from '@/src/utils/localStorageManagement';
import uploadImage from '@/src/hooks/imageUploader';
import { IProfile } from '@/src/types';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/src/redux/features/profile/profileApi';

const ProfileClient = ({ orders, wishlist, addresses }: any) => {
  const router = useRouter();
  const { data, refetch } = useGetProfileQuery({});
  const user = data?.data;

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<IProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [updatedData, setUpdatedData] = useState<IProfile>({
    firstName: '',
    lastName: '',
    image: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    dateOfBirth: '',
    isDeleted: false,
  });

  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    isDefault: false
  });

  const [updateProfile] = useUpdateProfileMutation();

  // Initialize user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setUserData(user);
      setUpdatedData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        image: user.image || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || '',
        zipCode: user.zipCode || '',
        dateOfBirth: user.dateOfBirth || '',
        isDeleted: user.isDeleted || false,
      });
      setImagePreview(user.image || null);
    }
  }, [user]);


  const handleImageChangeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
   
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    setImageFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImagePreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
 try {
   
      const response = await uploadImage(file);
      if (response) {
        console.log(response.imageUrl)
        setUpdatedData(prev=>({...prev,image:response?.imageUrl}))
        setImagePreview(response?.imageUrl);
      }
     
    
    
 
    
  } catch (error) {
    console.error(error);
  }

}
console.log(updatedData)
  // Animation variants
  const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10 }
  };



  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
  

      const res = await updateProfile({ updatedData }).unwrap();
      console.log(res,'res')
      if (res) {
        toast.success('Profile updated successfully');
        setUserData(res.data); // Update local user data with response
        refetch(); // Refetch the latest data
        setIsEditing(false);
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddAddress = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('Address added successfully');
      setNewAddress({
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        isDefault: false
      });
    } catch (error: any) {
      toast.error('Failed to add address');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOrderExpand = (orderId: any) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleLogout = () => {
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    removeToken();
    router.push('/login');
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setUpdatedData(prev => ({ ...prev, image: '' }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] z-0"></div>
      
      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile header with parallax effect */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-r from-[#088178] to-[#0abab5] h-32 relative">
            <motion.div 
              className="absolute -bottom-16 left-8"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview || "https://i.ibb.co/1zh2txz/men.jpg"}
                      alt="Profile"
                      
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 640px"
                    />
                    {isEditing && (
                      <div className="absolute inset-0 opacity-70  bg-black  flex items-center justify-center gap-2 ">
                        <label className="cursor-pointer p-2 rounded-full bg-opacity-20 transition ">
                          <input 
                            type="file" 
                            className="hidden " 
                            accept="image/*"
                            onChange={handleImageChangeUpload}
                          />
                          <FaEdit className="text-white text-lg" />
                        </label>
                        <button 
                          onClick={removeImage}
                          className="cursor-pointer p-2 rounded-full bg-red-500 bg-opacity-20  transition"
                        >
                          <FaTrash className="text-white text-lg" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    {isEditing ? (
                      <label className="w-full h-full flex items-center justify-center cursor-pointer">
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageChangeUpload}
                        />
                        <div className="text-center p-4">
                          <FaPlus className="mx-auto text-gray-500 text-2xl mb-2" />
                          <span className="text-gray-600 text-sm">Add Photo</span>
                        </div>
                      </label>
                    ) : (
                      <FaUser className="text-gray-500 text-4xl" />
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start">
              {isEditing ? (
                <div className="space-y-4 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={updatedData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={updatedData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={updatedData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={updatedData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={updatedData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={updatedData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={updatedData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={updatedData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={updatedData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={updatedData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setImagePreview(user?.image || null);
                        setImageFile(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="px-6 py-2 bg-[#088178] text-white rounded-lg font-medium flex items-center gap-2"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{userData?.firstName} {userData?.lastName}</h1>
                    <p className="text-gray-600">{userData?.email}</p>
                    {userData?.phoneNumber && <p className="text-gray-500 mt-1">Phone: {userData.phoneNumber}</p>}
                    {userData?.address && (
                      <p className="text-gray-500 mt-1">
                        Address: {userData.address}, {userData.city}, {userData.state} {userData.zipCode}, {userData.country}
                      </p>
                    )}
                    {/* {userData?.joinDate && (
                      <p className="text-gray-500 mt-2">Member since {new Date(userData.joinDate).toLocaleDateString()}</p>
                    )} */}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#088178] text-white rounded-lg"
                  >
                    <FaEdit /> Edit Profile
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      
    


































        {/* Main profile content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-8">
              <nav className="space-y-1 p-4">
                {[
                  { id: 'overview', icon: FaUser, label: 'Overview', count: null },
                  { id: 'orders', icon: FaShoppingBag, label: 'My Orders', count: orders.length },
                  { id: 'wishlist', icon: FaHeart, label: 'Wishlist', count: wishlist.length },
                  { id: 'addresses', icon: FaMapMarkerAlt, label: 'Addresses', count: addresses.length },
                  { id: 'settings', icon: FaCog, label: 'Settings', count: null },
                ]?.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 5 }}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-colors ${activeTab === item.id ? 'bg-[#088178] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="text-lg" />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== null && (
                      <span className={`px-2 py-1 text-xs rounded-full ${activeTab === item.id ? 'bg-white text-[#088178]' : 'bg-gray-200 text-gray-700'}`}>
                        {item.count}
                      </span>
                    )}
                  </motion.button>
                ))}
                <motion.button
                  whileHover={{ x: 5 }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 rounded-lg hover:bg-red-50 mt-4"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  <span>Sign Out</span>
                </motion.button>
              </nav>
            </div>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                {activeTab === 'overview' && (
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200"
                      >
                        <h3 className="text-lg font-medium text-blue-800 mb-2">Total Orders</h3>
                        <p className="text-3xl font-bold text-blue-600">{orders.length}</p>
                        <p className="text-sm text-blue-500 mt-2">View all orders</p>
                      </motion.div>
                      
                      <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200"
                      >
                        <h3 className="text-lg font-medium text-purple-800 mb-2">Wishlist Items</h3>
                        <p className="text-3xl font-bold text-purple-600">{wishlist.length}</p>
                        <p className="text-sm text-purple-500 mt-2">View your wishlist</p>
                      </motion.div>
                      
                      <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200"
                      >
                        <h3 className="text-lg font-medium text-green-800 mb-2">Saved Addresses</h3>
                        <p className="text-3xl font-bold text-green-600">{addresses.length}</p>
                        <p className="text-sm text-green-500 mt-2">Manage addresses</p>
                      </motion.div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
                      <div className="space-y-4">
                        {orders?.slice(0, 3)?.map((order:any) => (
                          <motion.div 
                            key={order?.id}
                            whileHover={{ x: 5 }}
                            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer"
                            onClick={() => setActiveTab('orders')}
                          >
                            <div className="bg-[#088178] bg-opacity-10 p-3 rounded-lg">
                              <FaShoppingBag className="text-[#088178] text-xl" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">Order #{order?.orderNumber}</h4>
                              <p className="text-sm text-gray-500">{new Date(order?.date).toLocaleDateString()} • {order?.status}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">${order?.total.toFixed(2)}</p>
                              <p className="text-sm text-gray-500">{order?.items.length} items</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>
                    
                    {orders.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="mx-auto bg-gray-100 p-6 rounded-full w-24 h-24 flex items-center justify-center mb-4">
                          <FaShoppingBag className="text-4xl text-gray-400" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-700">No orders yet</h3>
                        <p className="text-gray-500 mt-2">Your order history will appear here</p>
                        <button 
                          onClick={() => router.push('/products')}
                          className="mt-6 px-6 py-2 bg-[#088178] text-white rounded-lg"
                        >
                          Start Shopping
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders?.map((order:any) => (
                          <div key={order?.id} className="border border-gray-200 rounded-xl overflow-hidden">
                            <div 
                              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                              onClick={() => toggleOrderExpand(order?.id)}
                            >
                              <div>
                                <h3 className="font-medium">Order #{order?.orderNumber}</h3>
                                <p className="text-sm text-gray-500">{new Date(order?.date).toLocaleDateString()}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  order?.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                  order?.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                  order?.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {order?.status}
                                </div>
                                <div className="text-right">
                                  <p className="font-bold">${order?.total.toFixed(2)}</p>
                                </div>
                                {expandedOrder === order?.id ? (
                                  <FiChevronUp className="text-gray-500" />
                                ) : (
                                  <FiChevronDown className="text-gray-500" />
                                )}
                              </div>
                            </div>
                            
                            <AnimatePresence>
                              {expandedOrder === order?.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-4 border-t">
                                    <h4 className="font-medium mb-3">Order Items</h4>
                                    <div className="space-y-3">
                                    {order?.items?.map((item: any) => (
                                        <div key={item.id} className="flex items-center gap-4">
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="64px"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h5 className="font-medium">{item.name}</h5>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">${item.price.toFixed(2)}</p>
                                                {item.discountedPrice && (
                                                    <p className="text-sm text-gray-500 line-through">${item.originalPrice?.toFixed(2)}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    </div>
                                    
                                    <div className="mt-6 pt-6 border-t">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                          <h4 className="font-medium mb-3">Shipping Address</h4>
                                          <address className="not-italic text-gray-600">
                                            {order?.shippingAddress.street}<br />
                                            {order?.shippingAddress.city}, {order?.shippingAddress.state}<br />
                                            {order?.shippingAddress.zip}, {order?.shippingAddress.country}
                                          </address>
                                        </div>
                                        <div>
                                          <h4 className="font-medium mb-3">Payment Method</h4>
                                          <p className="text-gray-600">{order?.paymentMethod}</p>
                                          <h4 className="font-medium mt-4 mb-3">Order Summary</h4>
                                          <div className="space-y-2">
                                            <div className="flex justify-between">
                                              <span>Subtotal</span>
                                              <span>${order?.subtotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span>Shipping</span>
                                              <span>${order?.shippingCost.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span>Tax</span>
                                              <span>${order?.tax.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between font-bold pt-2 border-t">
                                              <span>Total</span>
                                              <span>${order?.total.toFixed(2)}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="mt-6 flex justify-end gap-3">
                                        <button className="px-4 py-2 border border-gray-300 rounded-lg">
                                          Track Order
                                        </button>
                                        <button className="px-4 py-2 bg-[#088178] text-white rounded-lg">
                                          Buy Again
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'wishlist' && (
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h2>
                    
                    {wishlist.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="mx-auto bg-gray-100 p-6 rounded-full w-24 h-24 flex items-center justify-center mb-4">
                          <FaHeart className="text-4xl text-gray-400" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-700">Your wishlist is empty</h3>
                        <p className="text-gray-500 mt-2">Save your favorite items here</p>
                        <button 
                          onClick={() => router.push('/products')}
                          className="mt-6 px-6 py-2 bg-[#088178] text-white rounded-lg"
                        >
                          Browse Products
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist?.map((item: any) => (
                          <motion.div
                            key={item.id}
                            whileHover={{ y: -5 }}
                            className="border border-gray-200 rounded-xl overflow-hidden"
                          >
                            <div className="relative aspect-square">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                              <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors">
                                <FaTrash className="text-red-500 hover:text-white" />
                              </button>
                            </div>
                            <div className="p-4">
                              <h3 className="font-medium mb-1">{item.name}</h3>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-[#088178]">${item.price.toFixed(2)}</span>
                                {item.originalPrice && (
                                  <span className="text-sm text-gray-500 line-through">${item.originalPrice.toFixed(2)}</span>
                                )}
                              </div>
                              <button className="w-full mt-4 py-2 bg-[#088178] text-white rounded-lg">
                                Add to Cart
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'addresses' && (
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">My Addresses</h2>
                      <button 
                        onClick={() => {
                          const modal = document.getElementById('new_address_modal') as HTMLDialogElement | null;
                          if (modal) modal.showModal();
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-[#088178] text-white rounded-lg"
                      >
                        <FaPlus /> Add New Address
                      </button>
                    </div>
                    
                    {addresses.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="mx-auto bg-gray-100 p-6 rounded-full w-24 h-24 flex items-center justify-center mb-4">
                          <FaMapMarkerAlt className="text-4xl text-gray-400" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-700">No saved addresses</h3>
                        <p className="text-gray-500 mt-2">Add your first address to get started</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses?.map((address: any) => (
                          <motion.div
                            key={address.id}
                            whileHover={{ scale: 1.02 }}
                            className={`border rounded-xl p-6 relative ${address.isDefault ? 'border-[#088178] ring-1 ring-[#088178]' : 'border-gray-200'}`}
                          >
                            {address.isDefault && (
                              <div className="absolute top-4 right-4 bg-[#088178] text-white text-xs px-2 py-1 rounded">
                                Default
                              </div>
                            )}
                            <h3 className="font-bold mb-3">{address.name}</h3>
                            <address className="not-italic text-gray-600 mb-4">
                              {address.street}<br />
                              {address.city}, {address.state}<br />
                              {address.zip}, {address.country}
                            </address>
                            <div className="flex gap-3">
                              <button className="text-sm text-[#088178] font-medium flex items-center gap-1">
                                <FaEdit /> Edit
                              </button>
                              <button className="text-sm text-red-600 font-medium flex items-center gap-1">
                                <FaTrash /> Remove
                              </button>
                              {!address.isDefault && (
                                <button className="text-sm text-gray-600 font-medium flex items-center gap-1">
                                  Set as Default
                                </button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
                    
                    <div className="space-y-8">
                      <div className="border-b pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                        <div className="max-w-md space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input
                              type="password"
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input
                              type="password"
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input
                              type="password"
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                            />
                          </div>
                          <button className="mt-2 px-6 py-2 bg-[#088178] text-white rounded-lg">
                            Update Password
                          </button>
                        </div>
                      </div>
                      
                      <div className="border-b pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                        <div className="space-y-3">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="rounded text-[#088178] focus:ring-[#088178]" defaultChecked />
                            <span>Email notifications</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="rounded text-[#088178] focus:ring-[#088178]" defaultChecked />
                            <span>SMS notifications</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="rounded text-[#088178] focus:ring-[#088178]" />
                            <span>Push notifications</span>
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Account</h3>
                        <p className="text-gray-600 mb-4">This will permanently delete your account and all associated data.</p>
                        <button className="px-6 py-2 bg-red-600 text-white rounded-lg">
                          Delete My Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* New Address Modal */}
      <dialog id="new_address_modal" className="modal">
        <div className="modal-box max-w-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg mb-6">Add New Address</h3>
          
          <form onSubmit={(e) => { e.preventDefault(); handleAddAddress(); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Title (e.g. Home, Office)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                <input
                  type="text"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
                <input
                  type="text"
                  value={newAddress.zip}
                  onChange={(e) => setNewAddress({...newAddress, zip: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  value={newAddress.country}
                  onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                  required
                >
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  {/* Add more countries as needed */}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAddress.isDefault}
                    onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                    className="rounded text-[#088178] focus:ring-[#088178]"
                  />
                  <span>Set as default shipping address</span>
                </label>
              </div>
            </div>
            
            <div className="modal-action">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-[#088178] text-white rounded-lg font-medium"
              >
                {isLoading ? 'Adding...' : 'Add Address'}
              </button>
            </div>
          </form>
        </div>
        
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default ProfileClient;