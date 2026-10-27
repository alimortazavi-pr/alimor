import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactCompiler: true,
  // The server has no native sharp binary and the site ships no raster images that need resizing
  images: { unoptimized: true },
  outputFileTracingExcludes: { "*": ["**/@img/**", "**/sharp/**"] },
  // The previous alimor.ir (English) is indexed under these paths; keep their ranking by pointing them home
  async redirects() {
    return [
      { source: "/contact", destination: "/en#contact", permanent: true },
      {
        source: "/:page(about|resume|projects|portfolios|blog)",
        destination: "/en",
        permanent: true,
      },
      { source: "/:page(portfolios|projects)/:slug*", destination: "/en", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
