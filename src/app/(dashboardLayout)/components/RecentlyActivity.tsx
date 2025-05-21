import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiClock } from 'react-icons/fi';

const activity = [
  {
    id: 1,
    type: 'completed',
    title: 'Project Alpha',
    description: 'Final review completed',
    time: '2h ago',
    icon: FiCheckCircle,
    iconColor: 'text-green-500',
  },
  {
    id: 2,
    type: 'warning',
    title: 'Server Maintenance',
    description: 'Scheduled for tomorrow',
    time: '4h ago',
    icon: FiAlertCircle,
    iconColor: 'text-yellow-500',
  },
  {
    id: 3,
    type: 'pending',
    title: 'User Feedback',
    description: '15 new responses',
    time: '1d ago',
    icon: FiClock,
    iconColor: 'text-blue-500',
  },
  {
    id: 4,
    type: 'completed',
    title: 'Database Backup',
    description: 'Backup completed successfully',
    time: '1d ago',
    icon: FiCheckCircle,
    iconColor: 'text-green-500',
  },
];

export default function RecentActivity() {
  return (
    <motion.div 
      className="rounded-lg bg-white p-6 shadow"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
      <div className="mt-6 flow-root">
        <ul className="-mb-8">
          {activity.map((item, itemIdx) => (
            <motion.li 
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * itemIdx }}
            >
              <div className="relative pb-8">
                {itemIdx !== activity.length - 1 ? (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${item.iconColor} bg-opacity-20`}
                    >
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-800">
                        {item.title}{' '}
                        <span className="font-medium text-gray-500">
                          {item.description}
                        </span>
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time dateTime={item.time}>{item.time}</time>
                    </div>
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}