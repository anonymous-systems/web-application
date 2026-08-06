/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      // Story and project covers are served from Firebase Storage.
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' }
    ]
  }
}

export default nextConfig
