/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['localhost', 'image.tmdb.org'], // Allow images from both localhost and TMDB
  },
};

export default nextConfig;
