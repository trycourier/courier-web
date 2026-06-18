---
name: changesets
description: Manage versioning for the @trycourier packages with changesets — create a changeset describing a version bump after changing package source, and bump package versions for release with `yarn changeset version`. Use when modifying @trycourier/*/src and a release-tracking changeset is needed, or when cutting a release locally / running the "Version Packages" step by hand.
---

# Changesets: create & version

This monorepo versions its `@trycourier/*` packages with [changesets](https://github.com/changesets/changesets). Two workflows live here:

- **[Create a changeset](#create-a-changeset)** — during development, after changing package source.
- **[Bump versions for release](#bump-versions-for-release)** — at release time, applying pending changesets with `yarn changeset version`.

> Some maintainers author changesets by hand and don't want them auto-created. If a project/user instruction says changesets are handled manually, do **not** create or edit `.changeset/*.md` files — surface the intended bump and let them write it. The versioning workflow below only *consumes* existing changesets and is always safe to drive.

---

## Create a changeset

### When
Whenever you modify source code in any `@trycourier/*` package (`@trycourier/*/src/**`). **Not** for test-only, config-only, or docs-only changes.

### How
Write a markdown file in `.changeset/` with a short, random kebab-case name (e.g. `happy-dogs-fly.md` — not named after the branch or ticket), or run `yarn changeset` interactively.

```markdown
---
"@trycourier/courier-js": patch
---

Fix preference client response parsing
```

Multi-package change — list each package whose own source changed:

```markdown
---
"@trycourier/courier-js": minor
"@trycourier/courier-react": patch
---

Add getUnreadCounts API and expose it through useCourier hook
```

### Bump types

| Type    | When to use                                                 |
|---------|-------------------------------------------------------------|
| `patch` | Bug fixes, internal refactors, small improvements           |
| `minor` | New features, new exports, non-breaking additions           |
| `major` | Breaking API changes, removed exports, renamed public types |

### Valid package names

`@trycourier/courier-js` · `@trycourier/courier-react` · `@trycourier/courier-react-17` · `@trycourier/courier-react-components` · `@trycourier/courier-ui-core` · `@trycourier/courier-ui-inbox` · `@trycourier/courier-ui-toast` · `@trycourier/courier-ui-preferences`

Internal dependents are bumped automatically at release time (`updateInternalDependencies: patch`), so only list packages whose own source you changed.

---

## Bump versions for release

The canonical, dependency-aware bump is `yarn changeset version` — it reads the pending changeset files, applies the right semver bump to each package, cascades bumps to internal dependents, deletes the consumed changesets, and updates each `CHANGELOG.md`. Normally the Changesets bot does this in a "Version Packages" PR; do this locally when bumping by hand.

### 1. Preview (read-only)

```bash
yarn changeset status --verbose
```

- Ignore `Package "<x>" must depend on the current version of ...` lines (from `examples/*` + `designer` `file:` deps) and any `Opening /dev/tty failed` line.
- Target versions appear as `🦋  - @trycourier/courier-js 3.3.0`, grouped under `patch` / `minor` / `major`.
- If **no changesets** are present, there's nothing to bump — stop and tell the user (they add changesets manually).

### 2. Confirm with the user

Build a current → bump → target table and ask — using the host tool's best interactive prompt (e.g. Claude Code's `AskUserQuestion`) — to confirm the target versions:

| Package | Current | Bump | Target |
|---|---|---|---|
| @trycourier/courier-js | 3.2.0 | minor | 3.3.0 |
| @trycourier/courier-ui-inbox | 2.4.4 | patch¹ | 2.4.5 |

(¹ patch bumps with no changeset of their own are internal-dependency cascades.)

> Changesets pick versions by semver **level**, not arbitrary strings. To change a target version, change the bump level in the relevant `.changeset/*.md`, then re-preview. An exact-version override that levels can't express requires hand-editing `package.json` — last resort, only if explicitly asked.

### 3. Apply

```bash
yarn changeset version
```

### 4. Hand off

- Show `git status` / `git diff --stat`.
- If the public API surface changed, refresh the API reports (see the `api-reports` skill / `yarn generate-api-docs`).
- The release itself runs in CI when the bump lands on `main` (`yarn release` builds and `changeset publish`es to npm).
- Do **not** commit, push, or publish unless the user asks.

---

## Notes

- Run from the repo root. Package manager is `yarn@1` (classic).
- `yarn changeset status` is read-only. `yarn changeset version` mutates files but does not publish. Publishing only happens via `yarn release` / `changeset publish`.
- Config: `.changeset/config.json` (`baseBranch: main`, `updateInternalDependencies: patch`, `access: public`).
- This skill lives at `.agents/skills/changesets/SKILL.md` (the cross-tool Agent Skills standard path). Cursor and Codex discover it there natively; Claude Code discovers it via the `.claude/skills` → `../.agents/skills` directory symlink.
