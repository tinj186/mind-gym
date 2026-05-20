/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Database Safety Boundary (Isolate Prisma/Postgres on the server side)
  serverExternalPackages: ['pg', '@prisma/client'],

  // 2. Local Network & Tailscale Security Passports
  allowedDevOrigins: [
    '100.109.201.120',
    '100.109.201.120:3001',
    'izozash.ddns.net',
    'izozash.ddns.net:3001',
    'localhost:3001',
    '127.0.0.1:3001'
  ],
  experimental: {
    serverActions: {
      allowedOrigins: ['100.109.201.120:3001', 'izozash.ddns.net:3001']
    }
  },

  // 3. Synology NAS & Docker CPU Optimization Overrides
  webpack: (config, { dev }) => {
    config.watchOptions = {
      ...config.watchOptions,
      poll: dev ? 1000 : false, // Check changes every 1s on NAS during dev; disables overhead in production
      ignored: [
        ...(Array.isArray(config.watchOptions?.ignored) ? config.watchOptions.ignored : []),
        '**/@eaDir/**',
        '**/@eaDir/**/*'
      ],
    };
    return config;
  },

  // 4. Reduce Background Noise/Telemetry for Network Storage
  devIndicators: {
    appIsrStatus: false,
  },
};

export default nextConfig;