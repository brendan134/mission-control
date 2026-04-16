import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: "/data/.openclaw/workspace/mission-control" },
  allowedDevOrigins: ['attachments-handheld-pcs-radar.trycloudflare.com', 'trycloudflare.com', 'mc.brendanrogers.au'],
};

export default nextConfig;
