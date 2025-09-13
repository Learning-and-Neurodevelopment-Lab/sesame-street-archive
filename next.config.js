const createNextIntlPlugin = require('next-intl/plugin');
const withMDX = require('@next/mdx')();

const withNextIntl = createNextIntlPlugin();

// @ts-check
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  
  
  // Image configuration for Amplify
  images: {
        // Disable image optimization during build if causing issues
    unoptimized: true,

    // Use remotePatterns instead of domains (recommended approach)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'amplify-d1sw11bqfb0mo6-ma-sesamestreetimagesbucket-dxflqmasf9ji.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      // Add pattern for any S3 bucket in case bucket name changes
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Optional: Add these for better performance
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Amplify-specific optimizations
  output: 'standalone', // Recommended for Amplify SSR
  
  // Optional: Enable experimental features that work well with Amplify
 
  // Enable if you're using App Router and want better performance
  serverExternalPackages: ['aws-amplify'],


  // Optional: Configure headers for better security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Optional: Configure redirects if needed
  async redirects() {
    return [
      // Add any redirects you need
    ];
  },
};

module.exports = withMDX(withNextIntl(nextConfig));
