import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
    resolveAlias: {
      "@": path.resolve(__dirname),
    },
  },
};

export default nextConfig;
