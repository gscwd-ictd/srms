import env from '@srms/utils/env';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: '/(.*)?', // Matches all pages
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
  devIndicators: false,
  assetPrefix: '/docs',
  async rewrites() {
    return [
      {
        source: '/docs',
        destination: env.NEXT_PUBLIC_APP_DOCS_URL,
      },
    ];
  },
};

export default nextConfig;
