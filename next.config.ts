import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'productos.comercialpatagonia.cl',
      },
      {
        protocol: 'https',
        hostname: 'tienda.comercialpatagonia.cl',
      },
    ],
  },
};

export default nextConfig;
