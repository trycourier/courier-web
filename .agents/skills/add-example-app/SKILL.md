---
name: add-example-app
description: Checklist for adding a new example app under examples/* so it's runnable and discoverable. Use whenever you create a new example app (any new examples/<name> workspace) — it MUST be registered in .vscode/launch.json's "🚀 Run Example App" picker, and there are a few other wiring steps. Apply this any time you scaffold a new example.
---

# Add a new example app

Example apps live in `examples/*` and are yarn workspaces. Creating the app folder is not enough — a new example must be **registered** so it runs via the standard tooling. Most importantly, the `.vscode/launch.json` **🚀 Run Example App** config drives every example from one picker, and that picker is a hard-coded list: a new app that isn't added to it simply can't be launched that way.

## Required: register in `.vscode/launch.json`

Add the new workspace name to the `exampleApp` input's `options` array:

```jsonc
{
  "id": "exampleApp",
  "type": "pickString",
  "description": "Select example app to run",
  "options": [
    "web-js",
    "vue",          // ← new examples go here
    "next-latest",
    "next-12",
    "react-latest",
    "react-17",
    "designer"
  ]
}
```

The value must exactly match the `name` field in the example's `package.json` (that's what `yarn workspace <name> run dev` resolves). The launch config runs `yarn workspace ${input:exampleApp} run dev`, so the example's `package.json` must define a `dev` script.

## Full checklist

When scaffolding `examples/<name>`:

1. **`package.json`** — set `"name": "<name>"`, `"private": true`, and a `dev` script (e.g. `"dev": "vite"`). Workspaces are matched by `examples/*` in the root `package.json`, so no root change is needed for the workspace itself.
2. **`.vscode/launch.json`** — add `<name>` to the `exampleApp` options (above). **This is the step most easily forgotten.**
3. **Depend on the SDK packages** via `file:` references, e.g. `"@trycourier/courier-ui-inbox": "file:../../@trycourier/courier-ui-inbox"`.
4. **Vite apps:** alias the `@trycourier/*` packages to their `src/` and add a `server.watch` allow-list, so the example tracks package source. Copy the pattern from `examples/web-js/vite.config.ts` or `examples/vue/vite.config.ts`.
5. **Credentials** — examples authenticate with `VITE_USER_ID` / `VITE_JWT`. Each `.env` is gitignored. To avoid re-entering credentials per example, the web-component examples (`vue`, `angular`) share one set by pointing Vite's `envDir` at `examples/web-js` — do the same for new web-component examples rather than adding a separate `.env`.
6. **`README.md`** — document where credentials come from and the run command, matching the other examples.
7. **Run `yarn install`** from the repo root so the new workspace is linked.

## Verify

```bash
yarn workspace <name> run dev     # should start the dev server
yarn workspace <name> run build   # should build cleanly
```

If module resolution fails for `@trycourier/*`, build the packages first — see the [sync-packages](../sync-packages/SKILL.md) skill.

## Framework examples with conflicting transitive deps (e.g. Angular)

Most examples just work with default yarn-classic hoisting. A framework whose toolchain pins versions that clash with the root (e.g. Angular needs TypeScript ≥5.5 while the root resolves an older TS) needs extra care:

- **`nohoist`** — keep that workspace's framework deps colocated in its own `node_modules` so its bundler/compiler resolves a consistent set. The root `package.json` `workspaces` is the object form with a `nohoist` list; add patterns like `"<name>/@angular/**"`, `"<name>/@analogjs/**"`, `"<name>/typescript"`. After editing `nohoist`, a plain `yarn install` won't re-evaluate hoisting — remove `node_modules` and reinstall (`yarn sync`).
- **Angular specifically** runs on Vite via [`@analogjs/vite-plugin-angular`](https://analogjs.org/) (keeps it consistent with the other Vite examples). Gotchas, all handled in `examples/angular`:
  - Needs `@angular/build` as a dep (Analog's devkit imports `@angular/build/private`).
  - Needs a `tsconfig.app.json` (Analog looks for it; without it the build silently under-compiles).
  - The standalone component must declare `schemas: [CUSTOM_ELEMENTS_SCHEMA]` so `courier-*` tags render as custom elements.
  - When aliasing the SDK to `src/`, pass Analog a `transformFilter` that skips `@trycourier` files — otherwise its `ngtsc` transform mangles the SDK's `export { … }` re-exports and the production build fails.

## Related

- [run-example-app](../run-example-app/SKILL.md) — running an already-registered example.
