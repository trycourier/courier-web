import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/inbox-demo",
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "connect-src 'self' https://inbox.courier.com https://api.courier.com https://realtime.courier.io wss://realtime.courier.io https://*.courier.com wss://*.courier.com https://static.hsappstatic.net",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://static.hsappstatic.net",
              "style-src 'self' 'unsafe-inline' https://static.hsappstatic.net",
              "img-src 'self' data: https:",
              "font-src 'self' data: https:",
              "frame-src 'self' https://www.googletagmanager.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
