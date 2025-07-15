import { CourierColors, CourierIconSVGs, SystemThemeMode } from "@trycourier/courier-ui-core";

export type CourierInboxFontTheme = {
  family?: string;
  weight?: string;
  size?: string;
  color?: string;
}

export type CourierInboxIconTheme = {
  color?: string;
  svg?: string;
}

export type CourierInboxFilterItemTheme = {
  icon?: CourierInboxIconTheme;
  text?: string;
}

export type CourierInboxUnreadDotIndicatorTheme = {
  backgroundColor?: string;
  borderRadius?: string;
  height?: string;
  width?: string;
}

export type CourierInboxUnreadCountIndicatorTheme = {
  font?: CourierInboxFontTheme;
  backgroundColor?: string;
  borderRadius?: string;
  padding?: string;
}

export type CourierInboxIconButtonTheme = {
  icon?: CourierInboxIconTheme;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;
}

export type CourierInboxButtonTheme = {
  font?: CourierInboxFontTheme;
  text?: string;
  shadow?: string;
  border?: string;
  borderRadius?: string;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;
}

export type CourierInboxMenuButtonTheme = CourierInboxIconButtonTheme & {
  unreadDotIndicator?: CourierInboxUnreadDotIndicatorTheme;
}

export type CourierInboxPopupTheme = {
  backgroundColor?: string;
  border?: string;
  borderRadius?: string;
  shadow?: string;
  list?: {
    font?: CourierInboxFontTheme;
    selectionIcon?: CourierInboxIconTheme;
    hoverBackgroundColor?: string;
    activeBackgroundColor?: string;
    divider?: string;
  };
}

export type CourierInboxListItemTheme = {
  unreadIndicatorColor?: string;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;
  title?: CourierInboxFontTheme;
  subtitle?: CourierInboxFontTheme;
  time?: CourierInboxFontTheme;
  archiveIcon?: CourierInboxIconTheme;
  divider?: string;
  actions?: {
    backgroundColor?: string;
    hoverBackgroundColor?: string;
    activeBackgroundColor?: string;
    border?: string;
    borderRadius?: string;
    shadow?: string;
    font?: CourierInboxFontTheme;
  }
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
      read?: CourierInboxIconTheme;
      unread?: CourierInboxIconTheme;
      archive?: CourierInboxIconTheme;
      unarchive?: CourierInboxIconTheme;
    };
  };
}

export type CourierInboxSkeletonLoadingStateTheme = {
  animation?: {
    barColor?: string;
    barHeight?: string;
    barBorderRadius?: string;
    duration?: string;
  },
  divider?: string;
}

export type CourierInboxInfoStateTheme = {
  title?: {
    font?: CourierInboxFontTheme;
    text?: string;
  },
  button?: CourierInboxButtonTheme;
}

export type CourierMenuItemTheme = {
  icon?: CourierInboxIconTheme;
  text?: string;
}

export type CourierFilterMenuTheme = {
  button?: CourierInboxIconButtonTheme;
  inbox?: CourierMenuItemTheme;
  archive?: CourierMenuItemTheme;
}

export type CourierActionMenuTheme = {
  button?: CourierInboxIconButtonTheme;
  markAllRead?: CourierMenuItemTheme;
  archiveAll?: CourierMenuItemTheme;
  archiveRead?: CourierMenuItemTheme;
}

export type CourierInboxTheme = {
  popup?: {
    button?: CourierInboxMenuButtonTheme;
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
        font?: CourierInboxFontTheme;
        inbox?: CourierInboxFilterItemTheme;
        archive?: CourierInboxFilterItemTheme;
        unreadIndicator?: CourierInboxUnreadCountIndicatorTheme;
      }
      menus?: {
        popup?: CourierInboxPopupTheme;
        filters?: CourierFilterMenuTheme;
        actions?: CourierActionMenuTheme;
      }
    }
    list?: {
      backgroundColor?: string;
      item?: CourierInboxListItemTheme;
    },
    loading?: CourierInboxSkeletonLoadingStateTheme,
    empty?: CourierInboxInfoStateTheme,
    error?: CourierInboxInfoStateTheme
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
      unreadDotIndicator: {
        backgroundColor: CourierColors.blue[500],
        borderRadius: '50%',
        height: '8px',
        width: '8px',
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
            size: '12px'
          },
          backgroundColor: CourierColors.blue[500],
          borderRadius: '4px',
          padding: '2px 6px',
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
            text: 'Read All'
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
        actions: {
          backgroundColor: 'transparent',
          hoverBackgroundColor: CourierColors.gray[200],
          activeBackgroundColor: CourierColors.gray[500],
          border: `1px solid ${CourierColors.gray[500]}`,
          borderRadius: '4px',
          shadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.06)',
          font: {
            color: CourierColors.black[500],
            family: undefined,
            size: '14px'
          }
        },
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
        barColor: CourierColors.gray[500],
        barHeight: '14px',
        barBorderRadius: '14px',
        duration: '2s'
      },
      divider: `1px solid ${CourierColors.gray[200]}`
    },
    empty: {
      title: {
        font: {
          size: '16px',
          weight: '500',
          color: CourierColors.black[500],
        }
      },
      button: {
        text: 'Refresh'
      }
    },
    error: {
      title: {
        font: {
          size: '16px',
          weight: '500',
          color: CourierColors.black[500],
        }
      },
      button: {
        text: 'Retry'
      }
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
      unreadDotIndicator: {
        backgroundColor: CourierColors.blue[500],
        borderRadius: '50%',
        height: '8px',
        width: '8px',
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
            size: '12px'
          },
          backgroundColor: CourierColors.blue[500],
          borderRadius: '4px',
          padding: '3px 8px',
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
            text: 'Read All'
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
        backgroundColor: 'transparent',
        unreadIndicatorColor: CourierColors.blue[500],
        hoverBackgroundColor: CourierColors.white[500_10],
        activeBackgroundColor: CourierColors.white[500_20],
        actions: {
          backgroundColor: 'transparent',
          hoverBackgroundColor: CourierColors.white[500_10],
          activeBackgroundColor: CourierColors.white[500_20],
          border: `1px solid ${CourierColors.gray[400]}`,
          borderRadius: '4px',
          shadow: `0px 1px 2px 0px ${CourierColors.white[500_10]}`,
          font: {
            color: CourierColors.white[500],
            family: undefined,
            size: '14px'
          }
        },
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
        barColor: CourierColors.gray[400],
        barHeight: '14px',
        barBorderRadius: '14px',
        duration: '2s'
      },
      divider: `1px solid ${CourierColors.gray[400]}`
    },
    empty: {
      title: {
        font: {
          size: '16px',
          weight: '500',
          color: CourierColors.white[500],
        }
      },
      button: {
        text: 'Refresh'
      }
    },
    error: {
      title: {
        font: {
          size: '16px',
          weight: '500',
          color: CourierColors.white[500],
        }
      },
      button: {
        text: 'Retry'
      }
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
        unreadDotIndicator: {
          ...defaultTheme.popup?.button?.unreadDotIndicator,
          ...theme.popup?.button?.unreadDotIndicator
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
