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
      {
        protocol: 'https',
        hostname: 'pub-4abcf05f9b7e4ab3895346ec31935c1d.r2.dev',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_URL?.replace('https://', '').replace('http://', ''),
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
