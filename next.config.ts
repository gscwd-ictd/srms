import env from "@srms/utils/env";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // devIndicators: false,
  reactStrictMode: false, // Turn this off temporarily to test
  assetPrefix: "/docs",
  images: {
    domains: ["172.20.110.84", "172.20.10.59", "172.20.110.60"],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete
    // even if your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: "/docs",
        destination: env.NEXT_PUBLIC_APP_DOCS_URL,
      },
    ];
  },
};

export default nextConfig;
