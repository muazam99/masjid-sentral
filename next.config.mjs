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
      {
        protocol: 'https',
        hostname: 'pub-4abcf05f9b7e4ab3895346ec31935c1d.r2.dev',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
