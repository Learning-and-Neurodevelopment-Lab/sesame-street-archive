import withMDX from '@next/mdx';
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    domains: ['amplify-d1sw11bqfb0mo6-ma-sesamestreetimagesbucket-dxflqmasf9ji.s3.us-east-1.amazonaws.com'],
  },
  experimental: {
    useLightningcss: false,
  },
};

const withPlugins = (config: NextConfig) => withMDX()(withNextIntl(config));

export default withPlugins(nextConfig);
 