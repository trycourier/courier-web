import { CourierColors, CourierIconSVGs, SystemThemeMode, CourierFontTheme, CourierIconTheme } from "@trycourier/courier-ui-core";

// Re-export common types from core for convenience

/** @public */
export type CourierToastFontTheme = CourierFontTheme;

/** @public */
export type CourierToastIconTheme = CourierIconTheme;

/** @public */
export type CourierToastItemTheme = {
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  autoDismissBarColor?: string;
  title?: CourierToastFontTheme;
  body?: CourierToastFontTheme;
  icon?: CourierToastIconTheme;
  dismissIcon?: CourierToastIconTheme;
  shadow?: string;
  border?: string;
  borderRadius?: string;
}

/** @public */
export type CourierToastTheme = {
  item?: CourierToastItemTheme;
};

/** @public */
export const defaultLightTheme: CourierToastTheme = {
  item: {
    backgroundColor: CourierColors.white[500],
    hoverBackgroundColor: CourierColors.gray[200],
    shadow: `0px 4px 8px -2px ${CourierColors.gray[500]}`,
    border: `1px solid ${CourierColors.gray[500]}`,
    borderRadius: '8px',
    title: {
      size: '11pt',
      weight: '400',
      color: CourierColors.black[500],
    },
    body: {
      size: '11pt',
      weight: '400',
      color: CourierColors.gray[600],
    },
    icon: {
      color: CourierColors.black[500],
      svg: CourierIconSVGs.inbox,
    },
    dismissIcon: {
      color: CourierColors.black[500],
      svg: CourierIconSVGs.remove,
    },
    autoDismissBarColor: CourierColors.blue[400],
  }
};

/** @public */
export const defaultDarkTheme: CourierToastTheme = {
  item: {
    backgroundColor: CourierColors.black[500],
    hoverBackgroundColor: CourierColors.gray[200],
    shadow: `0px 4px 8px -2px ${CourierColors.gray[400]}`,
    border: `1px solid ${CourierColors.black[500]}`,
    borderRadius: '8px',
    title: {
      size: '11pt',
      weight: '600',
      color: CourierColors.white[500],
    },
    body: {
      size: '11pt',
      weight: '400',
      color: CourierColors.gray[200],
    },
    icon: {
      color: CourierColors.white[500],
      svg: CourierIconSVGs.inbox,
    },
    dismissIcon: {
      color: CourierColors.white[500],
      svg: CourierIconSVGs.remove,
    },
    autoDismissBarColor: CourierColors.blue[400],
  }
};

/**
 * Deep merge themes, only overwriting non-optional properties.
 *
 * @public
 */
export const mergeTheme = (mode: SystemThemeMode, theme: CourierToastTheme): CourierToastTheme => {
  const defaultTheme = mode === 'light' ? defaultLightTheme : defaultDarkTheme;
  return {
    item: {
      ...defaultTheme.item,
      ...theme.item,
      title: {
        ...defaultTheme.item?.title,
        ...theme.item?.title
      },
      body: {
        ...defaultTheme.item?.body,
        ...theme.item?.body
      },
      icon: {
        ...defaultTheme.item?.icon,
        ...theme.item?.icon
      },
      dismissIcon: {
        ...defaultTheme.item?.dismissIcon,
        ...theme.item?.dismissIcon
      }
    }
  };
};
