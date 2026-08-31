import { CourierColors, CourierIconSVGs, SystemThemeMode, CourierFontTheme, CourierIconTheme, COURIER_DEFAULT_PRIMARY_COLOR } from "@trycourier/courier-ui-core";

// Re-export common types from core for convenience

/** @public */
export type CourierToastFontTheme = CourierFontTheme;

/** @public */
export type CourierToastIconTheme = CourierIconTheme & {
  /**
   * Whether the icon is drawn at all. Defaults to `true`; set it to `false` to
   * drop the icon and the space it holds, for toasts that read better as text
   * alone.
   */
  visible?: boolean;
};

/** @public */
export type CourierToastItemTheme = {
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;
  autoDismissBarColor?: string;
  title?: CourierToastFontTheme;
  body?: CourierToastFontTheme;
  icon?: CourierToastIconTheme;
  dismissIcon?: CourierToastIconTheme;
  shadow?: string;
  border?: string;
  borderRadius?: string;
  actions?: CourierToastActionsTheme;
}

/**
 * Styles for one toast-action look.
 *
 * @public
 */
export type CourierToastActionVariantTheme = {
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;
  border?: string;
  borderRadius?: string;
  shadow?: string;
  textDecoration?: string;
  padding?: string;
  font?: CourierToastFontTheme;
}

/**
 * Styles for a toast's action buttons.
 *
 * The top level describes the default filled button. `outlined` and `link` layer over it and
 * apply only when the action asks for that look.
 *
 * @public
 */
export type CourierToastActionsTheme = CourierToastActionVariantTheme & {
  /** Applies to `style: 'button'` — the filled button, and the default when absent. */
  button?: CourierToastActionVariantTheme;
  /** Applies to `style: 'secondary'` — the outlined button. */
  secondary?: CourierToastActionVariantTheme;
  /** Applies to `style: 'tertiary'` — the borderless button. */
  tertiary?: CourierToastActionVariantTheme;
  /** Applies to `style: 'link'` — inline text rather than a button. */
  link?: CourierToastActionVariantTheme;
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
  }
};

/** @public */
export const defaultDarkTheme: CourierToastTheme = {
  item: {
    backgroundColor: CourierColors.black[500],
    hoverBackgroundColor: CourierColors.gray[800],
    activeBackgroundColor: CourierColors.gray[700],
    shadow: `0px 4px 8px -2px ${CourierColors.gray[400]}`,
    border: `1px solid ${CourierColors.gray[400]}`,
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
      },
      actions: {
        ...defaultTheme.item?.actions,
        ...theme.item?.actions,
        font: {
          ...defaultTheme.item?.actions?.font,
          ...theme.item?.actions?.font
        },
        button: {
          ...defaultTheme.item?.actions?.button,
          ...theme.item?.actions?.button,
          font: {
            ...defaultTheme.item?.actions?.button?.font,
            ...theme.item?.actions?.button?.font
          }
        },
        secondary: {
          ...defaultTheme.item?.actions?.secondary,
          ...theme.item?.actions?.secondary,
          font: {
            ...defaultTheme.item?.actions?.secondary?.font,
            ...theme.item?.actions?.secondary?.font
          }
        },
        tertiary: {
          ...defaultTheme.item?.actions?.tertiary,
          ...theme.item?.actions?.tertiary,
          font: {
            ...defaultTheme.item?.actions?.tertiary?.font,
            ...theme.item?.actions?.tertiary?.font
          }
        },
        link: {
          ...defaultTheme.item?.actions?.link,
          ...theme.item?.actions?.link,
          font: {
            ...defaultTheme.item?.actions?.link?.font,
            ...theme.item?.actions?.link?.font
          }
        }
      }
    }
  };
};
