import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Served at the project root — no basePath (unlike the designer's /inbox-demo). */
  turbopack: {
    root: path.join(__dirname, ".."),
  },
};

export default nextConfig;
