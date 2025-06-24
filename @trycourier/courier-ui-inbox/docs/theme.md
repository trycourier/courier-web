# `CourierInboxTheme`

The theme type used to style the `courier-inbox` and `courier-inbox-popup-menu`.

```ts
export type CourierInboxTheme = {
  popup?: {
    button?: {
      icon?: {
        color?: string;
        svg?: string;
      };
      backgroundColor?: string;
      hoverBackgroundColor?: string;
      activeBackgroundColor?: string;
      unreadIndicator?: {
        font?: {
          family?: string;
          weight?: string;
          size?: string;
          color?: string;
        };
        backgroundColor?: string;
        borderRadius?: string;
      };
    };
    window?: {
      backgroundColor?: string;
      borderRadius?: string;
      border?: string;
      shadow?: string;
    };
  };
  inbox?: {
    header?: {
      backgroundColor?: string;
      shadow?: string;
      filters?: {
        font?: {
          family?: string;
          weight?: string;
          size?: string;
          color?: string;
        };
        inbox?: {
          icon?: {
            color?: string;
            svg?: string;
          };
          text?: string;
        };
        archive?: {
          icon?: {
            color?: string;
            svg?: string;
          };
          text?: string;
        };
        unreadIndicator?: {
          font?: {
            family?: string;
            weight?: string;
            size?: string;
            color?: string;
          };
          backgroundColor?: string;
          borderRadius?: string;
        };
      };
      menus?: {
        popup?: {
          backgroundColor?: string;
          border?: string;
          borderRadius?: string;
          shadow?: string;
          list?: {
            font?: {
              family?: string;
              weight?: string;
              size?: string;
              color?: string;
            };
            selectionIcon?: {
              color?: string;
              svg?: string;
            };
            hoverBackgroundColor?: string;
            activeBackgroundColor?: string;
            divider?: string;
          };
        };
        filters?: {
          button?: {
            icon?: {
              color?: string;
              svg?: string;
            };
            backgroundColor?: string;
            hoverBackgroundColor?: string;
            activeBackgroundColor?: string;
          };
          inbox?: {
            icon?: {
              color?: string;
              svg?: string;
            };
            text?: string;
          };
          archive?: {
            icon?: {
              color?: string;
              svg?: string;
            };
            text?: string;
          };
        };
        actions?: {
          button?: {
            icon?: {
              color?: string;
              svg?: string;
            };
            backgroundColor?: string;
            hoverBackgroundColor?: string;
            activeBackgroundColor?: string;
          };
          markAllRead?: {
            icon?: {
              color?: string;
              svg?: string;
            };
            text?: string;
          };
          archiveAll?: {
            icon?: {
              color?: string;
              svg?: string;
            };
            text?: string;
          };
          archiveRead?: {
            icon?: {
              color?: string;
              svg?: string;
            };
            text?: string;
          };
        };
      };
    };
    list?: {
      backgroundColor?: string;
      item?: {
        unreadIndicatorColor?: string;
        backgroundColor?: string;
        hoverBackgroundColor?: string;
        activeBackgroundColor?: string;
        title?: {
          family?: string;
          weight?: string;
          size?: string;
          color?: string;
        };
        subtitle?: {
          family?: string;
          weight?: string;
          size?: string;
          color?: string;
        };
        time?: {
          family?: string;
          weight?: string;
          size?: string;
          color?: string;
        };
        archiveIcon?: {
          color?: string;
          svg?: string;
        };
        divider?: string;
        actions?: {
          backgroundColor?: string;
          hoverBackgroundColor?: string;
          activeBackgroundColor?: string;
          border?: string;
          borderRadius?: string;
          shadow?: string;
          font?: {
            family?: string;
            weight?: string;
            size?: string;
            color?: string;
          };
        };
        menu?: {
          enabled?: boolean;
          backgroundColor?: string;
          border?: string;
          borderRadius?: string;
          shadow?: string;
          longPress?: {
            displayDuration?: number;
            vibrationDuration?: number;
          };
          item?: {
            hoverBackgroundColor?: string;
            activeBackgroundColor?: string;
            borderRadius?: string;
            read?: {
              color?: string;
              svg?: string;
            };
            unread?: {
              color?: string;
              svg?: string;
            };
            archive?: {
              color?: string;
              svg?: string;
            };
            unarchive?: {
              color?: string;
              svg?: string;
            };
          };
        };
      };
    };
    loading?: {
      animation?: {
        barColor?: string;
        barHeight?: string;
        barBorderRadius?: string;
        duration?: string;
      };
      divider?: string;
    };
    empty?: {
      title?: {
        font?: {
          family?: string;
          weight?: string;
          size?: string;
          color?: string;
        };
        text?: string;
      };
      button?: {
        font?: {
          family?: string;
          weight?: string;
          size?: string;
          color?: string;
        };
        text?: string;
        shadow?: string;
        border?: string;
        borderRadius?: string;
        backgroundColor?: string;
        hoverBackgroundColor?: string;
        activeBackgroundColor?: string;
      };
    };
    error?: {
      title?: {
        font?: {
          family?: string;
          weight?: string;
          size?: string;
          color?: string;
        };
        text?: string;
      };
      button?: {
        font?: {
          family?: string;
          weight?: string;
          size?: string;
          color?: string;
        };
        text?: string;
        shadow?: string;
        border?: string;
        borderRadius?: string;
        backgroundColor?: string;
        hoverBackgroundColor?: string;
        activeBackgroundColor?: string;
      };
    };
  };
};
```