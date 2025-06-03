# @trycourier/courier-js

The base API client and shared instance singleton for Courier's JavaScript Browser SDK.

## Installation

```ts
npm i @trycourier/courier-js@2.0.3-beta
```

## Usage

```ts
const courierClient = new CourierClient({
    userId: 'mike',
    jwt: 'ey...n0'
});

// Fetch the inbox messages for the user
const messages = await courierClient.inbox.getMessages();
console.log(messages);
```
