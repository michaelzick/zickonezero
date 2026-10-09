/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

module.exports = nextConfig;
