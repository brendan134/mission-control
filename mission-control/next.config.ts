import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['attachments-handheld-pcs-radar.trycloudflare.com', 'trycloudflare.com', 'mc.brendanrogers.au'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
