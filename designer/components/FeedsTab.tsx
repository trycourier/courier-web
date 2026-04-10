'use client';

import { useState, useCallback } from 'react';
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
  const [draftFeeds, setDraftFeeds] = useState<CourierInboxFeed[]>(feeds);

  const isDirty = JSON.stringify(draftFeeds) !== JSON.stringify(feeds);

  const handleUpdateFeed = useCallback((index: number, updates: Partial<CourierInboxFeed>) => {
    setDraftFeeds(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
  }, []);

  const handleUpdateTab = useCallback((feedIndex: number, tabIndex: number, updates: Partial<CourierInboxFeed['tabs'][0]>) => {
    setDraftFeeds(prev => {
      const updated = [...prev];
      const feed = updated[feedIndex];
      const updatedTabs = [...feed.tabs];
      updatedTabs[tabIndex] = { ...updatedTabs[tabIndex], ...updates };
      updated[feedIndex] = { ...feed, tabs: updatedTabs };
      return updated;
    });
  }, []);

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
    setDraftFeeds(prev => [...prev, newFeed]);
  };

  const handleRemoveFeed = (index: number) => {
    if (draftFeeds.length <= 1) {
      alert('You must have at least one feed.');
      return;
    }
    setDraftFeeds(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddTab = (feedIndex: number) => {
    const feed = draftFeeds[feedIndex];
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
    const feed = draftFeeds[feedIndex];
    handleUpdateFeed(feedIndex, {
      tabs: feed.tabs.filter((_, i) => i !== tabIndex)
    });
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all feeds to default? This action cannot be undone.')) {
      const defaults = defaultFeeds();
      setDraftFeeds(defaults);
      onFeedsChange(defaults);
    }
  };

  const handleSave = () => {
    onFeedsChange(draftFeeds);
  };

  const handleDiscard = () => {
    setDraftFeeds(feeds);
  };

  const { frameworkType } = useFramework();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
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
          {draftFeeds.map((feed, feedIndex) => (
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
      <div className="flex-shrink-0 border-t border-border p-4 space-y-4">
        {isDirty && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={handleDiscard}
              variant="outline"
              size="sm"
            >
              Discard
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              size="sm"
            >
              Save
            </Button>
            <span className="text-xs text-muted-foreground">Unsaved changes</span>
          </div>
        )}
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
