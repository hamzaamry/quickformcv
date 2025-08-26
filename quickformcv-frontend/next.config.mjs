/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  ...(process.env.NODE_ENV === 'production' && process.env.DOCKER_BUILD && {
    output: 'standalone',
  }),
};

export default nextConfig;