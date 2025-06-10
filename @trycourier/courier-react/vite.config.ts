import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import visualizer from "rollup-plugin-visualizer";

const root = dirname(fileURLToPath(import.meta.url));
const fromRoot = (p: string) => resolve(root, "../../node_modules", p); // <-- workspace root

export default defineConfig({
  define: {
    "process.env.NODE_ENV": '"production"',
    "__DEV__": "false",
    "import.meta.env.DEV": "false",
  },

  resolve: {
    alias: {
      react: fromRoot("react"),            // always the same copy
      "react-dom": fromRoot("react-dom"),
    },
    dedupe: ["react", "react-dom"],
  },

  build: {
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      name: "CourierReact",
      fileName: (format) => `index.${format === "es" ? "mjs" : "js"}`,
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: [
        /^@trycourier\/.+/,   // any Courier package
        "react",
        "react-dom",
        "react-dom/client",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-dom/client": "ReactDOMClient",
          "@trycourier/courier-js": "CourierJS",
          "@trycourier/courier-ui-inbox": "CourierInboxUI",
        },
      },
    },
    sourcemap: true,
    minify: "terser",
  },

  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ["src/**/*.tsx"],
    }) as PluginOption,
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: "treemap",
      sourcemap: true,
      filename: "stats.html",
    }) as PluginOption,
  ],
});