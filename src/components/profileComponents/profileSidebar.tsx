import React from 'react'
import { FaCog, FaFlag, FaHeart, FaShoppingBag, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useLogoutMutation } from '@/src/redux/features/Auth/authApi';
import { useRouter } from 'next/navigation';
import { removeToken } from '@/src/utils/localStorageManagement';

function ProfileSidebar({orders,reports,wishlist,activeTab,setActiveTab}:any) {
      const router = useRouter();
    
      const [logout]=useLogoutMutation()
    
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
    

  return (
    <div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-8">
              <nav className="space-y-1 p-4">
                {[
                  { id: 'overview', icon: FaUser, label: 'Overview', count: null },
                  { id: 'orders', icon: FaShoppingBag, label: 'My Orders', count: orders?.length || 1 }, 
                  { id: 'reports', icon: FaFlag, label: 'My Reports', count: reports?.meta?.total || 0 },

                  { id: 'wishlist', icon: FaHeart, label: 'Wishlist', count: wishlist.length },
                  // { id: 'addresses', icon: FaMapMarkerAlt, label: 'Addresses', count: addresses.length },
                  { id: 'settings', icon: FaCog, label: 'Settings', count: null },
                ]?.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 5 }}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full cursor-pointer flex items-center justify-between px-4 py-3 text-left rounded-lg transition-colors ${activeTab === item.id ? 'bg-[#088178] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <div className="flex items-center gap-3 ">
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

    </div>
  )
}

export default ProfileSidebar