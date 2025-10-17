/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true // Adicione esta linha para o Vercel
  },
  trailingSlash: true, // Adicione para melhor compatibilidade
  compress: true, // Habilita compressão
  poweredByHeader: false, // Remove header X-Powered-By
  // Adicione configurações de otimização
  experimental: {
    optimizeCss: true,
  },
  // Configurações de compilação
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // Remove console.log em produção
  },
}

module.exports = nextConfig