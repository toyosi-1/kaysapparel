import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "kaysapparel.com",
      },
    ],
    unoptimized: true, // Required for static export
  },
  output: 'export', // Required for Netlify static hosting
  trailingSlash: true,
  distDir: 'out',
  // Disable strict mode for production build
  reactStrictMode: false,
  // Enable compression
  compress: true,
  // Environment variables for build time
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
