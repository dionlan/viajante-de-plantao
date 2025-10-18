/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true
  },
  // Remover headers desnecessários que conflitam com Vercel
  experimental: {
    serverExternalPackages: [],
  },
  // Configuração para otimização no Vercel
  compress: true,
  poweredByHeader: false,
  // Configuração de redirecionamentos se necessário
  async redirects() {
    return [];
  },
  // Configuração de rewrites se necessário
  async rewrites() {
    return [];
  }
}

module.exports = nextConfig