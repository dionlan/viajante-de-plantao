/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
    unoptimized: true,
  },
  // Configurações de performance
  compress: true,
  poweredByHeader: false,
  // Otimizações para build
  experimental: {
    optimizeCss: true,
  },
  // Headers para API
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
  // Configuração para evitar warnings de runtime
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

module.exports = nextConfig;
