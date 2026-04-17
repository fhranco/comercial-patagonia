import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tienda.boostpatagonia.online',
      },
    ],
  },
};

export default nextConfig;
