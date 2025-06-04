// /** @type {import('next').NextConfig} */
// import withPWA from 'next-pwa';
// const nextConfig = {};

// export default withPWA({
//   ...nextConfig,
//   pwa: {
//     dest: 'public',
//     register: true,
//     skipWaiting: true,
//   },
// });
/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // since you're using /src/app
  },
};

export default withPWA({
  ...nextConfig,
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development', // optional: disables PWA in dev mode
  },
});

