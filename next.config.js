/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Force webpack to ignore Synology metadata folders without overwriting default ignores
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        ...(Array.isArray(config.watchOptions?.ignored) ? config.watchOptions.ignored : []),
        '**/@eaDir/**',
      ],
    };
    return config;
  },
  // Explicitly treat these as server-side only to prevent client-side bundling issues
  serverExternalPackages: ['pg', '@prisma/client'],
  experimental: {
    // In Next 15 Stable, allowedDevOrigins is usually placed inside experimental
    allowedDevOrigins: [
      '100.109.201.120',
      '100.109.201.120:3001',
      'izozash.ddns.net',
      'izozash.ddns.net:3001',
      'localhost:3001',
      '127.0.0.1:3001'
    ],
    serverActions: {
      allowedOrigins: [
        '100.109.201.120',
        '100.109.201.120:3001',
        'izozash.ddns.net',
        'izozash.ddns.net:3001',
        'localhost',
        'localhost:3001'
      ]
    }
  },
};

export default nextConfig;