import { useEffect } from 'react';
import { CourierInbox, useCourier, type CourierInboxTheme } from '@trycourier/courier-react';

export default function App() {
  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }, []);

  const theme: CourierInboxTheme = {
    inbox: {
      header: {
        filters: {
          unreadIndicator: {
            backgroundColor: '#8B5CF6',
          },
        },
      },
      list: {
        item: {
          unreadIndicatorColor: '#8B5CF6',
        },
      },
    },
  };

  return <CourierInbox lightTheme={theme} darkTheme={theme} mode="light" />; // Or user CourierInboxPopupMenu
}
