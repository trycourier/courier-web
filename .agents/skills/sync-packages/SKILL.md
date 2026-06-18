---
name: sync-packages
description: Reinstall dependencies and rebuild all @trycourier/* packages from a clean state (the "🔄 Sync Packages" launch config / `yarn sync`). Use when builds or tests fail with "Cannot find module '@trycourier/...'", when a package's dist/ is stale or missing, after switching branches or pulling changes that touch package source, or whenever workspace dependencies seem out of sync.
---

# Sync packages

This monorepo's `@trycourier/*` packages depend on each other through their **built** output (`dist/`), not their source. Examples and tests resolve, say, `@trycourier/courier-js` to its `dist/`. So if a package hasn't been built — common right after a fresh checkout, a branch switch, or a `node_modules` wipe — you'll hit errors like:

```
Cannot find module '@trycourier/courier-js' from 'src/datastore/inbox-datastore.ts'
```

`yarn sync` resets everything to a known-good state. It is the headless equivalent of the **🔄 Sync Packages** VSCode launch config.

## Run it

From the repo root:

```bash
yarn sync
```

This (`scripts/sync`) does, in order:

1. `nvm use` the version in `.nvmrc` (currently `v22.16.0`).
2. Removes every nested `node_modules` directory.
3. `yarn install` (yarn@1 classic) to relink the workspace.
4. `yarn build-packages` to build all `@trycourier/*` packages.

It's safe to re-run anytime; it's idempotent.

## Faster, targeted alternatives

`yarn sync` is the full reset and can take a while (it deletes and reinstalls everything). When you know what's stale, prefer the narrower commands:

- **Just (re)build all packages** — deps are already installed, you only need fresh `dist/`:

  ```bash
  yarn build-packages
  ```

- **Build a single package and its output:**

  ```bash
  yarn workspace @trycourier/courier-js run build
  ```

  Build a package's dependencies first if they're also stale — e.g. `courier-ui-inbox` depends on `courier-ui-core` and `courier-js`.

## When to reach for the full `yarn sync`

- `node_modules` is corrupt or you suspect a bad install.
- `yarn.lock` changed (e.g. a dependency was added) and linking looks off.
- Multiple packages are stale and you'd rather not chase the build order by hand.

## Notes

- Always run from the repo root with `yarn@1` (classic).
- `dist/`, `build/`, `lib/`, and `node_modules/` are gitignored — building never dirties the working tree.
- Examples (under `examples/*`) consume packages via `file:` deps, so they also need the packages built (or use their Vite `src` aliases — see the [run-example-app](../run-example-app/SKILL.md) skill).
