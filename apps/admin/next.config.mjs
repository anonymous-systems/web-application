/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  experimental: {
    // Allow larger file-manager uploads through server actions (default is 1 MB).
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
}

export default nextConfig
