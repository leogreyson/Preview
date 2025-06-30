import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
    ignoreDuringBuilds: true, // This will skip ESLint during builds
  },
  /* config options here */
  // Disable Next.js Dev Tools UI toggle
  devIndicators: false,
  
  // Configure headers for audio files to prevent downloading
  async headers() {
    return [
      {
        source: '/music/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'audio/mpeg',
          },
          {
            key: 'Content-Disposition',
            value: 'inline',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
