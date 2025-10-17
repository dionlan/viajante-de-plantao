/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true
  },
  trailingSlash: true,
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizeCss: false, // Desabilita temporariamente
  },
  typescript: {
    ignoreBuildErrors: false, // Mude para false após correções
  },
  eslint: {
    ignoreDuringBuilds: false, // Mude para false após correções
  },
  output: 'standalone',
}

module.exports = nextConfig