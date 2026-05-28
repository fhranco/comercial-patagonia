import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // 🏔️ DOMINIOS OFICIALES (HTTPS)
      {
        protocol: 'https',
        hostname: 'productos.comercialpatagonia.cl',
      },
      {
        protocol: 'https',
        hostname: 'tienda.comercialpatagonia.cl',
      },
      // 🏔️ DOMINIOS OFICIALES (HTTP - contingencia si WP no tiene SSL configurado internamente)
      {
        protocol: 'http',
        hostname: 'productos.comercialpatagonia.cl',
      },
      {
        protocol: 'http',
        hostname: 'tienda.comercialpatagonia.cl',
      },
      // 🏔️ SERVIDORES DE HOSTINGER (HTTPS & HTTP - para desarrollo/contingencia y assets sin redirección de base de datos)
      {
        protocol: 'https',
        hostname: 'darkorange-bat-658298.hostingersite.com',
      },
      {
        protocol: 'http',
        hostname: 'darkorange-bat-658298.hostingersite.com',
      },
      {
        protocol: 'https',
        hostname: '**.hostingersite.com',
      },
      {
        protocol: 'http',
        hostname: '**.hostingersite.com',
      },
    ],
  },
};

export default nextConfig;
