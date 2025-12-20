'use client';

import type { CourierInboxFeed } from '@trycourier/courier-react';
import { defaultFeeds } from '@trycourier/courier-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

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
    onFeedsChange(defaultFeeds());
  };

  return (
    <div className="p-4 h-full flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h2 className="text-lg font-semibold">Feeds</h2>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={handleResetToDefaults}
            variant="outline"
            size="sm"
          >
            Reset
          </Button>
          <Button
            type="button"
            onClick={handleAddFeed}
            size="sm"
          >
            + Add Feed
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <Accordion type="single" collapsible className="space-y-2">
          {feeds.map((feed, feedIndex) => (
            <AccordionItem key={feed.feedId} value={`feed-${feedIndex}`} className="border rounded-md px-4 relative">
              <AccordionTrigger className="hover:no-underline pr-20">
                <span className="font-medium truncate">{feed.title || feed.feedId}</span>
              </AccordionTrigger>
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFeed(feedIndex);
                }}
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive absolute right-4 top-4 z-10"
              >
                Remove
              </Button>
              <AccordionContent>
                <div className="space-y-4 pt-2 pb-2">
                  <div className="space-y-2">
                    <Label className="text-xs">Feed ID</Label>
                    <Input
                      type="text"
                      value={feed.feedId}
                      onChange={(e) => handleUpdateFeed(feedIndex, { feedId: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Title</Label>
                    <Input
                      type="text"
                      value={feed.title}
                      onChange={(e) => handleUpdateFeed(feedIndex, { title: e.target.value })}
                      className="text-sm"
                    />
                  </div>

                  <div className="border-t border-border pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Tabs</Label>
                      <Button
                        type="button"
                        onClick={() => handleAddTab(feedIndex)}
                        size="sm"
                        variant="outline"
                      >
                        + Add Tab
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {feed.tabs.map((tab, tabIndex) => (
                        <div key={tab.datasetId} className="p-3 border rounded-md bg-muted/50 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label className="text-xs">Dataset ID</Label>
                              <Input
                                type="text"
                                value={tab.datasetId}
                                onChange={(e) => handleUpdateTab(feedIndex, tabIndex, { datasetId: e.target.value })}
                                className="text-sm"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Title</Label>
                              <Input
                                type="text"
                                value={tab.title}
                                onChange={(e) => handleUpdateTab(feedIndex, tabIndex, { title: e.target.value })}
                                className="text-sm"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Tags (comma-separated)</Label>
                            <Input
                              type="text"
                              value={tab.filter?.tags?.join(', ') || ''}
                              onChange={(e) => {
                                const tags = e.target.value
                                  .split(',')
                                  .map(t => t.trim())
                                  .filter(t => t.length > 0);
                                handleUpdateTab(feedIndex, tabIndex, {
                                  filter: { ...tab.filter, tags: tags.length > 0 ? tags : undefined }
                                });
                              }}
                              className="text-sm"
                              placeholder="tag1, tag2"
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={() => handleRemoveTab(feedIndex, tabIndex)}
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive text-xs"
                          >
                            Remove Tab
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
