import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@trycourier/courier-react-components",
    "@trycourier/courier-react",
    "@trycourier/courier-ui-core",
    "@trycourier/courier-ui-inbox",
    "@trycourier/courier-js"
  ],
};

export default nextConfig;
