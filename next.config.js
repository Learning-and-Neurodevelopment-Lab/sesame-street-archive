const createNextIntlPlugin = require('next-intl/plugin');
const withMDX = require('@next/mdx')();

const withNextIntl = createNextIntlPlugin();

// @ts-check
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
};

module.exports = withMDX(withNextIntl(nextConfig));
 