'use client';

import type { CourierInboxFeed } from '@trycourier/courier-react';
import { defaultFeeds } from '@trycourier/courier-react';
import { Button } from './ui/button';
import { Accordion } from './ui/accordion';
import { FeedItem } from './FeedItem';
import { TabFooter } from './TabFooter';
import { useFramework } from './FrameworkContext';

interface FeedsTabProps {
  feeds: CourierInboxFeed[];
  onFeedsChange: (feeds: CourierInboxFeed[]) => void;
}

export function FeedsTab({ feeds, onFeedsChange }: FeedsTabProps) {
  const handleUpdateFeed = (index: number, updates: Partial<CourierInboxFeed>) => {
    const updated = [...feeds];
    updated[index] = { ...updated[index], ...updates };
    onFeedsChange(updated);
  };

  const handleUpdateTab = (feedIndex: number, tabIndex: number, updates: Partial<CourierInboxFeed['tabs'][0]>) => {
    const feed = feeds[feedIndex];
    const updatedTabs = [...feed.tabs];
    updatedTabs[tabIndex] = { ...updatedTabs[tabIndex], ...updates };
    handleUpdateFeed(feedIndex, { tabs: updatedTabs });
  };

  const handleAddFeed = () => {
    const newFeed: CourierInboxFeed = {
      feedId: `feed_${Date.now()}`,
      title: 'New Feed',
      tabs: [
        {
          datasetId: `dataset_${Date.now()}`,
          title: 'All Messages',
          filter: {}
        }
      ]
    };
    onFeedsChange([...feeds, newFeed]);
  };

  const handleRemoveFeed = (index: number) => {
    if (feeds.length <= 1) {
      alert('You must have at least one feed.');
      return;
    }
    onFeedsChange(feeds.filter((_, i) => i !== index));
  };

  const handleAddTab = (feedIndex: number) => {
    const feed = feeds[feedIndex];
    const newTab = {
      datasetId: `dataset_${Date.now()}`,
      title: 'New Tab',
      filter: {} as CourierInboxFeed['tabs'][0]['filter']
    };
    handleUpdateFeed(feedIndex, {
      tabs: [...feed.tabs, newTab]
    });
  };

  const handleRemoveTab = (feedIndex: number, tabIndex: number) => {
    const feed = feeds[feedIndex];
    handleUpdateFeed(feedIndex, {
      tabs: feed.tabs.filter((_, i) => i !== tabIndex)
    });
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all feeds to default? This action cannot be undone.')) {
      onFeedsChange(defaultFeeds());
    }
  };

  const { frameworkType } = useFramework();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            type="button"
            onClick={handleResetToDefaults}
            variant="outline"
            size="sm"
          >
            Reset to Defaults
          </Button>
          <Button
            type="button"
            onClick={handleAddFeed}
            size="sm"
          >
            + Add Feed
          </Button>
        </div>

        <Accordion type="single" collapsible>
          {feeds.map((feed, feedIndex) => (
            <FeedItem
              key={feed.feedId}
              feed={feed}
              feedIndex={feedIndex}
              onUpdateFeed={(updates) => handleUpdateFeed(feedIndex, updates)}
              onRemoveFeed={() => handleRemoveFeed(feedIndex)}
              onAddTab={() => handleAddTab(feedIndex)}
              onUpdateTab={(tabIndex, updates) => handleUpdateTab(feedIndex, tabIndex, updates)}
              onRemoveTab={(tabIndex) => handleRemoveTab(feedIndex, tabIndex)}
            />
          ))}
        </Accordion>
      </div>
      <div className="flex-shrink-0 border-t border-border p-4">
        <TabFooter
          copy="Configure feeds and tabs to organize your inbox messages."
          primaryButton={{
            label: "Tabs and Feeds",
            url: frameworkType === 'react'
              ? 'https://www.courier.com/docs/sdk-libraries/courier-react-web#tabs-and-feeds'
              : 'https://www.courier.com/docs/sdk-libraries/courier-ui-inbox-web#tabs-and-feeds'
          }}
        />
      </div>
    </div>
  );
}
