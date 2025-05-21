'use client';

import { Chart as ChartJS, registerables } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(...registerables);

interface ChartProps {
  type: 'bar' | 'pie';
}

export default function Chart({ type }: ChartProps) {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [65, 59, 80, 81, 56, 55],
      backgroundColor: [
          'rgba(8, 129, 120, 0.7)',     // #088178 with 70% opacity
          'rgba(8, 129, 120, 0.6)',     // Slightly lighter
          'rgba(8, 129, 120, 0.5)',     // Even lighter
          'rgba(200, 250, 247, 0.7)',   // #c8faf7 with 70% opacity
          'rgba(200, 250, 247, 0.5)',   // Lighter
          'rgba(200, 250, 247, 0.3)',   // Lightest
        ],
        borderColor: [
          'rgba(8, 129, 120, 1)',      // Solid #088178
          'rgba(8, 129, 120, 0.9)',
          'rgba(8, 129, 120, 0.8)',
          'rgba(200, 250, 247, 1)',    // Solid #c8faf7
          'rgba(200, 250, 247, 0.8)',
          'rgba(200, 250, 247, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <>
      {type === 'bar' ? (
        <Bar data={data} options={options} />
      ) : (
        <Pie data={data} options={options} />
      )}
    </>
  );
}