const createNextIntlPlugin = require('next-intl/plugin');

const withMDX = require('@next/mdx')();

// const withMDX = require('@next/mdx')({
//   extension: /\.mdx?$/,
//   options: {
//     // Optional: map front-matter to `export const metadata`
//     remarkPlugins: [
//       require('remark-frontmatter'),
//       [require('remark-mdx-frontmatter'), { name: 'metadata' }],
//     ],
//   },
// });

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
   // Explicitly disable experimental CSS optimizations
  experimental: {
    optimizeCss: false, // Disable CSS optimization that uses LightningCSS
  },
  // Webpack configuration to handle Sharp issues
  webpack: (config, { isServer, dev }) => {
        // Disable LightningCSS and use standard CSS processing
    if (config.optimization && config.optimization.minimizer) {
      config.optimization.minimizer = config.optimization.minimizer.filter(
        (minimizer) => {
          const name = minimizer.constructor.name;
          return !name.includes('LightningCss') && !name.includes('CssMinimizerPlugin');
        }
      );
    }
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

module.exports = withNextIntl(withMDX(nextConfig));
