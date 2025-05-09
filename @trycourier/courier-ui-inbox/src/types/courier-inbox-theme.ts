import { CourierColors, CourierIconSource, SystemThemeMode } from "@trycourier/courier-ui-core";

export type CourierInboxFont = {
  family?: string;
  weight?: string;
  size?: string;
  color?: string;
}

export type CourierInboxIcon = {
  color?: string;
  svg?: string;
}

export type CourierInboxFilterItem = {
  icon?: CourierInboxIcon;
  text?: string;
}

export type CourierInboxUnreadIndicator = {
  font?: CourierInboxFont;
  backgroundColor?: string;
  borderRadius?: string;
}

export type CourierInboxIconButton = {
  icon?: CourierInboxIcon;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;
}

export type CourierInboxButton = {
  font?: CourierInboxFont;
  text?: string;
  shadow?: string;
  border?: string;
  borderRadius?: string;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;
}

export type CourierInboxMenuButton = CourierInboxIconButton & {
  unreadIndicator?: CourierInboxUnreadIndicator;
}

export type CourierInboxPopup = {
  backgroundColor?: string;
  border?: string;
  borderRadius?: string;
  shadow?: string;
  list?: {
    font?: CourierInboxFont;
    selectionIcon?: CourierInboxIcon;
    hoverColor?: string;
    activeColor?: string;
    divider?: string;
    items?: CourierInboxFilterMenuListItem;
  };
}

export type CourierInboxFilterMenuListItem = {
  inbox?: CourierInboxFilterItem;
  archive?: CourierInboxFilterItem;
}

export type CourierInboxListItem = {
  unreadIndicatorColor?: string;
  hoverColor?: string;
  activeColor?: string;
  title?: CourierInboxFont;
  subtitle?: CourierInboxFont;
  time?: CourierInboxFont;
  archiveIcon?: CourierInboxIcon;
  divider?: string;
}

export type CourierInboxSkeletonLoadingState = {
  animation?: {
    color?: string;
    height?: string;
    borderRadius?: string;
    duration?: string;
  },
  divider?: string;
}

export type CourierInboxInfoState = {
  title?: {
    font?: CourierInboxFont;
    text?: string;
  },
  button?: CourierInboxButton;
}

export type CourierInboxTheme = {
  popup?: {
    button?: CourierInboxMenuButton;
    window?: {
      backgroundColor?: string;
      borderRadius?: string;
      border?: string;
      shadow?: string;
    };
  }
  inbox?: {
    header?: {
      backgroundColor?: string;
      shadow?: string;
      filters?: {
        font?: CourierInboxFont;
        inbox?: CourierInboxFilterItem;
        archive?: CourierInboxFilterItem;
        unreadIndicator?: CourierInboxUnreadIndicator;
      }
      menu?: {
        button?: CourierInboxIconButton;
        popup?: CourierInboxPopup;
      }
    }
    list?: {
      backgroundColor?: string;
      item?: CourierInboxListItem;
    },
    loading?: CourierInboxSkeletonLoadingState,
    empty?: CourierInboxInfoState,
    error?: CourierInboxInfoState
  }
};

