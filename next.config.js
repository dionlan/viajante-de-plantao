/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['impers', 'patchright', 'patchright-core'],
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,

  // ✅ Permitir chamadas às rotas internas da API
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
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
};

module.exports = nextConfig;
