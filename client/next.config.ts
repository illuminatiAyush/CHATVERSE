import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip ESLint during production builds on Vercel to avoid
  // deployment failures due to tooling config issues.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
