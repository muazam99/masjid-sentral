/** @type {import('next').NextConfig} */
const nextConfig = {
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
