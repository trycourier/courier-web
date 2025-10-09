import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import visualizer from "rollup-plugin-visualizer";
import packageJson from "./package.json";

// Get the root directory path of the current file
const root = dirname(fileURLToPath(import.meta.url));

// Helper function to resolve paths relative to node_modules
const fromRoot = (p: string) => resolve(root, "../../node_modules", p);

export default defineConfig({
  // Define environment variables and constants for production build
  define: {
    "__PACKAGE_VERSION__": JSON.stringify(packageJson.version),
    "process.env.NODE_ENV": '"production"',
    "__DEV__": "false",
    "import.meta.env.DEV": "false",
  },

  // Configure module resolution and aliases
  resolve: {
    alias: {
      // Ensure we use the same React instance from node_modules
      react: fromRoot("react"),
      "react-dom": fromRoot("react-dom"),
    },
    // Prevent duplicate React instances
    dedupe: ["react", "react-dom"],
  },

  // Library build configuration
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      name: "CourierReact17",
      // Output format: .mjs for ES modules, .cjs for CommonJS
      fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      // External dependencies that should not be bundled
      external: [
        // Explicitly exclude Courier dependencies _except_ courier-react-components,
        // which is not distributed independently.
        /^@trycourier\/courier-js/,
        /^@trycourier\/courier-ui-core/,
        /^@trycourier\/courier-ui-inbox/,
        /^@trycourier\/courier-ui-toast/,
        "@trycourier/courier-react-components",
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
      ],
      output: {
        // Global variable names for external dependencies
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-dom/client": "ReactDOMClient",
          "@trycourier/courier-js": "CourierJS",
          "@trycourier/courier-ui-inbox": "CourierInboxUI",
          "@trycourier/courier-ui-toast": "CourierToastUI",
          "@trycourier/courier-react-components": "CourierReactComponents",
        },
      },
    },
    sourcemap: true,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: false
      }
    }
  },

  // Build plugins configuration
  plugins: [
    // React plugin for JSX support
    react(),
    // TypeScript declaration files generation
    dts({
      insertTypesEntry: true,
      include: ["src/**/*.tsx", "src/**/*.ts"],
      exclude: ["src/__tests__/**"],
      aliasesExclude: ["react", "react-dom"],
    }) as PluginOption,
    // Bundle size visualization
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
