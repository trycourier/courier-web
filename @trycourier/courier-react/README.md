<img width="1040" alt="courier-react" src="https://github.com/user-attachments/assets/e886b445-d106-4dab-afca-82183e0fcbe7" />

**Using React 17?** Use the [@trycourier/courier-react-17](../courier-react-17/) package.

**Not using React?** Use the [@trycourier/courier-ui-inbox](../courier-ui-inbox/) package.

## Installation

```sh
npm install @trycourier/courier-react
```

## Usage

Check out the [Courier documentation](https://www.courier.com/docs/sdk-libraries/courier-react-web) for a full guide to Courier React.

If you’re coming from an earlier version of the Courier React SDK,
check out [the v8 migration guide](https://www.courier.com/docs/sdk-libraries/courier-react-v8-migration-guide)
for what’s changed, how to upgrade your app,
and links to documentation for past versions of the React SDK.

## Examples

Below are a few examples of the Courier Inbox. Visit the [Courier documentation](https://www.courier.com/docs/sdk-libraries/courier-react-web) for more examples.

### `CourierInbox`

<img width="688" alt="Screenshot 2025-06-25 at 5 17 47 PM" src="https://github.com/user-attachments/assets/1655f43b-cc61-473f-9204-8dffeae21042" />

```ts
import { useEffect } from 'react';
import { CourierInbox, useCourier } from '@trycourier/courier-react';

export default function App() {

  const courier = useCourier();

  useEffect(() => {
    // Generate a JWT for your user (do this on your backend server)
    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Replace with actual JWT

    // Authenticate the user with the inbox
    courier.shared.signIn({
      userId: $YOUR_USER_ID,
      jwt: jwt,
    });
  }, []);

  return <CourierInbox />;

}
```

### `CourierInboxPopupMenu`

<img width="605" alt="Screenshot 2025-06-25 at 5 21 53 PM" src="https://github.com/user-attachments/assets/1c5497ba-a860-4d7e-8cf7-5b56a65cea51" />

```ts
import { useEffect } from 'react';
import { CourierInbox, useCourier } from '@trycourier/courier-react';

export default function App() {

  const courier = useCourier();

  useEffect(() => {
    // Generate a JWT for your user (do this on your backend server)
    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Replace with actual JWT

    // Authenticate the user with the inbox
    courier.shared.signIn({
      userId: $YOUR_USER_ID,
      jwt: jwt,
    });
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <CourierInboxPopupMenu />
    </div>
  );

}
```

## Share feedback with Courier

Have an idea or feedback about our SDKs? Let us know!

Open an issue: [Courier Web Issues](https://github.com/trycourier/courier-web/issues)
