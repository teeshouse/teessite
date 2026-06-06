/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" }
    ]
  },
  async redirects() {
    return [
      {
        source: "/programs",
        destination: "/community-impact",
        permanent: true,
      },
      {
        source: "/services",
        destination: "/fundraising-offerings",
        permanent: true,
      },
    ]
  },
}
export default nextConfig