# @trycourier/courier-js

The base API client and shared instance singleton for Courier's JavaScript Browser SDK.

## Installation

```ts
npm i @trycourier/courier-react@8.0.2-beta
```

## Usage

```ts
import { useEffect } from 'react';
import { CourierInbox, useCourier } from '@trycourier/courier-react';

function App() {

  const courier = useCourier();

  useEffect(() => {
    courier.auth.signIn({
      userId: 'your_user_id',
      jwt: 'ey...n0',
    });
  }, []);

  return (
    <CourierInbox />
  );

}

export default App;
```