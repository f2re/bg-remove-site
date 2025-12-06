/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output для Docker
  output: 'standalone',

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'telegram.org',
      },
    ],
  },

  reactStrictMode: true,

  // Оптимизация для production
  compress: true,

  // Отключение телеметрии
  productionBrowserSourceMaps: false,
};

export default nextConfig;
