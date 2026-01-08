import { useMemo } from 'react';
import type { CourierInboxFeed, CourierInboxTheme } from '@trycourier/courier-react';
import type { ColorMode } from './ThemeTab';

export function useInboxComponentKey(feeds: CourierInboxFeed[], lightTheme?: CourierInboxTheme, darkTheme?: CourierInboxTheme, colorMode?: ColorMode): string {
  return useMemo(() => {
    const feedsKey = JSON.stringify(feeds.map(f => ({
      feedId: f.feedId,
      title: f.title,
      iconSVG: f.iconSVG,
      tabs: f.tabs.map(t => ({
        datasetId: t.datasetId,
        title: t.title,
        filter: t.filter
      }))
    })));
    const lightThemeKey = lightTheme ? JSON.stringify(lightTheme) : 'default-light';
    const darkThemeKey = darkTheme ? JSON.stringify(darkTheme) : 'default-dark';
    const modeKey = colorMode || 'system';
    return `${feedsKey}-${lightThemeKey}-${darkThemeKey}-${modeKey}`;
  }, [feeds, lightTheme, darkTheme, colorMode]);
}

