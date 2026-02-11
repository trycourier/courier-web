import { CourierColors, CourierIconSVGs, SystemThemeMode, CourierFontTheme, CourierIconTheme, CourierButtonTheme, CourierIconButtonTheme } from "@trycourier/courier-ui-core";

// Re-export common types from core for convenience
export type CourierInboxFontTheme = CourierFontTheme;
export type CourierInboxIconTheme = CourierIconTheme;
export type CourierInboxButtonTheme = CourierButtonTheme;
export type CourierInboxIconButtonTheme = CourierIconButtonTheme;

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

export type CourierInboxMenuButtonTheme = CourierInboxIconButtonTheme & {
  unreadDotIndicator?: CourierInboxUnreadDotIndicatorTheme;
}

export type CourierInboxAnimationTheme = {
  transition?: string;
  initialTransform?: string;
  visibleTransform?: string;
}

export type CourierInboxPopupTheme = {
  backgroundColor?: string;
  border?: string;
  borderRadius?: string;
  shadow?: string;
  animation?: CourierInboxAnimationTheme;
  list?: {
    font?: CourierInboxFontTheme;
    selectedIcon?: CourierInboxIconTheme;
    hoverBackgroundColor?: string;
    activeBackgroundColor?: string;
    divider?: string;
  };
}

export type CourierInboxSubtitleLinkTheme = {
  color?: string;
  textDecoration?: string;
  hoverColor?: string;
}

