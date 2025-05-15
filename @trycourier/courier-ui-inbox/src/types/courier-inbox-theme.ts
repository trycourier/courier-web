import { CourierColors, CourierIconSVGs, SystemThemeMode } from "@trycourier/courier-ui-core";

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
    hoverBackgroundColor?: string;
    activeBackgroundColor?: string;
    divider?: string;
  };
}

export type CourierInboxListItem = {
  unreadIndicatorColor?: string;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;
  title?: CourierInboxFont;
  subtitle?: CourierInboxFont;
  time?: CourierInboxFont;
  archiveIcon?: CourierInboxIcon;
  divider?: string;
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
      read?: CourierInboxIcon;
      unread?: CourierInboxIcon;
      archive?: CourierInboxIcon;
      unarchive?: CourierInboxIcon;
    };
  };
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

export type CourierMenuItem = {
  icon?: CourierInboxIcon;
  text?: string;
}

export type CourierFilterMenu = {
  button?: CourierInboxIconButton;
  inbox?: CourierMenuItem;
  archive?: CourierMenuItem;
}

export type CourierActionMenu = {
  button?: CourierInboxIconButton;
  markAllRead?: CourierMenuItem;
  archiveAll?: CourierMenuItem;
  archiveRead?: CourierMenuItem;
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
      menus?: {
        popup?: CourierInboxPopup;
        filters?: CourierFilterMenu;
        actions?: CourierActionMenu;
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
        svg: CourierIconSVGs.inbox
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
            svg: CourierIconSVGs.inbox
          },
          text: 'Inbox'
        },
        archive: {
          icon: {
            color: CourierColors.black[500],
            svg: CourierIconSVGs.archive
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
      menus: {
        popup: {
          backgroundColor: CourierColors.white[500],
          border: `1px solid ${CourierColors.gray[500]}`,
          borderRadius: '4px',
          shadow: `0px 4px 8px -2px ${CourierColors.gray[500]}`,
          list: {
            hoverBackgroundColor: CourierColors.gray[200],
            activeBackgroundColor: CourierColors.gray[500],
            divider: `none`,
            font: {
              color: CourierColors.black[500],
              family: undefined,
              size: '14px'
            },
            selectionIcon: {
              color: CourierColors.black[500],
              svg: CourierIconSVGs.check
            }
          }
        },
        filters: {
          button: {
            icon: {
              color: CourierColors.black[500],
              svg: CourierIconSVGs.filter
            },
            backgroundColor: 'transparent',
            hoverBackgroundColor: CourierColors.black[500_10],
            activeBackgroundColor: CourierColors.black[500_20],
          },
          inbox: {
            icon: {
              color: CourierColors.black[500],
              svg: CourierIconSVGs.inbox
            },
            text: 'Inbox'
          },
          archive: {
            icon: {
              color: CourierColors.black[500],
              svg: CourierIconSVGs.archive
            },
            text: 'Archive'
          }
        },
        actions: {
          button: {
            icon: {
              color: CourierColors.black[500],
              svg: CourierIconSVGs.overflow
            },
            backgroundColor: 'transparent',
            hoverBackgroundColor: CourierColors.black[500_10],
            activeBackgroundColor: CourierColors.black[500_20],
          },
          markAllRead: {
            icon: {
              color: CourierColors.black[500],
              svg: CourierIconSVGs.read
            },
            text: 'Mark All as Read'
          },
          archiveAll: {
            icon: {
              color: CourierColors.black[500],
              svg: CourierIconSVGs.archive
            },
            text: 'Archive All'
          },
          archiveRead: {
            icon: {
              color: CourierColors.black[500],
              svg: CourierIconSVGs.archiveRead
            },
            text: 'Archive Read'
          }
        },
      }
    },
    list: {
      backgroundColor: CourierColors.white[500],
      item: {
        backgroundColor: 'transparent',
        unreadIndicatorColor: CourierColors.blue[500],
        hoverBackgroundColor: CourierColors.gray[200],
        activeBackgroundColor: CourierColors.gray[500],
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
          color: CourierColors.gray[600],
          family: undefined,
          size: '14px'
        },
        divider: `1px solid ${CourierColors.gray[200]}`,
        menu: {
          enabled: true,
          backgroundColor: CourierColors.white[500],
          border: `1px solid ${CourierColors.gray[500]}`,
          borderRadius: '4px',
          shadow: `0px 2px 4px -2px ${CourierColors.gray[500]}`,
          longPress: {
            displayDuration: 4000,
            vibrationDuration: 50
          },
          item: {
            hoverBackgroundColor: CourierColors.gray[200],
            activeBackgroundColor: CourierColors.gray[500],
            borderRadius: '0px',
            read: {
              color: CourierColors.black[500],
              svg: CourierIconSVGs.read
            },
            unread: {
              color: CourierColors.black[500],
              svg: CourierIconSVGs.unread
            },
            archive: {
              color: CourierColors.black[500],
              svg: CourierIconSVGs.archive
            },
            unarchive: {
              color: CourierColors.black[500],
              svg: CourierIconSVGs.unarchive
            }
          }
        }
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
        svg: CourierIconSVGs.inbox
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
            svg: CourierIconSVGs.inbox
          },
          text: 'Inbox'
        },
        archive: {
          icon: {
            color: CourierColors.white[500],
            svg: CourierIconSVGs.archive
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
      menus: {
        popup: {
          backgroundColor: CourierColors.black[500],
          border: `1px solid ${CourierColors.gray[400]}`,
          borderRadius: '4px',
          shadow: `0px 4px 8px -2px ${CourierColors.white[500_20]}`,
          list: {
            hoverBackgroundColor: CourierColors.white[500_10],
            activeBackgroundColor: CourierColors.white[500_20],
            divider: `none`,
            font: {
              color: CourierColors.white[500],
              family: undefined,
              size: '14px'
            },
            selectionIcon: {
              color: CourierColors.white[500],
              svg: CourierIconSVGs.check
            }
          }
        },
        filters: {
          button: {
            icon: {
              color: CourierColors.white[500],
              svg: CourierIconSVGs.filter
            },
            backgroundColor: 'transparent',
            hoverBackgroundColor: CourierColors.white[500_10],
            activeBackgroundColor: CourierColors.white[500_20],
          },
          inbox: {
            icon: {
              color: CourierColors.white[500],
              svg: CourierIconSVGs.inbox
            },
            text: 'Inbox'
          },
          archive: {
            icon: {
              color: CourierColors.white[500],
              svg: CourierIconSVGs.archive
            },
            text: 'Archive'
          }
        },
        actions: {
          button: {
            icon: {
              color: CourierColors.white[500],
              svg: CourierIconSVGs.overflow
            },
            backgroundColor: 'transparent',
            hoverBackgroundColor: CourierColors.white[500_10],
            activeBackgroundColor: CourierColors.white[500_20],
          },
          markAllRead: {
            icon: {
              color: CourierColors.white[500],
              svg: CourierIconSVGs.read
            },
            text: 'Mark All as Read'
          },
          archiveAll: {
            icon: {
              color: CourierColors.white[500],
              svg: CourierIconSVGs.archive
            },
            text: 'Archive All'
          },
          archiveRead: {
            icon: {
              color: CourierColors.white[500],
              svg: CourierIconSVGs.archiveRead
            },
            text: 'Archive Read'
          }
        },
      }
    },
    list: {
      backgroundColor: CourierColors.black[500],
      item: {
        unreadIndicatorColor: CourierColors.blue[500],
        hoverBackgroundColor: CourierColors.white[500_10],
        activeBackgroundColor: CourierColors.white[500_20],
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
        divider: `1px solid ${CourierColors.gray[400]}`,
        menu: {
          enabled: true,
          backgroundColor: CourierColors.black[500],
          border: `1px solid ${CourierColors.gray[400]}`,
          borderRadius: '4px',
          shadow: `0px 2px 4px -2px ${CourierColors.white[500_20]}`,
          longPress: {
            displayDuration: 4000,
            vibrationDuration: 50
          },
          item: {
            hoverBackgroundColor: CourierColors.white[500_10],
            activeBackgroundColor: CourierColors.white[500_20],
            borderRadius: '0px',
            read: {
              color: CourierColors.white[500],
              svg: CourierIconSVGs.read
            },
            unread: {
              color: CourierColors.white[500],
              svg: CourierIconSVGs.unread
            },
            archive: {
              color: CourierColors.white[500],
              svg: CourierIconSVGs.archive
            },
            unarchive: {
              color: CourierColors.white[500],
              svg: CourierIconSVGs.unarchive
            }
          }
        }
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
        menus: {
          ...defaultTheme.inbox?.header?.menus,
          ...theme.inbox?.header?.menus,
          popup: {
            ...defaultTheme.inbox?.header?.menus?.popup,
            ...theme.inbox?.header?.menus?.popup,
            list: {
              ...defaultTheme.inbox?.header?.menus?.popup?.list,
              ...theme.inbox?.header?.menus?.popup?.list,
              font: {
                ...defaultTheme.inbox?.header?.menus?.popup?.list?.font,
                ...theme.inbox?.header?.menus?.popup?.list?.font
              },
              selectionIcon: {
                ...defaultTheme.inbox?.header?.menus?.popup?.list?.selectionIcon,
                ...theme.inbox?.header?.menus?.popup?.list?.selectionIcon
              }
            }
          },
          filters: {
            ...defaultTheme.inbox?.header?.menus?.filters,
            ...theme.inbox?.header?.menus?.filters,
            inbox: {
              ...defaultTheme.inbox?.header?.menus?.filters?.inbox,
              ...theme.inbox?.header?.menus?.filters?.inbox,
              icon: {
                ...defaultTheme.inbox?.header?.menus?.filters?.inbox?.icon,
                ...theme.inbox?.header?.menus?.filters?.inbox?.icon
              }
            },
            archive: {
              ...defaultTheme.inbox?.header?.menus?.filters?.archive,
              ...theme.inbox?.header?.menus?.filters?.archive,
              icon: {
                ...defaultTheme.inbox?.header?.menus?.filters?.archive?.icon,
                ...theme.inbox?.header?.menus?.filters?.archive?.icon
              }
            }
          },
          actions: {
            ...defaultTheme.inbox?.header?.menus?.actions,
            ...theme.inbox?.header?.menus?.actions,
            markAllRead: {
              ...defaultTheme.inbox?.header?.menus?.actions?.markAllRead,
              ...theme.inbox?.header?.menus?.actions?.markAllRead,
              icon: {
                ...defaultTheme.inbox?.header?.menus?.actions?.markAllRead?.icon,
                ...theme.inbox?.header?.menus?.actions?.markAllRead?.icon
              }
            },
            archiveAll: {
              ...defaultTheme.inbox?.header?.menus?.actions?.archiveAll,
              ...theme.inbox?.header?.menus?.actions?.archiveAll,
              icon: {
                ...defaultTheme.inbox?.header?.menus?.actions?.archiveAll?.icon,
                ...theme.inbox?.header?.menus?.actions?.archiveAll?.icon
              }
            },
            archiveRead: {
              ...defaultTheme.inbox?.header?.menus?.actions?.archiveRead,
              ...theme.inbox?.header?.menus?.actions?.archiveRead,
              icon: {
                ...defaultTheme.inbox?.header?.menus?.actions?.archiveRead?.icon,
                ...theme.inbox?.header?.menus?.actions?.archiveRead?.icon
              }
            }
          }
        }
      },
      list: {
        ...defaultTheme.inbox?.list,
        ...theme.inbox?.list,
        item: {
          ...defaultTheme.inbox?.list?.item,
          ...theme.inbox?.list?.item,
          menu: {
            ...defaultTheme.inbox?.list?.item?.menu,
            ...theme.inbox?.list?.item?.menu,
            item: {
              ...defaultTheme.inbox?.list?.item?.menu?.item,
              ...theme.inbox?.list?.item?.menu?.item,
              read: {
                ...defaultTheme.inbox?.list?.item?.menu?.item?.read,
                ...theme.inbox?.list?.item?.menu?.item?.read
              },
              unread: {
                ...defaultTheme.inbox?.list?.item?.menu?.item?.unread,
                ...theme.inbox?.list?.item?.menu?.item?.unread
              },
              archive: {
                ...defaultTheme.inbox?.list?.item?.menu?.item?.archive,
                ...theme.inbox?.list?.item?.menu?.item?.archive
              },
              unarchive: {
                ...defaultTheme.inbox?.list?.item?.menu?.item?.unarchive,
                ...theme.inbox?.list?.item?.menu?.item?.unarchive
              }
            }
          }
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
