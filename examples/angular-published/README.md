# Courier + Angular (published package)

A minimal [Angular 19](https://angular.dev/) + [Vite](https://vite.dev/) app
(via [`@analogjs/vite-plugin-angular`](https://analogjs.org/)) that renders
Courier's default inbox using the **published**
[`@trycourier/courier-angular`](https://www.npmjs.com/package/@trycourier/courier-angular)
package from npm — the exact setup an external app would use.

The single `AppComponent` renders `<courier-inbox>` after signing in, mirroring
the default inbox in the [`angular`](../angular/) showcase.

## How this differs from the `angular` example

The [`angular`](../angular/) example is a development showcase: it aliases
`@trycourier/courier-angular` to its locally built `dist/` and the peer
packages to their live `src/`, with a custom Analog `transformFilter`, so you
can iterate on the SDK and the example together.

This example depends on `@trycourier/courier-angular` by its published version
range (`^1.0.0`). Its peer packages (`courier-ui-inbox|toast|preferences`,
`courier-js`, `courier-ui-core`) resolve straight from `node_modules` via their
`exports`/`dist` — no source aliasing — so it behaves like a real consumer
install.

The one special case is `@trycourier/courier-angular` itself: it is built with
`ng-packagr`, which writes the package manifest into `dist/`. On npm that
`dist` manifest **is** the package root, but inside this monorepo the workspace
root has no such manifest, so `vite.config.ts` aliases the bare specifier to its
built `dist/` — i.e. the exact published artifact an npm consumer receives. That
bundle is partial-Ivy, so it's recompiled by Angular's linker (run by Analog),
its files are skipped by Analog's `transformFilter`, and it's excluded from
esbuild's `optimizeDeps`.

> Inside this monorepo, yarn links the local `@trycourier/courier-angular`
> workspace (same version), so you must **build the packages first** (see step
> 2) — yarn resolves the package through its built `dist`, exactly as npm would
> deliver it.

## Development

From the `courier-web` project root:

1. Install dependencies

    ```sh
    yarn install
    ```

2. Build the `@trycourier` packages so the published `dist` output exists:

    ```sh
    yarn sync
    ```

3. (Optional) To show live messages, set credentials in the shared
   [`examples/web-js/.env`](../web-js) file — this example reads its `.env` from
   there (via `envDir` in `vite.config.ts`), so the web-component examples share
   one set of credentials. Without them, the inbox renders its empty /
   signed-out state.

    ```sh
    VITE_USER_ID={YOUR_USER_ID}
    VITE_JWT={YOUR_JWT}
    ```

4. Run the example app

    ```sh
    yarn workspace angular-published run dev
    ```

5. Open the printed `http://localhost:<port>` in your browser.
