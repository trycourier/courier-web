import { defineConfig, type PluginOption } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";
import visualizer from "rollup-plugin-visualizer";
import packageJson from "./package.json";

export default defineConfig({
  // Define environment variables and constants for production build
  define: {
    "__PACKAGE_VERSION__": JSON.stringify(packageJson.version),
    "process.env.NODE_ENV": '"production"',
    "__DEV__": "false",
    "import.meta.env.DEV": "false",
  },

  // Library build configuration
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "CourierVue",
      // Output format: .mjs for ES modules, .cjs for CommonJS
      fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      // External dependencies that should not be bundled
      external: [
        /^@trycourier\/courier-js/,
        /^@trycourier\/courier-ui-core/,
        /^@trycourier\/courier-ui-inbox/,
        /^@trycourier\/courier-ui-toast/,
        /^@trycourier\/courier-ui-preferences/,
        "vue",
      ],
      output: {
        // Global variable names for external dependencies
        globals: {
          vue: "Vue",
          "@trycourier/courier-js": "CourierJS",
          "@trycourier/courier-ui-inbox": "CourierInboxUI",
          "@trycourier/courier-ui-toast": "CourierToastUI",
          "@trycourier/courier-ui-preferences": "CourierPreferencesUI",
        },
      },
    },
    sourcemap: true,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: false,
      },
    },
  },

  // Build plugins configuration
  plugins: [
    // Vue plugin (supports SFCs and provides Vue-aware transforms)
    vue(),
    // TypeScript declaration files generation
    dts({
      insertTypesEntry: true,
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts"],
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
