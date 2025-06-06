import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@trycourier/courier-react",
    "@trycourier/courier-ui-core",
    "@trycourier/courier-ui-inbox"
  ],
};

export default nextConfig;
