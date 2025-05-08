export type CourierComponentThemeMode = SystemThemeMode & 'system';

export type SystemThemeMode = 'light' | 'dark';

export const getSystemThemeMode = (): SystemThemeMode => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const addSystemThemeModeListener = (callback: (mode: SystemThemeMode) => void): (() => void) => {
  if (typeof window === 'undefined') {
    return () => { };
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light');
  };

  mediaQuery.addEventListener('change', handler);

  return () => {
    mediaQuery.removeEventListener('change', handler);
  };
};
