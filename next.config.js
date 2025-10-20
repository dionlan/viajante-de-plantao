/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove a configuração experimental problemática
  // experimental: {
  //   serverActions: true,
  // },

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

  // Configuração para evitar problemas de API routes
  api: {
    bodyParser: {
      sizeLimit: "2mb",
    },
    responseLimit: false,
  },

  // Melhor tratamento de erros
  poweredByHeader: false,
  compress: true,

  // Otimizações
  swcMinify: true,
};

module.exports = nextConfig;
