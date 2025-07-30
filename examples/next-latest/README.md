# Next.js (latest)

An example app using Next 15 and [`@trycourier/courier-react`](../../@trycourier/courier-react/).

## Development

From the `courier-web` project root:

1. Install dependencies

    ```sh
    yarn install
    ```

2. Create an `.env` file in this directory (`next-latest`) with the following variables.
   See [`@trycourier/courier-react`](../../@trycourier/courier-react/) for more information on authenticating with the Courier SDKs.

    ```sh
    NEXT_PUBLIC_USER_ID={YOUR_USER_ID}
    NEXT_PUBLIC_JWT={YOUR_JWT}
    ```

3. Run the example app

    ```sh
    yarn workspace next-latest run dev
    ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Developing transitive dependencies

While developing transitive dependencies (ex. [`@trycourier/courier-ui-inbox`](../../@trycourier/courier-ui-inbox/)), you'll
need to manually rebuild the dependency and refresh the web page to see changes. Restarting the Next.js server is not required.

For example, to rebuild the dependency once:

```sh
yarn workspace @trycourier/courier-ui-inbox run build
```

Or to watch for changes and continuously rebuild:

```sh
yarn workspace @trycourier/courier-ui-inbox run watch
```

> Rebuilding a direct dependency (ex. `@trycourier/courier-react`) is not required, but you may need to refresh the page to see changes.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