export const defaultLightTheme: CourierInboxTheme = {
  popup: {
    button: {
      icon: {
        color: CourierColors.black[500],
        svg: CourierIconSource.inbox
      },
      backgroundColor: 'transparent',
      hoverBackgroundColor: CourierColors.black[500_10],
      activeBackgroundColor: CourierColors.black[500_20],
      unreadIndicator: {
        font: {
          color: CourierColors.white[500],
          size: '14px',
          family: undefined,
          weight: undefined
        },
        backgroundColor: CourierColors.blue[500],
        borderRadius: '12px'
      }
    },
    window: {
      backgroundColor: CourierColors.white[500],
      borderRadius: '8px',
      border: `1px solid ${CourierColors.gray[500]}`,
      shadow: `0px 8px 16px -4px ${CourierColors.gray[500]}`
    }
  },
  inbox: {
    header: {
      backgroundColor: CourierColors.white[500],
      shadow: `0px 1px 0px 0px ${CourierColors.gray[500]}`,
      filters: {
        font: {
          color: CourierColors.black[500],
          family: undefined,
          size: '18px'
        },
        inbox: {
          icon: {
            color: CourierColors.black[500],
            svg: CourierIconSource.inbox
          },
          text: 'Inbox'
        },
        archive: {
          icon: {
            color: CourierColors.black[500],
            svg: CourierIconSource.archive
          },
          text: 'Archive'
        },
        unreadIndicator: {
          font: {
            color: CourierColors.white[500],
            family: undefined,
            size: '14px'
          },
          backgroundColor: CourierColors.blue[500],
          borderRadius: '12px'
        }
      },
      menu: {
        button: {
          icon: {
            color: CourierColors.black[500],
            svg: CourierIconSource.filter
          },
          backgroundColor: 'transparent',
          hoverBackgroundColor: CourierColors.black[500_10],
          activeBackgroundColor: CourierColors.black[500_20]
        },
        popup: {
          backgroundColor: CourierColors.white[500],
          border: `1px solid ${CourierColors.gray[500]}`,
          borderRadius: '4px',
          shadow: `0px 4px 8px -2px ${CourierColors.gray[500]}`,
          list: {
            hoverColor: CourierColors.gray[200],
            activeColor: CourierColors.gray[500],
            divider: `none`,
            font: {
              color: CourierColors.black[500],
              family: undefined,
              size: '14px'
            },
            selectionIcon: {
              color: CourierColors.black[500],
              svg: CourierIconSource.check
            },
            items: {
              inbox: {
                icon: {
                  color: CourierColors.black[500],
                  svg: CourierIconSource.inbox
                },
                text: 'Inbox'
              },
              archive: {
                icon: {
                  color: CourierColors.black[500],
                  svg: CourierIconSource.archive
                },
                text: 'Archive'
              }
            }
          }
        }
      }
    },
    list: {
      backgroundColor: CourierColors.white[500],
      item: {
        unreadIndicatorColor: CourierColors.blue[500],
        hoverColor: CourierColors.gray[200],
        activeColor: CourierColors.gray[500],
        title: {
          color: CourierColors.black[500],
          family: undefined,
          size: '14px'
        },
        subtitle: {
          color: CourierColors.gray[600],
          family: undefined,
          size: '14px'
        },
        time: {
          color: CourierColors.gray[500],
          family: undefined,
          size: '12px'
        },
        divider: `1px solid ${CourierColors.gray[200]}`
      }
    },
    loading: {
      animation: {
        color: CourierColors.gray[500],
        height: '14px',
        borderRadius: '14px',
        duration: '2s'
      },
      divider: `1px solid ${CourierColors.gray[200]}`
    }
  }
};

export const defaultDarkTheme: CourierInboxTheme = {
  popup: {
    button: {
      icon: {
        color: CourierColors.white[500],
        svg: CourierIconSource.inbox
      },
      backgroundColor: 'transparent',
      hoverBackgroundColor: CourierColors.white[500_10],
      activeBackgroundColor: CourierColors.white[500_20],
      unreadIndicator: {
        font: {
          color: CourierColors.white[500],
          size: '14px',
          family: undefined,
          weight: undefined
        },
        backgroundColor: CourierColors.blue[500],
        borderRadius: '12px'
      }
    },
    window: {
      backgroundColor: CourierColors.black[500],
      borderRadius: '8px',
      border: `1px solid ${CourierColors.gray[400]}`,
      shadow: `0px 4px 8px -2px ${CourierColors.white[500_20]}`
    }
  },
  inbox: {
    header: {
      backgroundColor: CourierColors.black[500],
      shadow: `0px 1px 0px 0px ${CourierColors.gray[400]}`,
      filters: {
        font: {
          color: CourierColors.white[500],
          family: undefined,
          size: '18px'
        },
        inbox: {
          icon: {
            color: CourierColors.white[500],
            svg: CourierIconSource.inbox
          },
          text: 'Inbox'
        },
        archive: {
          icon: {
            color: CourierColors.white[500],
            svg: CourierIconSource.archive
          },
          text: 'Archive'
        },
        unreadIndicator: {
          font: {
            color: CourierColors.white[500],
            family: undefined,
            size: '14px'
          },
          backgroundColor: CourierColors.blue[500],
          borderRadius: '12px'
        }
      },
      menu: {
        button: {
          icon: {
            color: CourierColors.white[500],
            svg: CourierIconSource.filter
          },
          backgroundColor: 'transparent',
          hoverBackgroundColor: CourierColors.white[500_10],
          activeBackgroundColor: CourierColors.white[500_20]
        },
        popup: {
          backgroundColor: CourierColors.black[500],
          border: `1px solid ${CourierColors.gray[400]}`,
          borderRadius: '4px',
          shadow: `0px 4px 8px -2px ${CourierColors.white[500_20]}`,
          list: {
            hoverColor: CourierColors.white[500_10],
            activeColor: CourierColors.white[500_20],
            divider: `none`,
            font: {
              color: CourierColors.white[500],
              family: undefined,
              size: '14px'
            },
            selectionIcon: {
              color: CourierColors.white[500],
              svg: CourierIconSource.check
            },
            items: {
              inbox: {
                icon: {
                  color: CourierColors.white[500],
                  svg: CourierIconSource.inbox
                },
                text: 'Inbox'
              },
              archive: {
                icon: {
                  color: CourierColors.white[500],
                  svg: CourierIconSource.archive
                },
                text: 'Archive'
              }
            }
          }
        }
      }
    },
    list: {
      backgroundColor: CourierColors.black[500],
      item: {
        unreadIndicatorColor: CourierColors.blue[500],
        hoverColor: CourierColors.white[500_10],
        activeColor: CourierColors.white[500_20],
        title: {
          color: CourierColors.white[500],
          family: undefined,
          size: '14px'
        },
        subtitle: {
          color: CourierColors.gray[500],
          family: undefined,
          size: '14px'
        },
        time: {
          color: CourierColors.gray[500],
          family: undefined,
          size: '12px'
        },
        divider: `1px solid ${CourierColors.gray[400]}`
      }
    },
    loading: {
      animation: {
        color: CourierColors.white[500],
        height: '14px',
        borderRadius: '14px',
        duration: '2s'
      },
      divider: `1px solid ${CourierColors.gray[400]}`
    }
  }
};

