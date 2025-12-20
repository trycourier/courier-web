import { useMemo } from 'react';
import type { CourierInboxFeed, CourierInboxTheme } from '@trycourier/courier-react';

export function useInboxComponentKey(feeds: CourierInboxFeed[], lightTheme?: CourierInboxTheme, darkTheme?: CourierInboxTheme): string {
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
    return `${feedsKey}-${lightThemeKey}-${darkThemeKey}`;
  }, [feeds, lightTheme, darkTheme]);
}

