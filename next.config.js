/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Database Safety Boundary (Isolate Prisma/Postgres on the server side)
  serverExternalPackages: ['pg', '@prisma/client'],
};

export default nextConfig;