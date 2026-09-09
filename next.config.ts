import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.178.192', '192.168.178.192:3000', '127.0.0.1:3000', 'localhost:3000'],
};

export default nextConfig;
