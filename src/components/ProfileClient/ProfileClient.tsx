/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaUser, FaHeart,FaEdit, FaTrash, FaPlus, FaEyeSlash, FaEye, FaLock, FaFlag, FaTimes, FaExternalLinkAlt, FaBoxOpen, FaTrashAlt, FaExclamationTriangle, FaStore, FaInfoCircle } from 'react-icons/fa';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { removeToken } from '@/src/utils/localStorageManagement';
import uploadImage from '@/src/hooks/imageUploader';
import { IOrder, IProfile, ReportedProduct } from '@/src/types';
import { useDeleteProfileMutation, useGetProfileQuery, useUpdateRoleMutation } from '@/src/redux/features/profile/profileApi';
import { useChangePasswordMutation, useLogoutMutation } from '@/src/redux/features/Auth/authApi';
import { format } from 'date-fns';
import TransId from '@/src/components/profileComponents/transId/TransId';
import SubscribeHandler from '@/src/components/profileComponents/subscribeHandler/SubscribeHandler';
import ProfileSidebar from '../profileComponents/profileSidebar';
import ProfileUserInfoUpdate from '../profileComponents/ProfileUserInfoUpdate';

const ProfileClient = ({ orders, wishlist,reports }: {orders:IOrder[],wishlist:any,reports:any}) => {
  const router = useRouter();
  const { data } = useGetProfileQuery({});
  const user = data?.data;
  const [showPassword, setShowPassword] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportedProduct | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<IProfile | null>(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
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

  const [changePassword,setChangePassword]=useState({
    currentPassword:"",
    newPassword:"",
    confirmPassword:""
  })
  
  const [passwordError,setPasswordError]=useState<string>("")
  const [changePasswordMutation]=useChangePasswordMutation()
  const [deleteProfile,{isLoading:isProfileDeleting}]=useDeleteProfileMutation()
  const [logout]=useLogoutMutation()
       const [updateProfile] = useUpdateRoleMutation();
  
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
        setUpdatedData(prev=>({...prev,image:response?.imageUrl}))
        setImagePreview(response?.imageUrl);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Animation variants
  const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10 }
  };


  const toggleOrderExpand = (orderId: any) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleLogout =async () => {
    try {
      const res=await logout({}).unwrap()
      if(res.success){
        toast.warn("You logged out",{
          autoClose:500,
          position:'bottom-center'
        })
      }
    }catch(err){
      console.log(err)
    }
    removeToken();
    router.push('/');
  };

  const removeImage = () => {
    setImagePreview(null);
    setUpdatedData(prev => ({ ...prev, image: '' }));
  };

  const handlePasswordChange=async()=>{
    let payload={
      oldPassword:'',
      newPassword:""
    }
    if(changePassword.confirmPassword===changePassword.newPassword&&changePassword.currentPassword){
      payload={
        oldPassword:changePassword.currentPassword,
        newPassword:changePassword.newPassword,
      }
    }
    try {
      const res=await changePasswordMutation(payload).unwrap()
      if(res.success){
        toast.success('Password Changed successfully, Please Login again')
        handleLogout()
      }
    } catch (err:any) {
      console.log(err,"Something went wrong, while changing password")
      setPasswordError(err?.data?.message)
    } finally {
      
    }
  } 
const handleProfileDelete = async() => {
    if (confirmationText !== 'DELETE') return;
    
    try {
      const res= await deleteProfile({id:user._id}).unwrap()
      console.log(res,"delete profile response")
      if(res.success){
      localStorage.removeItem('authToken');
     await logout({});
        toast.success("profile deleted successfully",{
          position:'top-center',
          autoClose:1500,
        })
        router.push('/')
 
      }
    } catch (error) {
      
    }
  };
