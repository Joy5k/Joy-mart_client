import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import '@/src/app/globals.css';
import { MobileSidebar } from './components/sidebar/MobileSidebar';
import { DesktopSidebar } from './components/sidebar/DesktopSidebar';
import { TopNavigation } from './components/navigation/TopNavigation';

const inter = Inter({ subsets: ['latin'] });

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
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