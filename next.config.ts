import type { NextConfig } from "next";
import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: 'standalone',
  turbopack: {
    root: path.resolve(__dirname),
  },
  compress: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co', // Untuk foto dari Supabase Storage
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig;
