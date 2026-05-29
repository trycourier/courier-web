import { CourierColors, SystemThemeMode, CourierFontTheme } from "@trycourier/courier-ui-core";

/**
 * Default accent color for the preferences UI. Matches the inbox primary
 * (`CourierColors.blue[500]`) so the two components feel consistent.
 * @public
 */
export const DEFAULT_PREFERENCES_PRIMARY_COLOR = CourierColors.blue[500];

/** @public */
export type CourierPreferencesFontTheme = CourierFontTheme;

/** @public */
export type CourierPreferencesToggleTheme = {
  trackColor?: string;
  trackActiveColor?: string;
  thumbColor?: string;
  borderRadius?: string;
}

/** @public */
export type CourierPreferencesRadioTheme = {
  /** Color of the unselected ring. */
  ringColor?: string;
  /** Color of the selected ring and inner dot. */
  checkedColor?: string;
  /** Font for the unselected radio label. Falls back to the parent digest font. */
  font?: CourierPreferencesFontTheme;
  /** Font for the selected radio label. Falls back to the parent digest selectedFont. */
  selectedFont?: CourierPreferencesFontTheme;
}

/** @public */
export type CourierPreferencesCheckboxTheme = {
  /** Color used for border and fill when checked. */
  checkedColor?: string;
  /** Font for the checkbox label. */
  font?: CourierPreferencesFontTheme;
  /** Font for the checkbox label when selected. */
  selectedFont?: CourierPreferencesFontTheme;
}

/** @public */
export type CourierPreferencesSectionTheme = {
  title?: CourierPreferencesFontTheme;
  backgroundColor?: string;
}

/** @public */
export type CourierPreferencesTopicTheme = {
  backgroundColor?: string;
  border?: string;
  borderRadius?: string;
  title?: CourierPreferencesFontTheme;
  statusLabel?: CourierPreferencesFontTheme;
  toggle?: CourierPreferencesToggleTheme;
}

/** @public */
export type CourierPreferencesDigestTheme = {
  /** Font for unselected schedule options. */
  font?: CourierPreferencesFontTheme;
  /** Font for the selected schedule option. */
  selectedFont?: CourierPreferencesFontTheme;
  /** Color of the trailing calendar icon. */
  iconColor?: string;
  /** Radio control colors. */
  radio?: CourierPreferencesRadioTheme;
}

/** @public */
export type CourierPreferencesChannelChipTheme = {
  /** Font for unselected channel chips. */
  font?: CourierPreferencesFontTheme;
  /** Font for selected channel chips. */
  selectedFont?: CourierPreferencesFontTheme;
  /** Divider rendered above the channel chips (CSS border shorthand). */
  divider?: string;
  /** Checkbox control colors. */
  checkbox?: CourierPreferencesCheckboxTheme;
}

/** @public */
export type CourierPreferencesContainerTheme = {
  font?: CourierPreferencesFontTheme;
}

/** @public */
export type CourierPreferencesLoadingAnimationTheme = {
  /** Color of the shimmer bar. */
  barColor?: string;
  /** Height of each shimmer bar. */
  barHeight?: string;
  /** Corner radius of each shimmer bar. */
  barBorderRadius?: string;
  /** Duration of one shimmer cycle. */
  duration?: string;
}

/** @public */
export type CourierPreferencesLoadingTheme = {
  /** Skeleton shimmer animation config. */
  animation?: CourierPreferencesLoadingAnimationTheme;
  /**
   * Reserved for future use. The loading state renders as a skeleton; this is
   * kept for backwards compatibility but is not currently applied.
   */
  font?: CourierPreferencesFontTheme;
}

/** @public */
export type CourierPreferencesInfoStateButtonTheme = {
  /** Button label text. */
  text?: string;
  /** Button label font. */
  font?: CourierPreferencesFontTheme;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  border?: string;
  borderRadius?: string;
}

/** @public */
export type CourierPreferencesInfoStateTheme = {
  title?: {
    /** Title text. Falls back to a sensible default per state. */
    text?: string;
    font?: CourierPreferencesFontTheme;
  };
  button?: CourierPreferencesInfoStateButtonTheme;
}

/**
 * @deprecated Prefer `CourierPreferencesInfoStateTheme` for `error` and
 * `CourierPreferencesLoadingTheme` for `loading`.
 * @public
 */
export type CourierPreferencesStatusTheme = {
  font?: CourierPreferencesFontTheme;
}

/** @public */
export type CourierPreferencesTheme = {
  primaryColor?: string;
  title?: CourierPreferencesFontTheme;
  subtitle?: CourierPreferencesFontTheme;
  container?: CourierPreferencesContainerTheme;
  loading?: CourierPreferencesLoadingTheme;
  error?: CourierPreferencesInfoStateTheme;
  empty?: CourierPreferencesInfoStateTheme;
  section?: CourierPreferencesSectionTheme;
  topic?: CourierPreferencesTopicTheme;
  digest?: CourierPreferencesDigestTheme;
  channelChip?: CourierPreferencesChannelChipTheme;
};

