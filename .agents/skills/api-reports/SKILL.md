---
name: api-reports
description: Check or update the committed API reports for the @trycourier packages (API Extractor reports under api/*.api.md). Use when CI's "Build packages and check API changes" job fails on an API diff, when you intentionally changed a package's public API surface and need to refresh the committed report, or to verify locally that the reports are in sync before pushing.
---

# Check & update the API reports

The public API surface of every `@trycourier/*` package is captured by [API Extractor](https://api-extractor.com/) in a committed report at the repo root: `api/<package>.api.md`. CI fails if a package's built API no longer matches its committed report, so any intentional API change must ship with an updated report **in the same PR**.

## How it works

- Each package's `api-extractor.json` writes its report to the root `api/` folder (`apiReport.reportFolder: "../../api"`).
- API Extractor reads the **built** types (`dist/index.d.ts`) — so the package must be built before the report is accurate.
- `api-extractor run` (no flags) runs in **check mode**: read-only, exits non-zero if the report is stale. This is wired into each package's `build:ci`.
- `api-extractor run --local` runs in **update mode**: rewrites `api/<package>.api.md`.

## Check whether the reports are in sync (read-only)

This is exactly what CI runs — it builds every package and runs API Extractor in check mode:

```bash
yarn build-packages:ci
```

If it fails with an API report mismatch, the public API changed without the committed report being updated → go update it below.

## Update the reports after an intentional API change

Rebuilds all packages and regenerates every report with `--local`:

```bash
yarn generate-api-docs
```

Then:

1. Review the diff: `git diff api/` — confirm the changes match what you intended to expose/remove/rename. An unexpected entry usually means an accidental export or a forgotten release tag.
2. Commit the updated `api/*.api.md` files **in the same PR** as the source change.
3. If the diff is large or surprising, double-check it's not a side effect of an unintended public export.

## Notes

- Run from the repo root. Package manager is `yarn@1` (classic).
- Reports live at `api/*.api.md`; per-package config is each package's `api-extractor.json`. Scripts: `scripts/generate-api-docs` (update) and `scripts/build-packages-ci` (build + check, used by CI's `build-packages.yml`).
- This skill lives at `.agents/skills/api-reports/SKILL.md` (the cross-tool Agent Skills standard path). Cursor and Codex discover it there natively; Claude Code discovers it via the `.claude/skills` → `../.agents/skills` directory symlink.
