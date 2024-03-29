/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    WEBSOCKET_URL: process.env.WEBSOCKET_URL,
    WEBSOCKET_PORT: process.env.WEBSOCKET_PORT,
  },
};

module.exports = nextConfig;