/** @public */
export const defaultLightTheme: CourierPreferencesTheme = {
  primaryColor: CourierColors.blue[500],
  title: {
    size: '28px',
    weight: '500',
    color: CourierColors.black[500],
  },
  subtitle: {
    size: '14px',
    weight: '400',
    color: '#404040',
  },
  container: {
    font: {
      family: undefined,
      color: CourierColors.black[500],
    },
  },
  loading: {
    animation: {
      barColor: CourierColors.gray[500],
      barHeight: '14px',
      barBorderRadius: '14px',
      duration: '2s',
    },
  },
  error: {
    title: {
      font: {
        size: '16px',
        weight: '500',
        color: CourierColors.black[500],
      },
    },
    button: {
      text: 'Retry',
      font: {
        size: '14px',
        weight: '500',
        color: CourierColors.white[500],
      },
      backgroundColor: CourierColors.black[500],
      hoverBackgroundColor: '#262626',
      border: 'none',
      borderRadius: '8px',
    },
  },
  empty: {
    title: {
      text: 'No preferences available',
      font: {
        size: '16px',
        weight: '500',
        color: CourierColors.black[500],
      },
    },
    button: {
      text: 'Refresh',
      font: {
        size: '14px',
        weight: '500',
        color: CourierColors.white[500],
      },
      backgroundColor: CourierColors.black[500],
      hoverBackgroundColor: '#262626',
      border: 'none',
      borderRadius: '8px',
    },
  },
  section: {
    title: {
      size: '18px',
      weight: '600',
      color: CourierColors.black[500],
    },
    backgroundColor: 'transparent',
  },
  topic: {
    backgroundColor: CourierColors.white[500],
    border: `1px solid ${CourierColors.gray[500]}`,
    borderRadius: '12px',
    title: {
      size: '16px',
      weight: '400',
      color: CourierColors.black[500],
    },
    statusLabel: {
      size: '14px',
      weight: '300',
      color: CourierColors.gray[600],
    },
    toggle: {
      trackColor: '#D4D4D4',
      trackActiveColor: CourierColors.blue[500],
      thumbColor: CourierColors.white[500],
      borderRadius: '12px',
    },
  },
  digest: {
    font: {
      size: '14px',
      weight: '400',
      color: '#525252',
    },
    selectedFont: {
      size: '14px',
      weight: '500',
      color: CourierColors.black[500],
    },
    iconColor: '#525252',
    radio: {
      ringColor: '#D4D4D4',
      checkedColor: CourierColors.black[500],
    },
  },
  channelChip: {
    font: {
      size: '14px',
      weight: '400',
      color: '#525252',
    },
    selectedFont: {
      size: '14px',
      weight: '500',
      color: CourierColors.black[500],
    },
    divider: '1px solid #E5E5E5',
    checkbox: {
      checkedColor: CourierColors.black[500],
    },
  },
};

/** @public */
export const defaultDarkTheme: CourierPreferencesTheme = {
  primaryColor: CourierColors.blue[500],
  title: {
    size: '28px',
    weight: '500',
    color: CourierColors.white[500],
  },
  subtitle: {
    size: '14px',
    weight: '400',
    color: '#A3A3A3',
  },
  container: {
    font: {
      family: undefined,
      color: CourierColors.white[500],
    },
  },
  loading: {
    animation: {
      barColor: CourierColors.gray[400],
      barHeight: '14px',
      barBorderRadius: '14px',
      duration: '2s',
    },
  },
  error: {
    title: {
      font: {
        size: '16px',
        weight: '500',
        color: CourierColors.white[500],
      },
    },
    button: {
      text: 'Retry',
      font: {
        size: '14px',
        weight: '500',
        color: CourierColors.black[500],
      },
      backgroundColor: CourierColors.white[500],
      hoverBackgroundColor: '#E5E5E5',
      border: 'none',
      borderRadius: '8px',
    },
  },
  empty: {
    title: {
      text: 'No preferences available',
      font: {
        size: '16px',
        weight: '500',
        color: CourierColors.white[500],
      },
    },
    button: {
      text: 'Refresh',
      font: {
        size: '14px',
        weight: '500',
        color: CourierColors.black[500],
      },
      backgroundColor: CourierColors.white[500],
      hoverBackgroundColor: '#E5E5E5',
      border: 'none',
      borderRadius: '8px',
    },
  },
  section: {
    title: {
      size: '18px',
      weight: '600',
      color: CourierColors.white[500],
    },
    backgroundColor: 'transparent',
  },
  topic: {
    backgroundColor: CourierColors.black[500],
    border: `1px solid ${CourierColors.gray[400]}`,
    borderRadius: '12px',
    title: {
      size: '16px',
      weight: '400',
      color: CourierColors.white[500],
    },
    statusLabel: {
      size: '14px',
      weight: '300',
      color: CourierColors.gray[500],
    },
    toggle: {
      trackColor: '#4B5563',
      trackActiveColor: CourierColors.blue[500],
      thumbColor: CourierColors.white[500],
      borderRadius: '12px',
    },
  },
  digest: {
    font: {
      size: '14px',
      weight: '400',
      color: '#9CA3AF',
    },
    selectedFont: {
      size: '14px',
      weight: '500',
      color: '#F9FAFB',
    },
    iconColor: '#9CA3AF',
    radio: {
      ringColor: '#4B5563',
      checkedColor: '#F9FAFB',
    },
  },
  channelChip: {
    font: {
      size: '14px',
      weight: '400',
      color: '#9CA3AF',
    },
    selectedFont: {
      size: '14px',
      weight: '500',
      color: '#F9FAFB',
    },
    divider: `1px solid ${CourierColors.gray[400]}`,
    checkbox: {
      checkedColor: '#F9FAFB',
    },
  },
};

