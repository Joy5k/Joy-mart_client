import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 
    images: {
      formats: ['image/webp'],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    },
    compiler: {
      styledComponents: true,
          reactRemoveProperties: process.env.NODE_ENV === 'production'

    },
    experimental: {
    },
    reactStrictMode: true, 
  eslint: {
    ignoreDuringBuilds: false
  },
  
};

export default nextConfig;
