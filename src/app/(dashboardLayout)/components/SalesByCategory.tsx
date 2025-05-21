// components/analytics/SalesByCategory.tsx
'use client';

import { Chart as ChartJS, registerables } from 'chart.js';
import { Pie } from 'react-chartjs-2';
ChartJS.register(...registerables);

export default function SalesByCategory({ timeRange }: { timeRange: string }) {
  const data = {
    labels: ['Electronics', 'Clothing', 'Home Goods', 'Books', 'Other'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          '#088178',
          '#0aa18f',
          '#c8faf7',
          '#9de5e0',
          '#e0f5f3'
        ],
        borderWidth: 0,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
  };

  return <Pie data={data} options={options} />;
}