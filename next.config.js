const createNextIntlPlugin = require('next-intl/plugin');
const withMDX = require('@next/mdx')();

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  
  // Image configuration for Amplify
  images: {
    // Disable image optimization completely
    unoptimized: true,
    // Disable blur placeholders which can cause Sharp issues
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Use remotePatterns instead of domains
    remotePatterns: [
      // Add your remote patterns here
    ],
  },
  
  // Webpack configuration to handle Sharp issues
  webpack: (config, { isServer, dev }) => {
    // Disable webpack cache in Amplify build environment
    if (process.env.AWS_BRANCH && !dev) {
      config.cache = false;
    }
    
    // Handle Sharp module issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    nextRuntime: 'nodejs'

    // Exclude problematic modules from client bundle
    config.externals = config.externals || [];
    config.externals.push({
      sharp: 'commonjs sharp',
      canvas: 'commonjs canvas',
    });
    
    return config;
  },
  

  
  // Output configuration for Amplify
  output: 'standalone',
  
 
};

// Apply plugins in the correct order
module.exports = withNextIntl(withMDX(nextConfig));
