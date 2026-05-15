'use client'

import { ReactNode, useEffect } from 'react';
import { Inter } from 'next/font/google';
import { MobileSidebar } from './components/sidebar/MobileSidebar';
import { DesktopSidebar } from './components/sidebar/DesktopSidebar';
import { TopNavigation } from './components/navigation/TopNavigation';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

const inter = Inter({ subsets: ['latin'] });

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for authToken in cookies or localStorage
    const authToken = Cookies.get('authToken') || localStorage.getItem('authToken');
    
    if (!authToken) {
      // Redirect to login with redirect parameter
      const redirectUrl = encodeURIComponent(pathname);
      router.push(`/login?redirect=${redirectUrl}`);
    }
  }, [pathname, router]);

  return (
    
        <div className="min-h-full">
          {/* Mobile sidebar */}
          <MobileSidebar />
          
          {/* Static sidebar for desktop */}
          <DesktopSidebar />
          
          <div className="flex flex-1 flex-col lg:pl-64">
            {/* Top navigation */}
            <TopNavigation />
            
            {/* Main content */}
            <main className="flex-1 pb-8">
              {children}
            </main>
          </div>
        </div>
     
  );
}