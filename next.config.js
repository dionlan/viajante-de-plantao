/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração explícita para o diretório de origem
  distDir: ".next",

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

  // Otimizações
  poweredByHeader: false,
  compress: true,

  // Logs para debug
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

module.exports = nextConfig;
