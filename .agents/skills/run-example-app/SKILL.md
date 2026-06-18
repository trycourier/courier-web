---
name: run-example-app
description: Run one of the example apps' dev servers (the "🚀 Run Example App" launch config). Use when asked to start, run, preview, or manually test an example app (web-js, vue, next-latest, next-12, react-latest, react-17, designer), e.g. to see an inbox/toast/preferences change working in a browser.
---

# Run an example app

The repo ships runnable example apps under `examples/*` (plus `designer`) that embed the Courier SDKs. This is the headless equivalent of the **🚀 Run Example App** VSCode launch config.

## Available apps

| Workspace      | Stack                                  | Notes |
| -------------- | -------------------------------------- | ----- |
| `web-js`       | Vanilla JS + Vite, Web Components       | Many sub-examples under `examples/web-js/examples/*.html` |
| `vue`          | Vue 3 + Vite, Web Components            | Embeds `<courier-inbox>` as a custom element |
| `next-latest`  | Next.js (latest) + React SDK            | |
| `next-12`      | Next.js 12 + React SDK                  | |
| `react-latest` | React (18+) + React SDK                 | |
| `react-17`     | React 17 + React 17 SDK                 | |
| `designer`     | Internal theming/designer app           | |

## Run it

From the repo root, pick the workspace and run its `dev` script:

```bash
yarn workspace <app> run dev
```

For example:

```bash
yarn workspace vue run dev      # → http://localhost:5173
yarn workspace web-js run dev
```

The Vite-based apps (`web-js`, `vue`) alias the `@trycourier/*` packages to their **`src/`** (see each app's `vite.config.ts`), so they pick up package source changes without a rebuild — but **restart the dev server** to see them (the SDK packages aren't HMR-integrated).

## Authentication / credentials

Most examples sign a user into the inbox using env vars. Create an `.env` in the app's directory:

```sh
VITE_USER_ID={YOUR_USER_ID}
VITE_JWT={YOUR_JWT}
```

(`.env` files are gitignored.) Without credentials the inbox renders its **empty / signed-out state** — which is itself useful for testing that UI (e.g. the `vue` example uses it to verify the empty-state styles don't leak into the host page). See each app's `README.md` for specifics, including EU endpoint setup.

## Prerequisites

If the app fails to resolve `@trycourier/*` modules, the packages likely need building — see the [sync-packages](../sync-packages/SKILL.md) skill (`yarn build-packages`, or `yarn sync` for a full reset).

## Related interactive helpers (human-run, GUI)

These two launch configs are interactive (they prompt via `gum` and open GUIs), so run them in a real terminal rather than automating them:

- **📱 Show Local IP QR** — `yarn ipqr`: prints a QR code to your LAN URL (default port `5173`) for testing the dev server on a phone.
- **📸 Setup Page for Screenshot** — `sh ./scripts/screenshot_launch.sh`: prompts for a URL and opens it in Chrome app mode for clean screenshots.
