/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.qrserver.com'], // Para generar códigos QR
  },
};

export default nextConfig;