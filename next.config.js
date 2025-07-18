/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['api.openai.com'],
    unoptimized: true,
  },
}

module.exports = nextConfig