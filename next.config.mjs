/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude modules that are only meant to be used on the server side
      config.externals.push("bcrypt");

      // Handle any potential issues with @mapbox/node-pre-gyp
      config.module.rules.push({
        test: /\.html$/,
        use: "null-loader", // Ignore HTML files to prevent bundling issues
      });
    }
    return config;
  },
};

export default nextConfig;
