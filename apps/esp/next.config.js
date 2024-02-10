const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('next').NextConfig}
 **/

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  reactStrictMode: false,
  poweredByHeader: false,
  swcMinify: true,
  productionBrowserSourceMaps: true,
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  experimental: {
    // https://nextjs.org/docs/app/api-reference/next-config-js/optimizePackageImports
    // optimizePackageImports:[]
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE ? true : false,
});

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withBundleAnalyzer,
];

module.exports = composePlugins(...plugins)(nextConfig);
