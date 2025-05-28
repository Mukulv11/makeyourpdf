/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'vercel.app'],
  },
  env: {
    CUSTOM_KEY: 'makeyourpdf',
  },
}

module.exports = nextConfig 