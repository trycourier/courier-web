// Builds the self-contained hosted-preferences embed bundle: a single minified
// IIFE with React + all @trycourier/* deps vendored inline. The backend inlines
// `dist/hosted-preferences.js` into its hosted-preferences HTML; it reads
// `window.courierConfig` and mounts the page into `#courier-preferences`.
//
// Run: `npm run build:embed`
import * as esbuild from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Dedupe React: `@trycourier/courier-react` ships its own nested copy, so without
// this esbuild bundles two React instances and every hook throws (#321). Pin all
// React imports (app entry + the courier packages) to one copy.
const require = createRequire(import.meta.url);
const reactDir = path.dirname(require.resolve("react/package.json"));
const reactDomDir = path.dirname(require.resolve("react-dom/package.json"));
const reactAlias = {
  react: reactDir,
  "react-dom": reactDomDir,
  "react/jsx-runtime": path.join(reactDir, "jsx-runtime"),
  "react/jsx-dev-runtime": path.join(reactDir, "jsx-dev-runtime"),
  "react-dom/client": path.join(reactDomDir, "client"),
};

const result = await esbuild.build({
  entryPoints: [path.join(root, "embed/main.tsx")],
  bundle: true,
  format: "iife",
  platform: "browser",
  target: ["es2020"],
  jsx: "automatic",
  minify: true,
  // React reads NODE_ENV; without this the dev build (with warnings) is bundled.
  define: { "process.env.NODE_ENV": '"production"' },
  alias: reactAlias,
  // Resolves the "@/..." path alias from tsconfig (baseUrl + paths).
  tsconfig: path.join(root, "tsconfig.json"),
  outfile: path.join(root, "dist/hosted-preferences.js"),
  metafile: true,
  logLevel: "info",
});

const out = path.join(root, "dist/hosted-preferences.js");
const bytes = result.metafile
  ? Object.values(result.metafile.outputs).reduce((n, o) => n + o.bytes, 0)
  : 0;
console.log(`\nBuilt ${out} (${(bytes / 1024).toFixed(0)} KB)`);
