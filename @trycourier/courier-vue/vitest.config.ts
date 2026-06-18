import { fileURLToPath } from "node:url";
import { realpathSync } from "node:fs";
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

// `Courier.shared` (in courier-js) is a process-wide singleton that the
// courier-ui-* datastores also read. In vitest the courier-ui-* dist bundles get
// loaded outside vite's module graph and resolve their own copy of courier-js,
// so the singleton splits — the composable signs into one instance while the
// datastore reads another ("[Datastore] User is not signed in"). Force every
// @trycourier import, from any importer, to one canonical (realpath-normalized)
// source file so the whole graph shares a single courier-js instance.
const PKGS = [
  "courier-js",
  "courier-ui-core",
  "courier-ui-inbox",
  "courier-ui-toast",
  "courier-ui-preferences",
] as const;

const canonical: Record<string, string> = {};
for (const pkg of PKGS) {
  canonical[`@trycourier/${pkg}`] = realpathSync(
    fileURLToPath(new URL(`../${pkg}/src/index.ts`, import.meta.url))
  );
}

export default defineConfig({
  plugins: [
    vue(),
    {
      name: "courier-single-instance",
      enforce: "pre",
      resolveId(id) {
        return canonical[id] ?? null;
      },
    },
  ],
  define: {
    "__PACKAGE_VERSION__": JSON.stringify("dev-version"),
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["src/test-setup.ts"],
    include: ["src/**/*.test.ts"],
    server: {
      deps: {
        inline: true,
      },
    },
  },
});
