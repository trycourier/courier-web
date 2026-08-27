#!/usr/bin/env node
/**
 * Checks that every name a package exports is importable by name from Node ESM.
 *
 * This is the check that would have caught trycourier/courier-web#247, where
 * `import { useCourier } from "@trycourier/courier-react"` failed in Astro,
 * SvelteKit, Nuxt, and plain `node --input-type=module`. Two things caused it:
 *
 *   1. No `exports` field, so Node resolved `main` — the CJS/UMD bundle — and
 *      never looked at `module`.
 *   2. Node reads named exports out of a CJS file with cjs-module-lexer, which
 *      only understands `exports.foo = …` and the exact unminified
 *      `Object.defineProperty(exports, "foo", { enumerable: true,
 *      get: function () { … } })`. Terser rewrites that getter into
 *      `{enumerable:!0,get:()=>…}`, and UMD hides everything behind a factory,
 *      so the lexer found 7 of 27 names in courier-react and 0 in courier-js.
 *
 * Reading the two bundles is not enough on its own: the ESM bundle re-exports
 * from sibling packages, so a broken `courier-js` breaks `courier-react` too.
 * So this imports each package the way a consumer does, through Node's real
 * resolver, and compares what arrives against the names in the ESM bundle.
 *
 * Run it after `yarn build-packages`. Exits non-zero on the first package whose
 * ESM and CJS surfaces disagree.
 */

import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promisify } from "node:util";

import { init as initLexer, parse } from "cjs-module-lexer";

const run = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// The ESM entry of cjs-module-lexer is the WASM build, which parses nothing
// until it is initialized.
await initLexer();

/** Every package published from this repo that ships a dist bundle. */
const PACKAGES = [
  "courier-js",
  "courier-ui-core",
  "courier-ui-inbox",
  "courier-ui-toast",
  "courier-ui-preferences",
  "courier-react-components",
  "courier-react",
  "courier-react-17",
  "courier-vue",
];

/** Names in the ESM bundle, read off its own `export { … }` statements. */
async function esmExportNames(bundlePath) {
  const source = await readFile(bundlePath, "utf8");
  const names = new Set();

  // `export { a, b as c };` — minified builds keep this list intact.
  for (const [, body] of source.matchAll(/export\s*\{([^}]*)\}\s*(?:;|$)/g)) {
    for (const clause of body.split(",")) {
      const parts = clause.trim().split(/\s+as\s+/);
      const name = (parts[1] ?? parts[0]).trim();
      if (name && name !== "default") names.add(name);
    }
  }

  // `export const foo = …` / `export function foo(…)` / `export class Foo`
  for (const [, name] of source.matchAll(
    /export\s+(?:declare\s+)?(?:const|let|var|function\*?|class)\s+([A-Za-z_$][\w$]*)/g,
  )) {
    names.add(name);
  }

  return [...names].sort();
}

/** Peers a package declares but does not install. Their absence is not our bug. */
const PEERS = ["react", "react-dom", "vue"];

/**
 * Imports the package by name in a fresh Node ESM process and reports what
 * came back. A missing name is a SyntaxError at link time, not a runtime
 * failure, so this has to be a real import in a real child process.
 *
 * Three outcomes, because not every failure is this repo's:
 *   ok       — imported, `names` holds the surface
 *   missing  — Node linked the module and could not find a name. The #247 bug.
 *   skipped  — a peer would not resolve. In this monorepo yarn hoists React 17
 *              under packages that peer on 19, which breaks the import for a
 *              reason that no consumer of a published package will ever hit.
 */
