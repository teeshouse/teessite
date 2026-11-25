/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" }
    ]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Stops other sites from framing ours (clickjacking on the login pages).
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Signed-in pages and the login/set-password pages must never be cached.
        source: "/mentorship/:area(portal|admin)/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
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
      {
        source: "/mentorship/portal/goals",
        destination: "/mentorship/portal/tasks",
        permanent: true,
      },
      {
        source: "/volunteer",
        destination: "/opportunities",
        permanent: true,
      },
    ]
  },
}
export default nextConfig