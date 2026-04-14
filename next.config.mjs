/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Lock in the Tailscale IP for development
  allowedDevOrigins: ['100.109.201.120', '100.109.201.120:3001'],

  webpack: (config, { dev }) => {
    if (dev) {
      // 2. Optimization for Synology/Docker CPU
      config.watchOptions = {
        poll: 1000, // Check for changes every second (essential for networked drives)
        aggregateTimeout: 300, 
        ignored: ['**/node_modules', '**/@eaDir/**', '**/@eaDir/**/*'],
      };
      
      config.resolve.alias = {
        ...config.resolve.alias,
        '@eaDir': false,
      };
    }
    return config;
  },

  // 3. Fix the "Zombie State" by explicitly defining the Dev Server
  devIndicators: {
    appIsrStatus: false, // Reduces background noise for the NAS
  },
};

export default nextConfig;