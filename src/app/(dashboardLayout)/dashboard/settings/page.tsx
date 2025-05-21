// app/(dashboardLayout)/dashboard/settings/page.tsx
'use client';

import { motion } from 'framer-motion';
import { FiShield, FiUsers, FiDatabase, FiServer, FiKey, FiSettings } from 'react-icons/fi';

export default function SuperAdminSettingsPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-lg font-medium leading-6 text-gray-900">Super Admin Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          System-wide configuration and administration
        </p>
      </motion.div>

      <div className="mt-8 space-y-8">
        {/* User Management */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="overflow-hidden rounded-lg bg-white shadow"
        >
          <div className="border-b border-gray-200 bg-[#088178] px-4 py-5 sm:px-6">
            <h3 className="flex items-center text-lg font-medium leading-6 text-white">
              <FiUsers className="mr-2 h-5 w-5" />
              User Management
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="user-role" className="block text-sm font-medium text-gray-700">
                    Default User Role
                  </label>
                  <select
                    id="user-role"
                    name="user-role"
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#088178] focus:outline-none focus:ring-[#088178] sm:text-sm"
                  >
                    <option>Viewer</option>
                    <option>Editor</option>
                    <option>Admin</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="registration" className="block text-sm font-medium text-gray-700">
                    User Registration
                  </label>
                  <select
                    id="registration"
                    name="registration"
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#088178] focus:outline-none focus:ring-[#088178] sm:text-sm"
                  >
                    <option>Open (Anyone can register)</option>
                    <option>Invite Only</option>
                    <option>Closed (Admin creates users)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-transparent bg-[#088178] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#07756e] focus:outline-none focus:ring-2 focus:ring-[#088178] focus:ring-offset-2"
                >
                  Save User Settings
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* System Security */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="overflow-hidden rounded-lg bg-white shadow"
        >
          <div className="border-b border-gray-200 bg-[#088178] px-4 py-5 sm:px-6">
            <h3 className="flex items-center text-lg font-medium leading-6 text-white">
              <FiShield className="mr-2 h-5 w-5" />
              System Security
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="password-policy" className="block text-sm font-medium text-gray-700">
                    Password Policy
                  </label>
                  <select
                    id="password-policy"
                    name="password-policy"
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#088178] focus:outline-none focus:ring-[#088178] sm:text-sm"
                  >
                    <option>Basic (6 characters minimum)</option>
                    <option>Standard (8 characters, 1 number)</option>
                    <option>Strict (12 characters, mixed case, special characters)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="session-timeout" className="block text-sm font-medium text-gray-700">
                    Session Timeout
                  </label>
                  <select
                    id="session-timeout"
                    name="session-timeout"
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#088178] focus:outline-none focus:ring-[#088178] sm:text-sm"
                  >
                    <option>15 minutes</option>
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>8 hours</option>
                    <option>24 hours</option>
                  </select>
                </div>
              </div>

              <div className="relative flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="two-factor"
                    name="two-factor"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-[#088178] focus:ring-[#088178]"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="two-factor" className="font-medium text-gray-700">
                    Require Two-Factor Authentication for Admins
                  </label>
                  <p className="text-gray-500">All admin users will need to enable 2FA</p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-transparent bg-[#088178] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#07756e] focus:outline-none focus:ring-2 focus:ring-[#088178] focus:ring-offset-2"
                >
                  Update Security Settings
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Database Management */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="overflow-hidden rounded-lg bg-white shadow"
        >
          <div className="border-b border-gray-200 bg-[#088178] px-4 py-5 sm:px-6">
            <h3 className="flex items-center text-lg font-medium leading-6 text-white">
              <FiDatabase className="mr-2 h-5 w-5" />
              Database Management
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="backup-frequency" className="block text-sm font-medium text-gray-700">
                  Automatic Backup Frequency
                </label>
                <select
                  id="backup-frequency"
                  name="backup-frequency"
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#088178] focus:outline-none focus:ring-[#088178] sm:text-sm"
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Disabled</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="last-backup" className="block text-sm font-medium text-gray-700">
                    Last Backup
                  </label>
                  <input
                    type="text"
                    name="last-backup"
                    id="last-backup"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#088178] focus:ring-[#088178] sm:text-sm"
                    value="2023-06-15 03:00 UTC"
                    readOnly
                  />
                </div>

                <div>
                  <label htmlFor="next-backup" className="block text-sm font-medium text-gray-700">
                    Next Scheduled Backup
                  </label>
                  <input
                    type="text"
                    name="next-backup"
                    id="next-backup"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#088178] focus:ring-[#088178] sm:text-sm"
                    value="2023-06-16 03:00 UTC"
                    readOnly
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#088178] focus:ring-offset-2"
                >
                  Create Manual Backup
                </button>
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-transparent bg-[#088178] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#07756e] focus:outline-none focus:ring-2 focus:ring-[#088178] focus:ring-offset-2"
                >
                  Restore from Backup
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* System Configuration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="overflow-hidden rounded-lg bg-white shadow"
        >
          <div className="border-b border-gray-200 bg-[#088178] px-4 py-5 sm:px-6">
            <h3 className="flex items-center text-lg font-medium leading-6 text-white">
              <FiServer className="mr-2 h-5 w-5" />
              System Configuration
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="system-mode" className="block text-sm font-medium text-gray-700">
                  System Mode
                </label>
                <select
                  id="system-mode"
                  name="system-mode"
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#088178] focus:outline-none focus:ring-[#088178] sm:text-sm"
                >
                  <option>Production</option>
                  <option>Maintenance</option>
                  <option>Development</option>
                </select>
                <p className="mt-2 text-sm text-gray-500">
                  Maintenance mode will show a system notice to all users
                </p>
              </div>

              <div>
                <label htmlFor="api-access" className="block text-sm font-medium text-gray-700">
                  API Access Level
                </label>
                <select
                  id="api-access"
                  name="api-access"
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#088178] focus:outline-none focus:ring-[#088178] sm:text-sm"
                >
                  <option>Full Access</option>
                  <option>Read Only</option>
                  <option>Disabled</option>
                </select>
              </div>

              <div className="relative flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="audit-logging"
                    name="audit-logging"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-[#088178] focus:ring-[#088178]"
                    defaultChecked
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="audit-logging" className="font-medium text-gray-700">
                    Enable Audit Logging
                  </label>
                  <p className="text-gray-500">Record all administrative actions</p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-transparent bg-[#088178] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#07756e] focus:outline-none focus:ring-2 focus:ring-[#088178] focus:ring-offset-2"
                >
                  Save System Configuration
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dangerous Zone */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="overflow-hidden rounded-lg border border-red-300 bg-white shadow"
        >
          <div className="border-b border-red-300 bg-red-600 px-4 py-5 sm:px-6">
            <h3 className="flex items-center text-lg font-medium leading-6 text-white">
              <FiKey className="mr-2 h-5 w-5" />
              Dangerous Zone
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="purge-data" className="block text-sm font-medium text-gray-700">
                  Purge Inactive User Data
                </label>
                <select
                  id="purge-data"
                  name="purge-data"
                  className="mt-1 block w-full rounded-md border-red-300 py-2 pl-3 pr-10 text-base focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                >
                  <option>Select duration...</option>
                  <option>Purge inactive &gt; 1 year</option>
                  <option>Purge inactive &gt; 6 months</option>
                  <option>Purge inactive &gt; 3 months</option>
                </select>
                <p className="mt-2 text-sm text-red-600">
                  Warning: This action cannot be undone
                </p>
              </div>

              <div className="relative flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="confirm-purge"
                    name="confirm-purge"
                    type="checkbox"
                    className="h-4 w-4 rounded border-red-300 text-red-600 focus:ring-red-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="confirm-purge" className="font-medium text-gray-700">
                    I understand this will permanently delete user data
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Purge Data
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}