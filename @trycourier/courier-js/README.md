# `@trycourier/courier-js`

The base API client and shared instance singleton for Courier's JavaScript Browser SDK.

## Installation

```sh
npm i @trycourier/courier-js@2.0.4-beta
```

## Usage

Setup the API client.

```ts
const courierClient = new CourierClient({
    userId: 'some_user_id', // The user id for your user. This is usually the user id you maintain in your system for a user.
    jwt: 'ey...n0',         // The access token associated with the user.
    tenantId: 'asdf',       // [OPTIONAL] Allows you to scope a client to a specific user in a tenant. This is uncommon, and used for advanced sub-tenant style apps. You probably don't need this.
    showLogs: true,         // [OPTIONAL] Shows debugging logs from the client. Defaults to process.env.NODE_ENV === 'development'.
});
```

### Generating a JWT

To authenticate the SDK, generate a JWT for your user.  
See the [Courier JWT Guide](https://www.courier.com/docs/reference/auth/issue-token) for instructions.

> **Important:** Always generate JWTs on your backend server, not in client-side code.

### Inbox APIs

Read and update user inbox messages.

```ts
// Fetch the inbox messages for the user
const inboxMessages = await courierClient.inbox.getMessages();

// Fetch the archived messages for the user
const archivedMessages = await courierClient.inbox.getArchivedMessages();

// Click a message
await courierClient.inbox.click({
    messageId: '1-678...',  // The message id
    trackingId: 'u2602...', // The tracking id. There are several to choose from on the InboxMessage object.
});

// Read a message
await courierClient.inbox.read({
    messageId: '1-678...',
});

// Unread a message
await courierClient.inbox.unread({
    messageId: '1-678...',
});

// Open a message
await courierClient.inbox.open({
    messageId: '1-678...',
});

// Archive a message
await courierClient.inbox.archive({
    messageId: '1-678...',
});

// Unarchive a message
await courierClient.inbox.unarchive({
    messageId: '1-678...',
});

// Read all messages
await courierClient.inbox.readAll();

// Archive read messages
await courierClient.inbox.archiveRead();

// Archive all messages
await courierClient.inbox.archiveAll();
```

### Preferences APIs

Read and update user notification preferences.

```ts
// Get list of preferences
const preferences = await courierClient.preferences.getUserPreferences();

// Get a preference topic
const topic = await courierClient.preferences.getUserPreferenceTopic({
    topicId: 'HVS...'
});

// Update a preference topic
const topic = await courierClient.preferences.putUserPreferenceTopic({
    topicId: 'HVS...',
    status: 'OPTED_IN',               // 'OPTED_IN' | 'OPTED_OUT' | 'REQUIRED'
    hasCustomRouting: true,           // true | false
    customRouting: ['inbox', 'push'], // Array of: 'direct_message' | 'inbox' | 'email' | 'push' | 'sms' | 'webhook'
});
```

### Brands APIs

Read data about a brand.

```ts
// Gets a brand by id
const brand = await courierClient.brands.getBrand({
    brandId: 'YF1...'
});
```

### Lists APIs

Read and update user list details.

```ts
// Subscribes to a list
await courierClient.lists.putSubscription({
    listId: 'your_list_id'
});

// Unsubscribes from a list
await courierClient.lists.deleteSubscription({
    listId: 'your_list_id'
});
```

### Models

#### Inbox

```ts
export interface InboxMessage {
    messageId: string;
    title?: string;
    body?: string;
    preview?: string;
    actions?: InboxAction[];
    data?: Record<string, any>;
    created?: string;
    archived?: string;
    read?: string;
     opened?: string;
    tags?: string[];
    trackingIds?: {
        archiveTrackingId?: string;
        openTrackingId?: string;
        clickTrackingId?: string;
        deliverTrackingId?: string;
        unreadTrackingId?: string;
        readTrackingId?: string;
    };
}

export interface InboxAction {
    content?: string;
    href?: string;
    data?: Record<string, any>;
    background_color?: string;
    style?: string;
}
```

#### Preferences

```ts
export interface CourierUserPreferencesTopic {
    topicId: string;
    topicName: string;
    sectionId: string;
    sectionName: string;
    status: CourierUserPreferencesStatus;
    defaultStatus: CourierUserPreferencesStatus;
    hasCustomRouting: boolean;
    customRouting: CourierUserPreferencesChannel[];
}

export type CourierUserPreferencesStatus = 'OPTED_IN' | 'OPTED_OUT' | 'REQUIRED' | 'UNKNOWN';

export type CourierUserPreferencesChannel = 'direct_message' | 'inbox' | 'email' | 'push' | 'sms' | 'webhook' | 'unknown';
```

#### Brands

```ts
export interface CourierBrand {
    id: string;
    name: string;
    created: number;
    updated: number;
    published: number;
    version: string;
    settings?: CourierBrandSettings;
}
```

See more endpoints that aren't in this SDK in the [Courier API Reference](https://www.courier.com/docs/reference/intro).
