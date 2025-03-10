/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'masjid.islam.gov.my',
        port: '',
        pathname: '/apps/images/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
