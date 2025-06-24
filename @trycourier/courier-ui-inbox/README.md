# `@trycourier/courier-ui-inbox`

Web components for Courier Inbox.

## Installation```sh
npm i @trycourier/courier-js@1.0.8-beta
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

    <courier-inbox></courier-inbox>

    <script type="module">
        import { Courier, CourierInbox } from '@trycourier/courier-ui-inbox';

        // Authenticate the user with the inbox
        Courier.shared.signIn({
            userId: 'some_user_id',
            jwt: 'ey...n0'
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

        // Authenticate the user with the inbox
        Courier.shared.signIn({
            userId: 'some_user_id',
            jwt: 'ey...n0'
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

  <courier-inbox id="inbox"></courier-inbox>

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


