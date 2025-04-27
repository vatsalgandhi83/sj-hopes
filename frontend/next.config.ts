// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true, // Or whatever other configurations you have
  images: {
    remotePatterns: [
      {
        protocol: 'https', // Protocol of the image URL
        hostname: 'via.placeholder.com', // The hostname to allow
        port: '', // Usually empty unless a specific port is needed
        pathname: '/**', // Allow any path on this host
      },
      // Add other hostnames here if needed
      // {
      //   protocol: 'https',
      //   hostname: 'another-image-host.com',
      //   port: '',
      //   pathname: '/**',
      // },
    ],
  },
  // ... any other configurations you might have
};

export default nextConfig; // Use export default