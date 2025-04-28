import { CourierColors } from "@trycourier/courier-ui-core";

export type CourierInboxTheme = {
  backgroundColor?: string;
  listItem?: {
    unreadIndicatorColor?: string;
    hoverColor?: string;
    activeColor?: string;
    titleColor?: string;
    subtitleColor?: string;
    timeColor?: string;
    archiveIconColor?: string;
  }
};

export const defaultLightTheme: CourierInboxTheme = {
  backgroundColor: CourierColors.white[500],
  listItem: {
    unreadIndicatorColor: CourierColors.blue[500],
    hoverColor: CourierColors.gray[200],
    activeColor: CourierColors.gray[500],
    titleColor: CourierColors.black[500],
    subtitleColor: CourierColors.gray[500],
    timeColor: CourierColors.gray[500],
    archiveIconColor: CourierColors.gray[500],
  }
};

export const defaultDarkTheme: CourierInboxTheme = {
  backgroundColor: CourierColors.black[500],
  listItem: {
    unreadIndicatorColor: CourierColors.blue[500],
    hoverColor: CourierColors.gray[400],
    activeColor: CourierColors.gray[500],
    titleColor: CourierColors.white[500],
    subtitleColor: CourierColors.gray[500],
    timeColor: CourierColors.gray[500],
    archiveIconColor: CourierColors.gray[500],
  }
};
