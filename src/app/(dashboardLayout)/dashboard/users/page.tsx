'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiEdit2, FiTrash2, FiPlus, FiSearch, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';
import { IFormData, Role } from '@/src/types';

import {  useCreateUserByAdminMutation, useGetAllUsersQuery, useUpdateUserMutation,useDeleteUserBySuperAdminMutation, useRestoredUserMutation } from '@/src/redux/features/userManagement/usersApi';
import { toast } from 'react-toastify';
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUser } from 'react-icons/fa';
import { getUserRole } from '@/src/utils/localStorageManagement';
import { useRouter } from 'next/navigation';
import Loader from '@/src/hooks/loader';

export type UserStatus = 'in-progress' | 'active' | 'blocked';

export type TUserUpdate = {
  id: string;
  role: Role;
  status: UserStatus;
}

interface ApiUser {
  _id: string;
  email: string;
  needsPasswordChange: boolean;
  role: Role;
  status: UserStatus;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  passwordChangedAt?: string;
}

export default function UserManagementPage() {
  const router=useRouter()
  const userRole = getUserRole();

if (userRole !== 'superAdmin' && userRole !== 'admin') {
    router.push('/dashboard');
    return null;
}

  const [userUpdatedInfo, setUserUpdateInfo] = useState<TUserUpdate>({
    id: '',
    role: 'user',
    status: 'in-progress'
  });
  const [searchQuery,setSearchQuery]=useState({
    firstName:'',
    lastName:'',
    role:'',
    email:'',
    status:''
  })
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null);
 const [formData, setFormData] = useState<IFormData>({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  
});
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { data: apiResponse, isLoading, refetch } = useGetAllUsersQuery(searchQuery);

  const [createUserByAdminMutation] = useCreateUserByAdminMutation();
  const [deleteUserMutation]=useDeleteUserBySuperAdminMutation()
  const [restoreUserMutation,{isLoading:restoring}]=useRestoredUserMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await createUserByAdminMutation(formData).unwrap();
      localStorage.setItem('token', res.data.accessToken);
      if(res.success){
        toast.success("Created User successfully",{
          position:"bottom-center",
          autoClose: 2000,
        })
        setIsAddModalOpen(true)     
        document.cookie= `authToken=${res.data.accessToken}`;

      }
    } catch (err:any) {
        console.log(err.data.errorSources[0].message)
      setError(err?.data?.errorSources[0]?.message||err.data?.message || 'Registration failed. Please try again.');
    } 
  };
  const [updateUser] = useUpdateUserMutation();


  // Role color mapping
  const getRoleColor = (role: Role) => {
    switch(role) {
      case 'superAdmin': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Status color mapping
  const getStatusColor = (status: UserStatus) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteUser = async (email:string) => {
    if (!currentUser) return;
    
    try {
      const res = await deleteUserMutation({ email }).unwrap();
      if(res.success){
        toast.info(`${email} is deleted successfully`,{
          autoClose:1000,
          position:'top-center'
        })
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditUser = (user: ApiUser) => {
    setCurrentUser(user);
    setUserUpdateInfo({
      id: user._id,
      role: user.role as Role,
      status: user.status
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!currentUser) return;
    
    try {
      const res = await updateUser({ 
        email:currentUser.email,
        data: {
          role: userUpdatedInfo.role,
          status: userUpdatedInfo.status
        }
      }).unwrap();
      
      if (res.success) {
        toast.success('User updated successfully', {
          position: 'bottom-center'
        });
        refetch();
        setIsEditModalOpen(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update user', {
        position: 'bottom-center'
      });
      console.error('Error updating user:', error);
    }
  };
const handleRestoreUser = async (email: string) => {
  try {
    // Call your API endpoint to restore the user
    const res = await restoreUserMutation({ email }).unwrap();
    if (res.success) {
      toast.success('User restored successfully');
      refetch(); // Refresh the user list
    }
  } catch (error) {
    toast.error('Failed to restore user');
    console.error('Restore error:', error);
  }
};

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row lg:flex-row items-center justify-between mt-2">
          <div>
            <h2 className="text-lg font-medium leading-6 text-gray-900">User Management</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage all system users and their permissions
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex mt-2 items-center rounded-md border border-transparent w-full md:w-fit lg:w-fit bg-[#088178] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#07756e] focus:outline-none focus:ring-2 focus:ring-[#088178] focus:ring-offset-2"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Add User
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-6 rounded-lg bg-white p-4 shadow"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                className="focus:ring-[#088178] focus:border-[#088178] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search by user email,first-name or last name "
                value={searchQuery.email}
                onChange={(e) => setSearchQuery({ ...searchQuery, email: e.target.value })}
              />
              
            </div>
           
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#088178] focus:outline-none focus:ring-[#088178] sm:text-sm"
              value={searchQuery.role}
              onChange={(e) => setSearchQuery({ ...searchQuery, role: e.target.value as Role | '' })}
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

        <div>
  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
    Status
  </label>
  <select
    id="status"
    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#088178] focus:outline-none focus:ring-[#088178] sm:text-sm"
    value={searchQuery.status || ""}
    onChange={(e) => setSearchQuery({ ...searchQuery, status: e.target.value as UserStatus | '' })}
  >
    <option value="">All Statuses</option>
    <option value="active">Active</option>
    <option value="in-progress">In Progress</option>
    <option value="blocked">Blocked</option>
  </select>
</div>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg"
      >
        <div className="bg-white">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <FiRefreshCw className="animate-spin h-8 w-8 text-[#088178]" />
            </div>
          ) : (
            <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-gray-300">
  <thead className="bg-gray-50">
    <tr>
      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
        Name
      </th>
      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
        Email
      </th>
      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
        Role
      </th>
      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
        Status
      </th>
      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
        Created At
      </th>
      {userRole === 'superAdmin' && (
        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
          Deleted
        </th>
      )}
      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
        <span className="sr-only">Actions</span>
      </th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200 bg-white">
    {apiResponse?.data?.result.map((user: ApiUser) => (
      <tr key={user._id}>
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
          <div className="flex items-center">
            <div className="h-10 w-10 flex-shrink-0">
              <div className={`flex items-center justify-center h-10 w-10 rounded-full ${
                user.isDeleted ? 'bg-gray-200 text-gray-500' : 'bg-[#c8faf7] text-[#088178]'
              }`}>
                <FiUser className="h-5 w-5" />
              </div>
            </div>
            <div className="ml-4">
              <div className={`font-medium ${
                user.isDeleted ? 'text-gray-400 line-through' : 'text-gray-900'
              }`}>
                {user.email.split('@')[0]}
              </div>
            </div>
          </div>
        </td>
        <td className={`whitespace-nowrap px-3 py-4 text-sm ${
          user.isDeleted ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {user.email}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.isDeleted ? 'bg-gray-100 text-gray-500' : getRoleColor(user.role)
          }`}>
            {user.role}
          </span>
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.isDeleted ? 'bg-gray-100 text-gray-500' : getStatusColor(user.status)
          }`}>
            {user.isDeleted ? 'Deleted' : user.status}
          </span>
        </td>
        <td className={`whitespace-nowrap px-3 py-4 text-sm ${
          user.isDeleted ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {new Date(user.createdAt).toLocaleDateString()}
        </td>
        {userRole === 'superAdmin' && (
          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
           {restoring ? <Loader></Loader> : 
           <>
           {
             user.isDeleted ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                <FiTrash2 className="mr-1 h-3 w-3" />
                Deleted
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <FiCheckCircle className="mr-1 h-3 w-3" />
                Active
              </span>
            )}
            </>
           }
          
          
           
          </td>
        )}
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <div className="flex space-x-2 justify-end">
            {user.isDeleted ? (
              <button
                onClick={() => handleRestoreUser(user.email)}
                className="text-green-600 hover:text-green-900"
                title="Restore user"
              >
                <FiRefreshCw className="h-5 w-5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleEditUser(user)}
                  className={`text-[#088178] hover:text-[#07756e] ${
                    user.role === 'superAdmin' ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                  disabled={user.role === 'superAdmin'}
                >
                  <FiEdit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    setCurrentUser(user);
                    setIsDeleteModalOpen(true);
                  }}
                  className={`text-red-600 hover:text-red-900 ${
                    user.role === 'superAdmin' ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                  disabled={user.role === 'superAdmin'}
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
            </div>
          )}
        </div>
      </motion.div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto  bg-gray-900/10 backdrop-blur-sm">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-start sm:mt-5">
                  <h3 className="leading-6 text-xl font-bold text-center text-[#088178]">Add New User</h3>
                   <form onSubmit={handleSubmit}>
                              {error && (
                                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                  {error}
                                </div>
                              )}
                  
                              <div className="mb-4">
                                <label htmlFor="name" className="block text-gray-700 mb-2">First Name</label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="text-gray-400" />
                                  </div>
                                  <input
                                    id="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none transition"
                                    placeholder="John Doe"
                                    required
                                  />
                                </div>
                              </div>
                  
                              <div className="mb-4">
                                <label htmlFor="lastName" className="block text-gray-700 mb-2">Last Name</label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="text-gray-400" />
                                  </div>
                                  <input
                                    id="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none transition"
                                    placeholder="John Doe"
                                    required
                                  />
                                </div>
                              </div>
                  
                              <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="text-gray-400" />
                                  </div>
                                  <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none transition"
                                    placeholder="your@email.com"
                                    required
                                  />
                                </div>
                              </div>
                  
                              <div className="mb-4">
                                <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                  </div>
                                  <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none transition"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
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
                  
                           
                  
                            
                            </form>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#088178] text-base font-medium text-white hover:bg-[#07756e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#088178] sm:col-start-2 sm:text-sm"
                  onClick={handleSubmit}
                >
                  Add User
                </button>
                <button
                  type="submit"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#088178] sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && currentUser && (
        <div className="fixed z-100 overflow-y-auto inset-0 bg-gray-900/10 backdrop-blur-sm">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 ">
          
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  <FiEdit2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Edit User</h3>
                  <div className="mt-2 space-y-4">
                    <div>
                      <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 text-left">
                        Email
                      </label>
                      <input
                        type="email"
                        id="edit-email"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#088178] focus:ring-[#088178] sm:text-sm"
                        value={currentUser.email}
                        disabled
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700 text-left">
                          Role
                        </label>
                       {currentUser.role==='superAdmin' ? <p className="text-[#088178]">Super Admin</p>:(
                         <select
                          id="edit-role"
                          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#088178] focus:outline-none focus:ring-[#088178] sm:text-sm"
                          value={userUpdatedInfo.role}
                          onChange={(e) => setUserUpdateInfo({
                            ...userUpdatedInfo,
                            role: e.target.value as Role
                          })}
                        >
                          <option value="user">User</option>
                          <option value="seller">Seller</option>
                          <option value="admin">Admin</option>
                        </select>
                       )}
                      </div>
                      <div>
                        <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 text-left">
                          Status
                        </label>
                        <select
                          id="edit-status"
                          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#088178] focus:outline-none focus:ring-[#088178] sm:text-sm"
                          value={userUpdatedInfo.status}
                          onChange={(e) => setUserUpdateInfo({
                            ...userUpdatedInfo,
                            status: e.target.value as UserStatus
                          })}
                        >
                          <option value="active">Active</option>
                          <option value="in-progress">In Progress</option>
                          <option value="blocked">Blocked</option>
                        </select>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#088178] text-base font-medium text-white hover:bg-[#07756e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#088178] sm:col-start-2 sm:text-sm"
                  onClick={handleUpdateUser}
                >
                  Update User
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#088178] sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentUser && (
        <div className="fixed z-100 overflow-y-auto inset-0 bg-gray-900/10 backdrop-blur-sm">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <FiTrash2 className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Delete User</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete {currentUser.email}? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className={`${currentUser.role==='superAdmin' ? 'cursor-not-allowed' : 'cursor-pointer'}   w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm `}
                  onClick={()=>handleDeleteUser(currentUser.email)}
                  disabled={currentUser.role==='superAdmin'}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#088178] sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}