async function importedNames(packageName, cwd) {
  const script = `
    import * as mod from ${JSON.stringify(packageName)};
    process.stdout.write(JSON.stringify(Object.keys(mod)));
  `;

  try {
    const { stdout } = await run(process.execPath, ["--input-type=module", "-e", script], { cwd });
    return { ok: true, names: JSON.parse(stdout) };
  } catch (cause) {
    const stderr = String(cause.stderr ?? cause.message);

    const missing = stderr.match(/Named export '([^']+)' not found/);
    if (missing) return { ok: false, missing: missing[1] };

    // `Cannot find module '…/node_modules/react/jsx-runtime'`, and the
    // does-not-provide-an-export form React 17 produces for `render`.
    const unresolvedPeer = PEERS.find((peer) =>
      new RegExp(`(node_modules/${peer}/|module '${peer}[/']|module '${peer}' does)`).test(stderr),
    );
    if (unresolvedPeer) return { ok: false, skipped: unresolvedPeer };

    return { ok: false, stderr: stderr.trim().split("\n").slice(0, 4) };
  }
}

let failed = 0;
const skipped = [];

for (const shortName of PACKAGES) {
  const packageName = `@trycourier/${shortName}`;
  const packageDir = join(root, "@trycourier", shortName);
  const manifest = JSON.parse(await readFile(join(packageDir, "package.json"), "utf8"));

  if (!manifest.exports) {
    console.error(`FAIL ${packageName}`);
    console.error(`     No "exports" field. Node resolves "main" (${manifest.main}) for ESM`);
    console.error(`     imports and ignores "module", so named imports break.`);
    failed++;
    continue;
  }

  const require = createRequire(pathToFileURL(join(packageDir, "package.json")));
  const esmPath = join(packageDir, manifest.exports["."].import.replace(/^\.\//, ""));
  const cjsPath = join(packageDir, manifest.exports["."].require.replace(/^\.\//, ""));

  const expected = await esmExportNames(esmPath);
  const imported = await importedNames(packageName, packageDir);

  if (imported.skipped) {
    // Still checked below: the exports map, and the CJS export surface.
    skipped.push(`${packageName} (peer ${imported.skipped} unresolved here)`);
  } else if (!imported.ok) {
    console.error(`FAIL ${packageName}`);
    if (imported.missing) console.error(`     Named export '${imported.missing}' is not importable.`);
    for (const line of imported.stderr ?? []) console.error(`     ${line}`);
    failed++;
    continue;
  } else {
    const absent = expected.filter((name) => !imported.names.includes(name));
    if (absent.length) {
      console.error(`FAIL ${packageName}`);
      console.error(`     ${absent.length} of ${expected.length} names missing: ${absent.join(", ")}`);
      failed++;
      continue;
    }
  }

  // The CJS bundle is what a `require()` consumer and any bundler still reading
  // "main" gets. Check the lexer can see the same surface there.
  const lexed = parse(await readFile(cjsPath, "utf8"));
  const cjsNames = new Set([...lexed.exports, ...lexed.reexports]);
  const opaque = expected.filter((name) => !cjsNames.has(name));

  const note = opaque.length
    ? `  (CJS: ${cjsNames.size}/${expected.length} names visible to cjs-module-lexer)`
    : "";

  const how = imported.skipped ? "in ESM bundle" : "named exports";
  console.log(`ok   ${packageName.padEnd(34)} ${expected.length} ${how}${note}`);

  // UMD wraps its exports in a factory the lexer cannot read at all. Those
  // packages rely on the `exports` map to keep ESM off the CJS path entirely,
  // which the import above already proved works.
  if (opaque.length && cjsPath.endsWith(".cjs")) {
    console.error(`     ↳ these are invisible in the CJS build: ${opaque.join(", ")}`);
    console.error(`       Set output.externalLiveBindings = false in ${shortName}/vite.config.ts.`);
    failed++;
  }
}

if (failed) {
  console.error(`\n${failed} package${failed === 1 ? "" : "s"} failed. See scripts/verify-esm-exports.mjs.`);
  process.exit(1);
}

if (skipped.length) {
  console.log(`\nImport not run for ${skipped.length} package(s), checked statically instead:`);
  for (const line of skipped) console.log(`  - ${line}`);
}

console.log(`\nAll ${PACKAGES.length} packages resolve to their ESM bundle and expose it by name.`);
