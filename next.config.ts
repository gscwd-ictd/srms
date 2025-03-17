import env from '@srms/utils/env';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
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
