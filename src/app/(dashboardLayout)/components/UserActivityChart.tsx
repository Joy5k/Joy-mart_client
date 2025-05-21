// components/analytics/UserActivityChart.tsx
'use client';

import { Chart as ChartJS, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(...registerables);

export default function UserActivityChart({ timeRange }: { timeRange: string }) {
  const data = {
    labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'New Users',
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 20),
        backgroundColor: '#088178',
      },
      {
        label: 'Active Users',
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 200) + 50),
        backgroundColor: '#c8faf7',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 250, 247, 0.2)'
        }
      },
      x: {
        grid: {
          color: 'rgba(200, 250, 247, 0.2)'
        }
      }
    }
  };

  return <Bar data={data} options={options} />;
}