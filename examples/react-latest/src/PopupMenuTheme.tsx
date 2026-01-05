import { useEffect } from 'react';
import {
  CourierInboxPopupMenu,
  useCourier,
  type CourierInboxTheme,
  type CourierInboxFeed,
} from '@trycourier/courier-react';

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
      feedId: 'all',
      title: 'All',
      tabs: [
        {
          datasetId: 'all',
          title: 'All',
          filter: {}
        }
      ]
    },
    {
      feedId: 'jobs',
      title: 'Jobs',
      tabs: [
        {
          datasetId: 'jobs',
          title: 'Jobs',
          filter: { tags: ['job'] }
        }
      ]
    },
    {
      feedId: 'my-posts',
      title: 'My Posts',
      tabs: [
        {
          datasetId: 'all-my-posts',
          title: 'All',
          filter: { tags: ['my_post'] }
        },
        {
          datasetId: 'comments',
          title: 'Comments',
          filter: { tags: ['comment'] }
        },
        {
          datasetId: 'reactions',
          title: 'Reactions',
          filter: { tags: ['reaction'] }
        },
        {
          datasetId: 'reposts',
          title: 'Reposts',
          filter: { tags: ['repost'] }
        }
      ]
    },
    {
      feedId: 'mentions',
      title: 'Mentions',
      tabs: [
        {
          datasetId: 'mentions',
          title: 'Mentions',
          filter: { tags: ['mention'] }
        }
      ]
    }
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

