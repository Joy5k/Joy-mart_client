'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiEdit2, FiTrash2, FiPlus, FiSearch, FiRefreshCw } from 'react-icons/fi';
import { Role as ImportedRole, Role } from '@/src/types';

import {  useGetAllUsersQuery, useUpdateUserMutation } from '@/src/redux/features/userManagement/usersApi';
import { toast } from 'react-toastify';

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
  const { data: apiResponse, isLoading, refetch } = useGetAllUsersQuery();
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ApiUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [userUpdatedInfo, setUserUpdateInfo] = useState<TUserUpdate>({
    id: '',
    role: 'user',
    status: 'in-progress'
  });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null);

  const [updateUser] = useUpdateUserMutation();

  // Form states
  const [newUser, setNewUser] = useState({
    email: '',
    role: 'user' as Role,
    status: 'in-progress' as UserStatus
  });

  // Set users from API response
  useEffect(() => {
    if (apiResponse?.success && apiResponse.data?.result) {
      setUsers(apiResponse.data.result);
      setFilteredUsers(apiResponse.data.result);
    }
  }, [apiResponse]);

  // Apply filters
  useEffect(() => {
    let result = users;
    
    if (searchTerm) {
      result = result.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }
    
    setFilteredUsers(result);
  }, [searchTerm, roleFilter, statusFilter, users]);

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

  // CRUD Operations
  const handleAddUser = async () => {
    try {
      setIsAddModalOpen(false);
      setNewUser({
        email: '',
        role: 'user',
        status: 'in-progress'
      });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleDeleteUser = async () => {
    if (!currentUser) return;
    
    try {
      setIsDeleteModalOpen(false);
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

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium leading-6 text-gray-900">User Management</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage all system users and their permissions
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center rounded-md border border-transparent bg-[#088178] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#07756e] focus:outline-none focus:ring-2 focus:ring-[#088178] focus:ring-offset-2"
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
                placeholder="Email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as Role | 'all')}
            >
              <option value="all">All Roles</option>
              <option value="superAdmin">Super Admin</option>
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as UserStatus | 'all')}
            >
              <option value="all">All Statuses</option>
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
                      User
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
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#c8faf7] text-[#088178]">
                              <FiUser className="h-5 w-5" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{user.email.split('@')[0]}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex space-x-2 justify-end">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-[#088178] hover:text-[#07756e] cursor-pointer"
                          >
                            <FiEdit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setCurrentUser(user);
                              setIsDeleteModalOpen(true);
                            }}
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
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
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Add New User</h3>
                  <div className="mt-2 space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#088178] focus:ring-[#088178] sm:text-sm"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 text-left">
                          Role
                        </label>
                        <select
                          id="role"
                          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#088178] focus:outline-none focus:ring-[#088178] sm:text-sm"
                          value={newUser.role}
                          onChange={(e) => setNewUser({...newUser, role: e.target.value as Role})}
                        >
                          <option value="superAdmin">Super Admin</option>
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 text-left">
                          Status
                        </label>
                        <select
                          id="status"
                          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#088178] focus:outline-none focus:ring-[#088178] sm:text-sm"
                          value={newUser.status}
                          onChange={(e) => setNewUser({...newUser, status: e.target.value as UserStatus})}
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
                  onClick={handleAddUser}
                >
                  Add User
                </button>
                <button
                  type="button"
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
                          <option value="superAdmin">Super Admin</option>
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
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
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
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm"
                  onClick={handleDeleteUser}
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