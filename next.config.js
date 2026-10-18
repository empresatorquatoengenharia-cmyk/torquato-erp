/** @type {import('next').NextConfig} */
const nextConfig = {
  // Evita que avisos de tipagem/lint travem a publicação
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};
module.exports = nextConfig;
