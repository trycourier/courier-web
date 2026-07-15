---
name: npm-release-pipeline
description: Diagnose and drive the courier-web npm release pipeline — the Release workflow on main, the changesets "Version Packages" PR (changelogs + version bumps), and OIDC publishing to npm. Use when a Release run fails, packages didn't appear on npm after merging Version Packages, publishing hits ENEEDAUTH, or someone asks why the changelogs/release didn't kick off after a merge.
---

# npm release pipeline

How a merged PR becomes an npm release. This is the courier-web (changesets) pipeline — **not** the api-spec/Stainless SDK pipeline, which is a separate release train with its own shepherding.

## The happy path

1. A PR that changes `@trycourier/*/src` ships a changeset (see the [changesets](../changesets/SKILL.md) skill).
2. On every push to `main`, the **Release** workflow (`.github/workflows/release.yml`) runs the changesets action:
   - **Changesets pending** → it creates/updates the **Version Packages** PR: applies the bumps, cascades internal deps, writes each `CHANGELOG.md`, deletes the consumed changesets. Changelogs only "kick off" through this PR — nothing publishes yet.
   - **No changesets pending** (i.e. the push *is* the Version Packages merge) → it publishes: `yarn release` = `build-packages:ci` (topological build + API report check) then `changeset publish`.
3. Publishing authenticates via **npm OIDC trusted publishing** (`id-token: write`, no NPM_TOKEN). Every package must be registered on npmjs.com: package → Settings → Trusted Publisher → GitHub Actions, repository `trycourier/courier-web`, workflow `release.yml`. Registration is per-package and can only be done by an npm owner.

So the full release is **two merges**: the feature PR, then the Version Packages PR it spawns.

## Triage a failed Release run

```bash
gh run list --repo trycourier/courier-web --workflow=release.yml --limit 5
gh run view <run-id> --repo trycourier/courier-web --log-failed | grep -E "ENEEDAUTH|cannot publish|error|🦋" | head -50
```

A run can fail while still publishing most packages — always check the `🦋 packages published successfully:` / `🦋 packages failed to publish:` lists near the end, then confirm reality against the registry:

```bash
npm view @trycourier/<pkg> version
```

| Log signature | Meaning | Fix |
| --- | --- | --- |
| `ENEEDAUTH … requires you to be logged in` | That package isn't registered for OIDC trusted publishing on npmjs.com | An npm owner registers it (see above), then re-run |
| `cannot publish over the previously published versions: X` | The version is already live; changesets' `npm info` check read a stale registry copy (common minutes after another run published it) | Benign — verify with `npm view`, then ignore or re-run later |
| A package's build fails (`TS2307` etc.) *during publish* only | Something reintroduced per-package `prepare`/`prepublishOnly` build scripts. `changeset publish` runs all packages **concurrently**, so publish-time rebuilds race each other's `dist` | Keep packages free of publish-time build scripts — `build-packages:ci` in `yarn release` already builds everything topologically |
| Whole run fails before any 🦋 output | `build-packages:ci` failed (build or stale API report) | See the [api-reports](../api-reports/SKILL.md) skill |

## Re-kick a release

Re-running is safe and idempotent — `changeset publish` only attempts versions missing from the registry:

```bash
gh run rerun <run-id> --repo trycourier/courier-web --failed
```

Or land the fix on `main`; the next push re-runs the whole flow.
