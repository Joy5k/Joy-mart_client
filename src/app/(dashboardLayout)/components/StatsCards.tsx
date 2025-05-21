import { motion } from 'framer-motion';
import { FiArrowUp, FiArrowDown, FiDollarSign, FiUsers, FiShoppingBag, FiBriefcase } from 'react-icons/fi';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: 'dollar' | 'users' | 'orders' | 'projects';
  trend: 'up' | 'down';
}

const iconMap = {
  dollar: FiDollarSign,
  users: FiUsers,
  orders: FiShoppingBag,
  projects: FiBriefcase,
};

export default function StatsCard({ title, value, change, icon, trend }: StatsCardProps) {
  const Icon = iconMap[icon];
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
    >
      <div className="flex items-center">
        <div className="rounded-md bg-[#c8faf7] p-3">
          <Icon className="h-6 w-6 text-[#088178]" aria-hidden="true" />
        </div>
        <div className="ml-4">
          <dt className="truncate text-sm font-medium text-gray-500">{title}</dt>
          <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
        </div>
      </div>
      <div className={`mt-4 flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {trend === 'up' ? (
          <FiArrowUp className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
        ) : (
          <FiArrowDown className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
        )}
        <span className="ml-1">{change} from last month</span>
      </div>
    </motion.div>
  );
}