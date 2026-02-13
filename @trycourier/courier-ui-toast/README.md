<!-- AUTO-GENERATED-OVERVIEW:START — Do not edit this section. It is synced from mintlify-docs. -->
# @trycourier/courier-ui-toast

Toast notification components for the Courier web UI.

**Using React?** Use the [@trycourier/courier-react](../courier-react/) package.

## Installation

```sh
npm install @trycourier/courier-ui-toast
```

## Usage

Check out the [Courier documentation](https://www.courier.com/docs/sdk-libraries/courier-ui-toast-web) for a full guide to Courier Toast Web Components.

## Examples

### `courier-toast`

```html
<body>

  <courier-toast id="toast"></courier-toast>

  <script type="module">
    import { Courier } from '@trycourier/courier-ui-toast';

    // Generate a JWT for your user (do this on your backend server)
    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Replace with actual JWT

    // Authenticate the user
    Courier.shared.signIn({
      userId: $YOUR_USER_ID,
      jwt: jwt
    });
  </script>

</body>
```
<!-- AUTO-GENERATED-OVERVIEW:END -->

## Share feedback with Courier

Have an idea or feedback about our SDKs? Let us know!

Open an issue: [Courier Web Issues](https://github.com/trycourier/courier-web/issues)
