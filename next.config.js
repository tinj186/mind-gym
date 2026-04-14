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
  // Ensure the server doesn't try to resolve these as routes
  serverExternalPackages: [],
};

export default nextConfig;