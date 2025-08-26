/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },

  ...(process.env.NODE_ENV === 'production' && process.env.DOCKER_BUILD && {
    output: 'standalone',
  }),

  googleAnalytics: {
    measurementId: 'G-HQ39WTN17K',
  },
};

export default nextConfig;