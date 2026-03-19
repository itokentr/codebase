import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: {
    position: 'bottom-right',
  },
  experimental: {
    authInterrupts: true,
  },
  reactCompiler: true,
  typedRoutes: true,
};

export default nextConfig;
