
'use client'; // Add this since we're using Framer Motion

import { motion } from 'framer-motion';
import StatsCard from '../components/StatsCards';
import ChartContainer from '../components/ChartContainer';
import RecentActivity from '../components/RecentlyActivity';

export default function DashboardPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-lg font-medium leading-6 text-gray-900">Overview</h2>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatsCard 
          title="Total Revenue" 
          value="$45,231" 
          change="+12%" 
          icon="dollar" 
          trend="up" 
        />
        <StatsCard 
          title="New Users" 
          value="2,345" 
          change="+5.4%" 
          icon="users" 
          trend="up" 
        />
        <StatsCard 
          title="Pending Orders" 
          value="124" 
          change="-2.8%" 
          icon="orders" 
          trend="down" 
        />
        <StatsCard 
          title="Active Projects" 
          value="18" 
          change="+3.2%" 
          icon="projects" 
          trend="up" 
        />
      </motion.div>

      {/* Charts and Recent Activity */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3"
      >
        <div className="lg:col-span-2">
          <ChartContainer />
        </div>
        <div>
          <RecentActivity />
        </div>
      </motion.div>
    </div>
  );
}