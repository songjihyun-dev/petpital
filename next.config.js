/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "i.pinimg.com",
      "upload.wikimedia.org",
    ],
  },
};

module.exports = nextConfig;
