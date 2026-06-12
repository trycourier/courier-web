import { CourierColors, CourierIconSVGs, SystemThemeMode, CourierFontTheme, CourierIconTheme } from "@trycourier/courier-ui-core";

// Re-export common types from core for convenience

/** @public */
export type CourierBannerFontTheme = CourierFontTheme;

/** @public */
export type CourierBannerIconTheme = CourierIconTheme;

/** @public */
export type CourierBannerItemTheme = {
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;
  autoDismissBarColor?: string;
  title?: CourierBannerFontTheme;
  body?: CourierBannerFontTheme;
  icon?: CourierBannerIconTheme;
  dismissIcon?: CourierBannerIconTheme;
  shadow?: string;
  border?: string;
  borderRadius?: string;
  actions?: {
    backgroundColor?: string;
    hoverBackgroundColor?: string;
    activeBackgroundColor?: string;
    border?: string;
    borderRadius?: string;
    shadow?: string;
    font?: CourierBannerFontTheme;
  }
}

/**
 * Theme applied to the `popup` layout's overlay container.
 *
 * @public
 */
export type CourierBannerPopupTheme = {
  /** Background color of the dimmed backdrop behind the popup. Use `transparent` to disable. */
  overlayColor?: string;
  /** Max width of the popup card. */
  maxWidth?: string;
};

/** @public */
export type CourierBannerTheme = {
  item?: CourierBannerItemTheme;
  popup?: CourierBannerPopupTheme;
};

/** @public */
export const defaultLightTheme: CourierBannerTheme = {
  item: {
    backgroundColor: CourierColors.white[500],
    hoverBackgroundColor: CourierColors.gray[200],
    activeBackgroundColor: CourierColors.gray[500],
    shadow: `0px 4px 8px -2px ${CourierColors.black[500_20]}`,
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
    actions: {
      backgroundColor: 'transparent',
      hoverBackgroundColor: CourierColors.gray[200],
      activeBackgroundColor: CourierColors.gray[500],
      border: `1px solid ${CourierColors.gray[500]}`,
      borderRadius: '4px',
      shadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.06)',
      font: {
        color: CourierColors.black[500],
        size: '14px',
      }
    }
  },
  popup: {
    overlayColor: CourierColors.black[500_20],
    maxWidth: '420px',
  }
};

/** @public */
export const defaultDarkTheme: CourierBannerTheme = {
  item: {
    backgroundColor: CourierColors.black[500],
    hoverBackgroundColor: CourierColors.gray[400],
    activeBackgroundColor: CourierColors.gray[600],
    shadow: `0px 4px 8px -2px ${CourierColors.gray[400]}`,
    border: `1px solid ${CourierColors.black[500]}`,
    borderRadius: '8px',
    title: {
      size: '11pt',
      weight: '400',
      color: CourierColors.white[500],
    },
    body: {
      size: '11pt',
      weight: '400',
      color: CourierColors.gray[500],
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
    actions: {
      backgroundColor: CourierColors.black[400],
      hoverBackgroundColor: CourierColors.white[500_10],
      activeBackgroundColor: CourierColors.white[500_20],
      border: `1px solid ${CourierColors.gray[400]}`,
      borderRadius: '4px',
      shadow: `0px 1px 2px 0px ${CourierColors.white[500_10]}`,
      font: {
        color: CourierColors.white[500],
        size: '14px'
      }
    }
  },
  popup: {
    overlayColor: CourierColors.black[500_20],
    maxWidth: '420px',
  }
};

/**
 * Deep merge themes, only overwriting non-optional properties.
 *
 * @public
 */
export const mergeTheme = (mode: SystemThemeMode, theme: CourierBannerTheme): CourierBannerTheme => {
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
    },
    popup: {
      ...defaultTheme.popup,
      ...theme.popup
    }
  };
};
