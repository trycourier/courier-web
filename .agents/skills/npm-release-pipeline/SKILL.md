---
name: npm-release-pipeline
description: Diagnose and drive the courier-web npm release pipeline — the Release workflow on main, the changesets "Version Packages" PR (changelogs + version bumps), and OIDC publishing to npm. Use when a Release run fails, packages didn't appear on npm after merging Version Packages, publishing hits an auth error, a published version is missing from the npm packument, or someone asks why the changelogs/release didn't kick off after a merge.
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

## Verify a release actually landed

`changeset publish` reports what it *attempted*. The registry is the only source of truth for what it achieved, and the two have come apart: in [#257](https://github.com/trycourier/courier-web/issues/257) the `courier-ui-core@2.5.0` tarball uploaded but the packument write never did, so the version existed and resolved for nobody. Because every package here pins its siblings at an **exact** version, that one invisible version made all eight dependent `latest` tags uninstallable, and it stayed that way for 15 days until an outside user reported it.

```bash
yarn verify-published
```

For every publishable package this checks that the checkout's version is present in that package's packument and that `dist-tags.latest` points at it — the same question a consumer's package manager asks. **Run it by hand after a release lands**; CI does not, so nothing tells you a publish half-succeeded unless someone looks.

**A failure here is not fixed by re-running the release.** npm will not let a version be re-published; the second attempt returns `E403 You cannot publish over the previously published versions`. The fix is a fresh `patch` changeset for the broken package — `updateInternalDependencies: patch` then cascades new versions to every dependent and rewrites their exact pins (see the [changesets](../changesets/SKILL.md) skill).

## Triage a failed Release run

```bash
gh run list --repo trycourier/courier-web --workflow=release.yml --limit 5
gh run view <run-id> --repo trycourier/courier-web --log | grep -E "E401|E403|ENEEDAUTH|cannot publish|error|🦋" | head -50
```

**A red Release run is weak evidence on its own.** `changeset publish` attempts every package on every run rather than only the ones whose versions moved, so on any push where nothing needs publishing, all ten come back `cannot publish over the previously published versions` and take the run's exit code with them. Runs are routinely red for that reason alone — which is exactly how a genuinely broken publish went unnoticed. Never conclude a run was fine from the error text; a run can also fail while publishing most packages. Read the `🦋 packages published successfully:` / `🦋 packages failed to publish:` lists near the end, then ask the registry:

```bash
yarn verify-published          # all packages at once, from this checkout
npm view @trycourier/<pkg> versions --json | grep <version>   # one package, by hand
```

`npm view @trycourier/<pkg> version` alone is not enough — it reads `dist-tags.latest`, which is one of the two things that can be wrong.

| Log signature | Meaning | Fix |
| --- | --- | --- |
| `ENEEDAUTH … requires you to be logged in` | That package isn't registered for OIDC trusted publishing on npmjs.com | An npm owner registers it (see above), then re-run |
| `E401 … Failed to generate Web Auth URLs due to error: BadRequestError: token is invalid` | Same cause as `ENEEDAUTH` — that package has no trusted publisher, so npm fell back to web auth and rejected the empty token. **It can half-publish**: npm accepted the tarball and the provenance statement on a request it then answered 401, leaving a version that is absent from the packument but `E403`s on any re-publish | An npm owner registers the package; the stranded version needs a fresh patch, not a re-run (see [Verify a release actually landed](#verify-a-release-actually-landed)) |
| `E403 … cannot publish over the previously published versions: X` | Usually routine — changesets attempts every package every run. But if `yarn verify-published` says that same version is missing from the packument, this is the half-publish above, not noise | Routine: nothing to do. Half-publish: fresh patch changeset |
| A package's build fails (`TS2307` etc.) *during publish* only | Something reintroduced per-package `prepare`/`prepublishOnly` build scripts. `changeset publish` runs all packages **concurrently**, so publish-time rebuilds race each other's `dist` | Keep packages free of publish-time build scripts — `build-packages:ci` in `yarn release` already builds everything topologically |
| Whole run fails before any 🦋 output | `build-packages:ci` failed (build or stale API report) | See the [api-reports](../api-reports/SKILL.md) skill |

## Re-kick a release

Re-running is safe — `changeset publish` will not overwrite a version that is already live. It does not help when a version half-published, though: npm considers it taken, so every re-run returns `E403` for it forever. Check `yarn verify-published` first.

```bash
gh run rerun <run-id> --repo trycourier/courier-web --failed
```

Or land the fix on `main`; the next push re-runs the whole flow.
