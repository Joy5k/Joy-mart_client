import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 
    images: {
      formats: ['image/webp'],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
          remotePatterns: [
            new URL('https://i.ibb.co/**'),
            new URL('https://i.ibb.co.com/**'),
          ],

    },
    compiler: {
      styledComponents: true,
          reactRemoveProperties: process.env.NODE_ENV === 'production'

    },
  
    reactStrictMode: true, 
  eslint: {
    ignoreDuringBuilds: false
  },
   experimental: {
    taint: true,
  },
  // For Turbopack issues
  webpack: (config) => {
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      url: false 
    }
    return config
  }
  
};

export default nextConfig;
