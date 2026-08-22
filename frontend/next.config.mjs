/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add any specific configurations here (e.g. image domains)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://127.0.0.1:3001/api/v1/:path*', // Proxy to Backend
      },
    ]
  }
};
export default nextConfig;