/**
 * Deep merge preferences themes.
 * @public
 */
export const mergeTheme = (mode: SystemThemeMode, theme: CourierPreferencesTheme): CourierPreferencesTheme => {
  const defaultTheme = mode === 'light' ? defaultLightTheme : defaultDarkTheme;
  return {
    primaryColor: theme.primaryColor ?? defaultTheme.primaryColor,
    title: { ...defaultTheme.title, ...theme.title },
    subtitle: { ...defaultTheme.subtitle, ...theme.subtitle },
    container: {
      ...defaultTheme.container,
      ...theme.container,
      font: { ...defaultTheme.container?.font, ...theme.container?.font },
    },
    loading: {
      ...defaultTheme.loading,
      ...theme.loading,
      animation: { ...defaultTheme.loading?.animation, ...theme.loading?.animation },
      font: { ...defaultTheme.loading?.font, ...theme.loading?.font },
    },
    error: {
      ...defaultTheme.error,
      ...theme.error,
      title: {
        ...defaultTheme.error?.title,
        ...theme.error?.title,
        font: { ...defaultTheme.error?.title?.font, ...theme.error?.title?.font },
      },
      button: {
        ...defaultTheme.error?.button,
        ...theme.error?.button,
        font: { ...defaultTheme.error?.button?.font, ...theme.error?.button?.font },
      },
    },
    empty: {
      ...defaultTheme.empty,
      ...theme.empty,
      title: {
        ...defaultTheme.empty?.title,
        ...theme.empty?.title,
        font: { ...defaultTheme.empty?.title?.font, ...theme.empty?.title?.font },
      },
      button: {
        ...defaultTheme.empty?.button,
        ...theme.empty?.button,
        font: { ...defaultTheme.empty?.button?.font, ...theme.empty?.button?.font },
      },
    },
    section: {
      ...defaultTheme.section,
      ...theme.section,
      title: { ...defaultTheme.section?.title, ...theme.section?.title },
    },
    topic: {
      ...defaultTheme.topic,
      ...theme.topic,
      title: { ...defaultTheme.topic?.title, ...theme.topic?.title },
      statusLabel: { ...defaultTheme.topic?.statusLabel, ...theme.topic?.statusLabel },
      toggle: { ...defaultTheme.topic?.toggle, ...theme.topic?.toggle },
    },
    digest: {
      ...defaultTheme.digest,
      ...theme.digest,
      font: { ...defaultTheme.digest?.font, ...theme.digest?.font },
      selectedFont: { ...defaultTheme.digest?.selectedFont, ...theme.digest?.selectedFont },
      radio: {
        ...defaultTheme.digest?.radio,
        ...theme.digest?.radio,
        font: { ...defaultTheme.digest?.radio?.font, ...theme.digest?.radio?.font },
        selectedFont: { ...defaultTheme.digest?.radio?.selectedFont, ...theme.digest?.radio?.selectedFont },
      },
    },
    channelChip: {
      ...defaultTheme.channelChip,
      ...theme.channelChip,
      font: { ...defaultTheme.channelChip?.font, ...theme.channelChip?.font },
      selectedFont: { ...defaultTheme.channelChip?.selectedFont, ...theme.channelChip?.selectedFont },
      checkbox: {
        ...defaultTheme.channelChip?.checkbox,
        ...theme.channelChip?.checkbox,
        font: { ...defaultTheme.channelChip?.checkbox?.font, ...theme.channelChip?.checkbox?.font },
        selectedFont: { ...defaultTheme.channelChip?.checkbox?.selectedFont, ...theme.channelChip?.checkbox?.selectedFont },
      },
    },
  };
};
