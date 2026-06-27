/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        'pino-pretty': false,
        lokijs: false,
        encoding: false,
        '@react-native-async-storage/async-storage': false,
      };
    }
    
    // Ignore optional dependencies that fail to resolve in browser environment using Next's passed webpack instance
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(pino-pretty|@react-native-async-storage\/async-storage)$/,
      })
    );

    return config;
  },
};

export default nextConfig;