export type CourierInboxListItemTheme = {
  unreadIndicatorColor?: string;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;
  transition?: string;
  title?: CourierInboxFontTheme;
  subtitle?: CourierInboxFontTheme;
  /** Styles for inline links inside the subtitle/body text */
  subtitleLink?: CourierInboxSubtitleLinkTheme;
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
    animation?: CourierInboxAnimationTheme;
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

export type CourierActionMenuTheme = {
  button?: CourierInboxIconButtonTheme;
  markAllRead?: CourierMenuItemTheme;
  archiveAll?: CourierMenuItemTheme;
  archiveRead?: CourierMenuItemTheme;
  animation?: CourierInboxAnimationTheme;
  menu?: CourierInboxPopupTheme;
}

export type CourierInboxTabsBorderRadius =
  | string
  | {
    topLeft?: string;
    topRight?: string;
    bottomLeft?: string;
    bottomRight?: string;
  };

export type CourierInboxListScrollbarTheme = {
  trackBackgroundColor?: string;
  thumbColor?: string;
  thumbHoverColor?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
}

export type CourierInboxTabsTheme = {
  borderRadius?: CourierInboxTabsBorderRadius;
  transition?: string;
  default?: {
    backgroundColor?: string;
    hoverBackgroundColor?: string;
    activeBackgroundColor?: string;
    font?: CourierInboxFontTheme;
    indicatorColor?: string;
    indicatorHeight?: string;
    unreadIndicator?: CourierInboxUnreadCountIndicatorTheme;
  },
  selected?: {
    backgroundColor?: string;
    hoverBackgroundColor?: string;
    activeBackgroundColor?: string;
    font?: CourierInboxFontTheme;
    indicatorColor?: string;
    indicatorHeight?: string;
    unreadIndicator?: CourierInboxUnreadCountIndicatorTheme;
  }
}

export type CourierInboxTheme = {
  popup?: {
    button?: CourierInboxMenuButtonTheme;
    window?: {
      backgroundColor?: string;
      borderRadius?: string;
      border?: string;
      shadow?: string;
      animation?: CourierInboxAnimationTheme;
    };
  }
  inbox?: {
    header?: {
      backgroundColor?: string;
      shadow?: string;
      border?: string;
      feeds?: {
        button?: {
          selectedFeedIconColor?: string;
          font?: CourierInboxFontTheme;
          changeFeedIcon?: CourierIconTheme;
          unreadCountIndicator?: CourierInboxUnreadCountIndicatorTheme;
          hoverBackgroundColor?: string;
          activeBackgroundColor?: string;
          transition?: string;
        }
        menu?: CourierInboxPopupTheme;
        tabs?: CourierInboxTabsTheme;
      }
      tabs?: CourierInboxTabsTheme;
      actions?: CourierActionMenuTheme
    }
    list?: {
      backgroundColor?: string;
      scrollbar?: CourierInboxListScrollbarTheme;
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
      shadow: `0px 8px 16px -4px ${CourierColors.gray[500]}`,
      animation: {
        transition: 'none',
        initialTransform: 'translate3d(0, 0, 0)',
        visibleTransform: 'translate3d(0, 0, 0)'
      }
    }
  },
  inbox: {
    header: {
      backgroundColor: CourierColors.white[500],
      shadow: `none`,
      border: `1px solid ${CourierColors.gray[500]}`,
      feeds: {
        button: {
          selectedFeedIconColor: CourierColors.black[500],
          hoverBackgroundColor: CourierColors.gray[200],
          activeBackgroundColor: CourierColors.gray[500],
          transition: 'all 0.2s ease',
          font: {
            color: CourierColors.black[500],
            family: undefined,
            size: '16px'
          },
          changeFeedIcon: {
            color: CourierColors.black[500],
            svg: CourierIconSVGs.chevronDown
          },
          unreadCountIndicator: {
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
        menu: {
          backgroundColor: CourierColors.white[500],
          border: `1px solid ${CourierColors.gray[500]}`,
          borderRadius: '6px',
          shadow: `0px 4px 8px -2px ${CourierColors.gray[500]}`,
          animation: {
            transition: 'none',
            initialTransform: 'translate3d(0, 0, 0)',
            visibleTransform: 'translate3d(0, 0, 0)'
          },
          list: {
            hoverBackgroundColor: CourierColors.gray[200],
            activeBackgroundColor: CourierColors.gray[500],
            divider: `none`,
            font: {
              color: CourierColors.black[500],
              family: undefined,
              size: '14px'
            },
            selectedIcon: {
              color: CourierColors.black[500],
              svg: CourierIconSVGs.check
            }
          }
        },
        tabs: {
          borderRadius: {
            topLeft: '4px',
            topRight: '4px'
          },
          transition: 'all 0.2s ease',
          default: {
            indicatorHeight: '1px',
            indicatorColor: 'transparent',
            backgroundColor: 'transparent',
            hoverBackgroundColor: CourierColors.gray[200],
            activeBackgroundColor: CourierColors.gray[500],
            font: {
              color: CourierColors.gray[600],
              family: undefined,
              size: '14px'
            },
            unreadIndicator: {
              font: {
                color: CourierColors.gray[600],
                family: undefined,
                size: '12px'
              },
              backgroundColor: CourierColors.black[500_10],
              borderRadius: '4px',
              padding: '2px 6px',
            }
          },
          selected: {
            indicatorHeight: '1px',
            indicatorColor: CourierColors.blue[500],
            backgroundColor: 'transparent',
            hoverBackgroundColor: CourierColors.gray[200],
            activeBackgroundColor: CourierColors.gray[500],
            font: {
              color: CourierColors.blue[500],
              family: undefined,
              size: '14px'
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
          }
        }
      },
      tabs: {
        borderRadius: {
          topLeft: '4px',
          topRight: '4px'
        },
        transition: 'all 0.2s ease',
        default: {
          indicatorHeight: '1px',
          indicatorColor: 'transparent',
          backgroundColor: 'transparent',
          hoverBackgroundColor: CourierColors.gray[200],
          activeBackgroundColor: CourierColors.gray[500],
          font: {
            color: CourierColors.gray[600],
            family: undefined,
            size: '14px'
          },
          unreadIndicator: {
            font: {
              color: CourierColors.gray[600],
              family: undefined,
              size: '12px'
            },
            backgroundColor: CourierColors.black[500_10],
            borderRadius: '4px',
            padding: '2px 6px',
          }
        },
        selected: {
          indicatorHeight: '1px',
          indicatorColor: CourierColors.blue[500],
          backgroundColor: 'transparent',
          hoverBackgroundColor: CourierColors.gray[200],
          activeBackgroundColor: CourierColors.gray[500],
          font: {
            color: CourierColors.blue[500],
            family: undefined,
            size: '14px'
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
        }
      },
      actions: {
        button: {
          icon: {
            color: CourierColors.black[500],
            svg: CourierIconSVGs.overflow
          },
          backgroundColor: 'transparent',
          hoverBackgroundColor: CourierColors.gray[200],
          activeBackgroundColor: CourierColors.gray[500],
        },
        markAllRead: {
          icon: {
            color: CourierColors.black[500]
          },
          text: 'Read All'
        },
        archiveAll: {
          icon: {
            color: CourierColors.black[500]
          },
          text: 'Archive All'
        },
        archiveRead: {
          icon: {
            color: CourierColors.black[500]
          },
          text: 'Archive Read'
        },
        animation: {
          transition: 'none',
          initialTransform: 'translate3d(0, 0, 0)',
          visibleTransform: 'translate3d(0, 0, 0)'
        }
      }
    },
    list: {
      backgroundColor: CourierColors.white[500],
      scrollbar: {
        trackBackgroundColor: 'transparent',
        thumbColor: CourierColors.black[500_20],
        thumbHoverColor: CourierColors.black[500_20],
        width: '8px',
        height: '8px',
        borderRadius: '4px'
      },
      item: {
        backgroundColor: 'transparent',
        unreadIndicatorColor: CourierColors.blue[500],
        hoverBackgroundColor: CourierColors.gray[200],
        activeBackgroundColor: CourierColors.gray[500],
        transition: 'all 0.2s ease',
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
        subtitleLink: {
          color: CourierColors.blue[500],
          textDecoration: 'underline',
          hoverColor: CourierColors.blue[500]
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
          animation: {
            transition: 'none',
            initialTransform: 'translate3d(0, 0, 0)',
            visibleTransform: 'translate3d(0, 0, 0)'
          },
          longPress: {
            displayDuration: 4000,
            vibrationDuration: 50
          },
          item: {
            hoverBackgroundColor: CourierColors.gray[200],
            activeBackgroundColor: CourierColors.gray[500],
            borderRadius: '0px',
            read: {
              color: CourierColors.black[500]
            },
            unread: {
              color: CourierColors.black[500]
            },
            archive: {
              color: CourierColors.black[500]
            },
            unarchive: {
              color: CourierColors.black[500]
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
      shadow: `0px 4px 8px -2px ${CourierColors.white[500_20]}`,
      animation: {
        transition: 'none',
        initialTransform: 'translate3d(0, 0, 0)',
        visibleTransform: 'translate3d(0, 0, 0)'
      }
    }
  },
  inbox: {
    header: {
      backgroundColor: CourierColors.black[500],
      shadow: `none`,
      border: `1px solid ${CourierColors.gray[400]}`,
      feeds: {
        button: {
          selectedFeedIconColor: CourierColors.white[500],
          hoverBackgroundColor: CourierColors.white[500_10],
          activeBackgroundColor: CourierColors.white[500_20],
          transition: 'all 0.2s ease',
          font: {
            color: CourierColors.white[500],
            family: undefined,
            size: '16px'
          },
          changeFeedIcon: {
            color: CourierColors.white[500],
            svg: CourierIconSVGs.chevronDown
          },
          unreadCountIndicator: {
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
        menu: {
          backgroundColor: CourierColors.black[500],
          border: `1px solid ${CourierColors.gray[400]}`,
          borderRadius: '6px',
          shadow: `0px 4px 8px -2px ${CourierColors.white[500_20]}`,
          animation: {
            transition: 'none',
            initialTransform: 'translate3d(0, 0, 0)',
            visibleTransform: 'translate3d(0, 0, 0)'
          },
          list: {
            hoverBackgroundColor: CourierColors.white[500_10],
            activeBackgroundColor: CourierColors.white[500_20],
            divider: `none`,
            font: {
              color: CourierColors.white[500],
              family: undefined,
              size: '14px'
            },
            selectedIcon: {
              color: CourierColors.white[500],
              svg: CourierIconSVGs.check
            }
          }
        },
        tabs: {
          borderRadius: {
            topLeft: '4px',
            topRight: '4px'
          },
          transition: 'all 0.2s ease',
          default: {
            indicatorHeight: '1px',
            indicatorColor: 'transparent',
            backgroundColor: 'transparent',
            hoverBackgroundColor: CourierColors.white[500_10],
            activeBackgroundColor: CourierColors.white[500_20],
            font: {
              color: CourierColors.white[500],
              family: undefined,
              size: '14px'
            },
            unreadIndicator: {
              font: {
                color: CourierColors.white[500],
                family: undefined,
                size: '12px'
              },
              backgroundColor: CourierColors.white[500_10],
              borderRadius: '4px',
              padding: '3px 8px',
            }
          },
          selected: {
            indicatorHeight: '1px',
            indicatorColor: CourierColors.blue[500],
            backgroundColor: 'transparent',
            hoverBackgroundColor: CourierColors.white[500_10],
            activeBackgroundColor: CourierColors.white[500_20],
            font: {
              color: CourierColors.blue[500],
              family: undefined,
              size: '14px'
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
          }
        }
      },
      tabs: {
        borderRadius: {
          topLeft: '4px',
          topRight: '4px'
        },
        transition: 'all 0.2s ease',
        default: {
          indicatorHeight: '1px',
          indicatorColor: 'transparent',
          backgroundColor: 'transparent',
          hoverBackgroundColor: CourierColors.white[500_10],
          activeBackgroundColor: CourierColors.white[500_20],
          font: {
            color: CourierColors.white[500],
            family: undefined,
            size: '14px'
          },
          unreadIndicator: {
            font: {
              color: CourierColors.white[500],
              family: undefined,
              size: '12px'
            },
            backgroundColor: CourierColors.white[500_10],
            borderRadius: '4px',
            padding: '3px 8px',
          }
        },
        selected: {
          indicatorHeight: '1px',
          indicatorColor: CourierColors.blue[500],
          backgroundColor: 'transparent',
          hoverBackgroundColor: CourierColors.white[500_10],
          activeBackgroundColor: CourierColors.white[500_20],
          font: {
            color: CourierColors.blue[500],
            family: undefined,
            size: '14px'
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
            color: CourierColors.white[500]
          },
          text: 'Read All'
        },
        archiveAll: {
          icon: {
            color: CourierColors.white[500]
          },
          text: 'Archive All'
        },
        archiveRead: {
          icon: {
            color: CourierColors.white[500]
          },
          text: 'Archive Read'
        },
        animation: {
          transition: 'none',
          initialTransform: 'translate3d(0, 0, 0)',
          visibleTransform: 'translate3d(0, 0, 0)'
        }
      }
    },
    list: {
      backgroundColor: CourierColors.black[500],
      scrollbar: {
        trackBackgroundColor: 'transparent',
        thumbColor: CourierColors.white[500_20],
        thumbHoverColor: CourierColors.white[500_20],
        width: '8px',
        height: '8px',
        borderRadius: '4px'
      },
      item: {
        backgroundColor: 'transparent',
        unreadIndicatorColor: CourierColors.blue[500],
        hoverBackgroundColor: CourierColors.white[500_10],
        activeBackgroundColor: CourierColors.white[500_20],
        transition: 'all 0.2s ease',
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
        subtitleLink: {
          color: CourierColors.blue[400],
          textDecoration: 'underline',
          hoverColor: CourierColors.blue[400]
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
          animation: {
            transition: 'none',
            initialTransform: 'translate3d(0, 0, 0)',
            visibleTransform: 'translate3d(0, 0, 0)'
          },
          longPress: {
            displayDuration: 4000,
            vibrationDuration: 50
          },
          item: {
            hoverBackgroundColor: CourierColors.white[500_10],
            activeBackgroundColor: CourierColors.white[500_20],
            borderRadius: '0px',
            read: {
              color: CourierColors.white[500]
            },
            unread: {
              color: CourierColors.white[500]
            },
            archive: {
              color: CourierColors.white[500]
            },
            unarchive: {
              color: CourierColors.white[500]
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
        ...theme.popup?.window,
        animation: {
          ...defaultTheme.popup?.window?.animation,
          ...theme.popup?.window?.animation
        }
      }
    },
    inbox: {
      header: {
        ...defaultTheme.inbox?.header,
        ...theme.inbox?.header,
        feeds: {
          ...defaultTheme.inbox?.header?.feeds,
          ...theme.inbox?.header?.feeds,
          button: {
            ...defaultTheme.inbox?.header?.feeds?.button,
            ...theme.inbox?.header?.feeds?.button,
            font: {
              ...defaultTheme.inbox?.header?.feeds?.button?.font,
              ...theme.inbox?.header?.feeds?.button?.font
            },
            changeFeedIcon: {
              ...defaultTheme.inbox?.header?.feeds?.button?.changeFeedIcon,
              ...theme.inbox?.header?.feeds?.button?.changeFeedIcon
            },
            unreadCountIndicator: {
              ...defaultTheme.inbox?.header?.feeds?.button?.unreadCountIndicator,
              ...theme.inbox?.header?.feeds?.button?.unreadCountIndicator,
              font: {
                ...defaultTheme.inbox?.header?.feeds?.button?.unreadCountIndicator?.font,
                ...theme.inbox?.header?.feeds?.button?.unreadCountIndicator?.font
              }
            }
          },
          menu: {
            ...defaultTheme.inbox?.header?.feeds?.menu,
            ...theme.inbox?.header?.feeds?.menu,
            animation: {
              ...defaultTheme.inbox?.header?.feeds?.menu?.animation,
              ...theme.inbox?.header?.feeds?.menu?.animation
            },
            list: {
              ...defaultTheme.inbox?.header?.feeds?.menu?.list,
              ...theme.inbox?.header?.feeds?.menu?.list,
              font: {
                ...defaultTheme.inbox?.header?.feeds?.menu?.list?.font,
                ...theme.inbox?.header?.feeds?.menu?.list?.font
              },
              selectedIcon: {
                ...defaultTheme.inbox?.header?.feeds?.menu?.list?.selectedIcon,
                ...theme.inbox?.header?.feeds?.menu?.list?.selectedIcon
              }
            }
          },
          tabs: {
            ...defaultTheme.inbox?.header?.feeds?.tabs,
            ...theme.inbox?.header?.feeds?.tabs,
            default: {
              ...defaultTheme.inbox?.header?.feeds?.tabs?.default,
              ...theme.inbox?.header?.feeds?.tabs?.default,
              font: {
                ...defaultTheme.inbox?.header?.feeds?.tabs?.default?.font,
                ...theme.inbox?.header?.feeds?.tabs?.default?.font
              },
              unreadIndicator: {
                ...defaultTheme.inbox?.header?.feeds?.tabs?.default?.unreadIndicator,
                ...theme.inbox?.header?.feeds?.tabs?.default?.unreadIndicator,
                font: {
                  ...defaultTheme.inbox?.header?.feeds?.tabs?.default?.unreadIndicator?.font,
                  ...theme.inbox?.header?.feeds?.tabs?.default?.unreadIndicator?.font
                }
              }
            },
            selected: {
              ...defaultTheme.inbox?.header?.feeds?.tabs?.selected,
              ...theme.inbox?.header?.feeds?.tabs?.selected,
              font: {
                ...defaultTheme.inbox?.header?.feeds?.tabs?.selected?.font,
                ...theme.inbox?.header?.feeds?.tabs?.selected?.font
              },
              unreadIndicator: {
                ...defaultTheme.inbox?.header?.feeds?.tabs?.selected?.unreadIndicator,
                ...theme.inbox?.header?.feeds?.tabs?.selected?.unreadIndicator,
                font: {
                  ...defaultTheme.inbox?.header?.feeds?.tabs?.selected?.unreadIndicator?.font,
                  ...theme.inbox?.header?.feeds?.tabs?.selected?.unreadIndicator?.font
                }
              }
            }
          }
        },
        tabs: {
          ...defaultTheme.inbox?.header?.tabs,
          ...theme.inbox?.header?.tabs,
          default: {
            ...defaultTheme.inbox?.header?.tabs?.default,
            ...theme.inbox?.header?.tabs?.default,
            font: {
              ...defaultTheme.inbox?.header?.tabs?.default?.font,
              ...theme.inbox?.header?.tabs?.default?.font
            },
            unreadIndicator: {
              ...defaultTheme.inbox?.header?.tabs?.default?.unreadIndicator,
              ...theme.inbox?.header?.tabs?.default?.unreadIndicator,
              font: {
                ...defaultTheme.inbox?.header?.tabs?.default?.unreadIndicator?.font,
                ...theme.inbox?.header?.tabs?.default?.unreadIndicator?.font
              }
            }
          },
          selected: {
            ...defaultTheme.inbox?.header?.tabs?.selected,
            ...theme.inbox?.header?.tabs?.selected,
            font: {
              ...defaultTheme.inbox?.header?.tabs?.selected?.font,
              ...theme.inbox?.header?.tabs?.selected?.font
            },
            unreadIndicator: {
              ...defaultTheme.inbox?.header?.tabs?.selected?.unreadIndicator,
              ...theme.inbox?.header?.tabs?.selected?.unreadIndicator,
              font: {
                ...defaultTheme.inbox?.header?.tabs?.selected?.unreadIndicator?.font,
                ...theme.inbox?.header?.tabs?.selected?.unreadIndicator?.font
              }
            }
          }
        },
        actions: {
          ...defaultTheme.inbox?.header?.actions,
          ...theme.inbox?.header?.actions,
          button: {
            ...defaultTheme.inbox?.header?.actions?.button,
            ...theme.inbox?.header?.actions?.button,
            icon: {
              ...defaultTheme.inbox?.header?.actions?.button?.icon,
              ...theme.inbox?.header?.actions?.button?.icon
            }
          },
          markAllRead: {
            ...defaultTheme.inbox?.header?.actions?.markAllRead,
            ...theme.inbox?.header?.actions?.markAllRead,
            icon: {
              ...defaultTheme.inbox?.header?.actions?.markAllRead?.icon,
              ...theme.inbox?.header?.actions?.markAllRead?.icon
            }
          },
          archiveAll: {
            ...defaultTheme.inbox?.header?.actions?.archiveAll,
            ...theme.inbox?.header?.actions?.archiveAll,
            icon: {
              ...defaultTheme.inbox?.header?.actions?.archiveAll?.icon,
              ...theme.inbox?.header?.actions?.archiveAll?.icon
            }
          },
          archiveRead: {
            ...defaultTheme.inbox?.header?.actions?.archiveRead,
            ...theme.inbox?.header?.actions?.archiveRead,
            icon: {
              ...defaultTheme.inbox?.header?.actions?.archiveRead?.icon,
              ...theme.inbox?.header?.actions?.archiveRead?.icon
            }
          },
          animation: {
            ...defaultTheme.inbox?.header?.actions?.animation,
            ...theme.inbox?.header?.actions?.animation
          }
        }
      },
      list: {
        ...defaultTheme.inbox?.list,
        ...theme.inbox?.list,
        scrollbar: {
          ...defaultTheme.inbox?.list?.scrollbar,
          ...theme.inbox?.list?.scrollbar
        },
        item: {
          ...defaultTheme.inbox?.list?.item,
          ...theme.inbox?.list?.item,
          actions: {
            ...defaultTheme.inbox?.list?.item?.actions,
            ...theme.inbox?.list?.item?.actions,
            font: {
              ...defaultTheme.inbox?.list?.item?.actions?.font,
              ...theme.inbox?.list?.item?.actions?.font
            }
          },
          title: {
            ...defaultTheme.inbox?.list?.item?.title,
            ...theme.inbox?.list?.item?.title
          },
          subtitle: {
            ...defaultTheme.inbox?.list?.item?.subtitle,
            ...theme.inbox?.list?.item?.subtitle
          },
          subtitleLink: {
            ...defaultTheme.inbox?.list?.item?.subtitleLink,
            ...theme.inbox?.list?.item?.subtitleLink
          },
          time: {
            ...defaultTheme.inbox?.list?.item?.time,
            ...theme.inbox?.list?.item?.time
          },
          menu: {
            ...defaultTheme.inbox?.list?.item?.menu,
            ...theme.inbox?.list?.item?.menu,
            animation: {
              ...defaultTheme.inbox?.list?.item?.menu?.animation,
              ...theme.inbox?.list?.item?.menu?.animation
            },
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
        animation: {
          ...defaultTheme.inbox?.loading?.animation,
          ...theme.inbox?.loading?.animation
        }
      },
      empty: {
        ...defaultTheme.inbox?.empty,
        ...theme.inbox?.empty,
        title: {
          ...defaultTheme.inbox?.empty?.title,
          ...theme.inbox?.empty?.title,
          font: {
            ...defaultTheme.inbox?.empty?.title?.font,
            ...theme.inbox?.empty?.title?.font
          }
        },
        button: {
          ...defaultTheme.inbox?.empty?.button,
          ...theme.inbox?.empty?.button,
          font: {
            ...defaultTheme.inbox?.empty?.button?.font,
            ...theme.inbox?.empty?.button?.font
          }
        }
      },
      error: {
        ...defaultTheme.inbox?.error,
        ...theme.inbox?.error,
        title: {
          ...defaultTheme.inbox?.error?.title,
          ...theme.inbox?.error?.title,
          font: {
            ...defaultTheme.inbox?.error?.title?.font,
            ...theme.inbox?.error?.title?.font
          }
        },
        button: {
          ...defaultTheme.inbox?.error?.button,
          ...theme.inbox?.error?.button,
          font: {
            ...defaultTheme.inbox?.error?.button?.font,
            ...theme.inbox?.error?.button?.font
          }
        }
      }
    }
  };
};
