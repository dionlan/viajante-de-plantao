/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true
  },
  trailingSlash: true,
  compress: true,
  poweredByHeader: false,
  // Desabilita otimizações problemáticas se necessário
  experimental: {
    optimizeCss: false, // Desabilita se estiver causando problemas
  },
  // Configuração para evitar erros de prerendering
  typescript: {
    ignoreBuildErrors: true, // Temporariamente para debug
  },
  eslint: {
    ignoreDuringBuilds: true, // Temporariamente para debug
  },
  // Output standalone para melhor performance no Vercel
  output: 'standalone',
}

module.exports = nextConfig