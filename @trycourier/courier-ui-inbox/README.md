# `@trycourier/courier-ui-inbox`

Web components for Courier Inbox.

## Installation

> **Are you using React?** We suggest you use [@trycourier/courier-react](../courier-react/README.md) package instead.

```sh
npm i @trycourier/courier-ui-inbox@1.0.8-beta
```

## Usage

### Generate a JWT

To authenticate the SDK, generate a JWT for your user.  
See the [Courier JWT Guide](https://www.courier.com/docs/reference/auth/issue-token) for instructions.

> **Important:** Always generate JWTs on your backend server, not in client-side code.

## Add Inbox Component

### `courier-inbox`

// TODO: Image

```html
<body>

    <courier-inbox id="inbox"></courier-inbox>

    <script type="module">
        import { Courier, CourierInbox } from '@trycourier/courier-ui-inbox';

        // Generate a JWT for your user (do this on your backend server)
        const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Replace with actual JWT

        // Authenticate the user with the inbox
        Courier.shared.signIn({
            userId: 'some_user_id',
            jwt: jwt
        });
    </script>

</body>
```

### `courier-inbox-popup-menu`

// TODO: Image

```html
<body>

    <div style="display: flex; justify-content: center; align-items: center; padding: 100px;">
        <courier-inbox-popup-menu id="inbox"></courier-inbox-popup-menu>
    </div>

    <script type="module">
        import { CourierInbox, Courier } from '@trycourier/courier-ui-inbox';

        // Generate a JWT for your user (do this on your backend server)
        const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Replace with actual JWT

        // Authenticate the user with the inbox
        Courier.shared.signIn({
            userId: 'some_user_id',
            jwt: jwt
        });
    </script>

</body>
```

## Handle Clicks and Presses

```html
<body>

    <courier-inbox id="inbox"></courier-inbox> <!-- or use courier-inbox-popup-menu -->

    <script type="module">
        ...

        // Reference the element
        const inbox = document.getElementById('inbox');

        // Handle message clicks
        inbox.onMessageClick(({ message, index }) => {
            alert("Message clicked at index " + index + ":\n" + JSON.stringify(message, null, 2));
        });

        // Handle message action clicks (These are buttons on individial messages)
        inbox.onMessageActionClick(({ message, action, index }) => {
            alert(
                "Message action clicked at index " + index + ":\n" +
                "Action: " + JSON.stringify(action, null, 2) + "\n" +
                "Message: " + JSON.stringify(message, null, 2)
            );
        });

        // Handle message long presses (Useful for mobile web)
        inbox.onMessageLongPress(({ message, index }) => {
            alert("Message long pressed at index " + index + ":\n" + JSON.stringify(message, null, 2));
        });
  </script>

</body>
```

## Styles and Theming

### Full screen `courier-inbox`

// TODO: Image

> **Important:** The default `courier-inbox` height is 768px.

```html
<body>

    <courier-inbox height="100%"></courier-inbox>

    ...

</body>
```

### Light & Dark Themes

// TODO Image

```html
<body>

  <courier-inbox id="inbox"></courier-inbox> <!-- or use courier-inbox-popup-menu -->

  <script type="module">
    ...

    // Reference the element
    const inbox = document.getElementById('inbox');

    const theme = {
        inbox: {
            header: {
                filters: {
                    unreadIndicator: {
                        backgroundColor: "#8B5CF6"
                    }
                }
            },
            list: {
                item: {
                    unreadIndicatorColor: "#8B5CF6"
                }
            }
        }
    }

    // Set the theme
    inbox.setLightTheme(theme);
    inbox.setDarkTheme(theme);

    // Set the mode
    // This will force light, dark or system theme mode
    inbox.setMode('light');

  </script>

</body>
```

[🎨 All available theme values](./docs/theme.md).

### Popup Alignment, Positioning, and Dimensions

```html
<body>

    <div style="display: flex; justify-content: center; align-items: center; padding: 100px;">
        <courier-inbox-popup-menu 
            mode="light" 
            popup-alignment="top-left" 
            top="44px" 
            left="44px" 
            popup-width="340px"
            popup-height="400px">
        </courier-inbox-popup-menu>
    </div>

    ...
</body>
```

## Custom Elements

Customize the inbox UI with any element you want.

### List Items

// TODO: Image

```html
<body>

    <courier-inbox id="inbox"></courier-inbox> <!-- or use courier-inbox-popup-menu -->

    <script type="module">
        ...

        // Reference the courier-inbox element
        const inbox = document.getElementById('inbox');

        // Set a custom list item
        inbox.setListItem(({ message, index }) => {
            const pre = document.createElement('pre');
            pre.style.padding = '24px';
            pre.style.borderBottom = '1px solid #e0e0e0';
            pre.style.margin = '0';
            pre.textContent = JSON.stringify(({ message, index }), null, 2);
            return pre;
        });
    </script>

</body>
```

### Header

// TODO: Image

```html
<body>

    <courier-inbox id="inbox"></courier-inbox> <!-- or use courier-inbox-popup-menu -->

    <script type="module">
        ...

        // Reference the courier-inbox element
        const inbox = document.getElementById('inbox');

        // Remove the header
        inbox.removeHeader();

        // Set a custom header
        inbox.setHeader(({ feedType, unreadCount, messageCount }) => {
            const headerDiv = document.createElement('div');
            headerDiv.style.background = 'red';
            headerDiv.style.fontSize = '24px';
            headerDiv.style.padding = '24px';
            headerDiv.style.width = '100%';
            headerDiv.textContent = feedType;
            return headerDiv;
        });

        // Change the feed type
        // "inbox" and "archive" are available
        inbox.setFeedType('archive');
    </script>

</body>
```

### Popup Menu Button

// TODO: Image

```html
<body>

    <div style="display: flex; justify-content: center; align-items: center; padding: 100px;">
        <courier-inbox-popup-menu id="inbox"></courier-inbox-popup-menu>
    </div>

    <script type="module">
        ...

        // Reference the courier-inbox element
        const inbox = document.getElementById('inbox');

        // Set a custom menu button
        inbox.setMenuButton(({ unreadCount }) => {
            const button = document.createElement('button');
            button.textContent = `Open the Inbox Popup. Unread message count: ${unreadCount}`;
            return button;
        });
    </script>

</body>
```

### Loading, Empty, Error & Pagination

```html
<body>

    <courier-inbox id="inbox"></courier-inbox> <!-- or use courier-inbox-popup-menu -->

    <script type="module">
        ...

        // Reference the courier-inbox element
        const inbox = document.getElementById('inbox');

        // Set a custom loading state
        inbox.setLoadingState(props => {
            const loading = document.createElement('div');
            loading.style.padding = '24px';
            loading.style.background = 'red';
            loading.textContent = 'Custom Loading State';
            return loading;
        });

        // Set a custom empty state
        inbox.setEmptyState(props => {
            const empty = document.createElement('div');
            empty.style.padding = '24px';
            empty.style.background = 'green';
            empty.textContent = 'Custom Empty State';
            return empty;
        });

        // Set a custom error state
        inbox.setErrorState(props => {
            const error = document.createElement('div');
            error.style.padding = '24px';
            error.style.background = 'blue';
            error.textContent = 'Custom Error State';
            return error;
        });

        // Set a custom pagination state
        inbox.setPaginationItem(props => {
            const pagination = document.createElement('div');
            pagination.style.padding = '24px';
            pagination.style.background = 'yellow';
            pagination.textContent = 'Custom Pagination Item';
            return pagination;
        });
    </script>

</body>
```

> **Are you using React?** We suggest you use [@trycourier/courier-react](../courier-react/README.md) package instead.
