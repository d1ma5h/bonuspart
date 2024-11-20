const nextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300, // Delay rebuilding after the first change
      };
    }
    return config;
  },
  reactStrictMode: true
};

module.exports = nextConfig;
