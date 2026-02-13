<!-- AUTO-GENERATED-OVERVIEW:START — Do not edit this section. It is synced from mintlify-docs. -->
<img width="1040" alt="courier-ui-inbox" src="https://github.com/user-attachments/assets/6227249b-d008-4719-bddc-874f34432376" />

**Using React?** Use the [@trycourier/courier-react](../courier-react/) package.

## Installation

```sh
npm install @trycourier/courier-ui-inbox
```

## Usage

Check out the [Courier documentation](https://www.courier.com/docs/sdk-libraries/courier-ui-inbox-web) for a full guide to Courier Inbox Web Components.

## Examples

Below are a few examples of the Courier Inbox. Visit the [Courier documentation](https://www.courier.com/docs/sdk-libraries/courier-ui-inbox-web) for more examples.

### `courier-inbox`

<img width="688" alt="Screenshot 2025-06-25 at 2 32 30 PM" src="https://github.com/user-attachments/assets/93246c34-3c5a-475e-8e83-7df6acf9bdf3" />

```html
<body>

  <courier-inbox id="inbox"></courier-inbox>

  <script type="module">
    import { Courier } from '@trycourier/courier-ui-inbox';

    // Generate a JWT for your user (do this on your backend server)
    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Replace with actual JWT

    // Authenticate the user with the inbox
    Courier.shared.signIn({
      userId: $YOUR_USER_ID,
      jwt: jwt
    });
  </script>

</body>
```

### `courier-inbox-popup-menu`

<img width="602" alt="Screenshot 2025-06-25 at 2 33 17 PM" src="https://github.com/user-attachments/assets/c3b7f4cc-26c1-4be6-9ed5-a3fc3c0b335b" />

```html
<body>

  <div style="padding: 24px;">
    <courier-inbox-popup-menu id="inbox"></courier-inbox-popup-menu>
  </div>

  <script type="module">
    import { Courier } from '@trycourier/courier-ui-inbox';

    // Generate a JWT for your user (do this on your backend server)
    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Replace with actual JWT

    // Authenticate the user with the inbox
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
