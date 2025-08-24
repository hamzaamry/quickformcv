/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Only use standalone when building for Docker
  ...(process.env.NODE_ENV === 'production' && process.env.DOCKER_BUILD && {
    output: 'standalone'
  }),
};

export default nextConfig;