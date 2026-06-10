// Builds the embed bundle and writes it into the backend as a base64 TS module
// the hosted-preferences lambda inlines. This is the "drop the bundle into the
// lambda" step: run it, then commit the generated file in the backend repo.
//
// Run: `npm run sync:backend` (optionally pass a backend path as the first arg).
//
// Base64 (not a raw template literal) so the 500 KB of minified JS — which
// contains backticks and `${...}` — embeds safely in a TS string, and ships
// through serverless-webpack as an ordinary string constant (no asset-copy
// config, no runtime fs read).
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bundlePath = path.join(root, "dist/hosted-preferences.js");
const defaultOut = path.resolve(
  root,
  "../../backend/client-routes/hosted-preferences-bundle.ts"
);
const outPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultOut;

// Always rebuild so the synced bundle is current.
execFileSync("node", [path.join(root, "scripts/build-embed.mjs")], {
  stdio: "inherit",
});

const b64 = fs.readFileSync(bundlePath).toString("base64");
const module = `// AUTO-GENERATED — do not edit by hand.
// Source: courier-web/preferences-page (embed/main.tsx -> npm run build:embed).
// Regenerate: in courier-web/preferences-page run \`npm run sync:backend\`.
// The hosted-preferences lambda decodes this and inlines it into the page HTML.
/* eslint-disable */
export const HOSTED_PREFERENCES_BUNDLE_B64 =
  "${b64}";
`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, module);
console.log(
  `\nWrote ${outPath} (${(b64.length / 1024).toFixed(0)} KB base64 from ${(
    fs.statSync(bundlePath).size / 1024
  ).toFixed(0)} KB bundle)`
);
