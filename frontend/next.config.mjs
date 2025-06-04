/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';
const nextConfig = {};

export default withPWA({
  ...nextConfig,
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
});

