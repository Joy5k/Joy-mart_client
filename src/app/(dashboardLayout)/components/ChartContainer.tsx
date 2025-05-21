// components/dashboard/ChartContainer.tsx
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiBarChart2, FiPieChart } from 'react-icons/fi';
import dynamic from 'next/dynamic';

// Define the props for the Chart component
type ChartProps = {
  type: 'bar' | 'pie';
};

// Dynamically import the chart component for better performance
const Chart = dynamic<ChartProps>(() => import('./Chart'), { 
  ssr: false,
  loading: () => <div className="h-80 w-full bg-gray-100 animate-pulse rounded-lg" />
});

export default function ChartContainer() {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  return (
    <motion.div 
      className="rounded-lg bg-white p-6 shadow"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Performance</h3>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setChartType('bar')}
            className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm ${chartType === 'bar' ? 'bg-[#c8faf7] text-[#088178]' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <FiBarChart2 className="mr-1.5 h-4 w-4" />
            Bar
          </button>
          <button
            type="button"
            onClick={() => setChartType('pie')}
            className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm ${chartType === 'pie' ? 'bg-[#c8faf7] text-[#088178]' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <FiPieChart className="mr-1.5 h-4 w-4" />
            Pie
          </button>
        </div>
      </div>
      <div className="mt-6 h-80">
        <Chart type={chartType} />
      </div>
    </motion.div>
  );
}