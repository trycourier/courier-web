import type { CourierInboxTheme } from '@trycourier/courier-react';

export type ThemePreset = 'default' | 'poppins' | 'inter' | 'roboto' | 'open-sans';

export const themePresets: Record<ThemePreset, CourierInboxTheme> = {
  default: {
    // Default theme - no customizations
  },
  poppins: {
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
  },
  inter: {
    popup: {
      button: {
        unreadDotIndicator: {
          backgroundColor: '#10B981',
          borderRadius: '50%',
          height: '10px',
          width: '10px',
        },
      },
      window: {
        borderRadius: '12px',
        border: '2px solid #E5E7EB',
        shadow: '0px 12px 24px -6px rgba(0, 0, 0, 0.15)',
        animation: {
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          initialTransform: 'translate3d(0, -20px, 0) scale(0.95)',
          visibleTransform: 'translate3d(0, 0, 0) scale(1)',
        },
      },
    },
    inbox: {
      header: {
        backgroundColor: '#F9FAFB',
        border: '1px solid #E5E7EB',
        feeds: {
          button: {
            font: {
              family: 'Inter',
              size: '15px',
              weight: '500',
            },
            unreadCountIndicator: {
              backgroundColor: '#10B981',
              borderRadius: '6px',
              padding: '3px 8px',
              font: {
                family: 'Inter',
                size: '11px',
                weight: '600',
              },
            },
          },
          menu: {
            borderRadius: '8px',
            shadow: '0px 6px 12px -4px rgba(0, 0, 0, 0.12)',
            animation: {
              transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
              initialTransform: 'translate3d(0, -12px, 0) scale(0.96)',
              visibleTransform: 'translate3d(0, 0, 0) scale(1)',
            },
            list: {
              font: {
                family: 'Inter',
                size: '14px',
              },
              selectedIcon: {
                color: '#10B981',
              },
            },
          },
          tabs: {
            borderRadius: {
              topLeft: '6px',
              topRight: '6px',
            },
            default: {
              font: {
                family: 'Inter',
                size: '13px',
                weight: '500',
              },
              unreadIndicator: {
                font: {
                  family: 'Inter',
                  size: '11px',
                  weight: '600',
                },
              },
            },
            selected: {
              indicatorColor: '#10B981',
              indicatorHeight: '2px',
              font: {
                color: '#10B981',
                family: 'Inter',
                size: '13px',
                weight: '600',
              },
              unreadIndicator: {
                backgroundColor: '#10B981',
                font: {
                  family: 'Inter',
                  size: '11px',
                  weight: '600',
                },
              },
            },
          },
        },
        tabs: {
          borderRadius: {
            topLeft: '6px',
            topRight: '6px',
          },
          default: {
            font: {
              family: 'Inter',
              size: '13px',
              weight: '500',
            },
            unreadIndicator: {
              font: {
                family: 'Inter',
                size: '11px',
                weight: '600',
              },
            },
          },
          selected: {
            indicatorColor: '#10B981',
            indicatorHeight: '2px',
            font: {
              color: '#10B981',
              family: 'Inter',
              size: '13px',
              weight: '600',
            },
            unreadIndicator: {
              backgroundColor: '#10B981',
              font: {
                family: 'Inter',
                size: '11px',
                weight: '600',
              },
            },
          },
        },
        actions: {
          animation: {
            transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            initialTransform: 'translate3d(12px, -12px, 0) scale(0.96)',
            visibleTransform: 'translate3d(0, 0, 0) scale(1)',
          },
        },
      },
      list: {
        backgroundColor: '#FFFFFF',
        item: {
          unreadIndicatorColor: '#10B981',
          title: {
            family: 'Inter',
            size: '14px',
            weight: '600',
          },
          subtitle: {
            family: 'Inter',
            size: '13px',
          },
          time: {
            family: 'Inter',
            size: '12px',
          },
          actions: {
            font: {
              family: 'Inter',
              size: '13px',
            },
          },
        },
      },
      empty: {
        title: {
          font: {
            family: 'Inter',
            size: '16px',
            weight: '600',
          },
        },
        button: {
          font: {
            family: 'Inter',
            size: '14px',
            weight: '500',
          },
        },
      },
      error: {
        title: {
          font: {
            family: 'Inter',
            size: '16px',
            weight: '600',
          },
        },
        button: {
          font: {
            family: 'Inter',
            size: '14px',
            weight: '500',
          },
        },
      },
    },
  },
  roboto: {
    popup: {
      button: {
        unreadDotIndicator: {
          backgroundColor: '#EF4444',
          borderRadius: '50%',
          height: '9px',
          width: '9px',
        },
      },
      window: {
        borderRadius: '16px',
        border: '1px solid #F3F4F6',
        shadow: '0px 16px 32px -8px rgba(0, 0, 0, 0.2)',
        animation: {
          transition: 'all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          initialTransform: 'translate3d(-12px, -24px, 0) scale(0.9)',
          visibleTransform: 'translate3d(0, 0, 0) scale(1)',
        },
      },
    },
    inbox: {
      header: {
        backgroundColor: '#FFFFFF',
        shadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
        feeds: {
          button: {
            font: {
              family: 'Roboto',
              size: '16px',
              weight: '500',
            },
            unreadCountIndicator: {
              backgroundColor: '#EF4444',
              borderRadius: '8px',
              padding: '4px 10px',
              font: {
                family: 'Roboto',
                size: '12px',
                weight: '700',
              },
            },
          },
          menu: {
            borderRadius: '12px',
            shadow: '0px 8px 16px -4px rgba(0, 0, 0, 0.15)',
            animation: {
              transition: 'all 350ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              initialTransform: 'translate3d(-10px, -18px, 0) scale(0.92)',
              visibleTransform: 'translate3d(0, 0, 0) scale(1)',
            },
            list: {
              font: {
                family: 'Roboto',
                size: '15px',
              },
              selectedIcon: {
                color: '#EF4444',
              },
            },
          },
          tabs: {
            borderRadius: {
              topLeft: '8px',
              topRight: '8px',
            },
            default: {
              font: {
                family: 'Roboto',
                size: '14px',
                weight: '400',
              },
              unreadIndicator: {
                font: {
                  family: 'Roboto',
                  size: '11px',
                  weight: '500',
                },
              },
            },
            selected: {
              indicatorColor: '#EF4444',
              indicatorHeight: '3px',
              font: {
                color: '#EF4444',
                family: 'Roboto',
                size: '14px',
                weight: '700',
              },
              unreadIndicator: {
                backgroundColor: '#EF4444',
                font: {
                  family: 'Roboto',
                  size: '11px',
                  weight: '700',
                },
              },
            },
          },
        },
        tabs: {
          borderRadius: {
            topLeft: '8px',
            topRight: '8px',
          },
          default: {
            font: {
              family: 'Roboto',
              size: '14px',
              weight: '400',
            },
            unreadIndicator: {
              font: {
                family: 'Roboto',
                size: '11px',
                weight: '500',
              },
            },
          },
          selected: {
            indicatorColor: '#EF4444',
            indicatorHeight: '3px',
            font: {
              color: '#EF4444',
              family: 'Roboto',
              size: '14px',
              weight: '700',
            },
            unreadIndicator: {
              backgroundColor: '#EF4444',
              font: {
                family: 'Roboto',
                size: '11px',
                weight: '700',
              },
            },
          },
        },
        actions: {
          animation: {
            transition: 'all 350ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            initialTransform: 'translate3d(12px, -18px, 0) scale(0.92)',
            visibleTransform: 'translate3d(0, 0, 0) scale(1)',
          },
        },
      },
      list: {
        backgroundColor: '#FAFAFA',
        item: {
          unreadIndicatorColor: '#EF4444',
          title: {
            family: 'Roboto',
            size: '15px',
            weight: '500',
          },
          subtitle: {
            family: 'Roboto',
            size: '14px',
          },
          time: {
            family: 'Roboto',
            size: '13px',
          },
          actions: {
            font: {
              family: 'Roboto',
              size: '14px',
            },
          },
        },
      },
      empty: {
        title: {
          font: {
            family: 'Roboto',
            size: '18px',
            weight: '500',
          },
        },
        button: {
          font: {
            family: 'Roboto',
            size: '15px',
            weight: '500',
          },
        },
      },
      error: {
        title: {
          font: {
            family: 'Roboto',
            size: '18px',
            weight: '500',
          },
        },
        button: {
          font: {
            family: 'Roboto',
            size: '15px',
            weight: '500',
          },
        },
      },
    },
  },
  'open-sans': {
    popup: {
      button: {
        unreadDotIndicator: {
          backgroundColor: '#3B82F6',
          borderRadius: '50%',
          height: '8px',
          width: '8px',
        },
      },
      window: {
        borderRadius: '10px',
        border: '1px solid #D1D5DB',
        shadow: '0px 10px 20px -5px rgba(0, 0, 0, 0.1)',
        animation: {
          transition: 'all 250ms ease-out',
          initialTransform: 'translate3d(0, -10px, 0) scale(0.98)',
          visibleTransform: 'translate3d(0, 0, 0) scale(1)',
        },
      },
    },
    inbox: {
      header: {
        backgroundColor: '#F3F4F6',
        border: '1px solid #D1D5DB',
        feeds: {
          button: {
            font: {
              family: 'Open Sans',
              size: '15px',
              weight: '600',
            },
            unreadCountIndicator: {
              backgroundColor: '#3B82F6',
              borderRadius: '5px',
              padding: '2px 7px',
              font: {
                family: 'Open Sans',
                size: '11px',
                weight: '600',
              },
            },
          },
          menu: {
            borderRadius: '10px',
            shadow: '0px 5px 10px -3px rgba(0, 0, 0, 0.1)',
            animation: {
              transition: 'all 250ms ease-out',
              initialTransform: 'translate3d(0, -10px, 0) scale(0.98)',
              visibleTransform: 'translate3d(0, 0, 0) scale(1)',
            },
            list: {
              font: {
                family: 'Open Sans',
                size: '14px',
              },
              selectedIcon: {
                color: '#3B82F6',
              },
            },
          },
          tabs: {
            borderRadius: {
              topLeft: '5px',
              topRight: '5px',
            },
            default: {
              font: {
                family: 'Open Sans',
                size: '13px',
                weight: '400',
              },
              unreadIndicator: {
                font: {
                  family: 'Open Sans',
                  size: '11px',
                  weight: '600',
                },
              },
            },
            selected: {
              indicatorColor: '#3B82F6',
              indicatorHeight: '2px',
              font: {
                color: '#3B82F6',
                family: 'Open Sans',
                size: '13px',
                weight: '700',
              },
              unreadIndicator: {
                backgroundColor: '#3B82F6',
                font: {
                  family: 'Open Sans',
                  size: '11px',
                  weight: '700',
                },
              },
            },
          },
        },
        tabs: {
          borderRadius: {
            topLeft: '5px',
            topRight: '5px',
          },
          default: {
            font: {
              family: 'Open Sans',
              size: '13px',
              weight: '400',
            },
            unreadIndicator: {
              font: {
                family: 'Open Sans',
                size: '11px',
                weight: '600',
              },
            },
          },
          selected: {
            indicatorColor: '#3B82F6',
            indicatorHeight: '2px',
            font: {
              color: '#3B82F6',
              family: 'Open Sans',
              size: '13px',
              weight: '700',
            },
            unreadIndicator: {
              backgroundColor: '#3B82F6',
              font: {
                family: 'Open Sans',
                size: '11px',
                weight: '700',
              },
            },
          },
        },
        actions: {
          animation: {
            transition: 'all 250ms ease-out',
            initialTransform: 'translate3d(10px, -10px, 0) scale(0.98)',
            visibleTransform: 'translate3d(0, 0, 0) scale(1)',
          },
        },
      },
      list: {
        backgroundColor: '#FFFFFF',
        item: {
          unreadIndicatorColor: '#3B82F6',
          title: {
            family: 'Open Sans',
            size: '14px',
            weight: '600',
          },
          subtitle: {
            family: 'Open Sans',
            size: '13px',
          },
          time: {
            family: 'Open Sans',
            size: '12px',
          },
          actions: {
            font: {
              family: 'Open Sans',
              size: '13px',
            },
          },
        },
      },
      empty: {
        title: {
          font: {
            family: 'Open Sans',
            size: '17px',
            weight: '600',
          },
        },
        button: {
          font: {
            family: 'Open Sans',
            size: '14px',
            weight: '600',
          },
        },
      },
      error: {
        title: {
          font: {
            family: 'Open Sans',
            size: '17px',
            weight: '600',
          },
        },
        button: {
          font: {
            family: 'Open Sans',
            size: '14px',
            weight: '600',
          },
        },
      },
    },
  },
};

export const themePresetLabels: Record<ThemePreset, string> = {
  default: 'Default',
  poppins: 'Poppins',
  inter: 'Inter',
  roboto: 'Roboto',
  'open-sans': 'Open Sans',
};

