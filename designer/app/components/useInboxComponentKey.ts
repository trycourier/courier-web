import { useMemo } from 'react';
import type { CourierInboxFeed, CourierInboxTheme } from '@trycourier/courier-react';

export function useInboxComponentKey(feeds: CourierInboxFeed[], theme?: CourierInboxTheme): string {
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
    const themeKey = theme ? JSON.stringify(theme) : 'default';
    return `${feedsKey}-${themeKey}`;
  }, [feeds, theme]);
}

