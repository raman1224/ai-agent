import type { NextConfig } from "next";
const GATEWAY_URL = process.env.GATEWAY_URL || "http://localhost:8000";

const nextConfig: NextConfig = {


  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${GATEWAY_URL}/api/:path*` },
    ];
  },

};

export default nextConfig;
