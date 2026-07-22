import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      { source: '/privacidad', destination: '/faq#privacidad', permanent: true },
      { source: '/terminos', destination: '/faq#terminos', permanent: true },
      { source: '/términos', destination: '/faq#terminos', permanent: true },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
