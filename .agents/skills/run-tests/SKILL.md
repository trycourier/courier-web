---
name: run-tests
description: Run the @trycourier package test suites (the "🧪 Run Tests" launch config) — all packages at once or a single package. Use when asked to run tests, verify a change is covered, or reproduce a CI test failure locally for courier-js, courier-react, courier-react-17, courier-ui-inbox, or courier-ui-toast.
---

# Run tests

This is the headless equivalent of the **🧪 Run Tests** VSCode launch config.

## Run all suites

From the repo root:

```bash
yarn test:all
```

This runs each package's `test` script concurrently (courier-js, courier-ui-inbox, courier-react, courier-react-17, courier-ui-toast, courier-ui-preferences).

## Run one package

```bash
yarn workspace @trycourier/courier-ui-inbox run test
```

Available test targets:

- `@trycourier/courier-js`
- `@trycourier/courier-react`
- `@trycourier/courier-react-17`
- `@trycourier/courier-ui-inbox`
- `@trycourier/courier-ui-toast`
- `@trycourier/courier-ui-preferences`

## Run a single test file or pattern

The test runners are Jest-based. Pass a filename pattern after `--`:

```bash
yarn workspace @trycourier/courier-ui-inbox run test -- info-state-style-scoping
```

## Important: build dependencies first

Several suites import sibling packages by their **built** output. If you see:

```
Cannot find module '@trycourier/courier-js' from 'src/datastore/inbox-datastore.ts'
```

the dependency package hasn't been built. Build it (or all packages) before running tests:

```bash
yarn workspace @trycourier/courier-js run build
# or, for a clean full reset, see the sync-packages skill:
yarn build-packages
```

See the [sync-packages](../sync-packages/SKILL.md) skill for details.

## Notes

- Run from the repo root with `yarn@1` (classic).
- `courier-ui-core` has no tests (its `test` script is a no-op) — exercise its components through `courier-ui-inbox` tests instead.
