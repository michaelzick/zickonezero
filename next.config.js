const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

/** @type {(phase: string) => import('next').NextConfig} */
const nextConfig = (phase) => ({
  // `next dev` compiles into its own folder, so a `next build` (or `npm run check`)
  // run alongside it can't delete or replace the modules the dev server is serving.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
  reactStrictMode: true,
  // Only the version string is inlined, so every analytics event names its release.
  env: {
    NEXT_PUBLIC_RELEASE_VERSION: require('./package.json').version,
  },
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  compiler: {
    styledComponents: true,
  },
});

module.exports = nextConfig;
