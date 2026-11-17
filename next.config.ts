import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Solo `next dev`: permite abrir el dev server por un quick tunnel de cloudflared, necesario
  // para probar webhooks de pago (MODO/MercadoPago) y sus callbacks contra el entorno local.
  allowedDevOrigins: ['*.trycloudflare.com'],
  async redirects() {
    return [
      { source: '/términos', destination: '/terminos', permanent: true },
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
