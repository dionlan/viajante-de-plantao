/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["images.unsplash.com", "your-cdn.com"],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    serverActions: true, // opcional, use com cuidado
  },
  // opcionalmente ajustar padrão de cache/headers via middleware
};

module.exports = nextConfig;
