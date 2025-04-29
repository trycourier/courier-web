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
    divider?: {
      color?: string;
      width?: string;
    },
    menu?: {
      icon?: {
        color?: string;
        svg?: string;
      }
      backgroundColor?: string;
      borderColor?: string;
      listItems?: {
        iconColor?: string;
        color?: string;
        hoverColor?: string;
        activeColor?: string;
        icons?: {
          inboxSVG?: string;
          archiveSVG?: string;
        }
      }
      shadow?: {
        color?: string;
        offsetX?: number;
        offsetY?: number;
        blur?: number;
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
    unreadIndicator: {
      color: CourierColors.white[500],
      backgroundColor: CourierColors.blue[500],
    },
    menu: {
      icon: {
        color: CourierColors.black[500],
        svg: CourierIconSource.filter,
      },
      backgroundColor: CourierColors.white[500],
      borderColor: CourierColors.gray[500],
      listItems: {
        iconColor: CourierColors.black[500],
        color: CourierColors.black[500],
        hoverColor: CourierColors.gray[200],
        activeColor: CourierColors.gray[500],
        icons: {
          inboxSVG: CourierIconSource.inbox,
          archiveSVG: CourierIconSource.archive,
        }
      },
      shadow: {
        color: CourierColors.gray[500],
        offsetX: 0,
        offsetY: 4,
        blur: 8,
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
      width: '1px',
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
      backgroundColor: CourierColors.blue[500],
    },
    menu: {
      icon: {
        color: CourierColors.white[500],
        svg: CourierIconSource.filter,
      },
      backgroundColor: CourierColors.black[500],
      borderColor: CourierColors.gray[500],
      listItems: {
        iconColor: CourierColors.white[500],
        color: CourierColors.white[500],
        hoverColor: CourierColors.white[500_10],
        activeColor: CourierColors.white[500],
        icons: {
          inboxSVG: CourierIconSource.inbox,
          archiveSVG: CourierIconSource.archive,
        }
      },
      shadow: {
        color: CourierColors.white[500_10],
        offsetX: 0,
        offsetY: 4,
        blur: 8,
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
      width: '1px',
    }
  }
};
