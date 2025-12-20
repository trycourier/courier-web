'use client';

import { useState } from 'react';
import type { CourierInboxFeed } from '@trycourier/courier-react';
import { defaultFeeds } from '@trycourier/courier-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface FeedsTabProps {
  feeds: CourierInboxFeed[];
  onFeedsChange: (feeds: CourierInboxFeed[]) => void;
}

export function FeedsTab({ feeds, onFeedsChange }: FeedsTabProps) {
  const [editingFeedIndex, setEditingFeedIndex] = useState<number | null>(null);
  const [editingTabIndex, setEditingTabIndex] = useState<number | null>(null);
  // Store draft state for each tab being edited
  const [tabDrafts, setTabDrafts] = useState<Record<string, CourierInboxFeed['tabs'][0]>>({});

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
    setEditingFeedIndex(feeds.length);
  };

  const handleRemoveFeed = (index: number) => {
    onFeedsChange(feeds.filter((_, i) => i !== index));
    if (editingFeedIndex === index) {
      setEditingFeedIndex(null);
    }
    // Clean up all drafts for this feed
    setTabDrafts(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(key => {
        if (key.startsWith(`${index}-`)) {
          delete next[key];
        }
      });
      return next;
    });
  };

  const handleUpdateFeed = (index: number, updates: Partial<CourierInboxFeed>) => {
    const updated = [...feeds];
    // Create a completely new feed object to ensure React detects the change
    updated[index] = { 
      ...updated[index], 
      ...updates,
      // If updating tabs, ensure tabs array is new
      ...(updates.tabs && { tabs: [...updates.tabs] })
    };
    onFeedsChange(updated);
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
    setEditingTabIndex(feed.tabs.length);
  };

  const handleRemoveTab = (feedIndex: number, tabIndex: number) => {
    const feed = feeds[feedIndex];
    handleUpdateFeed(feedIndex, {
      tabs: feed.tabs.filter((_, i) => i !== tabIndex)
    });
    if (editingTabIndex === tabIndex) {
      setEditingTabIndex(null);
    }
    // Clean up draft
    const tabKey = `${feedIndex}-${tabIndex}`;
    setTabDrafts(prev => {
      const next = { ...prev };
      delete next[tabKey];
      return next;
    });
  };

  const handleUpdateTab = (feedIndex: number, tabIndex: number, updates: Partial<CourierInboxFeed['tabs'][0]>) => {
    const feed = feeds[feedIndex];
    const tab = feed.tabs[tabIndex];
    const tabKey = `${feedIndex}-${tabIndex}`;
    
    // Update draft state instead of immediately updating feeds
    setTabDrafts(prev => {
      const existingDraft = prev[tabKey];
      const currentTab = existingDraft || tab;
      
      // If updating filter, merge it properly
      if (updates.filter) {
        return {
          ...prev,
          [tabKey]: { 
            ...currentTab, 
            ...updates,
            filter: { ...currentTab.filter, ...updates.filter }
          }
        };
      }
      
      return {
        ...prev,
        [tabKey]: { ...currentTab, ...updates }
      };
    });
  };

  const handleSaveTab = (feedIndex: number, tabIndex: number) => {
    const feed = feeds[feedIndex];
    const tabKey = `${feedIndex}-${tabIndex}`;
    const draft = tabDrafts[tabKey];
    
    if (draft) {
      const updatedTabs = [...feed.tabs];
      // Create a completely new tab object with a new filter object to ensure React detects changes
      updatedTabs[tabIndex] = {
        ...draft,
        filter: { ...draft.filter }
      };
      handleUpdateFeed(feedIndex, { tabs: updatedTabs });
      
      // Clear the draft
      setTabDrafts(prev => {
        const next = { ...prev };
        delete next[tabKey];
        return next;
      });
    }
  };

  const getTabValue = (feedIndex: number, tabIndex: number, field: keyof CourierInboxFeed['tabs'][0]): any => {
    const tabKey = `${feedIndex}-${tabIndex}`;
    const draft = tabDrafts[tabKey];
    const feed = feeds[feedIndex];
    const tab = feed.tabs[tabIndex];
    
    if (draft && field in draft) {
      return draft[field as keyof typeof draft];
    }
    return tab[field];
  };

  const handleResetToDefaults = () => {
    onFeedsChange(defaultFeeds());
    // Clear all drafts
    setTabDrafts({});
  };

  const handleExport = () => {
    const feedsJson = JSON.stringify(feeds, null, 2);
    alert(feedsJson);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Feeds Configuration</h2>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={handleExport}
            size="sm"
          >
            Export
          </Button>
          <Button
            type="button"
            onClick={handleResetToDefaults}
            variant="secondary"
            size="sm"
          >
            Reset to Defaults
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {feeds.map((feed, feedIndex) => (
          <Card key={feed.feedId}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Feed ID</Label>
                    <Input
                      type="text"
                      value={feed.feedId}
                      onChange={(e) => handleUpdateFeed(feedIndex, { feedId: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Feed Title</Label>
                    <Input
                      type="text"
                      value={feed.title}
                      onChange={(e) => handleUpdateFeed(feedIndex, { title: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Icon SVG (optional)</Label>
                      {feed.iconSVG && (
                        <Button
                          type="button"
                          onClick={() => handleUpdateFeed(feedIndex, { iconSVG: undefined })}
                          variant="ghost"
                          size="sm"
                          className="text-xs h-auto p-0 text-destructive hover:text-destructive"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    {feed.iconSVG ? (
                      <Textarea
                        value={feed.iconSVG}
                        onChange={(e) => handleUpdateFeed(feedIndex, { iconSVG: e.target.value })}
                        rows={2}
                        className="text-sm font-mono text-xs"
                        placeholder="<svg>...</svg>"
                      />
                    ) : (
                      <Button
                        type="button"
                        onClick={() => handleUpdateFeed(feedIndex, { iconSVG: '' })}
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                      >
                        + Add Icon SVG
                      </Button>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={() => handleRemoveFeed(feedIndex)}
                  variant="destructive"
                  size="sm"
                  className="ml-4"
                >
                  Remove
                </Button>
              </div>

              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Tabs</h3>
                  <Button
                    type="button"
                    onClick={() => handleAddTab(feedIndex)}
                    size="sm"
                    className="text-xs"
                  >
                    + Add Tab
                  </Button>
                </div>

                <div className="space-y-2">
                  {feed.tabs.map((tab, tabIndex) => (
                    <Card key={tab.datasetId} className="bg-muted">
                      <CardContent className="p-3 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Dataset ID</Label>
                            <Input
                              type="text"
                              value={getTabValue(feedIndex, tabIndex, 'datasetId') as string}
                              onChange={(e) => handleUpdateTab(feedIndex, tabIndex, { datasetId: e.target.value })}
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Tab Title</Label>
                            <Input
                              type="text"
                              value={getTabValue(feedIndex, tabIndex, 'title') as string}
                              onChange={(e) => handleUpdateTab(feedIndex, tabIndex, { title: e.target.value })}
                              className="text-sm"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs">Filter</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Tags (comma-separated)</Label>
                              <Input
                                type="text"
                                value={(getTabValue(feedIndex, tabIndex, 'filter') as CourierInboxFeed['tabs'][0]['filter']).tags?.join(', ') || ''}
                                onChange={(e) => {
                                  const currentFilter = getTabValue(feedIndex, tabIndex, 'filter') as CourierInboxFeed['tabs'][0]['filter'];
                                  const tags = e.target.value
                                    .split(',')
                                    .map(t => t.trim())
                                    .filter(t => t.length > 0);
                                  handleUpdateTab(feedIndex, tabIndex, {
                                    filter: { ...currentFilter, tags: tags.length > 0 ? tags : undefined }
                                  });
                                }}
                                className="text-sm"
                                placeholder="tag1, tag2"
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={(getTabValue(feedIndex, tabIndex, 'filter') as CourierInboxFeed['tabs'][0]['filter']).archived || false}
                                  onCheckedChange={(checked) => {
                                    const currentFilter = getTabValue(feedIndex, tabIndex, 'filter') as CourierInboxFeed['tabs'][0]['filter'];
                                    handleUpdateTab(feedIndex, tabIndex, {
                                      filter: { ...currentFilter, archived: checked ? true : undefined }
                                    });
                                  }}
                                  id={`archived-${feedIndex}-${tabIndex}`}
                                />
                                <Label htmlFor={`archived-${feedIndex}-${tabIndex}`} className="text-xs cursor-pointer">
                                  Archived
                                </Label>
                              </div>
                              <Select
                                value={(getTabValue(feedIndex, tabIndex, 'filter') as CourierInboxFeed['tabs'][0]['filter']).status || 'all'}
                                onValueChange={(value) => {
                                  const currentFilter = getTabValue(feedIndex, tabIndex, 'filter') as CourierInboxFeed['tabs'][0]['filter'];
                                  handleUpdateTab(feedIndex, tabIndex, {
                                    filter: { ...currentFilter, status: value === 'all' ? undefined : (value as 'read' | 'unread') }
                                  });
                                }}
                              >
                                <SelectTrigger className="text-sm">
                                  <SelectValue placeholder="All" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All</SelectItem>
                                  <SelectItem value="read">Read</SelectItem>
                                  <SelectItem value="unread">Unread</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <Button
                            type="button"
                            onClick={() => handleRemoveTab(feedIndex, tabIndex)}
                            variant="destructive"
                            size="sm"
                            className="text-xs"
                          >
                            Remove Tab
                          </Button>
                          <Button
                            type="button"
                            onClick={() => handleSaveTab(feedIndex, tabIndex)}
                            disabled={!tabDrafts[`${feedIndex}-${tabIndex}`]}
                            size="sm"
                            className="text-xs bg-green-600 hover:bg-green-700"
                          >
                            Save
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        type="button"
        onClick={handleAddFeed}
        className="w-full"
      >
        + Add Feed
      </Button>
    </div>
  );
}

