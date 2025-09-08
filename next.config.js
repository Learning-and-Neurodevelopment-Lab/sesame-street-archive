const createNextIntlPlugin = require('next-intl/plugin');
const withMDX = require('@next/mdx')();

const withNextIntl = createNextIntlPlugin();

// @ts-check
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    domains: ['amplify-d1sw11bqfb0mo6-ma-sesamestreetimagesbucket-dxflqmasf9ji.s3.us-east-1.amazonaws.com'],
  },
};

module.exports = withMDX(withNextIntl(nextConfig));
 