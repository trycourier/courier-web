#!/usr/bin/env node
/**
 * Checks that every version this commit claims to have released is actually
 * installable from npm.
 *
 * This is the check that would have caught trycourier/courier-web#257, where
 * `@trycourier/courier-ui-core@2.5.0` uploaded its tarball but never landed in
 * the registry's packument:
 *
 *   GET registry.npmjs.org/@trycourier/courier-ui-core/2.5.0  -> 200
 *   GET registry.npmjs.org/@trycourier/courier-ui-core        -> 2.5.0 absent,
 *                                                               latest = 2.4.0
 *
 * Package managers resolve ranges from the packument, so the version was
 * invisible. Every package here pins its siblings at an *exact* version, so one
 * invisible version made all eight dependent `latest` tags uninstallable
 * (`ERR_PNPM_NO_MATCHING_VERSION`). It went unnoticed for 15 days and was
 * reported from outside, because the Release run's own log was the only record
 * and `changeset publish` exits non-zero often enough that a red run carries
 * little information.
 *
 * So this asks the registry the same question a consumer's package manager
 * asks, for every package, on every Release run:
 *
 *   1. Is this commit's version present in the package's packument?
 *   2. Does `dist-tags.latest` point at it?
 *
 * Either answer being no means someone typing `npm install @trycourier/<pkg>`
 * gets a broken tree or a stale version, whatever the publish step reported.
 *
 * A version cannot be re-published to npm, so a failure here is not fixed by
 * re-running the release: it needs a fresh patch version. See the
 * npm-release-pipeline skill.
 *
 * Usage:
 *   ./scripts/verify-published.mjs             # or: yarn verify-published
 *
 * Env:
 *   VERIFY_REF          read versions from this git ref instead of the working
 *                       tree (CI uses HEAD — see REF below)
 *   VERIFY_TIMEOUT_MS   how long to keep re-checking a package the registry has
 *                       not caught up on yet (default 120000)
 *   VERIFY_REPORT_PATH  write a markdown failure report here, for CI to file
 *   GITHUB_STEP_SUMMARY written to automatically when present
 *
 * Exits non-zero if any published package is missing or mis-tagged.
 */

import { execFile } from "node:child_process";
import { readdir, readFile, writeFile, access } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as sleep } from "node:timers/promises";
import { promisify } from "node:util";

const run = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REGISTRY = "https://registry.npmjs.org";
/**
 * Which versions to check. On the Version Packages path `changesets/action` runs
 * `changeset version` in the workspace, so the package.json files on disk hold the
 * *next* versions — ones this commit never published and never will. CI therefore
 * asks for `HEAD`, the versions the commit actually claims. Unset locally, where
 * the working tree is what you want to know about.
 */
const REF = process.env.VERIFY_REF;
const TIMEOUT_MS = Number(process.env.VERIFY_TIMEOUT_MS ?? 120_000);
const RETRY_DELAY_MS = 10_000;

/** A package manifest, from the working tree or from a git ref. */
async function readManifest(name) {
  if (!REF) return readFile(join(root, "@trycourier", name, "package.json"), "utf8");
  const { stdout } = await run("git", ["show", `${REF}:@trycourier/${name}/package.json`], { cwd: root });
  return stdout;
}

/** The publishable packages, read off the workspace rather than a hardcoded list. */
async function publishablePackages() {
  const names = await readdir(join(root, "@trycourier"));
  const packages = [];

  for (const name of names.sort()) {
    let manifest;
    try {
      manifest = JSON.parse(await readManifest(name));
    } catch {
      continue; // not a package directory, or not in this ref
    }
    if (manifest.private) continue;
    packages.push({ name: manifest.name, version: manifest.version });
  }

  return packages;
}

/**
 * The full packument — the document every package manager resolves ranges
 * against. Deliberately not `npm view`: npm's own cache and auth config are
 * exactly what we don't want between us and the registry's answer.
 */
async function fetchPackument(name) {
  const response = await fetch(`${REGISTRY}/${name.replace("/", "%2f")}`, {
    headers: { accept: "application/json" },
    cache: "no-store",
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`GET ${name} -> ${response.status} ${response.statusText}`);
  return response.json();
}

/** `null` when the package is fine, otherwise why it isn't. */
async function check({ name, version }) {
  const packument = await fetchPackument(name);
  if (packument === null) return `not published at all (404 for the packument)`;

  const versions = Object.keys(packument.versions ?? {});
  if (!versions.includes(version)) {
    return `${version} is absent from the packument (latest is ${packument["dist-tags"]?.latest ?? "unset"}) — nothing can resolve it`;
  }

  const latest = packument["dist-tags"]?.latest;
  if (latest !== version) {
    return `${version} is published but dist-tags.latest is ${latest ?? "unset"} — \`npm install ${name}\` installs the wrong version`;
  }

  return null;
}

/**
 * The registry can take a few seconds to serve a just-published version, so a
 * failure is only a failure once it has had time to settle.
 */
async function checkWithRetry(pkg) {
  const deadline = Date.now() + TIMEOUT_MS;
  let waiting = false;

  for (;;) {
    const problem = await check(pkg);
    if (problem === null) {
      if (waiting) console.log(`  … ${pkg.name}: caught up`);
      return null;
    }
    if (Date.now() + RETRY_DELAY_MS >= deadline) return problem;

    if (!waiting) {
      console.log(`  … ${pkg.name}: ${problem}`);
      console.log(`  … giving the registry up to ${Math.round(TIMEOUT_MS / 1000)}s to catch up`);
      waiting = true;
    }
    await sleep(RETRY_DELAY_MS);
  }
}

async function inPreReleaseMode() {
  try {
    await access(join(root, ".changeset", "pre.json"));
    return true;
  } catch {
    return false;
  }
}

if (await inPreReleaseMode()) {
  console.log("Changesets is in pre-release mode — dist-tags.latest is expected to lag. Skipping.");
  process.exit(0);
}

const packages = await publishablePackages();
console.log(`Verifying ${packages.length} packages against ${REGISTRY}\n`);

const results = await Promise.all(
  packages.map(async (pkg) => ({ ...pkg, problem: await checkWithRetry(pkg) }))
);

for (const { name, version, problem } of results) {
  console.log(`${problem ? "✗" : "✓"} ${name}@${version}${problem ? ` — ${problem}` : ""}`);
}

const broken = results.filter((result) => result.problem);

const summary = broken.length
  ? [
      `### Release verification failed`,
      ``,
      `${broken.length} of ${results.length} packages are not installable as published:`,
      ``,
      ...broken.map(({ name, version, problem }) => `- \`${name}@${version}\` — ${problem}`),
      ``,
      `A version cannot be re-published to npm. Fixing this needs a fresh patch`,
      `changeset for the broken package, which cascades new versions to its`,
      `dependents — see the npm-release-pipeline skill.`,
    ].join("\n")
  : `### Release verification passed\n\nAll ${results.length} packages resolve at the versions this commit claims.`;

if (process.env.GITHUB_STEP_SUMMARY) {
  await writeFile(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`, { flag: "a" });
}

if (broken.length && process.env.VERIFY_REPORT_PATH) {
  await writeFile(process.env.VERIFY_REPORT_PATH, `${summary}\n`);
}

if (broken.length) {
  console.error(`\n${broken.length} package(s) are not installable as published.`);
  process.exit(1);
}

console.log(`\nAll ${results.length} packages resolve at the versions this commit claims.`);
