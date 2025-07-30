# Courier Web Examples

A set of examples using [Courier's Web Components](../../@trycourier/courier-ui-inbox/).

## Development

From the `courier-web` project root:

1. Install dependencies

    ```sh
    yarn install
    ```

2. Create an `.env` file in this directory (`web-js`) with the following variables.
   See [`@trycourier/courier-ui-inbox`](../../@trycourier/courier-ui-inbox/) for more information on authenticating with the Courier SDKs.

    ```sh
    VITE_USER_ID={YOUR_USER_ID}
    VITE_JWT={YOUR_JWT}
    ```

3. Run the example app

    ```sh
    yarn workspace web-js run dev
    ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

Changes made to `@trycourier` modules are _not_ hot-reloaded since Vite isn't integrated with the Web Component dependencies yet.

Restart the server to pick up changes.
