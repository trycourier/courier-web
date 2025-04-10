export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    inverse: string;
  };
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
  };
  border: {
    light: string;
    medium: string;
    dark: string;
  };
  button: {
    primary: {
      background: string;
      text: string;
      hover: string;
    };
    secondary: {
      background: string;
      text: string;
      hover: string;
    };
    tertiary: {
      background: string;
      text: string;
      hover: string;
    };
  };
  icon: {
    primary: string;
    secondary: string;
    disabled: string;
  };
}

export const lightTheme: ThemeColors = {
  text: {
    primary: '#0a0a0a',
    secondary: '#171717',
    disabled: '#6b7280',
    inverse: '#ffffff'
  },
  background: {
    primary: '#ffffff',
    secondary: '#e5e5e5',
    tertiary: '#f3f4f6',
    disabled: '#f3f4f6'
  },
  border: {
    light: '#e5e5e5',
    medium: '#d1d5db',
    dark: '#9ca3af'
  },
  button: {
    primary: {
      background: '#0a0a0a',
      text: '#ffffff',
      hover: '#262626'
    },
    secondary: {
      background: '#ffffff',
      text: '#0a0a0a',
      hover: '#f3f4f6'
    },
    tertiary: {
      background: '#e5e5e5',
      text: '#171717',
      hover: '#d1d5db'
    }
  },
  icon: {
    primary: 'currentColor',
    secondary: '#6b7280',
    disabled: '#9ca3af'
  }
};

export const darkTheme: ThemeColors = {
  text: {
    primary: '#ffffff',
    secondary: '#e5e5e5',
    disabled: '#9ca3af',
    inverse: '#0a0a0a'
  },
  background: {
    primary: '#0a0a0a',
    secondary: '#171717',
    tertiary: '#262626',
    disabled: '#1f2937'
  },
  border: {
    light: '#374151',
    medium: '#4b5563',
    dark: '#6b7280'
  },
  button: {
    primary: {
      background: '#ffffff',
      text: '#0a0a0a',
      hover: '#e5e5e5'
    },
    secondary: {
      background: '#171717',
      text: '#ffffff',
      hover: '#262626'
    },
    tertiary: {
      background: '#262626',
      text: '#ffffff',
      hover: '#374151'
    }
  },
  icon: {
    primary: 'currentColor',
    secondary: '#9ca3af',
    disabled: '#6b7280'
  }
};

export function getThemeVariables(theme: ThemeColors) {
  return {
    '--courier-text-primary': theme.text.primary,
    '--courier-text-secondary': theme.text.secondary,
    '--courier-text-disabled': theme.text.disabled,
    '--courier-text-inverse': theme.text.inverse,

    '--courier-background-primary': theme.background.primary,
    '--courier-background-secondary': theme.background.secondary,
    '--courier-background-tertiary': theme.background.tertiary,
    '--courier-background-disabled': theme.background.disabled,

    '--courier-border-light': theme.border.light,
    '--courier-border-medium': theme.border.medium,
    '--courier-border-dark': theme.border.dark,

    '--courier-button-primary-bg': theme.button.primary.background,
    '--courier-button-primary-text': theme.button.primary.text,
    '--courier-button-secondary-bg': theme.button.secondary.background,
    '--courier-button-secondary-text': theme.button.secondary.text,
    '--courier-button-tertiary-bg': theme.button.tertiary.background,
    '--courier-button-tertiary-text': theme.button.tertiary.text,

    '--courier-icon-primary': theme.icon.primary,
    '--courier-icon-secondary': theme.icon.secondary,
    '--courier-icon-disabled': theme.icon.disabled
  } as const;
}

export function applyTheme(mode: ThemeMode) {
  const theme = mode === 'light' ? lightTheme : darkTheme;
  const variables = getThemeVariables(theme);

  Object.entries(variables).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}


