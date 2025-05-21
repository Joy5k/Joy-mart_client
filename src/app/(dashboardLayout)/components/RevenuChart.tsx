// components/analytics/RevenueChart.tsx
'use client';

import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(...registerables);

export default function RevenueChart({ timeRange }: { timeRange: string }) {
  // Sample data - replace with your actual data
  const data = {
    labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'Revenue',
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 5000) + 1000),
        borderColor: '#088178',
        backgroundColor: 'rgba(8, 129, 120, 0.1)',
        tension: 0.4,
        fill: true
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
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 250, 247, 0.2)'
        },
        ticks: {
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(200, 250, 247, 0.2)'
        }
      }
    }
  };

  return <Line data={data} options={options} />;
}