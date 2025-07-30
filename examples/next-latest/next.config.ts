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
  // turbopack: {
  //   root: path.resolve(__dirname, "../../"),
  //   resolveAlias: {
  //     "@trycourier/courier-react-components": path.resolve(__dirname, "../../@trycourier/courier-react-components/src"),
  //     "@trycourier/courier-react": path.resolve(__dirname, "../../@trycourier/courier-react/src"),
  //     "@trycourier/courier-ui-core": path.resolve(__dirname, "../../@trycourier/courier-ui-core/src"),
  //     "@trycourier/courier-ui-inbox": path.resolve(__dirname, "../../@trycourier/courier-ui-inbox/src"),
  //     // "@trycourier/courier-js": path.resolve(__dirname, "../../@trycourier/courier-js/src"),
  //   }
  // }
};

export default nextConfig;
