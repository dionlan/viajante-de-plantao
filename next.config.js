/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações essenciais
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Headers para CORS
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-Requested-With",
          },
        ],
      },
    ];
  },

  // Configuração do body parser
  experimental: {
    serverComponentsExternalPackages: [],
  },

  // Otimizações
  poweredByHeader: false,
  compress: true,
};

module.exports = nextConfig;