const handleRoleChange = async (newRole:'user'|'seller') => {
  try {
    
    
    // Call API to update user role
    const response = await updateProfile({}).unwrap(); 
    
    if (response.success) {
   
      toast.success(`You are now a ${newRole}`);
    } else {
      toast.error(response.message || 'Failed to update role');
    }
  } catch (error) {
    toast.error('An error occurred while updating your role');
  } finally {
  }
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
              <div className='min-w-full'>
                 <ProfileUserInfoUpdate setIsEditing={setIsEditing} setImagePreview={setImagePreview} updatedData={updatedData} setUpdatedData={setUpdatedData}></ProfileUserInfoUpdate>
              </div>
              ) : (
                <div className="flex flex-col md:flex-row lg:flex-row items-center justify-between w-full">
                  <div>
                    <h3 className="text-2xl md:text-3xl lg:text-3xl font-bold text-gray-900">{userData?.firstName} {userData?.lastName}</h3>
                    <p className="text-gray-600">{userData?.email}</p>
                    {userData?.phoneNumber && <p className="text-gray-500 mt-1">Phone: {userData.phoneNumber}</p>}
                    {userData?.address && (
                      <p className="text-gray-500 mt-1">
                        Address: {userData.address}, {userData.city}, {userData.state} {userData.zipCode}, {userData.country}
                      </p>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#088178] text-white rounded-lg mt-5 md:mt-0 lg:mt-0"
                  >
                    <FaEdit /> Edit Profile
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main profile content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar navigation */}
        <ProfileSidebar orders={orders} wishlist={wishlist} reports={reports} activeTab={activeTab} setActiveTab={setActiveTab}></ProfileSidebar>

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
                    <h3 className="text-2xl md:text-3xl lg:text-3xl font-bold text-gray-900 mb-6">Dashboard Overview</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200"
                      >
                        <h3 className="text-lg font-medium text-blue-800 mb-2">Total Orders</h3>
                        <p className="text-3xl font-bold text-blue-600">{orders?.length || 0}</p>
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
                        <p className="text-3xl font-bold text-green-600">{1}</p>
                        <p className="text-sm text-green-500 mt-2">Manage addresses</p>
                      </motion.div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
                      <div className="space-y-4">
                       {
                        orders?.slice(0, 3).map((sampleOrder:IOrder) => (
                          <TransId key={sampleOrder.orderId} sampleOrder={sampleOrder} setActiveTab={setActiveTab} />
                        ))
                       }
                      </div>
                    </div>
                  </div>
                )}
{activeTab === 'orders' && (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>
    
    {orders?.length > 0 ? (
      orders.map((sampleOrder: IOrder) => (
        <div className="space-y-4" key={sampleOrder.orderId}>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
              onClick={() => toggleOrderExpand(sampleOrder.orderId)}
            >
              <div>
                <h3 className="font-medium">Order #{sampleOrder.orderId}</h3>
                <p className="text-sm text-gray-500">{new Date(sampleOrder.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  sampleOrder.orderStatus === 'completed' ? 'bg-green-100 text-green-800' :
                  sampleOrder.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  sampleOrder.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {sampleOrder.orderStatus}
                </div>
                <div className="text-right">
                  <p className="font-bold">{sampleOrder.paymentDetails.currency} {sampleOrder.totalAmount.toFixed(2)}</p>
                </div>
                {expandedOrder === sampleOrder.orderId ? (
                  <FiChevronUp className="text-gray-500" />
                ) : (
                  <FiChevronDown className="text-gray-500" />
                )}
              </div>
            </div>
            
            <AnimatePresence>
              {expandedOrder === sampleOrder.orderId && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 border-t">
                    <h4 className="font-medium mb-3">Order Details</h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium mb-2">Contact Information</h5>
                        <p>Email: {sampleOrder.contactInfo.email}</p>
                        <p>Phone: {sampleOrder.contactInfo.phone}</p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2">Payment Information</h5>
                        <p>Method: {sampleOrder.paymentMethod}</p>
                        <p>Status: {sampleOrder.paymentStatus}</p>
                        <p>Amount: {sampleOrder.paymentDetails.currency} {sampleOrder.totalAmount.toFixed(2)}</p>
                      </div>
                      
                      {sampleOrder.productIds.length > 0 ? (
                        <div>
                          <h5 className="font-medium mb-2">Order Items</h5>
                          {sampleOrder.productIds.map((product: any) => (
                            <div key={product.id} className="flex items-center gap-4 py-2 border-b">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg"></div>
                              <div className="flex-1">
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{sampleOrder.paymentDetails.currency} {product.price.toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p>No products in this order</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex justify-end gap-3">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg">
                          Contact Support
                        </button>
                        <button className="px-4 py-2 bg-[#088178] text-white rounded-lg">
                          Track Order
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ))
    ) : (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FaBoxOpen className="text-5xl text-gray-300 mb-4" />
        <h3 className="text-xl font-medium text-gray-700 mb-2">No orders yet</h3>
        <p className="text-gray-500 max-w-md mb-6">
          You haven't placed any orders. When you do, they'll appear here.
        </p>
        <button 
          className="px-6 py-2 bg-[#088178] text-white rounded-lg hover:bg-[#077168] transition-colors"
          onClick={() => {/* Add navigation to shop or products page */}}
        >
          Start Shopping
        </button>
      </div>
    )}
  </div>
)}
          {
  activeTab === 'reports' && (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Reports</h2>
      
      {reports?.meta?.total === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto bg-gray-100 p-6 rounded-full w-24 h-24 flex items-center justify-center mb-4">
            <FaFlag className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-700">No reports found</h3>
          <p className="text-gray-500 mt-2">You haven't reported any products yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports?.result?.map((report: ReportedProduct) => (
            <motion.div
              key={report._id}
              whileHover={{ y: -5 }}
              className="border border-gray-200 rounded-xl p-4 cursor-pointer"
              onClick={() => setSelectedReport(report)}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Image
                    src={report.productId.images[0] || '/placeholder-product.jpg'}
                    alt={report.productId.title || 'Reported product'}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900">{report.productId.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      report.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Reported on: {format(new Date(report.createdAt), 'MMM dd, yyyy')}
                  </p>
                  <div className="mt-2">
                    <p className="font-medium text-sm">Reason:</p>
                    <p className="text-gray-700 text-sm">{report.reason}</p>
                  </div>
                  {report.description && (
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {report.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">
                  Report Details
                </h2>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Details Section */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3">Product Information</h3>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Image
                        src={selectedReport.productId.images[0] || '/placeholder-product.jpg'}
                        alt={selectedReport.productId.title || 'Product image'}
                        width={120}
                        height={120}
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{selectedReport.productId.title || 'Unnamed Product'}</h4>
                      <p className="text-gray-600">${selectedReport.productId.price}</p>
                      <a
                        href={`/productDetails/${selectedReport.productId._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View Product Page <FaExternalLinkAlt className="ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Report Details Section */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3">Report Information</h3>
                  
                  {/* Report Images Carousel */}
                  {(selectedReport.reportImages && selectedReport.reportImages.length > 0) && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500 mb-2">Reported Images</p>
                      <div className="relative">
                        <div className="carousel rounded-box">
                          {selectedReport.reportImages.map((image, index) => (
                            <div key={index} className="carousel-item relative">
                              <Image
                                src={image || '/placeholder-report.jpg'}
                                alt={`Report image ${index + 1}`}
                                width={300}
                                height={200}
                                className="rounded-md object-contain h-48 w-full"
                              />
                              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                                {index + 1}/{selectedReport.reportImages?.length ? selectedReport.reportImages.length : 0}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Reported By</p>
                      <p className="text-gray-900">{selectedReport.reportedBy.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Reason</p>
                      <p className="text-gray-900">{selectedReport.reason}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Description</p>
                      <p className="text-gray-900">
                        {selectedReport.description || 'No additional details provided'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Reported On</p>
                      <p className="text-gray-900">
                        {format(new Date(selectedReport.createdAt), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            selectedReport.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            selectedReport.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}
                      >
                        {selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Admin Response Section */}
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold text-lg mb-3">Admin Response</h3>
                {selectedReport.status !== 'pending' && selectedReport.adminReply?.message ? (
                  <div className={`p-3 rounded-md ${
                    selectedReport.status === 'resolved' ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {selectedReport.status === 'resolved' ? 'Resolution note:' : 'Rejection reason:'}
                    </p>
                    <p className="text-gray-900">{selectedReport.adminReply?.message}</p>
                    {selectedReport.adminReply.repliedAt && (
                      <p className="text-xs text-gray-500 mt-2">
                        {selectedReport.status === 'resolved' ? 'Resolved' : 'Rejected'} on {format(new Date(selectedReport.adminReply.repliedAt), 'MMM dd, yyyy HH:mm')}
                      </p>
                    )}
                  </div>
                ) : 
                  <p className="text-gray-500">No response from admin yet.</p>
                }

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
                

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
                                src={item.images[0]}
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

                {activeTab === 'settings' && (
                   <div className="p-6">
    <h3 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h3>
    
    <div className="space-y-8">
      {/* Role Switching Section */}
   <div className="border-b pb-6">
  <h3 className="text-lg font-medium text-gray-900 mb-4">Account Type</h3>
  <div className="max-w-md space-y-2">
    <p className="text-gray-600 text-sm">
      You're currently a {user?.role === 'seller' ? 'Seller' : 'User'}. 
      {user?.role === 'user' ? ' Switch to seller account to start selling.' : ' Switch back to user account.'}
    </p>
    
    <div className="flex items-center gap-4 mt-4">


      {user?.role === 'seller' && (
        <button
          onClick={() => handleRoleChange('user')}
          className="px-6 py-2.5 rounded-lg cursor-pointer flex items-center gap-2 bg-[#088178] text-white hover:bg-[#076b64] transition-colors shadow-md hover:shadow-lg"
        >
          <FaUser /> Become User
        </button>
      )}
      
      {/* Show Become Seller button only if user is user */}
      {user?.role === 'user' && (
        <button
          onClick={() => handleRoleChange('seller')}
          className="px-6 py-2.5 rounded-lg flex cursor-pointer items-center gap-2 bg-[#088178] text-white hover:bg-[#076b64] transition-colors shadow-md hover:shadow-lg"
        >
          <FaStore /> Become Seller
        </button>
      )}
    </div>
    
    {user?.role === 'seller' && (
      <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
        <FaInfoCircle /> Seller account gives you access to list and manage products.
      </p>
    )}
  </div>
</div>
                      <div className="border-b pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                        <div className="max-w-md space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="text-gray-400" />
                              </div>
                              <input
                                type={showPassword ? "text" : "password"}
                                onChange={(e) => (
                                  setChangePassword((prev) => ({
                                    ...prev,
                                    currentPassword: e.target.value
                                  })),
                                  setPasswordError('')
                                )}
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none transition"
                                placeholder="••••••••"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                              >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                              </button>
                            </div>
                            {passwordError && <p className="text-orange-600 font-semibold">{passwordError}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="text-gray-400" />
                              </div>
                              <input
                                type={showPassword ? "text" : "password"}
                                onChange={(e) =>
                                  setChangePassword((prev) => ({
                                    ...prev,
                                    newPassword: e.target.value
                                  }))
                                }
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none transition"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                              >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="text-gray-400" />
                              </div>
                              <input
                                type={showPassword ? "text" : "password"}
                                onChange={(e) =>
                                  setChangePassword((prev) => ({
                                    ...prev,
                                    confirmPassword: e.target.value
                                  }))
                                }
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none transition"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                              >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                              </button>
                            </div>
                            {
                              changePassword?.newPassword !== changePassword?.confirmPassword && 
                              <p className="text-orange-600 font-semibold">Your password is miss match</p>
                            }
                          </div>
                          <button 
                            onClick={handlePasswordChange} 
                            disabled={changePassword?.newPassword !== changePassword?.confirmPassword}
                            className={`mt-2 px-6 py-2 ${
                              changePassword?.newPassword !== changePassword?.confirmPassword ? 
                              'bg-gray-500 cursor-not-allowed' : 
                              'bg-[#088178] cursor-pointer'
                            } text-white rounded-lg`}
                          >
                            Update Password
                          </button>
                        </div>
                      </div>
                      
                            {/*  Handle User subscribetion belo */}
                            <SubscribeHandler></SubscribeHandler>

{/* Profile Delete method and Modal  below  */}
                     <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Account</h3>
        <p className="text-gray-600 mb-4">This will permanently delete your account and all associated data.</p>
        <button 
          onClick={() => setIsOpen(true)}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <FaTrashAlt /> Delete My Account
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900/10 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-start gap-4 mb-4">
              <div className="mt-1 text-red-500">
                <FaExclamationTriangle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Delete Your Account?</h3>
                <p className="text-gray-600 mt-1">This action cannot be undone.</p>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <p className="text-gray-700">
                To confirm, please type <span className="font-bold">DELETE</span> in the box below:
              </p>
              
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value.toUpperCase())}
                placeholder="Type DELETE to confirm"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                autoFocus
              />

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setConfirmationText('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isProfileDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleProfileDelete}
                  disabled={confirmationText !== 'DELETE' || isProfileDeleting}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    confirmationText === 'DELETE'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-red-300 cursor-not-allowed text-white'
                  } transition-colors`}
                >
                  {isProfileDeleting ? (
                    'Deleting...'
                  ) : (
                    <>
                      <FaTrashAlt /> Confirm Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default ProfileClient;