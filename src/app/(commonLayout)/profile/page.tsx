
'use client'; // ← Make this a Client Component if using dynamic

import dynamic from 'next/dynamic';

const ProfileClient = dynamic(
  () => import('@/src/components/ProfileClient/ProfileClient'),
  { ssr: false } // ← Disable SSR if needed
);

  const user= {
    name: "John Doe",
    email: "johndoe@example.com",
    joined: "Jan 2022"
  }
 const recentOrders= [
    {
      id: "ORD-1001",
      date: "Jan 1, 2022",
      total: 100.00,
      status: "Delivered",
      items: 1
    },
    {
      id: "ORD-1002",
      date: "Feb 1, 2022",
      total: 50.00,
      status: "Shipped",
      items: 2
    }
  ]
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
    
  return (
    <ProfileClient 
      user={user}
      orders={recentOrders}
      wishlist={wishlist}
      addresses={addresses}
    />
  );
}
