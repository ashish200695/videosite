/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.dailymotion.com',
      },
      {
        protocol: 'https',
        hostname: '**.dm-static.net',
      },
    ],
  },
};

module.exports = nextConfig;