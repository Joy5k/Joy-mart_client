'use client'

import Loader from '@/src/hooks/loader';
import { useGetPaymentHistoryQuery } from '@/src/redux/features/payment/paymentApi';
import dynamic from 'next/dynamic';

const ProfileClient = dynamic(
  () => import('@/src/components/ProfileClient/ProfileClient'),
);


 const wishlist=[
    {
      name: "Smart Watch",
      price: 199.99
    },
    {
      name: "Bluetooth Speaker",
      price: 79.99
    },
    {
      name: "Laptop Backpack",
      price: 49.99
    }
  ]
  const addresses= [
    {
      type: "Home",
      address: "123 Main St, New York, NY 10001",
      default: true
    },
    {
      type: "Work",
      address: "456 Business Ave, New York, NY 10005",
      default: false
    }
  ]

export default function ProfilePage() {
      const {data,isLoading}=useGetPaymentHistoryQuery({})
      const recentOrders=data?.data ? data.data : [];
      console.log(recentOrders)
  if (isLoading) {
    return <Loader></Loader>
  }
  return (
    <ProfileClient 
      orders={recentOrders}
      wishlist={wishlist}
      addresses={addresses}
    />
  );
}
