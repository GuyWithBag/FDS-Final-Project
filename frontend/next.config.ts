import type { NextConfig } from "next";

const nextConfig = {
  images: {
    domains: ["encrypted-tbn0.gstatic.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/api/:path*", // Proxy to backend
      },
    ];
  },
};
export default nextConfig;
