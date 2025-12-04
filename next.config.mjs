/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

export default nextConfig;
