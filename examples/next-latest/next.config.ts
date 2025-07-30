import type { NextConfig } from "next";
import path from "path";

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
