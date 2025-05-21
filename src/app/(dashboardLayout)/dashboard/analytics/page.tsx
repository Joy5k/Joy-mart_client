// app/(dashboardLayout)/dashboard/analytics/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiDollarSign, 
  FiUsers, 
  FiShoppingCart,
  FiPieChart,
  FiBarChart2,
  FiCalendar
} from 'react-icons/fi';
import dynamic from 'next/dynamic';

// Dynamically import charts to avoid SSR issues
const RevenueChart = dynamic(() => import('@/src/app/(dashboardLayout)/components/RevenuChart'), { 
  ssr: false,
  loading: () => <div className="h-80 bg-gray-100 rounded-lg animate-pulse" />
});

const UserActivityChart = dynamic(() => import('@/src/app/(dashboardLayout)/components/UserActivityChart'), { 
  ssr: false,
  loading: () => <div className="h-80 bg-gray-100 rounded-lg animate-pulse" />
});

const SalesByCategory = dynamic(() => import('@/src/app/(dashboardLayout)/components/SalesByCategory'), {
  ssr: false,
  loading: () => <div className="h-80 bg-gray-100 rounded-lg animate-pulse" />
});

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '12m'>('30d');

  // Sample data - replace with your actual data fetching
  const metrics = [
    {
      title: "Total Revenue",
      value: "$24,780",
      change: "+12.5%",
      icon: <FiDollarSign className="h-6 w-6 text-[#088178]" />,
      trend: 'up'
    },
    {
      title: "Active Users",
      value: "1,842",
      change: "+8.2%",
      icon: <FiUsers className="h-6 w-6 text-[#088178]" />,
      trend: 'up'
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "+0.4%",
      icon: <FiTrendingUp className="h-6 w-6 text-[#088178]" />,
      trend: 'up'
    },
    {
      title: "Avg. Order Value",
      value: "$89.54",
      change: "-2.1%",
      icon: <FiShoppingCart className="h-6 w-6 text-[#088178]" />,
      trend: 'down'
    }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-lg font-medium leading-6 text-gray-900">Analytics Dashboard</h2>
            <p className="mt-1 text-sm text-gray-500">
              Track and analyze your business performance
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
            <FiCalendar className="h-5 w-5 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="rounded-md border-gray-300 py-1 pl-2 pr-8 text-base focus:border-[#088178] focus:outline-none focus:ring-[#088178] sm:text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="12m">Last 12 months</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Metrics Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
      >
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md bg-[#c8faf7] p-3">
                  {metric.icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {metric.title}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {metric.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className={`mt-4 flex items-center text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {metric.trend === 'up' ? (
                  <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="flex-shrink-0 h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="ml-1">{metric.change} from last period</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="space-y-8"
      >
        {/* Revenue Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FiBarChart2 className="mr-2 h-5 w-5 text-[#088178]" />
              Revenue Overview
            </h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm rounded-md bg-[#088178] text-white">
                Revenue
              </button>
              <button className="px-3 py-1 text-sm rounded-md border border-gray-300 text-gray-700">
                Orders
              </button>
            </div>
          </div>
          <div className="h-80">
            <RevenueChart timeRange={timeRange} />
          </div>
        </div>

        {/* User Activity Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FiUsers className="mr-2 h-5 w-5 text-[#088178]" />
              User Activity
            </h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm rounded-md bg-[#088178] text-white">
                New Users
              </button>
              <button className="px-3 py-1 text-sm rounded-md border border-gray-300 text-gray-700">
                Active Users
              </button>
            </div>
          </div>
          <div className="h-80">
            <UserActivityChart timeRange={timeRange} />
          </div>
        </div>

        {/* Sales by Category */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <FiPieChart className="mr-2 h-5 w-5 text-[#088178]" />
                Sales by Category
              </h3>
            </div>
            <div className="h-80">
              <SalesByCategory timeRange={timeRange} />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <FiTrendingUp className="mr-2 h-5 w-5 text-[#088178]" />
                Top Performing Products
              </h3>
            </div>
            <div className="space-y-6">
              {[
                { name: "Premium Widget", sales: 1243, change: "+12%" },
                { name: "Deluxe Gadget", sales: 982, change: "+8%" },
                { name: "Standard Item", sales: 756, change: "+5%" },
                { name: "Basic Product", sales: 432, change: "-2%" },
                { name: "Limited Edition", sales: 321, change: "+15%" },
              ].map((product, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#c8faf7] flex items-center justify-center text-[#088178]">
                    {index + 1}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} sales</p>
                    </div>
                    <div className="mt-1">
                      <div className="flex items-center text-sm text-green-600">
                        <svg className="flex-shrink-0 mr-1.5 h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 8 8">
                          <path d="M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z" />
                        </svg>
                        {product.change}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}