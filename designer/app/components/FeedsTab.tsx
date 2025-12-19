'use client';

import { useState } from 'react';
import type { CourierInboxFeed } from '@trycourier/courier-react';
import { defaultFeeds } from '@trycourier/courier-react';

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
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Feeds Configuration</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Export
          </button>
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Reset to Defaults
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {feeds.map((feed, feedIndex) => (
          <div
            key={feed.feedId}
            className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Feed ID
                  </label>
                  <input
                    type="text"
                    value={feed.feedId}
                    onChange={(e) => handleUpdateFeed(feedIndex, { feedId: e.target.value })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Feed Title
                  </label>
                  <input
                    type="text"
                    value={feed.title}
                    onChange={(e) => handleUpdateFeed(feedIndex, { title: e.target.value })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      Icon SVG (optional)
                    </label>
                    {feed.iconSVG && (
                      <button
                        type="button"
                        onClick={() => handleUpdateFeed(feedIndex, { iconSVG: undefined })}
                        className="text-xs text-red-600 dark:text-red-400 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {feed.iconSVG ? (
                    <textarea
                      value={feed.iconSVG}
                      onChange={(e) => handleUpdateFeed(feedIndex, { iconSVG: e.target.value })}
                      rows={2}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-xs"
                      placeholder="<svg>...</svg>"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleUpdateFeed(feedIndex, { iconSVG: '' })}
                      className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      + Add Icon SVG
                    </button>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFeed(feedIndex)}
                className="ml-4 px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>

            <div className="border-t border-gray-300 dark:border-gray-700 pt-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Tabs</h3>
                <button
                  type="button"
                  onClick={() => handleAddTab(feedIndex)}
                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  + Add Tab
                </button>
              </div>

              <div className="space-y-2">
                {feed.tabs.map((tab, tabIndex) => (
                  <div
                    key={tab.datasetId}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 space-y-2"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Dataset ID
                        </label>
                        <input
                          type="text"
                          value={getTabValue(feedIndex, tabIndex, 'datasetId') as string}
                          onChange={(e) => handleUpdateTab(feedIndex, tabIndex, { datasetId: e.target.value })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Tab Title
                        </label>
                        <input
                          type="text"
                          value={getTabValue(feedIndex, tabIndex, 'title') as string}
                          onChange={(e) => handleUpdateTab(feedIndex, tabIndex, { title: e.target.value })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Filter
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Tags (comma-separated)
                          </label>
                          <input
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
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                            placeholder="tag1, tag2"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={(getTabValue(feedIndex, tabIndex, 'filter') as CourierInboxFeed['tabs'][0]['filter']).archived || false}
                              onChange={(e) => {
                                const currentFilter = getTabValue(feedIndex, tabIndex, 'filter') as CourierInboxFeed['tabs'][0]['filter'];
                                handleUpdateTab(feedIndex, tabIndex, {
                                  filter: { ...currentFilter, archived: e.target.checked || undefined }
                                });
                              }}
                              className="rounded"
                            />
                            <span className="text-xs text-gray-700 dark:text-gray-300">Archived</span>
                          </label>
                          <select
                            value={(getTabValue(feedIndex, tabIndex, 'filter') as CourierInboxFeed['tabs'][0]['filter']).status || ''}
                            onChange={(e) => {
                              const currentFilter = getTabValue(feedIndex, tabIndex, 'filter') as CourierInboxFeed['tabs'][0]['filter'];
                              handleUpdateTab(feedIndex, tabIndex, {
                                filter: { ...currentFilter, status: e.target.value as 'read' | 'unread' | undefined || undefined }
                              });
                            }}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">All</option>
                            <option value="read">Read</option>
                            <option value="unread">Unread</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveTab(feedIndex, tabIndex)}
                        className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Remove Tab
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveTab(feedIndex, tabIndex)}
                        disabled={!tabDrafts[`${feedIndex}-${tabIndex}`]}
                        className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddFeed}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        + Add Feed
      </button>
    </div>
  );
}

