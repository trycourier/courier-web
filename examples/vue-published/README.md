# Courier + Vue (published package)

A minimal [Vue 3](https://vuejs.org/) + [Vite](https://vite.dev/) app that
renders Courier's default inbox using the **published**
[`@trycourier/courier-vue`](https://www.npmjs.com/package/@trycourier/courier-vue)
package from npm — the exact setup an external app would use.

The page simply renders `<CourierInbox />` after signing in, mirroring the
default inbox in the [`vue`](../vue/) showcase.

## How this differs from the `vue` example

The [`vue`](../vue/) example is a development showcase: its `vite.config.ts`
aliases `@trycourier/*` to the packages' live `src/` so you can iterate on the
SDK and the example together.

This example does **not** alias anything. It depends on
`@trycourier/courier-vue` by its published version range (`^1.0.0`) and imports
it straight from `node_modules`, resolved via the package's `exports`/`dist` —
so it behaves like a real consumer install. Copy this folder out of the monorepo
and `npm install` would pull the same package from the public registry.

> Inside this monorepo, yarn links the local `@trycourier/courier-vue`
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
    yarn workspace vue-published run dev
    ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.
