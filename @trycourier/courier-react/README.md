# @trycourier/courier-react

React UI components used to create an Inbox

## Installation

```bash
npm i @trycourier/courier-react@8.0.6-beta
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
    <CourierInbox
      onMessageClick={(props) => {
        console.log(props);
      }}
      onMessageActionClick={(props) => {
        console.log(props);
      }}
      onMessageLongPress={(props) => {
        console.log(props);
      }}
       />

      // or

    <CourierInboxMenu
      onMessageClick={(props) => {
        console.log(props);
      }}
      onMessageActionClick={(props) => {
        console.log(props);
      }}
      onMessageLongPress={(props) => {
        console.log(props);
      }}
       />
  );

}

export default App;
```

## Theme Customization

This allows you to style the prebuilt `<CourierInbox/>`. Tons of options live inside `CourierInboxTheme`. Command click in to see all options!

```ts
import { CourierInboxTheme } from '@trycourier/courier-ui-inbox';

const theme: CourierInboxTheme = {
  popup: {
    button: {
      unreadIndicator: {
        backgroundColor: '#9b4dca',
        ...
      }
    },
    window: {
      ...
    }
  },
  inbox: {
    header: {
      filters: {
        unreadIndicator: {
          backgroundColor: '#9b4dca',
          ...
        }
      }
    },
    list: {
      item: {
        unreadIndicatorColor: '#9b4dca',
        ...
      }
    }
  }
};

...

<CourierInbox
  height={'456px'}
  mode='system'
  feedType='archive'
  lightTheme={theme}
  darkTheme={theme}
   />

  // or

<CourierInboxMenu
  popupAlignment='top-left'
  popupWidth='456px'
  popupHeight='456px'
  mode='system'
  feedType='archive'
   />

```

## Fully Custom UI Elements

You can change any element in the Inbox to be custom. Here are the available options.

```ts
<CourierInbox
  renderHeader={(props) => {
    return <div>...</div>
  }}
  renderListItem={(props) => {
    return <div>...</div>
  }}
  renderEmptyState={(props) => {
    return <div>...</div>
  }}
  renderErrorState={(props) => {
    return <div>...</div>
  }}
  renderLoadingState={(props) => {
    return <div>...</div>
  }}
  renderPaginationItem={(props) => {
    return <div>...</div>
  }}
   />

  // or

<CourierInboxMenu
  renderPopupMenuButton={(props) => {
    return <div>...</div>
  }}
  renderPopupHeader={(props) => {
    return <div>...</div>
  }}
  renderPopupListItem={(props) => {
    return <div>...</div>
  }}
  renderPopupEmptyState={(props) => {
    return <div>...</div>
  }}
  renderPopupLoadingState={(props) => {
    return <div>...</div>
  }}
  renderPopupErrorState={(props) => {
    return <div>...</div>
  }}
  renderPopupPaginationItem={(props) => {
    return <div>...</div>
  }}
   />
```
