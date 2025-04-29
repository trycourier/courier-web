import { CourierColors, CourierIconSource } from "@trycourier/courier-ui-core";

export type CourierInboxTheme = {
  backgroundColor?: string;
  header?: {
    backgroundColor?: string;
    titleColor?: string;
    iconColor?: string;
    unreadIndicator?: {
      color?: string;
      backgroundColor?: string;
    }
    shadow?: {
      color?: string;
      offsetX?: number;
      offsetY?: number;
      blur?: number;
    }
    menu?: {
      button?: {
        icon?: {
          color?: string;
          svg?: string;
        }
        backgroundColor?: string;
        hoverBackgroundColor?: string;
        activeBackgroundColor?: string;
      }
      popup?: {
        backgroundColor?: string;
        borderColor?: string;
        borderWidth?: string;
        borderRadius?: string;
        shadow?: {
          color?: string;
          offsetX?: number;
          offsetY?: number;
          blur?: number;
        }
        listItems?: {
          hoverColor?: string;
          activeColor?: string;
          font?: {
            family?: string;
            color?: string;
            size?: string;
          }
          icons?: {
            selected?: {
              color?: string;
              svg?: string;
            }
            color?: string;
            inboxSVG?: string;
            archiveSVG?: string;
          }
        }
      }
    }
  }
  listItem?: {
    unreadIndicatorColor?: string;
    hoverColor?: string;
    activeColor?: string;
    titleColor?: string;
    subtitleColor?: string;
    timeColor?: string;
    archiveIconColor?: string;
    divider?: {
      color?: string;
      width?: string;
    }
  }
};

export const defaultLightTheme: CourierInboxTheme = {
  backgroundColor: CourierColors.white[500],
  header: {
    backgroundColor: CourierColors.white[500],
    titleColor: CourierColors.black[500],
    iconColor: CourierColors.black[500],
    shadow: {
      color: CourierColors.gray[500],
      offsetX: 0,
      offsetY: 1,
      blur: 0
    },
    unreadIndicator: {
      color: CourierColors.white[500],
      backgroundColor: CourierColors.blue[500]
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
        borderColor: CourierColors.gray[500],
        borderWidth: '1px',
        borderRadius: '4px',
        shadow: {
          color: CourierColors.gray[500],
          offsetX: 0,
          offsetY: 4,
          blur: 8
        },
        listItems: {
          hoverColor: CourierColors.gray[200],
          activeColor: CourierColors.gray[500],
          font: {
            color: CourierColors.black[500],
            family: undefined,
            size: '14px'
          },
          icons: {
            selected: {
              color: CourierColors.black[500],
              svg: CourierIconSource.check
            },
            color: CourierColors.black[500],
            inboxSVG: CourierIconSource.inbox,
            archiveSVG: CourierIconSource.archive
          }
        }
      }
    }
  },
  listItem: {
    unreadIndicatorColor: CourierColors.blue[500],
    hoverColor: CourierColors.gray[200],
    activeColor: CourierColors.gray[500],
    titleColor: CourierColors.black[500],
    subtitleColor: CourierColors.gray[600],
    timeColor: CourierColors.gray[500],
    archiveIconColor: CourierColors.black[500],
    divider: {
      color: CourierColors.gray[200],
      width: '1px'
    }
  }
};

export const defaultDarkTheme: CourierInboxTheme = {
  backgroundColor: CourierColors.black[500],
  header: {
    backgroundColor: CourierColors.black[500],
    titleColor: CourierColors.white[500],
    iconColor: CourierColors.white[500],
    unreadIndicator: {
      color: CourierColors.white[500],
      backgroundColor: CourierColors.blue[500]
    },
    shadow: {
      color: CourierColors.gray[400],
      offsetX: 0,
      offsetY: 1,
      blur: 0
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
        borderColor: CourierColors.gray[400],
        borderWidth: '1px',
        borderRadius: '4px',
        shadow: {
          color: CourierColors.white[500_10],
          offsetX: 0,
          offsetY: 4,
          blur: 8
        },
        listItems: {
          hoverColor: CourierColors.white[500_10],
          activeColor: CourierColors.white[500_20],
          font: {
            color: CourierColors.white[500],
            family: undefined,
            size: '14px'
          },
          icons: {
            selected: {
              color: CourierColors.white[500],
              svg: CourierIconSource.check
            },
            color: CourierColors.white[500],
            inboxSVG: CourierIconSource.inbox,
            archiveSVG: CourierIconSource.archive
          }
        }
      }
    }
  },
  listItem: {
    unreadIndicatorColor: CourierColors.blue[500],
    hoverColor: CourierColors.gray[400],
    activeColor: CourierColors.gray[500],
    titleColor: CourierColors.white[500],
    subtitleColor: CourierColors.gray[500],
    timeColor: CourierColors.gray[500],
    archiveIconColor: CourierColors.white[500],
    divider: {
      color: CourierColors.gray[400],
      width: '1px'
    }
  }
};
