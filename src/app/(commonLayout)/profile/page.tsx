'use client'

import Loader from '@/src/hooks/loader';
import { useGetPaymentHistoryQuery } from '@/src/redux/features/payment/paymentApi';
import { useGetMyReportedProductsQuery } from '@/src/redux/features/reportProduct/reportProductApi';
import { useAppSelector } from '@/src/redux/hooks';
import { RootState } from '@/src/redux/store';
import dynamic from 'next/dynamic';

const ProfileClient = dynamic(
  () => import('@/src/components/ProfileClient/ProfileClient'),
);


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
      const { items } = useAppSelector((state: RootState) => state.wishlist as { items: any[] });
      const {data,isLoading}=useGetPaymentHistoryQuery({})
      const recentOrders=data?.data ? data.data : [];
    
  if (isLoading) {
    return <Loader></Loader>
  }
  return (
    <ProfileClient 
      orders={recentOrders}
      wishlist={items}
      addresses={addresses}
    />
  );
}
