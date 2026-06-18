# Courier + Vue (Web Components)

A minimal [Vue 3](https://vuejs.org/) + [Vite](https://vite.dev/) app that embeds
Courier's [Web Components inbox](../../@trycourier/courier-ui-inbox/) — the same
setup you'd use to drop the inbox into a Vue app.

This example also serves as a regression test for
[C-18926](https://linear.app/trycourier): the inbox empty-state used to inject a
**global** `.container` style into `<head>`, which clobbered any host-app
`.container` class and broke page layouts. This app intentionally builds its
layout on a `.container` class so the conflict is obvious if it ever regresses.

## How Vue uses the Web Components

Two things make the native custom elements work in Vue:

1. The Vite config tells the Vue compiler to treat `courier-*` tags as custom
   elements (`isCustomElement`), so Vue renders them as-is instead of warning.
2. Importing `@trycourier/courier-ui-inbox` registers the `<courier-inbox>`
   element. We grab it with a template `ref` to call its imperative API
   (`onMessageClick`, etc.).

## Development

From the `courier-web` project root:

1. Install dependencies

    ```sh
    yarn install
    ```

2. (Optional) Create an `.env` file in this directory with real credentials to
   show live messages. Without them, the inbox renders its empty / signed-out
   state — which is the exact UI this example is testing.

    ```sh
    VITE_USER_ID={YOUR_USER_ID}
    VITE_JWT={YOUR_JWT}
    ```

3. Run the example app

    ```sh
    yarn workspace vue run dev
    ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## What "working" looks like

The page header, sidebar, inbox card and footer stay laid out in their grid even
while the inbox shows its empty state. If you see the layout collapse (everything
centered/stacked), the global-style leak has regressed.

> Changes made to `@trycourier` modules are _not_ hot-reloaded. Restart the
> server to pick up changes.
