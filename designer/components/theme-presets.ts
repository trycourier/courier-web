import type { CourierInboxTheme } from '@trycourier/courier-react';

export type ThemePreset = 'default' | 'poppins' | 'inter' | 'roboto' | 'open-sans';

export interface ThemePresetPair {
  light: CourierInboxTheme;
  dark: CourierInboxTheme;
}

export const themePresets: Record<ThemePreset, ThemePresetPair> = {
  default: {
    light: {
      // Default theme - no customizations
    },
    dark: {
      // Default dark theme - no customizations
    },
  },
  poppins: {
    light: {
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
    dark: {
      popup: {
        button: {
          unreadDotIndicator: {
            backgroundColor: '#A78BFA',
          },
        },
        window: {
          border: '1px solid #374151',
          shadow: '0px 4px 8px -2px rgba(0, 0, 0, 0.3)',
          animation: {
            transition: 'all 200ms cubic-bezier(0.16, 1, 0.22, 1)',
            initialTransform: 'translate3d(-8px, -16px, 0) scale(0.97)',
            visibleTransform: 'translate3d(0, 0, 0) scale(1)',
          },
        },
      },
      inbox: {
        header: {
          border: '1px solid #374151',
          feeds: {
            button: {
              font: {
                family: 'Poppins',
                color: '#F9FAFB',
              },
              unreadCountIndicator: {
                backgroundColor: '#A78BFA',
                font: {
                  family: 'Poppins',
                  color: '#FFFFFF',
                },
              },
            },
            menu: {
              border: '1px solid #374151',
              shadow: '0px 4px 8px -2px rgba(0, 0, 0, 0.3)',
              animation: {
                transition: 'all 200ms cubic-bezier(0.16, 1, 0.22, 1)',
                initialTransform: 'translate3d(-8px, -16px, 0) scale(0.97)',
                visibleTransform: 'translate3d(0, 0, 0) scale(1)',
              },
              list: {
                font: {
                  family: 'Poppins',
                  color: '#F9FAFB',
                },
                selectedIcon: {
                  color: '#A78BFA',
                },
              },
            },
            tabs: {
              default: {
                font: {
                  family: 'Poppins',
                  color: '#D1D5DB',
                },
                unreadIndicator: {
                  font: {
                    family: 'Poppins',
                    color: '#F9FAFB',
                  },
                },
              },
              selected: {
                indicatorColor: '#A78BFA',
                font: {
                  color: '#A78BFA',
                  family: 'Poppins',
                },
                unreadIndicator: {
                  font: {
                    family: 'Poppins',
                    color: '#FFFFFF',
                  },
                },
              },
            },
          },
          tabs: {
            default: {
              font: {
                family: 'Poppins',
                color: '#D1D5DB',
              },
              unreadIndicator: {
                font: {
                  family: 'Poppins',
                  color: '#F9FAFB',
                },
              },
            },
            selected: {
              indicatorColor: '#A78BFA',
              font: {
                color: '#A78BFA',
                family: 'Poppins',
              },
              unreadIndicator: {
                font: {
                  family: 'Poppins',
                  color: '#FFFFFF',
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
            unreadIndicatorColor: '#A78BFA',
            title: {
              family: 'Poppins',
              color: '#F9FAFB',
            },
            subtitle: {
              family: 'Poppins',
              color: '#9CA3AF',
            },
            time: {
              family: 'Poppins',
              color: '#9CA3AF',
            },
            actions: {
              font: {
                family: 'Poppins',
                color: '#F9FAFB',
              },
            },
          },
        },
        empty: {
          title: {
            font: {
              family: 'Poppins',
              color: '#F9FAFB',
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
              color: '#F9FAFB',
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
  },
  inter: {
    light: {
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
          border: '1px solid #E5E7EB',
          feeds: {
            button: {
              font: {
                family: 'Montserrat',
                size: '15px',
                weight: '500',
              },
              unreadCountIndicator: {
                backgroundColor: '#10B981',
                borderRadius: '6px',
                padding: '3px 8px',
                font: {
                  family: 'Montserrat',
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
                  family: 'Montserrat',
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
                  family: 'Montserrat',
                  size: '13px',
                  weight: '500',
                },
                unreadIndicator: {
                  font: {
                    family: 'Montserrat',
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
                  family: 'Montserrat',
                  size: '13px',
                  weight: '600',
                },
                unreadIndicator: {
                  font: {
                    family: 'Montserrat',
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
                family: 'Montserrat',
                size: '13px',
                weight: '500',
              },
              unreadIndicator: {
                font: {
                  family: 'Montserrat',
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
                family: 'Montserrat',
                size: '13px',
                weight: '600',
              },
              unreadIndicator: {
                font: {
                  family: 'Montserrat',
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
          item: {
            unreadIndicatorColor: '#10B981',
            title: {
              family: 'Montserrat',
              size: '14px',
              weight: '600',
            },
            subtitle: {
              family: 'Montserrat',
              size: '13px',
            },
            time: {
              family: 'Montserrat',
              size: '12px',
            },
            actions: {
              font: {
                family: 'Montserrat',
                size: '13px',
              },
            },
          },
        },
        empty: {
          title: {
            font: {
              family: 'Montserrat',
              size: '16px',
              weight: '600',
            },
          },
          button: {
            font: {
              family: 'Montserrat',
              size: '14px',
              weight: '500',
            },
          },
        },
        error: {
          title: {
            font: {
              family: 'Montserrat',
              size: '16px',
              weight: '600',
            },
          },
          button: {
            font: {
              family: 'Montserrat',
              size: '14px',
              weight: '500',
            },
          },
        },
      },
    },
    dark: {
      popup: {
        button: {
          unreadDotIndicator: {
            backgroundColor: '#34D399',
            borderRadius: '50%',
            height: '10px',
            width: '10px',
          },
        },
        window: {
          borderRadius: '12px',
          border: '2px solid #374151',
          shadow: '0px 12px 24px -6px rgba(0, 0, 0, 0.4)',
          animation: {
            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            initialTransform: 'translate3d(0, -20px, 0) scale(0.95)',
            visibleTransform: 'translate3d(0, 0, 0) scale(1)',
          },
        },
      },
      inbox: {
        header: {
          border: '1px solid #374151',
          feeds: {
            button: {
              font: {
                family: 'Montserrat',
                size: '15px',
                weight: '500',
                color: '#F9FAFB',
              },
              unreadCountIndicator: {
                backgroundColor: '#34D399',
                borderRadius: '6px',
                padding: '3px 8px',
                font: {
                  family: 'Montserrat',
                  size: '11px',
                  weight: '600',
                  color: '#111827',
                },
              },
            },
            menu: {
              border: '1px solid #374151',
              borderRadius: '8px',
              shadow: '0px 6px 12px -4px rgba(0, 0, 0, 0.4)',
              animation: {
                transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                initialTransform: 'translate3d(0, -12px, 0) scale(0.96)',
                visibleTransform: 'translate3d(0, 0, 0) scale(1)',
              },
              list: {
                font: {
                  family: 'Montserrat',
                  size: '14px',
                  color: '#F9FAFB',
                },
                selectedIcon: {
                  color: '#34D399',
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
                  family: 'Montserrat',
                  size: '13px',
                  weight: '500',
                  color: '#D1D5DB',
                },
                unreadIndicator: {
                  font: {
                    family: 'Montserrat',
                    size: '11px',
                    weight: '600',
                    color: '#F9FAFB',
                  },
                },
              },
              selected: {
                indicatorColor: '#34D399',
                indicatorHeight: '2px',
                font: {
                  color: '#34D399',
                  family: 'Montserrat',
                  size: '13px',
                  weight: '600',
                },
                unreadIndicator: {
                  font: {
                    family: 'Montserrat',
                    size: '11px',
                    weight: '600',
                    color: '#111827',
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
                family: 'Montserrat',
                size: '13px',
                weight: '500',
                color: '#D1D5DB',
              },
              unreadIndicator: {
                font: {
                  family: 'Montserrat',
                  size: '11px',
                  weight: '600',
                  color: '#F9FAFB',
                },
              },
            },
            selected: {
              indicatorColor: '#34D399',
              indicatorHeight: '2px',
              font: {
                color: '#34D399',
                family: 'Montserrat',
                size: '13px',
                weight: '600',
              },
              unreadIndicator: {
                font: {
                  family: 'Montserrat',
                  size: '11px',
                  weight: '600',
                  color: '#111827',
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
          item: {
            unreadIndicatorColor: '#34D399',
            title: {
              family: 'Montserrat',
              size: '14px',
              weight: '600',
              color: '#F9FAFB',
            },
            subtitle: {
              family: 'Montserrat',
              size: '13px',
              color: '#9CA3AF',
            },
            time: {
              family: 'Montserrat',
              size: '12px',
              color: '#9CA3AF',
            },
            actions: {
              font: {
                family: 'Montserrat',
                size: '13px',
                color: '#F9FAFB',
              },
            },
          },
        },
        empty: {
          title: {
            font: {
              family: 'Montserrat',
              size: '16px',
              weight: '600',
              color: '#F9FAFB',
            },
          },
          button: {
            font: {
              family: 'Montserrat',
              size: '14px',
              weight: '500',
            },
          },
        },
        error: {
          title: {
            font: {
              family: 'Montserrat',
              size: '16px',
              weight: '600',
              color: '#F9FAFB',
            },
          },
          button: {
            font: {
              family: 'Montserrat',
              size: '14px',
              weight: '500',
            },
          },
        },
      },
    },
  },
  roboto: {
    light: {
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
          shadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
          feeds: {
            button: {
              font: {
                family: 'Playfair Display',
                size: '16px',
                weight: '500',
              },
              unreadCountIndicator: {
                backgroundColor: '#EF4444',
                borderRadius: '8px',
                padding: '4px 10px',
                font: {
                  family: 'Playfair Display',
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
                  family: 'Playfair Display',
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
                  family: 'Playfair Display',
                  size: '14px',
                  weight: '400',
                },
                unreadIndicator: {
                  font: {
                    family: 'Playfair Display',
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
                  family: 'Playfair Display',
                  size: '14px',
                  weight: '700',
                },
                unreadIndicator: {
                  font: {
                    family: 'Playfair Display',
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
                family: 'Playfair Display',
                size: '14px',
                weight: '400',
              },
              unreadIndicator: {
                font: {
                  family: 'Playfair Display',
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
                family: 'Playfair Display',
                size: '14px',
                weight: '700',
              },
              unreadIndicator: {
                font: {
                  family: 'Playfair Display',
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
          item: {
            unreadIndicatorColor: '#EF4444',
            title: {
              family: 'Playfair Display',
              size: '15px',
              weight: '500',
            },
            subtitle: {
              family: 'Playfair Display',
              size: '14px',
            },
            time: {
              family: 'Playfair Display',
              size: '13px',
            },
            actions: {
              font: {
                family: 'Playfair Display',
                size: '14px',
              },
            },
          },
        },
        empty: {
          title: {
            font: {
              family: 'Playfair Display',
              size: '18px',
              weight: '500',
            },
          },
          button: {
            font: {
              family: 'Playfair Display',
              size: '15px',
              weight: '500',
            },
          },
        },
        error: {
          title: {
            font: {
              family: 'Playfair Display',
              size: '18px',
              weight: '500',
            },
          },
          button: {
            font: {
              family: 'Playfair Display',
              size: '15px',
              weight: '500',
            },
          },
        },
      },
    },
    dark: {
      popup: {
        button: {
          unreadDotIndicator: {
            backgroundColor: '#F87171',
            borderRadius: '50%',
            height: '9px',
            width: '9px',
          },
        },
        window: {
          borderRadius: '16px',
          border: '1px solid #374151',
          shadow: '0px 16px 32px -8px rgba(0, 0, 0, 0.5)',
          animation: {
            transition: 'all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            initialTransform: 'translate3d(-12px, -24px, 0) scale(0.9)',
            visibleTransform: 'translate3d(0, 0, 0) scale(1)',
          },
        },
      },
      inbox: {
        header: {
          border: '1px solid #374151',
          shadow: 'none',
          feeds: {
            button: {
              font: {
                family: 'Playfair Display',
                size: '16px',
                weight: '500',
                color: '#F9FAFB',
              },
              unreadCountIndicator: {
                backgroundColor: '#F87171',
                borderRadius: '8px',
                padding: '4px 10px',
                font: {
                  family: 'Playfair Display',
                  size: '12px',
                  weight: '700',
                  color: '#FFFFFF',
                },
              },
            },
            menu: {
              border: '1px solid #374151',
              borderRadius: '12px',
              shadow: '0px 8px 16px -4px rgba(0, 0, 0, 0.5)',
              animation: {
                transition: 'all 350ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                initialTransform: 'translate3d(-10px, -18px, 0) scale(0.92)',
                visibleTransform: 'translate3d(0, 0, 0) scale(1)',
              },
              list: {
                font: {
                  family: 'Playfair Display',
                  size: '15px',
                  color: '#F9FAFB',
                },
                selectedIcon: {
                  color: '#F87171',
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
                  family: 'Playfair Display',
                  size: '14px',
                  weight: '400',
                  color: '#D1D5DB',
                },
                unreadIndicator: {
                  font: {
                    family: 'Playfair Display',
                    size: '11px',
                    weight: '500',
                    color: '#F9FAFB',
                  },
                },
              },
              selected: {
                indicatorColor: '#F87171',
                indicatorHeight: '3px',
                font: {
                  color: '#F87171',
                  family: 'Playfair Display',
                  size: '14px',
                  weight: '700',
                },
                unreadIndicator: {
                  font: {
                    family: 'Playfair Display',
                    size: '11px',
                    weight: '700',
                    color: '#FFFFFF',
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
                family: 'Playfair Display',
                size: '14px',
                weight: '400',
                color: '#D1D5DB',
              },
              unreadIndicator: {
                font: {
                  family: 'Playfair Display',
                  size: '11px',
                  weight: '500',
                  color: '#F9FAFB',
                },
              },
            },
            selected: {
              indicatorColor: '#F87171',
              indicatorHeight: '3px',
              font: {
                color: '#F87171',
                family: 'Playfair Display',
                size: '14px',
                weight: '700',
              },
              unreadIndicator: {
                font: {
                  family: 'Playfair Display',
                  size: '11px',
                  weight: '700',
                  color: '#FFFFFF',
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
          item: {
            unreadIndicatorColor: '#F87171',
            title: {
              family: 'Playfair Display',
              size: '15px',
              weight: '500',
              color: '#F9FAFB',
            },
            subtitle: {
              family: 'Playfair Display',
              size: '14px',
              color: '#9CA3AF',
            },
            time: {
              family: 'Playfair Display',
              size: '13px',
              color: '#9CA3AF',
            },
            actions: {
              font: {
                family: 'Playfair Display',
                size: '14px',
                color: '#F9FAFB',
              },
            },
          },
        },
        empty: {
          title: {
            font: {
              family: 'Playfair Display',
              size: '18px',
              weight: '500',
              color: '#F9FAFB',
            },
          },
          button: {
            font: {
              family: 'Playfair Display',
              size: '15px',
              weight: '500',
            },
          },
        },
        error: {
          title: {
            font: {
              family: 'Playfair Display',
              size: '18px',
              weight: '500',
              color: '#F9FAFB',
            },
          },
          button: {
            font: {
              family: 'Playfair Display',
              size: '15px',
              weight: '500',
            },
          },
        },
      },
    },
  },
  'open-sans': {
    light: {
      popup: {
        button: {
          unreadDotIndicator: {
            backgroundColor: '#F97316',
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
          border: '1px solid #D1D5DB',
          feeds: {
            button: {
              font: {
                family: 'Raleway',
                size: '15px',
                weight: '600',
              },
              unreadCountIndicator: {
                backgroundColor: '#F97316',
                borderRadius: '5px',
                padding: '2px 7px',
                font: {
                  family: 'Raleway',
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
                  family: 'Raleway',
                  size: '14px',
                },
                selectedIcon: {
                  color: '#F97316',
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
                  family: 'Raleway',
                  size: '13px',
                  weight: '400',
                },
                unreadIndicator: {
                  font: {
                    family: 'Raleway',
                    size: '11px',
                    weight: '600',
                  },
                },
              },
              selected: {
                indicatorColor: '#F97316',
                indicatorHeight: '2px',
                font: {
                  color: '#F97316',
                  family: 'Raleway',
                  size: '13px',
                  weight: '700',
                },
                unreadIndicator: {
                  font: {
                    family: 'Raleway',
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
                family: 'Raleway',
                size: '13px',
                weight: '400',
              },
              unreadIndicator: {
                font: {
                  family: 'Raleway',
                  size: '11px',
                  weight: '600',
                },
              },
            },
            selected: {
              indicatorColor: '#F97316',
              indicatorHeight: '2px',
              font: {
                color: '#F97316',
                family: 'Raleway',
                size: '13px',
                weight: '700',
              },
              unreadIndicator: {
                font: {
                  family: 'Raleway',
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
          item: {
            unreadIndicatorColor: '#F97316',
            title: {
              family: 'Raleway',
              size: '14px',
              weight: '600',
            },
            subtitle: {
              family: 'Raleway',
              size: '13px',
            },
            time: {
              family: 'Raleway',
              size: '12px',
            },
            actions: {
              font: {
                family: 'Raleway',
                size: '13px',
              },
            },
          },
        },
        empty: {
          title: {
            font: {
              family: 'Raleway',
              size: '17px',
              weight: '600',
            },
          },
          button: {
            font: {
              family: 'Raleway',
              size: '14px',
              weight: '600',
            },
          },
        },
        error: {
          title: {
            font: {
              family: 'Raleway',
              size: '17px',
              weight: '600',
            },
          },
          button: {
            font: {
              family: 'Raleway',
              size: '14px',
              weight: '600',
            },
          },
        },
      },
    },
    dark: {
      popup: {
        button: {
          unreadDotIndicator: {
            backgroundColor: '#FB923C',
            borderRadius: '50%',
            height: '8px',
            width: '8px',
          },
        },
        window: {
          borderRadius: '10px',
          border: '1px solid #374151',
          shadow: '0px 10px 20px -5px rgba(0, 0, 0, 0.3)',
          animation: {
            transition: 'all 250ms ease-out',
            initialTransform: 'translate3d(0, -10px, 0) scale(0.98)',
            visibleTransform: 'translate3d(0, 0, 0) scale(1)',
          },
        },
      },
      inbox: {
        header: {
          border: '1px solid #374151',
          feeds: {
            button: {
              font: {
                family: 'Raleway',
                size: '15px',
                weight: '600',
                color: '#F9FAFB',
              },
              unreadCountIndicator: {
                backgroundColor: '#FB923C',
                borderRadius: '5px',
                padding: '2px 7px',
                font: {
                  family: 'Raleway',
                  size: '11px',
                  weight: '600',
                  color: '#111827',
                },
              },
            },
            menu: {
              border: '1px solid #374151',
              borderRadius: '10px',
              shadow: '0px 5px 10px -3px rgba(0, 0, 0, 0.3)',
              animation: {
                transition: 'all 250ms ease-out',
                initialTransform: 'translate3d(0, -10px, 0) scale(0.98)',
                visibleTransform: 'translate3d(0, 0, 0) scale(1)',
              },
              list: {
                font: {
                  family: 'Raleway',
                  size: '14px',
                  color: '#F9FAFB',
                },
                selectedIcon: {
                  color: '#FB923C',
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
                  family: 'Raleway',
                  size: '13px',
                  weight: '400',
                  color: '#D1D5DB',
                },
                unreadIndicator: {
                  font: {
                    family: 'Raleway',
                    size: '11px',
                    weight: '600',
                    color: '#F9FAFB',
                  },
                },
              },
              selected: {
                indicatorColor: '#FB923C',
                indicatorHeight: '2px',
                font: {
                  color: '#FB923C',
                  family: 'Raleway',
                  size: '13px',
                  weight: '700',
                },
                unreadIndicator: {
                  font: {
                    family: 'Raleway',
                    size: '11px',
                    weight: '700',
                    color: '#111827',
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
                family: 'Raleway',
                size: '13px',
                weight: '400',
                color: '#D1D5DB',
              },
              unreadIndicator: {
                font: {
                  family: 'Raleway',
                  size: '11px',
                  weight: '600',
                  color: '#F9FAFB',
                },
              },
            },
            selected: {
              indicatorColor: '#FB923C',
              indicatorHeight: '2px',
              font: {
                color: '#FB923C',
                family: 'Raleway',
                size: '13px',
                weight: '700',
              },
              unreadIndicator: {
                font: {
                  family: 'Raleway',
                  size: '11px',
                  weight: '700',
                  color: '#111827',
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
          item: {
            unreadIndicatorColor: '#FB923C',
            title: {
              family: 'Raleway',
              size: '14px',
              weight: '600',
              color: '#F9FAFB',
            },
            subtitle: {
              family: 'Raleway',
              size: '13px',
              color: '#9CA3AF',
            },
            time: {
              family: 'Raleway',
              size: '12px',
              color: '#9CA3AF',
            },
            actions: {
              font: {
                family: 'Raleway',
                size: '13px',
                color: '#F9FAFB',
              },
            },
          },
        },
        empty: {
          title: {
            font: {
              family: 'Raleway',
              size: '17px',
              weight: '600',
              color: '#F9FAFB',
            },
          },
          button: {
            font: {
              family: 'Raleway',
              size: '14px',
              weight: '600',
            },
          },
        },
        error: {
          title: {
            font: {
              family: 'Raleway',
              size: '17px',
              weight: '600',
              color: '#F9FAFB',
            },
          },
          button: {
            font: {
              family: 'Raleway',
              size: '14px',
              weight: '600',
            },
          },
        },
      },
    },
  },
};

export const themePresetLabels: Record<ThemePreset, string> = {
  default: 'Default',
  poppins: 'Poppins',
  inter: 'Montserrat',
  roboto: 'Playfair Display',
  'open-sans': 'Raleway',
};

