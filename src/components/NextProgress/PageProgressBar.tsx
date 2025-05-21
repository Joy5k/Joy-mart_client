'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const PageProgressBar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Custom NProgress configuration
    NProgress.configure({
      minimum: 0.1,
      showSpinner: false,
      trickleSpeed: 200,
      parent: '#progress-bar-container'
    });

    const startLoading = () => {
      setIsLoading(true);
      setProgress(10);
      NProgress.start();
      
      // Simulate progress (replace with actual loading events if possible)
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);

      return interval;
    };

    const stopLoading = () => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
        NProgress.done();
      }, 300);
    };

    const interval = startLoading();

    // Stop when navigation completes
    const timer = setTimeout(stopLoading, 2000); // Adjust timeout as needed

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
      stopLoading();
    };
  }, [pathname, searchParams]);

  return (
    <div id="progress-bar-container" className="fixed top-0 left-0 right-0 z-50">
      {isLoading && (
        <div 
          className="h-1 bg-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      )}
    </div>
  );
};

export default PageProgressBar;