// Deep merge the themes, only overwriting non-optional properties
export const mergeTheme = (mode: SystemThemeMode, theme: CourierInboxTheme): CourierInboxTheme => {
  const defaultTheme = mode === 'light' ? defaultLightTheme : defaultDarkTheme;
  return {
    popup: {
      button: {
        ...defaultTheme.popup?.button,
        ...theme.popup?.button,
        icon: {
          ...defaultTheme.popup?.button?.icon,
          ...theme.popup?.button?.icon
        },
        unreadIndicator: {
          ...defaultTheme.popup?.button?.unreadIndicator,
          ...theme.popup?.button?.unreadIndicator
        }
      },
      window: {
        ...defaultTheme.popup?.window,
        ...theme.popup?.window
      }
    },
    inbox: {
      header: {
        ...defaultTheme.inbox?.header,
        ...theme.inbox?.header,
        filters: {
          ...defaultTheme.inbox?.header?.filters,
          ...theme.inbox?.header?.filters,
          inbox: {
            ...defaultTheme.inbox?.header?.filters?.inbox,
            ...theme.inbox?.header?.filters?.inbox,
            icon: {
              ...defaultTheme.inbox?.header?.filters?.inbox?.icon,
              ...theme.inbox?.header?.filters?.inbox?.icon
            }
          },
          archive: {
            ...defaultTheme.inbox?.header?.filters?.archive,
            ...theme.inbox?.header?.filters?.archive,
            icon: {
              ...defaultTheme.inbox?.header?.filters?.archive?.icon,
              ...theme.inbox?.header?.filters?.archive?.icon
            }
          },
          unreadIndicator: {
            ...defaultTheme.inbox?.header?.filters?.unreadIndicator,
            ...theme.inbox?.header?.filters?.unreadIndicator
          }
        },
        menu: {
          ...defaultTheme.inbox?.header?.menu,
          ...theme.inbox?.header?.menu,
          button: {
            ...defaultTheme.inbox?.header?.menu?.button,
            ...theme.inbox?.header?.menu?.button,
            icon: {
              ...defaultTheme.inbox?.header?.menu?.button?.icon,
              ...theme.inbox?.header?.menu?.button?.icon
            }
          }
        }
      },
      list: {
        ...defaultTheme.inbox?.list,
        ...theme.inbox?.list,
        item: {
          ...defaultTheme.inbox?.list?.item,
          ...theme.inbox?.list?.item
        }
      },
      loading: {
        ...defaultTheme.inbox?.loading,
        ...theme.inbox?.loading,
      },
      empty: {
        ...defaultTheme.inbox?.empty,
        ...theme.inbox?.empty
      },
      error: {
        ...defaultTheme.inbox?.error,
        ...theme.inbox?.error
      }
    }
  };
};
