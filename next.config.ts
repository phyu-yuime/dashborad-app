import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias['@components'] = path.join(__dirname, 'components');
    config.resolve.alias['@styles'] = path.join(__dirname, 'styles');
    return config;
  }
};

export default nextConfig;
