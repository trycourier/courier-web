import { useEffect } from 'react';
import {
  CourierInboxPopupMenu,
  useCourier,
  type CourierInboxTheme,
  type CourierInboxFeed,
} from '@trycourier/courier-react-17';

export default function App() {
  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }, []);

  const theme: CourierInboxTheme = {
    popup: {
      button: {
        unreadDotIndicator: {
          backgroundColor: '#8B5CF6',
        },
      },
      window: {
        animation: {
          transition: 'all 200ms cubic-bezier(0.16, 1, 0.22, 1)',
          initialTransform: 'translate3d(-8px, -16px, 0) scale(0.97)',
          visibleTransform: 'translate3d(0, 0, 0) scale(1)',
        },
      },
    },
    inbox: {
      header: {
        feeds: {
          button: {
            font: {
              family: 'Poppins',
            },
            unreadCountIndicator: {
              backgroundColor: '#8B5CF6',
              font: {
                family: 'Poppins',
              },
            },
          },
          menu: {
            animation: {
              transition: 'all 200ms cubic-bezier(0.16, 1, 0.22, 1)',
              initialTransform: 'translate3d(-8px, -16px, 0) scale(0.97)',
              visibleTransform: 'translate3d(0, 0, 0) scale(1)',
            },
            list: {
              font: {
                family: 'Poppins',
              },
              selectedIcon: {
                color: '#8B5CF6',
              },
            },
          },
          tabs: {
            default: {
              font: {
                family: 'Poppins',
              },
              unreadIndicator: {
                font: {
                  family: 'Poppins',
                },
              },
            },
            selected: {
              indicatorColor: '#8B5CF6',
              font: {
                color: '#8B5CF6',
                family: 'Poppins',
              },
              unreadIndicator: {
                backgroundColor: '#8B5CF6',
                font: {
                  family: 'Poppins',
                },
              },
            },
          },
        },
        tabs: {
          default: {
            font: {
              family: 'Poppins',
            },
            unreadIndicator: {
              font: {
                family: 'Poppins',
              },
            },
          },
          selected: {
            indicatorColor: '#8B5CF6',
            font: {
              color: '#8B5CF6',
              family: 'Poppins',
            },
            unreadIndicator: {
              backgroundColor: '#8B5CF6',
              font: {
                family: 'Poppins',
              },
            },
          },
        },
        actions: {
          animation: {
            transition: 'all 200ms cubic-bezier(0.16, 1, 0.22, 1)',
            initialTransform: 'translate3d(8px, -16px, 0) scale(0.97)',
            visibleTransform: 'translate3d(0, 0, 0) scale(1)',
          },
        },
      },
      list: {
        item: {
          unreadIndicatorColor: '#8B5CF6',
          title: {
            family: 'Poppins',
          },
          subtitle: {
            family: 'Poppins',
          },
          time: {
            family: 'Poppins',
          },
          actions: {
            font: {
              family: 'Poppins',
            },
          },
        },
      },
      empty: {
        title: {
          font: {
            family: 'Poppins',
          },
        },
        button: {
          font: {
            family: 'Poppins',
          },
        },
      },
      error: {
        title: {
          font: {
            family: 'Poppins',
          },
        },
        button: {
          font: {
            family: 'Poppins',
          },
        },
      },
    },
  };

  const feeds: CourierInboxFeed[] = [
    {
      feedId: 'inbox',
      title: 'Inbox',
      tabs: [
        {
          datasetId: 'inbox',
          title: 'Inbox',
          filter: {},
        },
      ],
    },
    {
      feedId: 'categories',
      title: 'Categories',
      tabs: [
        {
          datasetId: 'all',
          title: 'All',
          filter: {},
        },
        {
          datasetId: 'unread',
          title: 'Unread',
          filter: { status: 'unread' },
        },
        {
          datasetId: 'read',
          title: 'Read',
          filter: { status: 'read' },
        },
        {
          datasetId: 'important',
          title: 'Important',
          filter: { tags: ['important'] },
        },
      ],
    },
    {
      feedId: 'archive',
      title: 'Archive',
      tabs: [
        {
          datasetId: 'archive',
          title: 'Archive',
          filter: { archived: true },
        },
      ],
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <CourierInboxPopupMenu
        feeds={feeds}
        lightTheme={theme}
        darkTheme={theme}
        mode="light"
      />
    </div>
  );
}

